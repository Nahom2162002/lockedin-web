'use client';
import { useEffect, useState } from 'react';

interface Status {
  plan: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
}

export default function PortalReturnPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setError('Missing session. Please check your plan in the extension.');
      setLoading(false);
      return;
    }

    fetch('/api/stripe/status', {
      headers: { authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not confirm your subscription status. Please check the extension.');
        setLoading(false);
      });
  }, []);

  let title = 'You can close this tab';
  let message = 'You can close this tab and return to the extension.';

  if (status) {
    if (status.plan === 'free') {
      title = 'Subscription cancelled';
      message = 'Your subscription has been cancelled. You can close this tab and return to the extension.';
    } else if (status.cancelAtPeriodEnd) {
      const endDate = status.currentPeriodEnd
        ? new Date(status.currentPeriodEnd).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
        : null;
      title = 'Cancellation scheduled';
      message = endDate
        ? `Your subscription will end on ${endDate}. You'll keep Pro access until then. You can close this tab and return to the extension.`
        : "Your subscription will end at the close of the current billing period. You'll keep Pro access until then. You can close this tab and return to the extension.";
    } else {
      title = "You're all set";
      message = 'Your subscription is active. You can close this tab and return to the extension.';
    }
  }

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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        animation: 'fadeInUp 0.8s ease-out forwards',
        background: 'rgba(4, 6, 36, 0.55)',
        border: '1px solid rgba(0, 170, 255, 0.35)',
        borderRadius: 16,
        boxShadow: '0 0 20px 2px rgba(0, 170, 255, 0.25), inset 0 0 30px rgba(0, 170, 255, 0.05)',
        backdropFilter: 'blur(6px)',
        padding: '40px 36px',
        width: 400,
        maxWidth: '100%',
        textAlign: 'center'
      }}>
        {loading ? (
          <>
            <div style={{
              width: 36,
              height: 36,
              margin: '0 auto 20px',
              border: '3px solid rgba(0, 170, 255, 0.15)',
              borderTop: '3px solid rgb(0, 170, 255)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: 'rgba(150, 210, 255, 0.6)', margin: 0 }}>Checking your subscription...</p>
          </>
        ) : error ? (
          <>
            <h1 style={{ color: 'white', fontSize: 24, margin: '0 0 12px', textShadow: '0 0 12px rgba(0, 170, 255, 0.55)' }}>
              🔒 LockedIn
            </h1>
            <p style={{ color: '#ff4d4d', fontSize: 14, margin: 0 }}>{error}</p>
          </>
        ) : (
          <>
            <h1 style={{ color: 'white', fontSize: 24, margin: '0 0 12px', textShadow: '0 0 12px rgba(0, 170, 255, 0.55)' }}>
              {title}
            </h1>
            <p style={{ color: 'rgba(180, 225, 255, 0.65)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
