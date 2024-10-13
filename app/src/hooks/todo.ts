import * as anchor from '@coral-xyz/anchor';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { TODO_PROGRAM_PUBKEY } from '../constants';
import todoIDL from '../constants/todo.json';
import toast from 'react-hot-toast';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { authorFilter } from '../utils';
import { TodoOnchain } from '../types/todo-onchain';
import { TodoAccount } from '@/types/todo-account';
import { UserProfile } from '@/types/user-profile';
import { Program, ProgramAccount } from '@coral-xyz/anchor';

export function useTodo() {
  const anchorWallet: AnchorWallet | undefined = useAnchorWallet();
  const [{ connection }, { publicKey }] = [useConnection(), useWallet()];

  const [initialized, setInitialized] = useState<boolean>(false);
  const [lastTodo, setLastTodo] = useState<number>(0);
  const [todos, setTodos] = useState<TodoAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionPending, setTransactionPending] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions());
      anchor.setProvider(provider);

      return new anchor.Program(todoIDL as anchor.Idl, provider) as Program<TodoOnchain>;
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

            const todoAccounts: ProgramAccount<TodoAccount>[] = await program.account.todoAccount.all([authorFilter(publicKey.toString())]);
            setTodos(todoAccounts.map((account: ProgramAccount<TodoAccount>): TodoAccount => account.account));
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
    setInput(event.target.value);
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

        if (input) {
          await program.methods
            .addTodo(input)
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
      setInput(''); // Reset input field after submission
    }
  };

  const markTodo = async (todoPda: PublicKey, todoIdx: number) => {
    try {
      if (program &&publicKey) {
        setTransactionPending(true);
      setLoading(true);

      const [profilePda] = PublicKey.findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId);

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
      };

      
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

        const [profilePda] = PublicKey.findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId);

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

  const incompleteTodos: TodoAccount[] = useMemo(() => todos.filter((todo) => !todo.marked), [todos]);
  const completedTodos: TodoAccount[] = useMemo(() => todos.filter((todo) => todo.marked), [todos]);

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
    input,
    setInput,
    handleChange,
  };
}