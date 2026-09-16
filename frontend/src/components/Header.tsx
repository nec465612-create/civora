import React, { useEffect, useState } from 'react';
import { walletManager } from '../services/walletManager';
import { WalletView } from '../types';

interface HeaderProps {
  onOpenConnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConnect }) => {
  const [view, setView] = useState<WalletView>(walletManager.selectWalletView());

  useEffect(() => {
    const unsub = walletManager.subscribeWalletState(() => {
      setView(walletManager.selectWalletView());
    });
    return unsub;
  }, []);

  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="brand-title">Civora Workbench</h1>
        <span className="brand-subtitle">
          Consensus-backed public statistics revision checks
        </span>
      </div>

      <div className="header-controls">
        <div className="network-badge" title="Studio Next preview network">
          <span className="dot dot-green" />
          <span>Studio Next</span>
        </div>

        {view.wallet ? (
          <div className="wallet-connected-info">
            <span className="wallet-brand-tag">{view.wallet.brand}</span>
            <span className="wallet-address" title={view.wallet.address}>
              {view.wallet.address.substring(0, 6)}...{view.wallet.address.substring(view.wallet.address.length - 4)}
            </span>
            {view.phase === 'WRONG_CHAIN' && (
              <button type="button" className="btn btn-sm btn-warning" onClick={() => void walletManager.recoverChain()}>
                Switch network
              </button>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => walletManager.disconnect()}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenConnect}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};
