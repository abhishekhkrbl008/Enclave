export function PrivacyLedger() {
  return (
    <div className="border border-ivory/12 rounded-sm p-6">
      <h3 className="font-display text-xl text-ivory mb-4">
        What an observer can see
      </h3>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <p className="font-mono text-[11px] text-slate-light mb-2">public</p>
          <ul className="space-y-1.5 text-sm text-ivory/75">
            <li>· the enclave's name and room labels</li>
            <li>· each room's running entry count</li>
            <li>· the set of spent room-scoped nullifiers</li>
            <li>· whether the enclave is open or closed</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] text-amber-light mb-2">private</p>
          <ul className="space-y-1.5 text-sm text-ivory/75">
            <li>· the member's allowlist secret</li>
            <li>· which member entered which room</li>
            <li>· a member's other room visits</li>
            <li>· any wallet-to-membership linkage</li>
          </ul>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-ivory/10">
        <p className="text-sm text-ivory/60 leading-relaxed">
          Each entry proves, in zero-knowledge, that the caller's secret
          belongs to the allowlist and hasn't entered this room before —{" "}
          <em className="not-italic text-ivory/80">without revealing which member it is</em>.
        </p>
      </div>
    </div>
  );
}
