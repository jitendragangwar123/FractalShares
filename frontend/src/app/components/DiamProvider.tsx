"use client";
import { mainnet } from "@starknet-react/chains";
import {
  argent,
  reddioProvider,
  StarknetConfig,
  starkscan,
  useInjectedConnectors,
} from "@starknet-react/core";


interface DiamProviderProps {
  children: React.ReactNode;
}

export function DiamProvider({ children }: DiamProviderProps) {
  const { connectors: injected } = useInjectedConnectors({
    recommended: [argent()],
    includeRecommended: "always",
  });

  const connectors = [
    ...injected,
  ];

  const apiKey = process.env.NEXT_PUBLIC_API_KEY!;

  let provider=reddioProvider({ apiKey });;

  return (
    <StarknetConfig
      connectors={connectors}
      chains={[mainnet]}
      provider={provider}
      explorer={starkscan}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
