import { useState } from 'react';
import styles from '../room.module.css';

interface CreateRoomFormProps {
  onSubmit: (name: string) => void;
  loading: boolean;
}

export const CreateRoomForm = ({ onSubmit, loading }: CreateRoomFormProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit(name);
  };

  return (
    <div>
      <h3 style={{marginBottom: '1rem', color: 'var(--accent-gold)'}}>CREATE ROOM</h3>
      <form onSubmit={handleSubmit} className={styles.createRoomForm}>
        <input
          type="text"
          placeholder="部屋の名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.createButton}>
          {loading ? '...' : '作成'}
        </button>
      </form>
    </div>
  );
};