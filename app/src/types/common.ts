import { ChangeEvent, FormEvent } from 'react';
import { Program, ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

import { TodoOnchain } from './todo-onchain';

/**
 * Represents an individual to-do item on the Solana blockchain.
 *
 * @property {PublicKey} authority - The public key of the user who created the to-do item.
 * @property {string} content - The textual content of the to-do item.
 * @property {number} idx - The unique index of the to-do item for the user.
 * @property {boolean} marked - Indicates whether the to-do item is marked as completed.
 *
 * @example
 * // Example of a Todo object:
 * const todo = {
 *   authority: new PublicKey('examplePublicKey123'),
 *   content: 'Finish the Solana project',
 *   idx: 1,
 *   marked: false
 * };
 */
export type Todo = {
  authority: PublicKey;
  content: string;
  idx: number;
  marked: boolean;
};

/**
 * Represents a user profile on the Solana blockchain, used for tracking to-do counts and metadata.
 *
 * @property {number} lastTodo - The index of the last created to-do item for the user.
 * @property {number} todoCount - The total number of to-do items created by the user.
 * @property {PublicKey} authority - The public key of the user associated with this profile.
 *
 * @example
 * // Example of a UserProfile object:
 * const userProfile = {
 *   lastTodo: 5,
 *   todoCount: 10,
 *   authority: new PublicKey('userPublicKeyExample456')
 * };
 */
export type UserProfile = {
  lastTodo: number;
  todoCount: number;
  authority: PublicKey;
};

/**
 * Defines the core functionalities for managing to-do items in the app, including state and action methods.
 *
 * @property {boolean} initialized - Indicates if the user's profile and to-do list are loaded.
 * @property {boolean} loading - Shows whether data is loading.
 * @property {boolean} transactionPending - True if a transaction is in progress, false otherwise.
 * @property {ProgramAccount<Todo>[]} completedTodos - List of completed to-do items.
 * @property {ProgramAccount<Todo>[]} incompleteTodos - List of incomplete to-do items.
 * @property {(todoPda: PublicKey, todoIdx: number) => Promise<void>} markTodo - Function to mark a to-do item as completed.
 * @property {(todoPda: PublicKey, todoIdx: number) => Promise<void>} removeTodo - Function to remove a to-do item.
 * @property {(event: FormEvent) => Promise<void>} addTodo - Function to add a new to-do item.
 * @property {string} todoContent - The content of the to-do item currently being created.
 * @property {(input: string) => void} setTodoContent - Sets the content of the to-do item being created.
 * @property {(event: ChangeEvent<HTMLInputElement>) => void} handleChange - Updates content as the user types.
 */
export type UseTodo = {
  initialized: boolean;
  loading: boolean;
  transactionPending: boolean;
  completedTodos: ProgramAccount<Todo>[];
  incompleteTodos: ProgramAccount<Todo>[];
  markTodo: (todoPda: PublicKey, todoIdx: number) => Promise<void>;
  removeTodo: (todoPda: PublicKey, todoIdx: number) => Promise<void>;
  addTodo: (event: FormEvent) => Promise<void>;
  todoContent: string;
  setTodoContent: (input: string) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Represents an action that requires a Solana program and public key to execute, such as adding or updating a to-do.
 *
 * @param {Program<TodoOnchain>} program - The Anchor program that interacts with the Solana blockchain.
 * @param {PublicKey} publicKey - The public key of the user initiating the action.
 * @returns {Promise<void>} - A promise that resolves when the action completes.
 */
export type TryAction = (program: Program<TodoOnchain>, publicKey: PublicKey) => Promise<void>;

/**
 * Options for customizing the behavior of a TryAction, providing hooks for error handling, completion, and custom resolution.
 *
 * @property {Array} [resolver] - Optional array to customize resolution of the TryAction.
 * @property {string} [onErrorMessage] - Message to display if the action fails.
 * @property {() => void} [onFinally] - Callback executed after the action completes, regardless of success or failure.
 * @property {() => void} [onCatch] - Callback executed if an error is caught during the action.
 */
export type TryActionOptions= {
  resolver?: [Program, PublicKey, ...any]; 
  onErrorMessage?: string, 
  onFinally?: () => void, 
  onCatch?: () => void 
}

export type { TodoOnchain };
