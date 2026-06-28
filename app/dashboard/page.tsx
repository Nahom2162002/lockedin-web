'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

interface Stats {
  totalFocusMinutes: number;
  topSites: { url: string; count: number }[];
  streak: number;
  totalSessions: number;
  last7Days: { date: string; minutes: number }[];
  avgDailyMinutes: number;
  bestDayMinutes: number;
  blockEventsToday: number;
}

const formatMinutes = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

const streakColor = (streak: number) => {
  if (streak === 0) return '#888';
  if (streak < 3) return '#facc15';
  if (streak < 7) return '#f97316';
  return '#ef4444';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1a2e',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: '8px 12px'
      }}>
        <p style={{ color: 'white', margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ color: '#0099ff', margin: 0}}>{formatMinutes(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setError('No token provided. Please open this from the extension.');
      setLoading(false);
      return;
    }

    fetch('/api/user/stats', {
      headers: { 'authorization': `Bearer ${token}` }
    })
     .then(res => res.json())
     .then(data => {
      if (data.error) setError(data.error);
      else setStats(data);
      setLoading(false);
     })
     .catch(() => {setError('Failed to load stats'); setLoading(false);});
  }, []);

  if (loading) return (
    <div style={{ ...styles.container, ...styles.centered }}>
      <div style={styles.spinner} />
      <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: 16 }}>Loading your stats...</p>
    </div>
  );

  if (error) return (
    <div style={styles.container}>
      <p style={{ color: '#ff4d4d' }}>{error}</p>
    </div>
  );

  if (!stats) return null;

  const hasData = stats.totalSessions > 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>LockedIn</h1>
        <p style={styles.subtitle}>Your focus dashboard</p>
      </div>

      <div style={styles.cardRow}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Focus Time</p>
          <p style={styles.cardValue}>{formatMinutes(stats.totalFocusMinutes)}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Current Streak</p>
          <p style={{ ...styles.cardValue, color: streakColor(stats.streak)}}>{stats.streak} 🔥 days</p>
          <p style={styles.cardSub}>{stats.streak === 1 ? 'day' : 'days'}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Sessions</p>
          <p style={styles.cardValue}>{stats.totalSessions}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Avg Daily Focus</p>
          <p style={styles.cardValue}>{formatMinutes(stats.avgDailyMinutes)}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Best Day</p>
          <p style={styles.cardValue}>{formatMinutes(stats.bestDayMinutes)}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Blocked Today</p>
          <p style={styles.cardValue}>{stats.blockEventsToday}</p>
          <p style={styles.cardSub}>attempts</p>
        </div>
      </div>

      {!hasData ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: 48 }}>🎯</p>
          <p style={styles.emptyTitle}>No sessions yet</p>
          <p style={styles.emptyText}>Add websites to block in the extension and your stats will appear here.</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at 50% 50%, #1a1a2e, #0d0d0d)',
    padding: '40px 24px 60px',
    fontFamily: 'Inter, sans-serif',
    maxWidth: 800,
    margin: '0 auto'
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    textAlign: 'center',
    marginBottom: 40
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 700,
    margin: 0
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    marginTop: 6
  },
  cardRow: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 32,
    flexWrap: 'wrap'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: '20px 24px',
    textAlign: 'center',
    minWidth: 130,
    flex: '1 1 130px',
    maxWidth: 160
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
    margin: '0 0 8px 0'
  },
  cardValue: {
    color: 'white',
    fontSize: 26,
    fontWeight: 700,
    margin: 0
  },
  cardSub: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 11,
    marginTop: 2,
    margin: '2px 0 0 0'
  },
  chartContainer: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: '24px',
    marginBottom: 24
  },
  chartTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 20,
    margin: '0 0 20px 0'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 24px',
    color: 'rgba(255, 255, 255, 0.4)'
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 600,
    margin: '12px 0 8px'
  },
  emptyText: {
    fontSize: 14,
    maxWidth: 320,
    margin: '0 auto',
    lineHeight: 1.6
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #0099ff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
};