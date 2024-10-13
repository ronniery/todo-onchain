import { type PublicKey } from '@solana/web3.js';
import styles from '../../styles/Todo.module.css';
import TodoItem from './TodoItem';
import { v4 as uuidv4 } from 'uuid';

export type TodoListProps = {
  todos: any[]; // TODO: Change
  action: (publicKey: PublicKey, idx: number) => void;
}

const TodoList   = ({ todos, action }: TodoListProps): JSX.Element => {
  debugger
  return (
    <ul className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem key={uuidv4()} {...todo.account} publicKey={todo.publicKey} action={action} />
      ))}
    </ul>
  );
};

export default TodoList;
