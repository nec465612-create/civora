import {
  ConnectedWallet,
  DetectedWallet,
  EIP1193Provider,
  EIP6963ProviderDetail,
  WalletBrand,
  WalletSessionState,
  WalletView,
} from '../types';
import { appConfig } from '../config';

const STUDIO_NEXT_CHAIN_ID_HEX = `0x${appConfig.chainId.toString(16)}`;

// WALLET_SESSION_STATE_MACHINE is the single owner of provider, account,
// network, write eligibility, chooser state, and public wallet errors.
export class WalletManager {
  private state: WalletSessionState = {
    phase: 'DISCONNECTED',
    detectedWallets: [],
    selectedWalletId: null,
    activeWallet: null,
    error: null,
  };
  private registry = new Map<string, DetectedWallet>();
  private subscribers = new Set<() => void>();
  private hasAnnounced = false;
  private discoveryCleanup: (() => void) | null = null;
  private sessionCleanup: (() => void) | null = null;

  constructor() {
    this.initDiscovery();
  }

  public getWalletState(): WalletSessionState {
    return {
      ...this.state,
      detectedWallets: [...this.state.detectedWallets],
      activeWallet: this.state.activeWallet ? { ...this.state.activeWallet } : null,
    };
  }

  public selectWalletView(): WalletView {
    const connected = this.state.phase === 'CONNECTED';
    return {
      phase: this.state.phase,
      wallets: [...this.state.detectedWallets],
      wallet: this.state.activeWallet,
      canWrite: connected,
      showConnect: !connected,
      error: this.state.error,
    };
  }

