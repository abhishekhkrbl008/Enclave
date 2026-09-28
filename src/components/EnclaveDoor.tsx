import { useState } from "react";
import { randomSecretHex } from "../lib/crypto";
import { submitEnterRoom, isDeployed } from "../lib/contractClient";
import { WalletApi } from "../lib/midnightWallet";

type Phase = "no-secret" | "ready" | "proving" | "error";

const ROOM_LABELS = ["The Study", "The Archive", "Strategy Room"];

export function EnclaveDoor({
  walletApi,
  walletConnected,
}: {
  walletApi: WalletApi | null;
  walletConnected: boolean;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [roomIndex, setRoomIndex] = useState<number>(0);
  const [phase, setPhase] = useState<Phase>("no-secret");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{txHash: string, explorerUrl: string} | null>(null);

  function handleGenerateSecret() {
    setSecret(randomSecretHex());
    setPhase("ready");
    setSuccessData(null);
  }

  async function handleEnter() {
    if (!secret || !walletApi) return;
    setPhase("proving");
    setErrorMsg(null);
    setSuccessData(null);
    try {
      const result = await submitEnterRoom({ wallet: walletApi, memberSecret: secret, roomIndex });
      setSuccessData(result);
      setPhase("ready");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "The transaction could not be submitted.");
      setPhase("error");
    }
  }

  return (
    <div className="lantern-glow border border-ivory/10 rounded-sm overflow-hidden">
      <div className="p-8">
        <p className="font-mono text-[11px] tracking-wide text-ivory/40">enclave · quiet correspondence society</p>
        <h2 className="font-display text-3xl text-ivory mt-1 mb-6">
          Who goes there?
        </h2>

        {!walletConnected ? (
          <p className="text-sm text-ivory/60 leading-relaxed">
            Connect a Midnight wallet above to begin. Your membership
            secret is generated on your device — it never leaves it.
          </p>
        ) : phase === "no-secret" ? (
          <div className="space-y-4">
            <p className="text-sm text-ivory/70 leading-relaxed">
              Generate a membership secret. For this to grant real entry,
              the corresponding leaf must already be part of the
              enclave's allowlist Merkle root at deployment time — see
              docs/USAGE.md for wiring a real issuance flow.
            </p>
            <button
              onClick={handleGenerateSecret}
              className="w-full font-mono text-sm bg-ivory text-obsidian rounded-sm py-3 hover:bg-ivory/90 transition-colors"
            >
              generate membership secret
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-2">
              {ROOM_LABELS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setRoomIndex(i)}
                  className={`font-mono text-xs rounded-sm py-3 px-2 border transition-colors ${
                    roomIndex === i
                      ? "border-amber text-amber-light bg-amber/10"
                      : "border-ivory/15 text-ivory/60 hover:border-ivory/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {errorMsg && (
              <p className="text-sm text-amber-light border border-amber/30 bg-amber/5 rounded-sm px-3 py-2 leading-relaxed">
                {errorMsg}
              </p>
            )}

            {successData && (
              <div className="text-sm text-emerald-400 border border-emerald-500/30 bg-emerald-500/5 rounded-sm px-3 py-2 leading-relaxed">
                <p>Entry verified!</p>
                <p className="text-xs truncate font-mono mt-1 opacity-70">Tx: {successData.txHash}</p>
                <a 
                  href={successData.explorerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs underline hover:text-emerald-300 mt-2 inline-block"
                >
                  View on Explorer ↗
                </a>
              </div>
            )}

            <button
              onClick={handleEnter}
              disabled={phase === "proving" || !isDeployed()}
              className="w-full font-mono text-sm bg-slate text-obsidian-deep rounded-sm py-3.5 hover:bg-slate-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              title={!isDeployed() ? "No contract deployed yet — see the banner above" : undefined}
            >
              {phase === "proving" ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-obsidian-deep/30 border-t-obsidian-deep animate-spin" />
                  generating proof…
                </>
              ) : (
                `enter ${ROOM_LABELS[roomIndex]}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
