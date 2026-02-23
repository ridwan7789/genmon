"use client";
import { useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export function useWallet() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const isTestnet = useMemo(() => {
    if (typeof window === "undefined") return true;
    return connection.rpcEndpoint.includes("devnet");
  }, [connection.rpcEndpoint]);

  const isMainnet = !isTestnet;

  const balance = useMemo(() => {
    if (!wallet.publicKey || wallet.balance === null) return null;
    return wallet.balance / LAMPORTS_PER_SOL;
  }, [wallet.publicKey, wallet.balance]);

  return {
    address: wallet.publicKey?.toBase58() ?? null,
    publicKey: wallet.publicKey,
    balance,
    isConnecting: wallet.connecting,
    isConnected: wallet.connected,
    isCorrectChain: true, // Solana doesn't have chain switching like EVM
    isTestnet,
    isMainnet,
    error: wallet.error,
    wallet: wallet.wallet,
    connectedWallet: wallet.wallet,
    connect: wallet.connect,
    disconnect: wallet.disconnect,
    switchToSolana: () => {}, // Not needed for Solana
    shortAddress: wallet.publicKey
      ? `${wallet.publicKey.toBase58().slice(0, 6)}...${wallet.publicKey.toBase58().slice(-4)}`
      : null,
  };
}

/**
 * Hook to get a Solana connection and signer from the connected wallet.
 * Use this in components that need to sign transactions or send instructions.
 */
export function useSolanaSigner() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const getSigner = useMemo(() => {
    if (!wallet.connected || !wallet.publicKey) {
      return async () => null;
    }
    return async (): Promise<{ publicKey: PublicKey; signTransaction: any } | null> => {
      try {
        if (!wallet.signTransaction) return null;
        return {
          publicKey: wallet.publicKey!,
          signTransaction: wallet.signTransaction,
        };
      } catch {
        return null;
      }
    };
  }, [wallet.connected, wallet.publicKey, wallet.signTransaction]);

  return { getSigner, connection, publicKey: wallet.publicKey };
}
