import dynamic from 'next/dynamic';
import React from 'react';

import { useTodo } from '@/hooks/UseTodos';
import Loading from '@/components/Loading';
import TodoSection from '@/components/todo/TodoSection';
import styles from '@/styles/Home.module.scss';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Home: React.FC = (): JSX.Element => {
  const {
    initialized,
    loading,
    completedTodos,
    incompleteTodos,
    addTodo,
    markTodo,
    removeTodo,
    todoContent,
    handleChange,
  } = useTodo();

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        {initialized && (
          <div className={styles.todoInput}>
            <div className={`${styles.todoCheckbox} ${styles.checked}`} />
            <div className={styles.inputContainer}>
              <form onSubmit={addTodo}>
                <input
                  value={todoContent}
                  onChange={handleChange}
                  id={styles.inputField}
                  type="text"
                  placeholder="Create a new todo..."
                />
              </form>
            </div>
            <div className={styles.iconContainer}></div>
          </div>
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
