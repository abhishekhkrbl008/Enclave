import { WalletStatus } from "../lib/midnightWallet";

function truncate(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export function Header({
  status,
  address,
  walletName,
  error,
  onConnect,
  onDisconnect,
}: {
  status: WalletStatus;
  address: string | null;
  walletName: string | null;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <header className="border-b border-ivory/10">
      <div className="mx-auto max-w-3xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 64 64" className="shrink-0">
            <path d="M18 50 V28 A14 14 0 0 1 46 28 V50" fill="none" stroke="#E8A33D" strokeWidth="3.5" />
            <circle cx="32" cy="30" r="3" fill="#E8A33D" />
          </svg>
          <div>
            <p className="font-display text-2xl text-ivory leading-none tracking-wide">Enclave</p>
            <p className="font-mono text-[11px] text-ivory/45 mt-1">
              first quarter · midnight builder challenge
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {status === "connected" && address ? (
            <button
              onClick={onDisconnect}
              className="font-mono text-xs text-slate-light border border-slate/40 rounded px-3 py-1.5 hover:bg-slate/10 transition-colors"
            >
              {walletName ?? "wallet"} · {truncate(address)}
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={status === "connecting"}
              className="font-mono text-xs text-ivory border border-ivory/25 rounded px-3 py-1.5 hover:border-amber hover:text-amber-light transition-colors disabled:opacity-50"
            >
              {status === "connecting" ? "connecting…" : "connect wallet"}
            </button>
          )}
          {status === "unavailable" && (
            <p className="text-[11px] text-ivory/40 max-w-[240px] text-right">{error}</p>
          )}
          {status === "error" && error && (
            <p className="text-[11px] text-amber-light max-w-[240px] text-right">{error}</p>
          )}
        </div>
      </div>
    </header>
  );
}
