import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Program, ProgramAccount, Idl, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import toast from 'react-hot-toast';

import todoIDL from '@/constants/todo.json';
import { authorFilter } from '@/utils';
import { TodoOnchain, Todo, UserProfile } from '@/types/common';

type UseTodo = {
  initialized: boolean;
  initializeUser: () => Promise<void>;
  loading: boolean;
  transactionPending: boolean;
  completedTodos: ProgramAccount<Todo>[];
  incompleteTodos: ProgramAccount<Todo>[];
  markTodo: (todoPda: PublicKey, todoIdx: number) => Promise<void>;
  removeTodo: (todoPda: PublicKey, todoIdx: number) => Promise<void>;
  addTodo: (event: FormEvent) => Promise<void>;
  input: string;
  setInput: (input: string) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function useTodo(): UseTodo {
  const anchorWallet: AnchorWallet | undefined = useAnchorWallet();
  const [{ connection }, { publicKey }] = [useConnection(), useWallet()];

  const [initialized, setInitialized] = useState<boolean>(false);
  const [lastTodo, setLastTodo] = useState<number>(0);
  const [todos, setTodos] = useState<ProgramAccount<Todo>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionPending, setTransactionPending] = useState<boolean>(false);
  const [todoContent, setTodoContent] = useState<string>('');

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
      setProvider(provider);

      return new Program(todoIDL as Idl, provider) as unknown as Program<TodoOnchain>;
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const findProfileAccounts = async () => {
      if (program && publicKey && !transactionPending) {
        try {
          setLoading(true);

          const [profilePda] = PublicKey.findProgramAddressSync(
            [utf8.encode('USER_STATE'), publicKey.toBuffer()],
            program.programId
          );

          const profileAccount: UserProfile = await program.account.userProfile.fetch(profilePda);

          if (profileAccount) {
            setLastTodo(profileAccount.lastTodo);
            setInitialized(true);

            const todoAccounts: ProgramAccount<Todo>[] = await program.account.todoAccount.all([
              authorFilter(publicKey.toString()),
            ]);
            setTodos(todoAccounts);
          } else {
            setInitialized(false);
          }
        } catch (err) {
          console.log(err);
          setInitialized(false);
          setTodos([]);
        } finally {
          setLoading(false);
        }
      }
    };

    findProfileAccounts();
  }, [publicKey, program, transactionPending]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoContent(event.target.value);
  };

  const initializeUser = async (): Promise<void> => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);

        const [profilePda] = PublicKey.findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );
        const output = program.methods.initializeUser();

        await output
          .accounts({
            userProfile: profilePda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setInitialized(true);
        toast.success('Successfully initialized user');
      } catch (err) {
        console.log(err);
        toast.error('Failed to initialize user');
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const addTodo = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (program && publicKey) {
        setTransactionPending(true);

        const [profilePda] = PublicKey.findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );

        const [todoPda] = PublicKey.findProgramAddressSync(
          [utf8.encode('TODO_STATE'), publicKey.toBuffer(), Uint8Array.from([lastTodo])],
          program.programId
        );

        if (todoContent) {
          await program.methods
            .addTodo(todoContent)
            .accounts({
              userProfile: profilePda,
              todoAccount: todoPda,
              authority: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();

          toast.success('Successfully added todo');
        }
      }
    } catch (err) {
      toast.error('Failed to add todo');
      console.log(err);
    } finally {
      setTransactionPending(false);
      setTodoContent(''); // Reset input field after submission
    }
  };

  const markTodo = async (todoPda: PublicKey, todoIdx: number) => {
    try {
      if (program && publicKey) {
        setTransactionPending(true);
        setLoading(true);

        const [profilePda] = PublicKey.findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .markTodo(todoIdx)
          .accounts({
            userProfile: profilePda,
            todoAccount: todoPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        toast.success('Successfully marked todo');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to mark todo');
    } finally {
      setTransactionPending(false);
      setLoading(false);
    }
  };

  const removeTodo = async (todoPda: PublicKey, todoIdx: number) => {
    try {
      if (program && publicKey) {
        setTransactionPending(true);
        setLoading(true);

        const [profilePda] = PublicKey.findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .removeTodo(todoIdx)
          .accounts({
            userProfile: profilePda,
            todoAccount: todoPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        toast.success('Successfully removed todo');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove todo');
    } finally {
      setTransactionPending(false);
      setLoading(false);
    }
  };

  const incompleteTodos: ProgramAccount<Todo>[] = useMemo(
    () => todos.filter(({ account }) => !account.marked),
    [todos]
  );
  const completedTodos: ProgramAccount<Todo>[] = useMemo(() => todos.filter(({ account }) => account.marked), [todos]);

  return {
    initialized,
    initializeUser,
    loading,
    transactionPending,
    completedTodos,
    incompleteTodos,
    markTodo,
    removeTodo,
    addTodo,
    input: todoContent,
    setInput: setTodoContent,
    handleChange,
  };
}
