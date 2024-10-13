import dynamic from 'next/dynamic';
import React from 'react';

import { useTodo } from '@/hooks/todo';
import Loading from '@/components/loading';
import TodoSection from '@/components/todo/todo-section';

import styles from './index.module.css';

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
    </div>
  );
};

export default Home;