"use client";
import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, BackpackWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

// Custom styles for Solana wallet adapter
const customStyles = `
  .wallet-adapter-button {
    background: linear-gradient(to right, rgba(0, 255, 255, 0.2), rgba(191, 0, 255, 0.2)) !important;
    border: 1px solid rgba(0, 255, 255, 0.4) !important;
    color: #00FFFF !important;
    border-radius: 0.5rem !important;
    font-size: 0.875rem !important;
    transition: all 0.2s !important;
  }
  .wallet-adapter-button:hover {
    background: linear-gradient(to right, rgba(0, 255, 255, 0.3), rgba(191, 0, 255, 0.3)) !important;
  }
  .wallet-adapter-dropdown {
    display: flex;
    align-items: center;
  }
  .wallet-adapter-modal-wrapper {
    background: #0A0A0F !important;
    border: 1px solid rgba(191, 0, 255, 0.2) !important;
    border-radius: 0.75rem !important;
  }
  .wallet-adapter-modal-title {
    color: #ffffff !important;
  }
  .wallet-adapter-button-start {
    color: #00FFFF !important;
  }
`;

export default function Web3Provider({ children }: { children: ReactNode }) {
  // Use Solana Devnet or Mainnet
  const endpoint = useMemo(() => {
    // Check if we should use mainnet (can be controlled via env var)
    const useMainnet = process.env.NEXT_PUBLIC_SOLANA_MAINNET === "true";
    return useMainnet 
      ? "https://api.mainnet-beta.solana.com" 
      : clusterApiUrl("devnet");
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <style>{customStyles}</style>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
