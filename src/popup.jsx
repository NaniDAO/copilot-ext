import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./pages/Popup";
import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http("https://rpc.ankr.com/eth"),
    [sepolia.id]: http("https://rpc.ankr.com/eth_sepolia"),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Popup />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
