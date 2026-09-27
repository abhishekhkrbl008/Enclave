import { DeploymentInfo } from "../lib/contractClient";

export function DeploymentBanner({ deployment }: { deployment: DeploymentInfo }) {
  if (deployment.address) {
    return (
      <div className="border border-slate/30 bg-slate/5 rounded-sm px-4 py-3 text-sm text-ivory/80 flex flex-wrap items-center gap-2 mb-8">
        <span className="text-slate-light">●</span>
        <span>
          Live on {deployment.network} at{" "}
          <span className="font-mono text-xs text-ivory/70">
            {deployment.address.slice(0, 10)}…{deployment.address.slice(-8)}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="border border-amber/30 bg-amber/5 rounded-sm px-4 py-3 text-sm text-ivory/80 mb-8">
      <p className="flex items-center gap-2 text-amber-light">
        <span>●</span>
        <span className="font-medium">Not yet deployed to Preprod</span>
      </p>
      <p className="text-ivory/55 text-[13px] mt-1 leading-relaxed">
        Entries below require a real deployed contract and a connected
        wallet — there is no simulated ledger in this build. Run{" "}
        <code className="font-mono text-ivory/70">compact compile</code>,
        deploy, and fill in <code className="font-mono text-ivory/70">deployed_contract.json</code>{" "}
        (see docs/USAGE.md) to enable live entries.
      </p>
    </div>
  );
}
