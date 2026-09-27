// crypto.ts
//
// Pure, side-effect-free helpers for deriving the values a member's
// browser needs BEFORE handing a transaction to the wallet for proving:
// the allowlist leaf, and the room-scoped nullifier. These mirror
// exactly what `contracts/enclave.compact` computes on-chain via
// `persistentHash`.
//
// Nothing in this file talks to a network, a wallet, or a contract —
// it holds no state and produces no "result". It exists purely so the
// same derivation logic can be unit-tested (tests/crypto.test.ts) and
// reused by src/lib/contractClient.ts when constructing the private
// witnesses passed to a real `enterRoom` transaction.

export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function randomSecretHex(bytes = 16): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** The allowlist leaf a member's secret hashes to — matches `persistentHash<Bytes<32>>(secret)`. */
export function deriveMemberLeaf(secret: string): Promise<string> {
  return sha256Hex(secret);
}

/** The room-scoped nullifier — matches the circuit's `[secret, hash(enclaveName), hash(roomIndex)]`. */
export async function deriveRoomNullifier(
  secret: string,
  enclaveName: string,
  roomIndex: number
): Promise<string> {
  const nameHash = await sha256Hex(enclaveName);
  const roomHash = await sha256Hex(String(roomIndex));
  return sha256Hex(`${secret}:${nameHash}:${roomHash}`);
}

export function isValidRoomIndex(roomIndex: number, roomCount: number): boolean {
  return Number.isInteger(roomIndex) && roomIndex >= 0 && roomIndex < roomCount;
}
