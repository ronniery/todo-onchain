import { PublicKey } from "@solana/web3.js";

export type Todo = {
  authority: PublicKey;
  content: string;
  idx: number;
  marked: boolean;
}