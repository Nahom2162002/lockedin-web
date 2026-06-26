'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalFocusMinutes: number;
  topSites: { url: string; count: number }[];
  streak: number;
  totalSessions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setError('No token provided. Please open this from the extension.');
      return;
    }

    fetch('/api/user/stats', {
      headers: { 'authorization': `Bearer ${token}` }
    })
     .then(res => res.json())
     .then(data => {
      if (data.error) setError(data.error);
      else setStats(data);
     })
     .catch(() => setError('Failed to load stats'));
  }, []);

  if (error) return (
    <div style={styles.container}>
      <p style={{ color: '#ff4d4d' }}>{error}</p>
    </div>
  );

  if (!stats) return (
    <div style={styles.container}>
      <p style={{ color: 'white' }}>Loading your stats...</p>
    </div>
  );

  const hours = Math.floor(stats.totalFocusMinutes / 60);
  const minutes = stats.totalFocusMinutes % 60;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>LockedIn Dashboard</h1>

      <div style={styles.cardRow}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Focus Time</p>
          <p style={styles.cardValue}>{hours}h {minutes}m</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Current Streak</p>
          <p style={styles.cardValue}>{stats.streak} 🔥 days</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Sessions</p>
          <p style={styles.cardValue}>{stats.totalSessions}</p>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <h2 style={styles.chartTitle}>Top Blocked Sites</h2>
        {stats.topSites.length === 0 ? (
          <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>No blocked sites yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.topSites} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="url" tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}/>
              <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} allowDecimals={false}/>
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 8 }}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: '#0099ff' }}
              />
              <Bar 
                dataKey="count" 
                radius={[6, 6, 0, 0]} 
                fill="#0099ff"
                shape={(props: any) => {
                  const { x, y, width, height, index } = props;
                  const opacity = index === 0 ? 1 : 0.8 - index * 0.15;
                  return <rect x={x} y={y} width={width} height={height} fill={`rgba(0, 153, 255, ${opacity})`} rx={6} ry={6} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at 50% 50%, #1a1a2e, #0d0d0d)',
    padding: '40px 24px',
    fontFamily: 'Inter, sans-serif'
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 32
  },
  cardRow: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 40,
    flexWrap: 'wrap'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: '24px 32px',
    textAlign: 'center',
    minWidth: 160
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    marginBottom: 8
  },
  cardValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 700
  },
  chartContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    maxWidth: 700,
    margin: '0 auto'
  },
  chartTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 20
  }
};