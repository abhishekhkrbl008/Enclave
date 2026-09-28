# Product Proposal

## What is the product, and who uses it?
Enclave is a zero-knowledge private room application. It allows users to prove membership in a specific group or "room" without revealing their true identity. It can be used by organizations, DAO members, or private communities who want verifiable but anonymous access to resources or voting systems.

## Why Midnight specifically?
Midnight provides native support for Zero-Knowledge proofs and shielded state. A transparent chain like Cardano or Ethereum would expose the members' identities or their access patterns to the public, destroying the anonymity that Enclave requires. Midnight allows us to verify a user's membership (via a private witness) while keeping their identity and exact actions completely shielded from the public ledger, recording only aggregate room entry counts.

## Data Model
| Data Point                        | Type            | Disclosed To |
|-------------------------------------|-----------------|--------------|
| Enclave name & room labels          | Public ledger   | Everyone     |
| Per-room entry counts                | Public ledger   | Everyone     |
| Spent nullifier set                  | Public ledger   | Everyone     |
| Member's allowlist secret            | Private witness | No one       |
| Which member entered which room      | Private witness | No one       |
| Merkle Tree Root (Allowlist)         | Public ledger   | Everyone     |
| User Wallet Address                  | Private wallet  | No one       |

## Mainnet Feasibility
This is highly feasible for Mainnet by Level 6. The core zero-knowledge circuit for membership verification and nullifier checking is well-understood and fits perfectly within Midnight's Compact language capabilities. The primary tasks remaining are wiring up the wallet integration for mainnet and setting up a secure way to distribute the allowlist secrets off-chain.