  public subscribeWalletState(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  public subscribe(callback: () => void): () => void {
    return this.subscribeWalletState(callback);
  }

  private commit(next: Partial<WalletSessionState>): void {
    this.state = { ...this.state, ...next };
    this.subscribers.forEach((callback) => callback());
  }

  public openChooser(): void {
    this.commit({ phase: 'DISCOVERING', error: null });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('eip6963:requestProvider'));
    }
    this.commit({ phase: 'CHOOSER_OPEN' });
  }

  public closeChooser(): void {
    if (this.state.phase === 'CHOOSER_OPEN' || this.state.phase === 'DISCOVERING') {
      this.commit({ phase: this.state.activeWallet ? 'CONNECTED' : 'DISCONNECTED' });
    }
  }

  private initDiscovery(): void {
    if (typeof window === 'undefined') return;
    const announce = (event: Event) => {
      const detail = (event as CustomEvent<EIP6963ProviderDetail>).detail;
      if (!detail?.info || !detail.provider || typeof detail.provider.request !== 'function') return;
      const brand = this.identifyBrand(detail.info.name, detail.info.rdns);
      if (!brand) return;
      this.hasAnnounced = true;

      const id = detail.info.uuid || `${brand}-eip6963`;
      const duplicate = [...this.registry.entries()].find(
        ([, wallet]) => wallet.id === id || wallet.provider === detail.provider,
      );
      const wallet: DetectedWallet = {
        id,
        brand,
        name: brand,
        icon: detail.info.icon || this.defaultIcon(brand),
        provider: detail.provider,
        isFallback: false,
      };
      if (duplicate) this.registry.delete(duplicate[0]);
      this.registry.delete(`legacy-${brand}`);
      this.registry.set(id, wallet);
      this.commit({ detectedWallets: [...this.registry.values()] });
    };
    window.addEventListener('eip6963:announceProvider', announce);
    this.discoveryCleanup = () => window.removeEventListener('eip6963:announceProvider', announce);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    setTimeout(() => {
      if (this.hasAnnounced || typeof window === 'undefined') return;
      const root = (window as unknown as { ethereum?: EIP1193Provider & Record<string, unknown> }).ethereum;
      if (!root || typeof root.request !== 'function') return;
      const providers = Array.isArray(root.providers) ? root.providers : [root];
      providers.forEach((provider) => {
        const brand = this.identifyLegacyBrand(provider);
        if (!brand || [...this.registry.values()].some((item) => item.provider === provider)) return;
        this.registry.set(`legacy-${brand}`, {
          id: `legacy-${brand}`,
          brand,
          name: brand,
          icon: this.defaultIcon(brand),
          provider,
          isFallback: true,
        });
      });
      this.commit({ detectedWallets: [...this.registry.values()] });
    }, 150);
  }

  private identifyBrand(name = '', rdns = ''): WalletBrand | null {
    const identity = `${name} ${rdns}`.toLowerCase();
    if (identity.includes('metamask')) return 'MetaMask';
    if (identity.includes('okx')) return 'OKX Wallet';
    if (identity.includes('rabby')) return 'Rabby';
    return null;
  }

  private identifyLegacyBrand(provider: Record<string, unknown>): WalletBrand | null {
    if (provider.isRabby) return 'Rabby';
    if (provider.isOKExWallet || provider.isOkxWallet) return 'OKX Wallet';
    if (provider.isMetaMask) return 'MetaMask';
    return null;
  }

  private defaultIcon(brand: WalletBrand): string {
    const color = brand === 'MetaMask' ? '%23E2761B' : brand === 'Rabby' ? '%238697FF' : '%23000';
    const label = brand === 'MetaMask' ? 'MM' : brand === 'Rabby' ? 'RB' : 'OKX';
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${color}"/><text x="16" y="21" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="white">${label}</text></svg>`;
  }

  public getDetectedWallets(): DetectedWallet[] {
    return this.selectWalletView().wallets;
  }

  public getActiveWallet(): ConnectedWallet | null {
    return this.selectWalletView().wallet;
  }

  private detachSession(): void {
    this.sessionCleanup?.();
    this.sessionCleanup = null;
  }

  public async connectWallet(wallet: DetectedWallet): Promise<ConnectedWallet> {
    if (!this.registry.has(wallet.id) || typeof wallet.provider.request !== 'function') {
      throw new Error('This wallet is no longer available. Reopen the wallet picker.');
    }
    this.commit({ phase: 'CONNECTING', selectedWalletId: wallet.id, error: null });
    const provider = wallet.provider;
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!Array.isArray(accounts) || !/^0x[0-9a-fA-F]{40}$/.test(String(accounts[0] ?? ''))) {
        throw new Error('No valid account was returned by the selected wallet.');
      }
      const address = String(accounts[0]);
      await this.ensureTargetChain(provider);
      const stillAuthorized = await provider.request({ method: 'eth_accounts' });
      if (!Array.isArray(stillAuthorized) || !stillAuthorized.some(
        (account) => String(account).toLowerCase() === address.toLowerCase(),
      )) {
        throw new Error('The selected account changed before the connection completed.');
      }
      this.detachSession();

      const accountsChanged = (value: unknown) => {
        const next = Array.isArray(value) ? String(value[0] ?? '') : '';
        if (!/^0x[0-9a-fA-F]{40}$/.test(next)) return this.disconnect();
        if (!this.state.activeWallet) return;
        this.commit({ activeWallet: { ...this.state.activeWallet, address: next } });
      };
      const chainChanged = (value: unknown) => {
        const chainId = Number.parseInt(String(value), 16);
        if (chainId !== appConfig.chainId) {
          this.commit({ phase: 'WRONG_CHAIN', error: 'Switch the selected wallet to Studio Next to continue.' });
        } else if (this.state.activeWallet) {
          this.commit({ phase: 'CONNECTED', activeWallet: { ...this.state.activeWallet, chainId }, error: null });
        }
      };
      const disconnected = () => this.disconnect();
      provider.on?.('accountsChanged', accountsChanged);
      provider.on?.('chainChanged', chainChanged);
      provider.on?.('disconnect', disconnected);
      this.sessionCleanup = () => {
        provider.removeListener?.('accountsChanged', accountsChanged);
        provider.removeListener?.('chainChanged', chainChanged);
        provider.removeListener?.('disconnect', disconnected);
      };

      const activeWallet = { address, chainId: appConfig.chainId, brand: wallet.brand, provider };
      this.commit({ phase: 'CONNECTED', activeWallet, selectedWalletId: wallet.id, error: null });
      return activeWallet;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The selected wallet could not connect.';
      this.commit({ phase: 'ERROR', activeWallet: null, error: message });
      throw error;
    }
  }

  public async recoverChain(): Promise<void> {
    if (!this.state.activeWallet) throw new Error('Reconnect the wallet before switching network.');
    await this.ensureTargetChain(this.state.activeWallet.provider);
    this.commit({
      phase: 'CONNECTED',
      activeWallet: { ...this.state.activeWallet, chainId: appConfig.chainId },
      error: null,
    });
  }

  private async ensureTargetChain(provider: EIP1193Provider): Promise<void> {
    const current = await provider.request({ method: 'eth_chainId' });
    if (Number.parseInt(String(current), 16) !== appConfig.chainId) {
      try {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: STUDIO_NEXT_CHAIN_ID_HEX }] });
      } catch (error) {
        const value = error as { code?: number; message?: string };
        if (value.code !== 4902 && !value.message?.includes('4902')) throw error;
        await provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: STUDIO_NEXT_CHAIN_ID_HEX, chainName: 'GenLayer Studio Next', rpcUrls: [appConfig.rpcUrl], nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 }, blockExplorerUrls: [appConfig.explorerBaseUrl] }] });
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: STUDIO_NEXT_CHAIN_ID_HEX }] });
      }
    }
    const verified = await provider.request({ method: 'eth_chainId' });
    if (Number.parseInt(String(verified), 16) !== appConfig.chainId) {
      throw new Error('The selected wallet did not switch to Studio Next.');
    }
  }

  public disconnect(): void {
    this.detachSession();
    this.commit({ phase: 'DISCONNECTED', activeWallet: null, selectedWalletId: null, error: null });
  }

  public destroy(): void {
    this.disconnect();
    this.discoveryCleanup?.();
    this.discoveryCleanup = null;
  }
}

export const walletManager = new WalletManager();
