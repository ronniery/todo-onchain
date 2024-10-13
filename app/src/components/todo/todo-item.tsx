import { PublicKey } from '@solana/web3.js';
import { CalendarIcon, TrashIcon } from '@heroicons/react/outline';

import { Todo } from '@/types/common';

import styles from './todo-item.module.css';

export type TodoItemProps = {
  todo: Todo & { dateline?: string };
  publicKey: PublicKey;
  action: (publicKey: PublicKey, idx: number) => void;
};

const TodoItem = ({ todo, publicKey, action }: TodoItemProps): JSX.Element => {
  const { idx, content, marked, dateline } = todo;

  const handleMarkTodo = () => {
    // Only allow unchecked todo to be marked
    if (marked) return;

    action(publicKey, idx);
  };

  const handleRemoveTodo = () => {
    // Only allow checked todo to be removed
    if (!marked) return;

    action(publicKey, idx);
  };

  return (
    <li key={idx} className={styles.todoItem}>
      <div onClick={handleMarkTodo} className={`${styles.todoCheckbox} ${marked && styles.checked}`} />
      <div>
        <span className="todoText">{content}</span>
        {dateline && (
          <div className={styles.todoDateline}>
            <CalendarIcon className={styles.calendarIcon} />
            <span>{dateline}</span>
          </div>
        )}
      </div>
      <div className={styles.iconContainer}>
        <TrashIcon onClick={handleRemoveTodo} className={`${styles.trashIcon} ${!marked && styles.checked}`} />
      </div>
    </li>
  );
};

export default TodoItem;
