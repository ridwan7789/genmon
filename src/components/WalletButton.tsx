"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function WalletButton() {
  const { connected, publicKey, wallet, disconnect } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [isTestnet, setIsTestnet] = useState(true);

  // Fetch balance when connected
  useEffect(() => {
    if (!publicKey || !connection) return;

    const getBalance = async () => {
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
        
        // Check if devnet or mainnet
        const endpoint = connection.rpcEndpoint;
        setIsTestnet(endpoint.includes("devnet"));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    getBalance();
    
    // Subscribe to balance changes
    const subscription = connection.onAccountChange(publicKey, (accountInfo) => {
      setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
    });

    return () => {
      connection.removeAccountChangeListener(subscription);
    };
  }, [publicKey, connection]);

  // Custom styled WalletMultiButton
  return (
    <div className="flex items-center gap-1.5">
      {connected && publicKey && (
        <>
          {/* Network indicator */}
          <div
            className={`px-2 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${
              isTestnet
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                : "border-green-500/30 bg-green-500/10 text-green-400"
            }`}
            title={isTestnet ? "Solana Devnet" : "Solana Mainnet"}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${isTestnet ? "bg-yellow-400" : "bg-green-400"}`} />
            {isTestnet ? "Devnet" : "Mainnet"}
          </div>

          {/* Balance display */}
          {balance !== null && (
            <span className="text-[10px] text-gray-500 hidden sm:inline">
              {balance.toFixed(3)} SOL
            </span>
          )}
        </>
      )}

      {/* Custom styled wallet button */}
      <WalletMultiButton />
    </div>
  );
}
