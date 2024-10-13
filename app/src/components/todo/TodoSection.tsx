import { PublicKey } from '@solana/web3.js';
import { ProgramAccount } from '@coral-xyz/anchor';

import styles from '$styles/Todo.module.css';
import { Todo } from '$types/common';

import TodoList from './TodoList';

export type TodoSectionProps = {
  title: string;
  todos: ProgramAccount<Todo>[];
  action: (publicKey: PublicKey, idx: number) => Promise<void>;
};

const TodoSection = ({ title, todos, action }: TodoSectionProps): JSX.Element => {
  return (
    <div className={styles.todoSection}>
      <h1 className="title">
        {title} - {todos.length}
      </h1>

      <TodoList todos={todos} action={action} />
    </div>
  );
};

export default TodoSection;
