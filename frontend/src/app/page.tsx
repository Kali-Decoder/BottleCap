"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
export default function Home() {
  const { address } = useAccount();
  return (
    <>
      <div className="bg-black">
        <ConnectButton />
        Hello World
      </div>
    </>
  );
}
