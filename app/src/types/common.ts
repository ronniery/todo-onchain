import { PublicKey } from '@solana/web3.js';
import { TodoOnchain } from './todo-onchain';

export type Todo = {
  authority: PublicKey;
  content: string;
  idx: number;
  marked: boolean;
};

export type UserProfile = {
  lastTodo: number;
  todoCount: number;
  authority: PublicKey;
};

export type { TodoOnchain };
