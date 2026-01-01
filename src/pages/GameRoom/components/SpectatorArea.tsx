import type { Player } from '../../../types';
import { Card } from '../../../components/Card/Card';
import styles from './SpectatorArea.module.css';

interface Props {
  players: Player[];
}

export const SpectatorArea = ({ players }: Props) => {
  return (
    <div className='container'>
      <h2 style={{ textAlign: 'center', color: '#fff', backgroundColor: '#333', padding: '0.5rem' }}>観戦モード</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {players.map((p) => (
          <div key={p.userID} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '0.5rem', background: 'rgba(255,255,255,0.9)', width: '300px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', borderBottom: '1px solid #eee' }}>
              {p.user?.name} ({p.hand?.length ?? 0}枚)
              {p.rank > 0 && <span style={{ color: 'red', marginLeft: '0.5rem' }}>{p.rank}位</span>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {p.hand?.map((c) => (
                <div key={c.id} style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '36px', height: '54px' }}>
                   <Card card={c} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};