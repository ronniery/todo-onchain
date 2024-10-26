import { PublicKey } from '@solana/web3.js';
import { ProgramAccount } from '@coral-xyz/anchor';

import { Todo } from '@/types/common';

import TodoList from './TodoList';
import styles from './TodoSection.module.scss';

export type TodoSectionProps = {
  title: string;
  todos: ProgramAccount<Todo>[];
  action: (publicKey: PublicKey, idx: number) => Promise<void>;
};

const TodoSection = ({ title, todos, action }: TodoSectionProps): JSX.Element => {
  return (
    <div className={styles.todoSection}>
      <h1 className={styles.todoStatus}>
        {title} - {todos.length}
      </h1>

      <TodoList todos={todos} action={action} />
    </div>
  );
};

export default TodoSection;
