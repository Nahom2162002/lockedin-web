'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalFocusMinutes: number;
  topSites: { url: string; count: number }[];
  streak: number;
  totalSessions: number;
  last7Days: { date: string; minutes: number }[];
  avgDailyMinutes: number;
  bestDayMinutes: number;
  blockEventsToday: number;
  goals: { dailyMinutes: number; weeklyMinutes: number };
  todayMinutes: number;
  weeklyFocusMinutes: number;
}

const formatMinutes = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

interface TooltipPayloadEntry {
  value: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'oklch(0.16 0.02 260 / 0.95)',
          border: '1px solid oklch(0.6 0.19 265 / 0.4)',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 0 12px 2px oklch(0.6 0.19 265 / 0.3)',
        }}
      >
        <p style={{ color: 'oklch(0.97 0.005 260)', margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ color: 'oklch(0.72 0.14 265)', margin: 0 }}>{formatMinutes(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="stat-card" style={highlight ? styles.cardHighlight : styles.card}>
      <p style={highlight ? styles.cardLabelHighlight : styles.cardLabel}>{label}</p>
      <p style={styles.cardValue}>{value}</p>
      {sub && <p style={highlight ? styles.cardSubHighlight : styles.cardSub}>{sub}</p>}
    </div>
  );
}

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

    const now = new Date();
    const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    fetch(`/api/user/stats?date=${todayLocal}`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load stats');
        setLoading(false);
      });
  }, []);

  const hasData = !!stats && stats.totalSessions > 0;

  return (
    <div style={styles.page}>
      <div style={styles.bgImage} />
      <div style={styles.bgOverlay} />
      <div className="bg-glow-tl" style={styles.bgGlowTopLeft} />
      <div className="bg-glow-br" style={styles.bgGlowBottomRight} />
      <div style={styles.bgVignette} />

      <div style={styles.contentWrap}>
        {loading && (
          <div style={styles.centered}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading your stats...</p>
          </div>
        )}

        {!loading && error && (
          <div style={styles.centered}>
            <div style={styles.errorCard}>
              <p style={{ color: '#ff8080', margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && stats && (
          <div className="dashboard-content">
            <div style={styles.header}>
              <h2 style={styles.title}>LockedIn</h2>
              <p style={styles.subtitle}>Your focus dashboard</p>
            </div>

            <div className="stat-grid" style={styles.statGrid}>
              <StatCard label="Total Focus Time" value={formatMinutes(stats.totalFocusMinutes)} />
              <StatCard
                label="Current Streak"
                value={
                  <>
                    {stats.streak} <span style={{ fontSize: 17 }}>🔥</span>
                  </>
                }
                sub={stats.streak === 1 ? 'day' : 'days'}
                highlight
              />
              <StatCard label="Total Sessions" value={stats.totalSessions} />
              <StatCard label="Avg Daily Focus" value={formatMinutes(stats.avgDailyMinutes)} />
              <StatCard label="Best Day" value={formatMinutes(stats.bestDayMinutes)} />
            </div>

            <div style={styles.blockedTodayWrap}>
              <StatCard label="Blocked Today" value={stats.blockEventsToday} sub="attempts" />
            </div>

            {(stats.goals.dailyMinutes > 0 || stats.goals.weeklyMinutes > 0) && (
              <div style={{ ...styles.chartCard, marginBottom: 22 }}>
                <h3 style={styles.chartTitle}>🎯 Goal Progress</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {stats.goals.dailyMinutes > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: 'oklch(0.95 0.005 260)', fontSize: 13 }}>Daily Goal</span>
                        <span style={{ color: 'oklch(0.65 0.02 260)', fontSize: 12 }}>
                          {formatMinutes(stats.todayMinutes)} / {formatMinutes(stats.goals.dailyMinutes)}
                        </span>
                      </div>
                      <div style={{ height: 8, background: 'oklch(1 0 0 / 0.08)', borderRadius: 4 }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min((stats.todayMinutes / stats.goals.dailyMinutes) * 100, 100)}%`,
                            background:
                              stats.todayMinutes >= stats.goals.dailyMinutes
                                ? '#4CAF50'
                                : 'linear-gradient(135deg, oklch(0.64 0.17 265), oklch(0.55 0.16 265))',
                            borderRadius: 4,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      {stats.todayMinutes >= stats.goals.dailyMinutes && (
                        <p style={{ color: '#4CAF50', fontSize: 12, margin: '4px 0 0' }}>✓ Daily goal reached!</p>
                      )}
                    </div>
                  )}

                  {stats.goals.weeklyMinutes > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: 'oklch(0.95 0.005 260)', fontSize: 13 }}>Weekly Goal</span>
                        <span style={{ color: 'oklch(0.65 0.02 260)', fontSize: 12 }}>
                          {formatMinutes(stats.weeklyFocusMinutes)} / {formatMinutes(stats.goals.weeklyMinutes)}
                        </span>
                      </div>
                      <div style={{ height: 8, background: 'oklch(1 0 0 / 0.08)', borderRadius: 4 }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min((stats.weeklyFocusMinutes / stats.goals.weeklyMinutes) * 100, 100)}%`,
                            background:
                              stats.weeklyFocusMinutes >= stats.goals.weeklyMinutes
                                ? '#4CAF50'
                                : 'linear-gradient(135deg, oklch(0.64 0.17 265), oklch(0.55 0.16 265))',
                            borderRadius: 4,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      {stats.weeklyFocusMinutes >= stats.goals.weeklyMinutes && (
                        <p style={{ color: '#4CAF50', fontSize: 12, margin: '4px 0 0' }}>✓ Weekly goal reached!</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!hasData ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: 48, margin: 0 }}>🎯</p>
                <p style={styles.emptyTitle}>No sessions yet</p>
                <p style={styles.emptyText}>Add websites to block in the extension and your stats will appear here.</p>
              </div>
            ) : (
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Top Blocked Sites</h3>
                {stats.topSites.length === 0 ? (
                  <p style={{ color: 'oklch(0.6 0.02 260)' }}>No blocked sites yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.topSites} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <XAxis dataKey="url" tick={{ fill: 'oklch(0.65 0.02 260)', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'oklch(0.65 0.02 260)', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(1 0 0 / 0.04)' }} />
                      <Bar
                        dataKey="count"
                        radius={[6, 6, 0, 0]}
                        shape={(props: { x: number; y: number; width: number; height: number; index: number }) => {
                          const { x, y, width, height, index } = props;
                          const opacity = index === 0 ? 1 : 0.75 - index * 0.15;
                          return (
                            <rect
                              x={x}
                              y={y}
                              width={width}
                              height={height}
                              fill={`oklch(0.64 0.17 265 / ${opacity})`}
                              rx={6}
                              ry={6}
                            />
                          );
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 0.85;
          }
        }
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
        .bg-glow-tl {
          animation: glowPulse 9s ease-in-out infinite;
        }
        .bg-glow-br {
          animation: glowPulse 11s ease-in-out infinite reverse;
        }
        .dashboard-content {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .stat-card {
          transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        @media (max-width: 760px) {
          .stat-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .stat-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    background: 'oklch(0.13 0.015 260)',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    overflow: 'hidden',
  },
  bgImage: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/futuristic-bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.65,
    zIndex: 0,
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'oklch(0.13 0.02 260 / 0.45)',
    zIndex: 0,
  },
  bgGlowTopLeft: {
    position: 'absolute',
    top: '-20%',
    left: '-10%',
    width: '60%',
    height: '70%',
    background: 'radial-gradient(circle, oklch(0.55 0.16 265 / 0.3), transparent 70%)',
    filter: 'blur(10px)',
    mixBlendMode: 'screen',
    zIndex: 0,
  },
  bgGlowBottomRight: {
    position: 'absolute',
    bottom: '-25%',
    right: '-10%',
    width: '65%',
    height: '75%',
    background: 'radial-gradient(circle, oklch(0.58 0.14 220 / 0.25), transparent 70%)',
    filter: 'blur(10px)',
    mixBlendMode: 'screen',
    zIndex: 0,
  },
  bgVignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 45%, transparent 25%, oklch(0.1 0.015 260 / 0.82) 100%)',
    zIndex: 0,
  },
  contentWrap: {
    position: 'relative',
    zIndex: 5,
    maxWidth: 900,
    margin: '0 auto',
    padding: '40px 24px 60px',
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: 22,
  },
  title: {
    color: 'oklch(0.97 0.005 260)',
    fontSize: 22,
    fontWeight: 800,
    margin: 0,
  },
  subtitle: {
    color: 'oklch(0.65 0.02 260)',
    fontSize: 13,
    margin: '6px 0 0',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 14,
    marginBottom: 14,
  },
  card: {
    background: 'oklch(0.19 0.025 260 / 0.65)',
    backdropFilter: 'blur(10px)',
    border: '1px solid oklch(1 0 0 / 0.08)',
    borderRadius: 14,
    padding: '18px 12px',
    textAlign: 'center',
  },
  cardHighlight: {
    background: 'oklch(0.28 0.08 265 / 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid oklch(0.65 0.15 265 / 0.4)',
    borderRadius: 14,
    padding: '18px 12px',
    textAlign: 'center',
    boxShadow: '0 0 20px -6px oklch(0.6 0.19 265 / 0.5)',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'oklch(0.6 0.02 260)',
    textTransform: 'uppercase',
    margin: '0 0 10px',
  },
  cardLabelHighlight: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'oklch(0.78 0.06 265)',
    textTransform: 'uppercase',
    margin: '0 0 10px',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 800,
    color: 'oklch(0.97 0.005 260)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cardSub: {
    fontSize: 11,
    color: 'oklch(0.6 0.02 260)',
    margin: '2px 0 0',
  },
  cardSubHighlight: {
    fontSize: 11,
    color: 'oklch(0.72 0.05 265)',
    margin: '2px 0 0',
  },
  blockedTodayWrap: {
    maxWidth: 260,
    margin: '0 auto 22px',
  },
  chartCard: {
    background: 'oklch(0.17 0.025 260 / 0.65)',
    backdropFilter: 'blur(10px)',
    border: '1px solid oklch(1 0 0 / 0.08)',
    borderRadius: 18,
    padding: 22,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'oklch(0.95 0.005 260)',
    margin: '0 0 20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: 'oklch(0.65 0.02 260)',
    background: 'oklch(0.19 0.025 260 / 0.4)',
    border: '1px dashed oklch(1 0 0 / 0.15)',
    borderRadius: 18,
  },
  emptyTitle: {
    color: 'oklch(0.97 0.005 260)',
    fontSize: 20,
    fontWeight: 600,
    margin: '12px 0 8px',
  },
  emptyText: {
    fontSize: 14,
    maxWidth: 320,
    margin: '0 auto',
    lineHeight: 1.6,
  },
  loadingText: {
    color: 'oklch(0.65 0.02 260)',
    marginTop: 16,
  },
  errorCard: {
    background: 'oklch(0.19 0.025 260 / 0.65)',
    backdropFilter: 'blur(10px)',
    border: '1px solid oklch(1 0 0 / 0.08)',
    borderRadius: 14,
    padding: '20px 24px',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid oklch(1 0 0 / 0.12)',
    borderTop: '3px solid oklch(0.64 0.17 265)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
