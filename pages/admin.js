// /pages/admin.js
import { useState } from 'react';

export default function Admin() {
  const [name, setName] = useState('');
  const [id,   setId]   = useState('');
  const [qr,   setQr]   = useState('');
  const [url,  setUrl]  = useState('');
  const [err,  setErr]  = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, id })
    });
    if (!res.ok) {
      const json = await res.json();
      setErr(json.error||'Failed');
      return;
    }
    const { qrDataUrl, url } = await res.json();
    setQr(qrDataUrl);
    setUrl(url);
  }

  return (
    <div style={{ maxWidth:400, margin:'2rem auto', fontFamily:'sans-serif' }}>
      <h1>Admin: Create Worker</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
        <label style={{marginTop:10}}>ID</label>
        <input value={id} onChange={e=>setId(e.target.value)} />
        <button style={{marginTop:10}}>Generate QR</button>
      </form>
      {err && <p style={{color:'red'}}>{err}</p>}
      {qr && (
        <div style={{marginTop:20}}>
          <h2>{name} ({id})</h2>
          <img src={qr} alt="QR code" width={200} height={200}/>
          <p><a href={url} target="_blank">{url}</a></p>
        </div>
      )}
    </div>
  );
}
