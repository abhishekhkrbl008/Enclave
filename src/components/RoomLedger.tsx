import { isDeployed } from "../lib/contractClient";

const ROOM_LABELS = ["The Study", "The Archive", "Strategy Room"];

export function RoomLedger() {
  const deployed = isDeployed();

  return (
    <div className="border border-ivory/12 rounded-sm p-6">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-display text-xl text-ivory">Room ledger</h3>
        <span className="font-mono text-[11px] text-ivory/40">
          {deployed ? "live · on-chain" : "awaiting deployment"}
        </span>
      </div>

      <div className="space-y-3">
        {ROOM_LABELS.map((label) => (
          <div key={label} className="flex justify-between items-center text-sm">
            <span className="text-ivory/70">{label}</span>
            <span className="font-mono text-xs text-ivory/40">
              {deployed ? "reads from managed/enclave" : "—"}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-ivory/35 mt-5 pt-5 border-t border-ivory/10">
        Entry counts come from the contract's public ledger state — this
        panel does not compute or estimate them locally.
      </p>
    </div>
  );
}
