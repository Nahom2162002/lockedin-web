'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      setError('Please fill in both fields');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (data.message) {
        setMessage('Password reset successful! You can now log in.');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleReset();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse 900px 500px at 15% -5%, rgba(0, 170, 255, 0.14), transparent 60%),
        radial-gradient(ellipse 900px 600px at 85% 105%, rgba(0, 120, 255, 0.12), transparent 60%),
        linear-gradient(180deg, #050726 0%, #000004 100%)`,
      fontFamily: 'Inter, sans-serif',
      padding: 24
    }}>
      <style>{`
        .back-link { transition: color 0.15s ease; }
        .back-link:hover { color: rgba(120, 210, 255, 1) !important; }
        .reset-input { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
        .reset-input:focus { border-color: rgb(0, 170, 255); box-shadow: 0 0 8px 2px rgba(0, 170, 255, 0.45); outline: none; }
        .reset-btn { transition: box-shadow 0.2s ease, transform 0.1s ease; }
        .reset-btn:hover:not(:disabled) { box-shadow: 0 0 20px 4px rgba(0, 170, 255, 0.5); }
        .reset-btn:disabled { opacity: 0.6; cursor: default; }
      `}</style>

      <a href="https://www.deeplockin.com" className="back-link" style={{ color: 'rgb(0, 170, 255)', fontSize: 14, textDecoration: 'none', marginBottom: 24 }}>
        ← Back to LockedIn
      </a>

      <div style={{
        background: 'rgba(4, 6, 36, 0.55)',
        border: '1px solid rgba(0, 170, 255, 0.35)',
        borderRadius: 16,
        boxShadow: '0 0 20px 2px rgba(0, 170, 255, 0.25), inset 0 0 30px rgba(0, 170, 255, 0.05)',
        backdropFilter: 'blur(6px)',
        padding: '40px 36px',
        width: 360,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h2 style={{
          color: 'white',
          textAlign: 'center',
          margin: '0 0 8px',
          fontSize: 24,
          textShadow: '0 0 12px rgba(0, 170, 255, 0.55)'
        }}>
          🔒 Reset Password
        </h2>

        <input
          type="password"
          className="reset-input"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            background: 'rgba(5, 5, 53, 0.6)',
            border: '1px solid rgba(0, 170, 255, 0.4)',
            borderRadius: 6,
            color: '#e6f6ff',
            padding: '10px 12px',
            fontSize: 14
          }}
        />
        <input
          type="password"
          className="reset-input"
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            background: 'rgba(5, 5, 53, 0.6)',
            border: '1px solid rgba(0, 170, 255, 0.4)',
            borderRadius: 6,
            color: '#e6f6ff',
            padding: '10px 12px',
            fontSize: 14
          }}
        />

        {error && <p style={{ color: '#ff4d4d', fontSize: 13, margin: 0, textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: '#4CAF50', fontSize: 13, margin: 0, textAlign: 'center' }}>{message}</p>}

        <button
          onClick={handleReset}
          disabled={loading}
          className="reset-btn"
          style={{
            background: 'linear-gradient(135deg, #0099ff, #0055ff)',
            boxShadow: '0 0 12px 1px rgba(0, 170, 255, 0.35)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}
