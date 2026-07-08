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
        background: 'rgba(5, 5, 53, 0.95)',
        border: '1px solid rgba(0, 170, 255, 0.4)',
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: '0 0 12px 2px rgba(0, 170, 255, 0.3)'
      }}>
        <p style={{ color: 'white', margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ color: 'rgb(0, 170, 255)', margin: 0}}>{formatMinutes(payload[0].value)}</p>
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
      <p style={{ color: 'rgba(150, 210, 255, 0.6)', marginTop: 16 }}>Loading your stats...</p>
    </div>
  );

  if (error) return (
    <div style={{ ...styles.container, ...styles.centered }}>
      <div style={styles.card}>
        <p style={{ color: '#ff4d4d', margin: 0 }}>{error}</p>
      </div>
    </div>
  );

  if (!stats) return null;

  const hasData = stats.totalSessions > 0;

  return (
    <div style={styles.container}>
      <div className="dashboard-content">
      <div style={styles.header}>
        <h1 style={styles.title}>🔒 LockedIn</h1>
        <p style={styles.subtitle}>Your focus dashboard</p>
      </div>

      <div style={styles.cardRow}>
        <div className="stat-card" style={styles.card}>
          <p style={styles.cardLabel}>Total Focus Time</p>
          <p style={styles.cardValue}>{formatMinutes(stats.totalFocusMinutes)}</p>
        </div>
        <div className="stat-card" style={styles.card}>
          <p style={styles.cardLabel}>Current Streak</p>
          <p style={{ ...styles.cardValue, color: streakColor(stats.streak)}}>{stats.streak} 🔥</p>
          <p style={styles.cardSub}>{stats.streak === 1 ? 'day' : 'days'}</p>
        </div>
        <div className="stat-card" style={styles.card}>
          <p style={styles.cardLabel}>Total Sessions</p>
          <p style={styles.cardValue}>{stats.totalSessions}</p>
        </div>
        <div className="stat-card" style={styles.card}>
          <p style={styles.cardLabel}>Avg Daily Focus</p>
          <p style={styles.cardValue}>{formatMinutes(stats.avgDailyMinutes)}</p>
        </div>
        <div className="stat-card" style={styles.card}>
          <p style={styles.cardLabel}>Best Day</p>
          <p style={styles.cardValue}>{formatMinutes(stats.bestDayMinutes)}</p>
        </div>
        <div className="stat-card" style={styles.card}>
          <p style={styles.cardLabel}>Blocked Today</p>
          <p style={styles.cardValue}>{stats.blockEventsToday}</p>
          <p style={styles.cardSub}>attempts</p>
        </div>
      </div>

      {!hasData ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: 48, margin: 0 }}>🎯</p>
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
                  <XAxis dataKey="url" tick={{ fill: 'rgba(180, 225, 255, 0.75)', fontSize: 12 }}/>
                  <YAxis tick={{ fill: 'rgba(180, 225, 255, 0.75)', fontSize: 12 }} allowDecimals={false}/>
                  <Tooltip
                    contentStyle={{ background: 'rgba(5, 5, 53, 0.95)', border: '1px solid rgba(0, 170, 255, 0.4)', borderRadius: 8, boxShadow: '0 0 12px 2px rgba(0, 170, 255, 0.3)' }}
                    labelStyle={{ color: 'white' }}
                    itemStyle={{ color: 'rgb(0, 170, 255)' }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    fill="rgb(0, 170, 255)"
                    shape={(props: any) => {
                      const { x, y, width, height, index } = props;
                      const opacity = index === 0 ? 1 : 0.8 - index * 0.15;
                      return <rect x={x} y={y} width={width} height={height} fill={`rgba(0, 170, 255, ${opacity})`} rx={6} ry={6} />;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dashboard-content {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .stat-card {
          transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 170, 255, 0.55);
          box-shadow: 0 0 18px 2px rgba(0, 170, 255, 0.25);
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: `
      radial-gradient(ellipse 900px 500px at 15% -5%, rgba(0, 170, 255, 0.14), transparent 60%),
      radial-gradient(ellipse 900px 600px at 85% 105%, rgba(0, 120, 255, 0.12), transparent 60%),
      linear-gradient(180deg, #050726 0%, #000004 100%)`,
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
    margin: 0,
    textShadow: '0 0 12px rgba(0, 170, 255, 0.55)'
  },
  subtitle: {
    color: 'rgba(150, 210, 255, 0.55)',
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
    background: 'rgba(0, 170, 255, 0.06)',
    border: '1px solid rgba(0, 170, 255, 0.25)',
    borderRadius: 16,
    padding: '20px 24px',
    textAlign: 'center',
    minWidth: 130,
    flex: '1 1 130px',
    maxWidth: 160,
    boxShadow: '0 0 10px 1px rgba(0, 170, 255, 0.12)'
  },
  cardLabel: {
    color: 'rgba(180, 225, 255, 0.55)',
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
    color: 'rgba(180, 225, 255, 0.4)',
    fontSize: 11,
    marginTop: 2,
    margin: '2px 0 0 0'
  },
  chartContainer: {
    background: 'rgba(5, 5, 53, 0.55)',
    border: '1px solid rgba(0, 170, 255, 0.35)',
    borderRadius: 16,
    padding: '24px',
    marginBottom: 24,
    backdropFilter: 'blur(6px)',
    boxShadow: '0 0 20px 2px rgba(0, 170, 255, 0.18), inset 0 0 30px rgba(0, 170, 255, 0.04)'
  },
  chartTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 20,
    margin: '0 0 20px 0',
    textShadow: '0 0 8px rgba(0, 170, 255, 0.4)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: 'rgba(180, 225, 255, 0.5)',
    background: 'rgba(0, 170, 255, 0.05)',
    border: '1px dashed rgba(0, 170, 255, 0.3)',
    borderRadius: 16
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
    border: '3px solid rgba(0, 170, 255, 0.15)',
    borderTop: '3px solid rgb(0, 170, 255)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
};
