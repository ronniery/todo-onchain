/**
 * Custom hook for managing Todo items on the Solana blockchain.
 * Provides functions for initializing, adding, marking, and removing Todos,
 * as well as managing the current state of the Todo list.
 */

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, ProgramAccount, Idl, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';

import { TodoOnchain, Todo, UserProfile, UseTodo, TryAction, TryActionOptions } from '@/types/common';
import todoIDL from '@/constants/todo.json';
import { authorFilter } from '@/utils';

/**
 * useTodo hook manages Todo state and actions on the Solana blockchain.
 * @returns {UseTodo} - Object containing state, computed values, and actions for managing Todos.
 */
export function useTodo(): UseTodo {
  const anchorWallet: AnchorWallet | undefined = useAnchorWallet();
  const [{ connection }, { publicKey }] = [useConnection(), useWallet()];
  const [internalState, setInternalState] = useState({
    initialized: false,
    lastTodo: 0,
    todos: [] as ProgramAccount<Todo>[],
    loading: false,
    transactionPending: false,
    todoContent: '',
  });

  /**
   * Initializes the Program with the Anchor provider and wallet if available.
   */
  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
      setProvider(provider);
      return new Program(todoIDL as Idl, provider) as unknown as Program<TodoOnchain>;
    }
  }, [connection, anchorWallet]);

  const [incompleteTodos, completedTodos] = useMemo(() => {
    return [
      internalState.todos.filter(({ account }) => !account.marked),
      internalState.todos.filter(({ account }) => account.marked),
    ];
  }, [internalState.todos]);

  /**
   * Updates the internal state with partial updates.
   * @param {Partial<typeof internalState>} updates - Object containing state updates.
   */
  const updateState = (updates: Partial<typeof internalState>) =>
    setInternalState((prev) => ({ ...prev, ...updates }));

  /**
   * Executes an action with error handling and transaction management.
   * @param {TryAction} action - The action to be attempted.
   * @param {TryActionOptions} options - Callbacks for success, error, and completion.
   */
  const tryAction = async (action: TryAction, { onErrorMessage, onFinally, onCatch }: TryActionOptions) => {
    if (program && publicKey && !internalState.transactionPending) {
      try {
        updateState({ transactionPending: true });
        await action(program, publicKey);
      } catch (err) {
        console.log(err);
        toast.error(onErrorMessage ?? '');
        onCatch?.();
      } finally {
        updateState({ transactionPending: false });
        onFinally?.();
      }
    }
  };

  /**
   * Handles input changes for todo content.
   * @param {ChangeEvent<HTMLInputElement>} event - Input change event.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    updateState({ todoContent: event.target.value });

  /**
   * Finds the Program Derived Address (PDA) for the user's profile.
   * @param {Program<TodoOnchain>} program - The Anchor program instance.
   * @param {PublicKey} publicKey - The public key of the user.
   * @returns {PublicKey} - The derived profile PDA.
   */
  const findProfilePda = (program: Program<TodoOnchain>, publicKey: PublicKey) => {
    const [profilePda] = PublicKey.findProgramAddressSync(
      [utf8.encode('USER_STATE'), publicKey.toBuffer()],
      program.programId,
    );
    return profilePda;
  };

  /**
   * Adds a new todo item by interacting with the blockchain.
   * @param {FormEvent} event - Form submission event.
   */
  const addTodo = async (event: FormEvent) => {
    event.preventDefault();
    await tryAction(
      async (program, publicKey) => {
        const profilePda = findProfilePda(program, publicKey);
        const [todoPda] = PublicKey.findProgramAddressSync(
          [utf8.encode('TODO_STATE'), publicKey.toBuffer(), Uint8Array.from([internalState.lastTodo])],
          program.programId,
        );
        if (internalState.todoContent) {
          await program.methods
            .addTodo(internalState.todoContent)
            .accounts({
              userProfile: profilePda,
              todoAccount: todoPda,
              authority: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
          toast.success('Successfully added todo');
        }
      },
      {
        onErrorMessage: 'Failed to add todo',
        onFinally: () => updateState({ todoContent: '' }),
      },
    );
  };

  /**
   * Marks a todo item as complete.
   * @param {PublicKey} todoPda - The PDA of the todo to mark.
   * @param {number} todoIdx - The index of the todo to mark.
   */
  const markTodo = async (todoPda: PublicKey, todoIdx: number) => {
    await tryAction(
      async (program, publicKey) => {
        updateState({ loading: true });
        await program.methods
          .markTodo(todoIdx)
          .accounts({
            userProfile: findProfilePda(program, publicKey),
            todoAccount: todoPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        toast.success('Successfully marked todo');
      },
      {
        onErrorMessage: 'Failed to mark todo',
        onFinally: () => updateState({ loading: false }),
      },
    );
  };

  /**
   * Removes a todo item from the blockchain.
   * @param {PublicKey} todoPda - The PDA of the todo to remove.
   * @param {number} todoIdx - The index of the todo to remove.
   */
  const removeTodo = async (todoPda: PublicKey, todoIdx: number) => {
    await tryAction(
      async (program, publicKey) => {
        updateState({ loading: true });
        await program.methods
          .removeTodo(todoIdx)
          .accounts({
            userProfile: findProfilePda(program, publicKey),
            todoAccount: todoPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        toast.success('Successfully removed todo');
      },
      {
        onErrorMessage: 'Failed to remove todo',
        onFinally: () => updateState({ loading: false }),
      },
    );
  };

  useEffect(() => {
    const findProfileAccounts = async () => {
      if (program && publicKey && !internalState.transactionPending) {
        try {
          updateState({ loading: true });
          const profilePda = findProfilePda(program, publicKey);
          const profileAccount: UserProfile = await program.account.userProfile.fetch(profilePda);

          if (profileAccount) {
            updateState({
              lastTodo: profileAccount.lastTodo,
              initialized: true,
              todos: await program.account.todoAccount.all([authorFilter(publicKey.toString())]),
            });
          } else {
            updateState({ initialized: false, todos: [] });
          }
        } catch (err) {
          console.log(err);
          updateState({ initialized: false, todos: [] });
        } finally {
          updateState({ loading: false });
        }
      }
    };
    findProfileAccounts();
  }, [publicKey, program, internalState.transactionPending]);

  return {
    ...internalState,
    completedTodos,
    incompleteTodos,
    markTodo,
    removeTodo,
    addTodo,
    setTodoContent: (value: string) => updateState({ todoContent: value }),
    handleChange,
  };
}
