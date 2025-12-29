import { useState } from 'react';

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
    <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>新しい部屋を作る</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="部屋の名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          {loading ? '作成中...' : '作成して入室'}
        </button>
      </form>
    </section>
  );
};