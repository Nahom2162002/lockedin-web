'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();

    if (data.message) {
      setMessage('Password reset successful! You can now log in.');
      setError('');
    } else {
      setError(data.error);
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d0d' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: 40, borderRadius: 16, width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ color: 'white', textAlign: 'center' }}>🔒 Reset Password</h2>
        <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}
        {message && <p style={{ color: '#4CAF50' }}>{message}</p>}
        <button onClick={handleReset}>Reset Password</button>
      </div>
    </div>
  );
}