import React, { useEffect, useState } from 'react';
import { walletManager } from '../services/walletManager';
import { ConnectedWallet } from '../types';

interface HeaderProps {
  onOpenConnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConnect }) => {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(walletManager.getActiveWallet());

  useEffect(() => {
    const unsub = walletManager.subscribe(() => {
      setWallet(walletManager.getActiveWallet());
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

        {wallet ? (
          <div className="wallet-connected-info">
            <span className="wallet-brand-tag">{wallet.brand}</span>
            <span className="wallet-address" title={wallet.address}>
              {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
            </span>
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
