import { PublicKey } from "@solana/web3.js";

export type TodoAccount = {
  authority: PublicKey;
  content: string;
  idx: number;
  marked: boolean;
}