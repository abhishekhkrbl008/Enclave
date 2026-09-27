import { describe, it, expect } from "vitest";
import {
  deriveMemberLeaf,
  deriveRoomNullifier,
  isValidRoomIndex,
  randomSecretHex,
} from "../src/lib/crypto";

describe("deriveMemberLeaf", () => {
  it("is deterministic for the same secret", async () => {
    const leaf1 = await deriveMemberLeaf("member-a-secret");
    const leaf2 = await deriveMemberLeaf("member-a-secret");
    expect(leaf1).toBe(leaf2);
  });

  it("produces a 64-character hex digest", async () => {
    const leaf = await deriveMemberLeaf("member-a-secret");
    expect(leaf).toMatch(/^[0-9a-f]{64}$/);
  });

  it("differs for different secrets", async () => {
    const a = await deriveMemberLeaf("member-a-secret");
    const b = await deriveMemberLeaf("member-b-secret");
    expect(a).not.toBe(b);
  });
});

describe("deriveRoomNullifier", () => {
  it("is deterministic for the same secret, enclave, and room", async () => {
    const n1 = await deriveRoomNullifier("member-a-secret", "The Study", 0);
    const n2 = await deriveRoomNullifier("member-a-secret", "The Study", 0);
    expect(n1).toBe(n2);
  });

  it("differs between rooms for the same member (one entry per room)", async () => {
    const room0 = await deriveRoomNullifier("member-a-secret", "The Study", 0);
    const room1 = await deriveRoomNullifier("member-a-secret", "The Study", 1);
    expect(room0).not.toBe(room1);
  });

  it("differs between members for the same room", async () => {
    const a = await deriveRoomNullifier("member-a-secret", "The Study", 0);
    const b = await deriveRoomNullifier("member-b-secret", "The Study", 0);
    expect(a).not.toBe(b);
  });

  it("differs between enclaves for the same member and room index (nullifier is enclave-scoped)", async () => {
    const enclaveA = await deriveRoomNullifier("member-a-secret", "The Study", 0);
    const enclaveB = await deriveRoomNullifier("member-a-secret", "The Archive", 0);
    expect(enclaveA).not.toBe(enclaveB);
  });

  it("never contains the raw secret as a substring", async () => {
    const n = await deriveRoomNullifier("member-a-secret", "The Study", 0);
    expect(n).not.toContain("member-a-secret");
  });
});

describe("isValidRoomIndex", () => {
  it("accepts indices within range", () => {
    expect(isValidRoomIndex(0, 3)).toBe(true);
    expect(isValidRoomIndex(2, 3)).toBe(true);
  });

  it("rejects indices at or beyond room count", () => {
    expect(isValidRoomIndex(3, 3)).toBe(false);
    expect(isValidRoomIndex(-1, 3)).toBe(false);
  });

  it("rejects non-integer input", () => {
    expect(isValidRoomIndex(1.5, 3)).toBe(false);
  });
});

describe("randomSecretHex", () => {
  it("produces distinct secrets across calls", () => {
    const a = randomSecretHex();
    const b = randomSecretHex();
    expect(a).not.toBe(b);
  });

  it("produces a hex string of the expected length", () => {
    const s = randomSecretHex(16);
    expect(s).toMatch(/^[0-9a-f]{32}$/);
  });
});
