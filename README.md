# Enclave
![CI](https://github.com/abhishekhkrbl008/Enclave/actions/workflows/ci.yml/badge.svg)
> Prove membership without revealing identity. Built on Midnight.

## Live Demo
[https://enclave-three.vercel.app](https://enclave-three.vercel.app)

## Contract Address
| Network  | Address                          |
|----------|-----------------------------------|
| Preprod  | [Contract 0xe64d9f9a… \| Midnight Explorer](https://preprod.midnightexplorer.com/contracts/0xe64d9f9a2fda1aba27ad9545a0c64c81de66833d31ccf7fd034d93f4d07dd649) |

## What This Does
Enclave gates a set of private "rooms" behind a single allowlist. A
convener publishes the Merkle root of every allowlisted member's hashed
secret; members then prove, in zero-knowledge, that they belong to that
allowlist and haven't entered a given room before — without ever
revealing which member they are, or which other rooms they've visited.

## No mock data — architecture note
This build intentionally has **no local ledger simulator**. Earlier
Level 3 submissions in this series (Quorum, Signet) shipped with an
in-browser TypeScript mirror of the circuit so the UI was clickable
before deployment. This one doesn't: `src/lib/contractClient.ts`
refuses to fabricate a transaction result. Every action either goes
through a connected wallet against a real deployed contract, or the UI
tells you plainly that nothing is deployed yet. See docs/USAGE.md
for the exact steps to wire it up to a live Preprod deployment.

## Privacy Model
- **PUBLIC:** the enclave's name and room labels, each room's running
  entry count, the set of spent room-scoped nullifiers, open/closed
  status.
- **PRIVATE:** the member's allowlist secret, which member entered
  which room, and any wallet-to-membership linkage.
- **PROVED without revealing:** that the caller's secret is a genuine
  member of the allowlist and has not entered this specific room
  before — without revealing which member it is.

## Privacy Claim
An on-chain observer can see exactly how many times each room has been
entered, and can confirm no member entered the same room twice (the
nullifier set only grows). What they cannot see, at any point, is
whose secret it was, or which other rooms that same member has
entered — nullifiers are room-scoped and unlinkable to each other.

## Tech Stack
- **Contract:** Compact (`contracts/enclave.compact`) — Midnight's ZK
  smart contract language
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Wallet:** Midnight DApp Connector API (Lace, 1AM, or any compatible
  wallet — multi-wallet detection, no hardcoded provider)
- **Tests:** Vitest, covering the pure witness-derivation helpers used
  to build real transactions
- **CI/CD:** GitHub Actions

## Prerequisites
- Node.js v22+
- npm
- [Midnight `compact` CLI](https://docs.midnight.network) (for compiling
  the contract and deploying to Preprod)
- A Midnight-compatible wallet (Lace or 1AM), funded on Preprod

## Setup & Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Compile the contract (requires the Midnight toolchain)
npm run compact:compile

# 3. Run the app
npm run dev
```
Until `deployed_contract.json` has a real address and
`src/lib/contractClient.ts`'s live-call section is wired to your
compiled `managed/enclave` bindings (see docs/USAGE.md), the app runs
but honestly reports that no contract is deployed rather than
simulating one.

## Run Tests
```
npm test
```

## CI/CD
On every push and pull request to `main`, the GitHub Actions pipeline
(`.github/workflows/ci.yml`) checks out the code, installs dependencies
on Node 22, compiles the Compact contract when the toolchain is present,
lints, runs the full Vitest suite, and produces a production build —
failing the run if any step errors.

## Product Proposal
See [PROPOSAL.md](./PROPOSAL.md).
