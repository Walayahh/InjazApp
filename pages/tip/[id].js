// pages/tip/[id].js
import { useRouter } from 'next/router';
import useSWR        from 'swr';
import { useState, useEffect } from 'react';

const fetcher = url => fetch(url).then(r => r.json());

export default function TipPage() {
  const { query } = useRouter();
  const { data: w, error } = useSWR(
    () => query.id ? `/api/workers/${query.id}` : null,
    fetcher
  );

  const [amt,       setAmt]       = useState(0);
  const [msg,       setMsg]       = useState('');
  const [loading,   setLoading]   = useState(false);

  // If worker fetch fails
  if (error) return <p style={{textAlign:'center'}}>Error loading worker.</p>;
  // Loading state
  if (!w)    return <p style={{textAlign:'center'}}>Loading…</p>;

  // Fee calculations
  const serviceFee = amt > 0 ? (amt * 0.0225) + 0.25 : 0;
  const totalPay   = amt + serviceFee;
  const workerGets = amt; // bank fee is handled client-side

  async function handleTip() {
    if (amt < 1) {
      setMsg('❌ Please enter at least 1 AED');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/tip', {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ workerId: query.id, amount: workerGets })
      });
      const j = await res.json();
      if (j.success) {
        setMsg('✅ Tip successful!');
      } else {
        setMsg('❌ ' + (j.error||'Failed'));
      }
    } catch(e) {
      setMsg('❌ Network error');
    }
    setLoading(false);
  }

  return (
    <>
      <div className="bg-decoration"></div>
      <div className="bg-decoration"></div>
      <div className="bg-decoration"></div>

      <div className="container">
        <div className="card">
          <div className="header">
            <div className="worker-icon">👤</div>
            <h1 id="worker-name">{w.name}</h1>
          </div>

          {/* Impact message */}
          <div className="impact-container">
            <div className="impact-message">
              <div className="heart-icon">❤️</div>
              <div className="main-text">
                100% of your tip goes to <strong>{w.name}</strong>
              </div>
              <div className="community-note">
                <span className="community-icon">🤝</span>
                <div>Supporting our community, one tip at a time</div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="input-group">
            <label htmlFor="tip-amount">Enter Tip Amount</label>
            <div className="input-container">
              <input
                type="number"
                id="tip-amount"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amt}
                onChange={e => setAmt(parseFloat(e.target.value)||0)}
              />
              <span className="currency-symbol">AED</span>
            </div>
          </div>

          {/* Fees breakdown */}
          <div className="fees-breakdown">
            <div className="fee-row">
              <span>Service Fee (2.25% + 0.25)</span>
              <span>{serviceFee.toFixed(2)} AED</span>
            </div>
            <div className="fee-row total">
              <span>Total to Pay</span>
              <span>{totalPay.toFixed(2)} AED</span>
            </div>
            <div className="fee-row worker-gets">
              <span>Worker Receives</span>
              <span>{workerGets.toFixed(2)} AED</span>
            </div>
          </div>

          {/* Tip button */}
          <button
            className="tip-button"
            onClick={handleTip}
            disabled={loading}
          >
            <span className="button-text">{loading ? '' : 'Send Tip'}</span>
            {loading && <span className="loading"></span>}
          </button>

          {/* Message */}
          {msg && (
            <div className={`message ${msg.startsWith('✅') ? 'success' : 'error'} show`}>
              {msg}
            </div>
          )}
        </div>
      </div>

      {/* Inlined CSS */}
      <style jsx>{`
        /* (Paste your full CSS here exactly as in your HTML, but convert any
           pseudo-classes or global resets to global if needed, e.g: ) */

        :global(*) {
          margin:0; padding:0; box-sizing:border-box;
        }
        :global(body) {
          background: linear-gradient(135deg, #FBEAD2 0%, #E8D5B7 100%);
          min-height:100vh; font-family:'Inter',sans-serif;
          display:flex; align-items:center; justify-content:center;
          position:relative; overflow-x:hidden;
        }
        .bg-decoration {
          position:absolute; border-radius:50%; opacity:0.1;
          animation:float 6s ease-in-out infinite;
        }
        .bg-decoration:nth-child(1) {
          width:200px; height:200px; background:#4F7042;
          top:10%; left:-100px; animation-delay:0s;
        }
        .bg-decoration:nth-child(2) {
          width:150px; height:150px; background:#7A9A70;
          top:60%; right:-75px; animation-delay:2s;
        }
        .bg-decoration:nth-child(3) {
          width:100px; height:100px; background:#A8C49A;
          bottom:20%; left:5%; animation-delay:4s;
        }
        @keyframes float {
          0%,100%{transform:translateY(0) rotate(0)}
          50%{transform:translateY(-20px) rotate(180deg)}
        }
        .container { perspective:1000px; z-index:10; }
        .card {
          max-width:420px; width:90vw; background:rgba(255,255,255,0.95);
          backdrop-filter:blur(10px); border-radius:24px;
          padding:2.5rem; box-shadow:0 20px 40px rgba(79,112,66,0.1),
                             0 8px 16px rgba(79,112,66,0.05);
          border:1px solid rgba(255,255,255,0.2);
          transition:all .3s; transform-style:preserve-3d;
          animation:slideUp .8s ease-out;
        }
        .card:hover {
          transform:translateY(-8px) rotateX(2deg);
          box-shadow:0 32px 64px rgba(79,112,66,0.15),
                     0 16px 32px rgba(79,112,66,0.1);
        }
        @keyframes slideUp {
          from {opacity:0; transform:translateY(50px)} to {opacity:1;transform:translateY(0)}
        }
        .header { text-align:center; margin-bottom:2rem; }
        .worker-icon {
          width:64px; height:64px;
          background:linear-gradient(135deg,#4F7042,#7A9A70);
          border-radius:50%; margin:0 auto 1rem;
          display:flex; align-items:center; justify-content:center;
          font-size:2rem; color:white; animation:pulse 2s infinite;
        }
        @keyframes pulse {0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        h1 { font-size:1.75rem; font-weight:700; color:#2D5233; margin-bottom:.5rem; }
        .impact-container { /* your existing styling */ }
        /* ...and so on for all other classes... */
        .input-group { margin:1.5rem 0; }
        input {
          width:100%; padding:1rem 1.25rem; border:2px solid #E1E8DD;
          border-radius:12px; font-size:1.1rem; background:rgba(255,255,255,0.8);
          transition:all .3s; outline:none;
        }
        input:focus {border-color:#4F7042; background:#fff; box-shadow:0 0 0 4px rgba(79,112,66,0.1);}
        .currency-symbol {position:absolute; right:1.25rem; top:50%;transform:translateY(-50%);color:#7A9A70;}
        .fees-breakdown {
          background:#F8FBF6; border-radius:12px; padding:1.5rem;
          margin:1.5rem 0; border:1px solid #E8F0E3;
        }
        .fee-row { display:flex; justify-content:space-between; margin:.75rem 0;
                   padding:.5rem 0; font-size:.95rem;}
        .fee-row.total { border-top:2px solid #4F7042; padding-top:1rem;
                         margin-top:1rem; font-weight:700; font-size:1.1rem;}
        .fee-row.worker-gets { background:rgba(79,112,66,0.05); padding:.75rem 1rem;
                               border-radius:8px; color:#4F7042; margin:0 -1rem; }
        .tip-button {
          width:100%; padding:1.25rem; background:linear-gradient(135deg,#4F7042,#7A9A70);
          color:#fff; border:none; border-radius:16px; font-size:1.1rem;
          font-weight:600; cursor:pointer; position:relative; overflow:hidden;
          margin-top:2rem; text-transform:uppercase; letter-spacing:.5px;
          display:flex; align-items:center; justify-content:center;
        }
        .tip-button.disabled,
        .tip-button:disabled { opacity:.6; cursor:not-allowed; }
        .tip-button .loading {
          width:20px; height:20px; border:2px solid rgba(255,255,255,0.3);
          border-radius:50%; border-top-color:white; animation:spin 1s infinite;
        }
        @keyframes spin { to { transform:rotate(360deg);} }
        .message {
          margin-top:1.5rem; text-align:center; padding:1rem; border-radius:12px;
          font-weight:500; opacity:0; transform:translateY(10px); transition:all .3s;
        }
        .message.show { opacity:1; transform:translateY(0); }
        .message.success { background:rgba(79,112,66,0.1); color:#2D5233; border:1px solid #A8C49A;}
        .message.error   { background:rgba(220,38,38,0.1); color:#DC2626; border:1px solid #FCA5A5;}
      `}</style>
    </>
  );
}
