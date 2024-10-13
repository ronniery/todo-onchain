import { PublicKey } from '@solana/web3.js';
import styles from '../../styles/Todo.module.css';
import TodoList from './TodoList';
import { TodoAccount } from '@/types/todo-account';

export type TodoSectionProps = {
  title: string;
  todos: TodoAccount[]; // TODO: Change it
  action: (publicKey: PublicKey, idx: number) => Promise<void>;
}

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
