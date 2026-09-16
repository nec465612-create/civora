import { useEffect, useState } from 'react';
import { ConnectedWallet } from '../types';
import { walletManager } from './walletManager';

export function useActiveWallet(): ConnectedWallet | null {
  const current = walletManager.selectWalletView();
  const [wallet, setWallet] = useState<ConnectedWallet | null>(current.canWrite ? current.wallet : null);

  useEffect(
    () => walletManager.subscribeWalletState(() => {
      const view = walletManager.selectWalletView();
      setWallet(view.canWrite ? view.wallet : null);
    }),
    [],
  );

  return wallet;
}
