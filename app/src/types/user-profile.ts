import { PublicKey } from "@solana/web3.js";

export type  UserProfile = {
  lastTodo: number;
  todoCount: number;
  authority: PublicKey;
}