// pages/admin.js
import { useState } from 'react';
import useSWR        from 'swr';
import QRCode        from 'qrcode.react';

const fetcher = url => fetch(url).then(r => r.json());

export default function Admin() {
  // 1) Fetch existing workers
  const { data: workers, mutate, error } = useSWR('/api/workers', fetcher);

  const [name, setName] = useState('');
  const [id,   setId]   = useState('');
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !id) return setErr('Name & ID required');
    setBusy(true); setErr('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, id })
    });
    const j = await res.json();
    if (!res.ok) {
      setErr(j.error || 'Failed');
    } else {
      // refresh worker list
      await mutate();
      setName(''); setId('');
    }
    setBusy(false);
  }

  if (error) return <p>Error loading workers</p>;
  if (!workers) return <p>Loading…</p>;

  return (
    <div style={{fontFamily:'sans-serif', padding:'2rem', maxWidth:800, margin:'auto'}}>
      <h1>👷‍♂️ Admin Panel</h1>
      <form onSubmit={handleSubmit} style={{marginBottom:'2rem'}}>
        <input
          placeholder="Worker Name"
          value={name} onChange={e=>setName(e.target.value)}
          disabled={busy}
        />
        <input
          placeholder="Worker ID"
          value={id} onChange={e=>setId(e.target.value)}
          disabled={busy}
        />
        <button type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create Worker & QR'}
        </button>
        {err && <p style={{color:'red'}}>{err}</p>}
      </form>

      <h2>All Workers</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,200px)',gap:'1rem'}}>
        {workers.map(w => {
          const url = `${process.env.NEXT_PUBLIC_BASE_URL}/tip/${encodeURIComponent(w.workerId)}`;
          return (
            <div key={w.workerId} style={{padding:'1rem',border:'1px solid #ddd',borderRadius:8}}>
              <strong>{w.name}</strong><br/>
              <small>ID: {w.workerId}</small>
              <div style={{margin:'1rem 0'}}>
                <QRCode value={url} size={128} level="H" />
              </div>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {new URL(url).pathname}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
