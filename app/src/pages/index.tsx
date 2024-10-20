import dynamic from 'next/dynamic';
import React from 'react';

import { useTodo } from '@/hooks/UseTodos';
import Loading from '@/components/Loading';
import TodoSection from '@/components/todo/TodoSection';

import styles from './index.module.scss';
import { Divider, Grid2, IconButton, InputAdornment, InputBase, Paper, TextField } from '@mui/material';
import { MenuIcon, SearchIcon, ArrowRightIcon, MenuAlt1Icon } from '@heroicons/react/outline';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Home: React.FC = (): JSX.Element => {
  const {
    initialized,
    initializeUser,
    loading,
    transactionPending,
    completedTodos,
    incompleteTodos,
    addTodo,
    markTodo,
    removeTodo,
    input,
    handleChange,
  } = useTodo();

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        {initialized ? (
          <div className={styles.todoInput}>
            <div className={`@/{styles.todoCheckbox} @/{styles.checked}`} />
            <div className={styles.inputContainer}>
              <form onSubmit={addTodo}>
                <input
                  value={input}
                  onChange={handleChange}
                  id={styles.inputField}
                  type="text"
                  placeholder="Create a new todo..."
                />
              </form>
            </div>
            <div className={styles.iconContainer}></div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.button}
            onClick={() => initializeUser()}
            disabled={transactionPending}
          >
            Initialize
          </button>
        )}
        <WalletMultiButtonDynamic />
      </div>

      <div className={styles.mainContainer}>
        <Loading loading={loading}>
          <TodoSection title="Tasks" todos={incompleteTodos} action={markTodo} />
          <TodoSection title="Completed" todos={completedTodos} action={removeTodo} />
        </Loading>
      </div>

      <Grid2 container justifyContent={'center'} display={'flex'} alignContent={'center'}>
        <Grid2 size={8} >
        <TextField
        id="input-with-icon-textfield"
        sx={{
          '::placeholder': {
            color: '#ccc',
          },
          color: 'white',
        }}
        
        fullWidth
        slotProps={{
          input: {
            sx: {
              color: 'white'
            },
            startAdornment: (
              <InputAdornment position="start">
                <MenuAlt1Icon />
              </InputAdornment>
            ),
          },
        }}
        variant="standard"
      />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Home;
