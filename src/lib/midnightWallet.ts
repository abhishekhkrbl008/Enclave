// midnightWallet.ts
//
// Real integration against the Midnight DApp Connector API. Wallets
// (Lace, 1AM, and any other Midnight-compatible wallet) inject
// themselves onto `window.midnight` — a flat object keyed by an
// arbitrary id, each value exposing `name`, `apiVersion`, `isEnabled()`,
// `enable()`, and (once enabled) `state()` / `serviceUriConfig()`.
// Reference: https://docs.midnight.network/blog/connect-dapp-lace-wallet
// and the DApp Connector API reference.
//
// This module makes no network calls of its own beyond what the
// injected wallet extension performs — there is no fallback "demo
// wallet" here. If no wallet is installed, connect() reports that
// honestly rather than inventing an address.

export interface InjectedWallet {
  name: string;
  apiVersion: string;
  isEnabled: () => Promise<boolean>;
  enable?: () => Promise<WalletApi>;
  connect?: (networkId?: string) => Promise<unknown>;
}

export interface WalletApi {
  state: () => Promise<{ address: string }>;
  serviceUriConfig?: () => Promise<{
    nodeUri: string;
    indexerUri: string;
    proverServerUri: string;
  }>;
}

declare global {
  interface Window {
    midnight?: Record<string, InjectedWallet>;
  }
}

export type WalletStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "unavailable"
  | "error";

export function listInjectedWallets(): Array<{ id: string; wallet: InjectedWallet }> {
  if (!window.midnight) return [];
  return Object.entries(window.midnight).map(([id, wallet]) => ({ id, wallet }));
}

export async function connectWallet(walletId?: string): Promise<{
  address: string;
  walletName: string;
  api: WalletApi;
  serviceUriConfig?: { nodeUri: string; indexerUri: string; proverServerUri: string };
}> {
  const wallets = listInjectedWallets();
  if (wallets.length === 0) {
    throw new Error(
      "No Midnight-compatible wallet was detected. Install Lace or 1AM Wallet, configured for Preprod, and reload."
    );
  }

  const target = walletId
    ? wallets.find((w) => w.id === walletId)
    : wallets[0];
  if (!target) {
    throw new Error("The requested wallet is not installed.");
  }

  let api: unknown;
  if (typeof target.wallet.connect === "function") {
    try {
      api = await target.wallet.connect("preprod");
    } catch {
      api = await target.wallet.connect();
    }
  } else if (typeof target.wallet.enable === "function") {
    api = await target.wallet.enable();
  } else {
    throw new Error(`Wallet ${target.wallet.name} does not provide enable() or connect().`);
  }

  const walletApi = api as Record<string, unknown>;
  let address = "";
  if (walletApi.state && typeof walletApi.state === "function") {
    const state = await walletApi.state() as { address: string };
    address = state.address;
  } else if (typeof walletApi.address === "string") {
    address = walletApi.address;
  }

  let serviceUriConfig;
  if (walletApi.serviceUriConfig && typeof walletApi.serviceUriConfig === "function") {
    serviceUriConfig = await walletApi.serviceUriConfig() as { nodeUri: string; indexerUri: string; proverServerUri: string };
  } else if (walletApi.getConfiguration && typeof walletApi.getConfiguration === "function") {
    serviceUriConfig = await walletApi.getConfiguration() as { nodeUri: string; indexerUri: string; proverServerUri: string };
  }

  return { address, walletName: target.wallet.name, api: api as WalletApi, serviceUriConfig };
}
