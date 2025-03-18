import { http } from "viem";
const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  iconUrl: "https://miro.medium.com/v2/resize:fit:400/0*aRHYdVg5kllfc7Gn.jpg",
  nativeCurrency: { name: "Monad Testnet", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz/"] },
  },
  blockExplorers: {
    default: {
      name: "Monad Testnet",
      url: "https://monad-testnet.socialscan.io/",
    },
  },
};

const coreDaoTestnet2 = {
  id: 1114,
  name: "Core Blockchain Testnet2",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/23254.png",
  nativeCurrency: { name: "TCORE2", symbol: "tCore2", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.test2.btcs.network/"] },
  },
  blockExplorers: {
    default: {
      name: "Core Blockchain Testnet2",
      url: "https://scan.test2.btcs.network/",
    },
  },
};



export const chainArray = [monadTestnet,coreDaoTestnet2];
export const transportsObject = {
  [monadTestnet.id]: http(),
  [coreDaoTestnet2.id]: http()
};
