import { type PublicKey } from '@solana/web3.js';
import styles from '../../styles/Todo.module.css';
import TodoItem from './TodoItem';
import { v4 as uuidv4 } from 'uuid';
import { ProgramAccount } from '@coral-xyz/anchor';
import { Todo } from '@/types/todo';

export type TodoListProps = {
  todos: ProgramAccount<Todo>[];
  action: (publicKey: PublicKey, idx: number) => void;
}

const TodoList   = ({ todos, action }: TodoListProps): JSX.Element => {
  return (
    <ul className={styles.todoList}>
      {todos.map((todo: ProgramAccount<Todo>): JSX.Element => (
        <TodoItem key={uuidv4()} todo={todo.account} publicKey={todo.publicKey} action={action} />
      ))}
    </ul>
  );
};

export default TodoList;
