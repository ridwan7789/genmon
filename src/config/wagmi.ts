import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { cookieStorage, createStorage } from "wagmi";

// Solana Devnet
export const solanaDevnet = defineChain({
  id: 101,
  name: "Solana Devnet",
  nativeCurrency: { name: "SOL", symbol: "SOL", decimals: 9 },
  rpcUrls: {
    default: { http: ["https://api.devnet.solana.com"] },
  },
  blockExplorers: {
    default: { name: "Solana Explorer", url: "https://explorer.solana.com?cluster=devnet" },
  },
  testnet: true,
});

// Solana Mainnet
export const solanaMainnet = defineChain({
  id: 101,
  name: "Solana",
  nativeCurrency: { name: "SOL", symbol: "SOL", decimals: 9 },
  rpcUrls: {
    default: { http: ["https://api.mainnet-beta.solana.com"] },
  },
  blockExplorers: {
    default: { name: "Solana Explorer", url: "https://solscan.io" },
  },
});

const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "YOUR_PROJECT_ID";

// Both chains available — user switches via UI
export const wagmiConfig = getDefaultConfig({
  appName: "GENMON",
  projectId: WC_PROJECT_ID,
  chains: [solanaDevnet, solanaMainnet],
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});

export const TESTNET_CHAIN_ID = solanaDevnet.id;
export const MAINNET_CHAIN_ID = solanaMainnet.id;
