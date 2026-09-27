# Usage notes

## Circuit walkthrough (`contracts/enclave.compact`)

- `openEnclave(name, labels, numRooms, root)` — convener opens the
  enclave with 1-3 named rooms and the Merkle root of every allowlisted
  member's hashed secret.
- `enterRoom(roomIndex)` — a member supplies two private witnesses
  (`memberSecret`, `memberPath`), the circuit proves membership against
  `allowlistRoot`, derives a room-scoped nullifier (`secret + enclave
  name + room index`), checks it hasn't been spent, then increments only
  the room's public visit counter.
- `closeEnclave()` — freezes further entries without altering past
  visit counts.

## Going from stub to live calls (real on-chain transactions)

This repo ships with **no simulated ledger**. `src/lib/contractClient.ts`
throws until you complete this wiring — it will never return a
fabricated transaction hash.

1. Install the Midnight `compact` CLI and run
   `npm run compact:compile` — this populates `managed/enclave` with
   the generated TypeScript bindings and verifier keys.
2. Build the allowlist Merkle tree off-chain from your real members'
   hashed secrets, and deploy the contract with `openEnclave` called
   against that root. Record the resulting Preprod contract address in
   `deployed_contract.json` and in `README.md`.
3. In `src/lib/contractClient.ts`, replace the body of
   `submitEnterRoom` with a real call against your generated
   `managed/enclave` bindings, using `@midnight-ntwrk/midnight-js-contracts`
   (`findDeployedContract` + a `callTx` against the `enterRoom` circuit).
   The exact provider construction (indexer/node/proof-server URIs, taken
   from `walletApi.serviceUriConfig()`) varies slightly by SDK version —
   mirror Midnight's official `example-counter` reference dApp, which
   demonstrates the full deploy-and-call pattern end to end:
   https://docs.midnight.network (see "Examples" in the sidebar).
4. Once wired, `EnclaveDoor`'s "enter room" button will submit a real
   wallet-signed transaction and should surface the returned tx hash —
   add an explorer link (Preprod Midnight Explorer or 1AM Explorer) next
   to the success state.

## Manual steps still required before submission

- [ ] Compile the contract and deploy to Preprod with a real allowlist root
- [ ] Wire `submitEnterRoom` to the generated bindings (step 3 above)
- [ ] Add the real Preprod contract address to `README.md` and `deployed_contract.json`
- [ ] Fill in every `[I WILL FILL THIS IN]` section of `PROPOSAL.md`
- [ ] Submit the chosen idea (Private Allowlist Access) for approval
- [ ] Record the 1-minute demo video showing a real transaction (see checklist below)
- [ ] Make 10+ meaningful, incremental commits
- [ ] Deploy the frontend (e.g. Vercel/Netlify) and add the live URL

## Demo video checklist
1. Full flow: connect a real wallet → generate a membership secret →
   enter a room → show the resulting transaction on a Preprod explorer
2. Terminal showing `npm test` output (13 passing)
3. README showing the green CI badge
