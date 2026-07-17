import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { CHROME_STORE_URL } from '@/lib/constants';
import { inter } from '@/lib/fonts';
import SiteNav from '@/components/landing/SiteNav';
import PersonaHero from '@/components/landing/PersonaHero';

const FEATURES = [
  {
    title: 'Website Blocking',
    tier: 'FREE' as const,
    desc: 'Block any websites during specific dates and times. Set it and forget it.',
  },
  {
    title: 'Recurring Schedules',
    tier: 'PRO' as const,
    desc: 'Block sites every weekday 9-5 without re-adding them each day.',
  },
  {
    title: 'Category Blocking',
    tier: 'PRO' as const,
    desc: 'Block entire categories like Social Media, Gaming, or News in one click.',
  },
  {
    title: 'Stats Dashboard',
    tier: 'PRO' as const,
    desc: 'Track your focus time, streaks, and which sites tried to steal your attention.',
  },
  {
    title: 'Strict Mode',
    tier: 'PRO' as const,
    desc: 'Make it harder to disable blocks mid-session with a confirmation phrase.',
  },
  {
    title: 'Cross-Device Sync',
    tier: 'PRO' as const,
    desc: 'Your blocks stay in sync across all your Chrome browsers automatically.',
  },
];

const AUDIENCES = [
  { label: 'STUDENTS', desc: 'Block social feeds during study blocks and exam weeks.' },
  { label: 'REMOTE WORKERS', desc: 'Recurring 9-5 schedules keep meetings-adjacent scrolling in check.' },
  { label: 'FREELANCERS', desc: 'Bill hours you actually deep-worked, tracked automatically.' },
];

const cardStyle: CSSProperties = {
  background: 'rgba(30,144,255,.06)',
  border: '1px solid rgba(79,195,255,.2)',
  borderRadius: 14,
};

export default function LandingPage() {
  return (
    <main
      className={inter.className}
      style={{
        background:
          'radial-gradient(ellipse 1000px 600px at 20% -10%, rgba(30,144,255,.22), transparent 60%), radial-gradient(ellipse 900px 700px at 90% 10%, rgba(0,194,255,.14), transparent 60%), #030713',
        color: '#fff',
        minHeight: '100vh',
      }}
    >
      <style>{`
        .nav-link { transition: color 0.15s ease; }
        .nav-link:hover { color: #8adfff !important; }
        .cta-btn { transition: box-shadow 0.2s ease, transform 0.1s ease; }
        .cta-btn:hover { box-shadow: 0 0 24px 4px rgba(30,144,255,.55); transform: translateY(-1px); }
        .ghost-btn { transition: border-color 0.2s ease, background 0.2s ease; }
        .ghost-btn:hover { border-color: rgba(79,195,255,.6); background: rgba(30,144,255,.16); }
        .feature-card { transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
        .feature-card:hover { transform: translateY(-3px); border-color: rgba(79,195,255,.5); box-shadow: 0 0 20px 2px rgba(30,144,255,.2); }
        .plan-card { transition: transform 0.15s ease, box-shadow 0.2s ease; }
        .plan-card:hover { transform: translateY(-3px); }
        .footer-link { transition: color 0.15s ease; }
        .footer-link:hover { color: #8adfff !important; }

        @media (max-width: 900px) {
          .audiences-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 768px) {
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; padding-top: 72px !important; }
          .hero-section { padding: 64px 20px 0 !important; }
          .heading-lg { font-size: 28px !important; }
          .heading-md { font-size: 26px !important; }
          .hero-shot-wrap { padding: 0 20px !important; }
          .hero-shot { height: 220px !important; }
          .proof-grid { grid-template-columns: 1fr !important; }
          .proof-wide { grid-column: 1 / -1 !important; height: 160px !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .cta-final { padding: 72px 20px 72px !important; }
        }

        @media (max-width: 560px) {
          .audiences-grid { grid-template-columns: 1fr !important; }
          .site-footer { flex-direction: column !important; text-align: center !important; padding: 28px 20px !important; }
          .hero-shot { height: 180px !important; }
        }

        @media (max-width: 400px) {
          .hero-shot { height: 150px !important; }
        }

        @media (max-width: 340px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SiteNav showLinks />

      {/* Hero */}
      <section className="hero-section" style={{ position: 'relative', padding: '88px 24px 0', textAlign: 'center', overflow: 'hidden' }}>
        <Image
          src="/futuristic-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            opacity: 0.24,
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 92%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 92%)',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <PersonaHero />
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noreferrer"
              className="cta-btn"
              style={{
                background: 'linear-gradient(135deg,#1e90ff,#00c2ff)',
                boxShadow: '0 0 20px 3px rgba(30,144,255,.45)',
                color: '#fff',
                padding: '15px 32px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Add to Chrome — free
            </a>
            <a
              href="#how"
              className="ghost-btn"
              style={{
                background: 'rgba(30,144,255,.1)',
                border: '1px solid rgba(79,195,255,.35)',
                color: '#fff',
                padding: '15px 32px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              See how it works
            </a>
          </div>
        </div>
        <div className="hero-shot-wrap" style={{ position: 'relative', maxWidth: 820, margin: '0 auto', padding: '0 24px' }}>
          <div
            className="hero-shot"
            style={{
              position: 'relative',
              border: '1px solid rgba(79,195,255,.3)',
              borderRadius: 16,
              background: 'linear-gradient(180deg, rgba(30,144,255,.1), rgba(10,18,48,.4))',
              boxShadow: '0 0 40px 6px rgba(30,144,255,.15)',
              height: 320,
              overflow: 'hidden',
            }}
          >
            <Image
              src="/focus-session.png"
              alt="LockedIn focus-session dashboard with an active blocklist and streak"
              fill
              sizes="(max-width: 820px) 100vw, 820px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Pain-point narrative */}
      <section id="how" className="section-pad" style={{ maxWidth: 940, margin: '0 auto', padding: '120px 24px 20px', textAlign: 'center' }}>
        <h2 className="heading-lg" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.25, margin: '0 0 16px' }}>
          &ldquo;3 hours on YouTube.
          <br />0 pages of your essay.&rdquo;
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(200,225,255,.6)', margin: '0 0 56px' }}>
          Sound familiar? LockedIn shuts the door on distraction before it opens.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, maxWidth: 520, margin: '0 auto', textAlign: 'left' }}>
          {[
            { title: 'Pick your distractions', desc: 'Add the sites that always pull you off track.' },
            { title: 'Set your hours', desc: 'One-time or recurring blocks — your schedule, your rules.' },
            { title: 'Lock in', desc: 'LockedIn handles the rest — no willpower required.' },
          ].map((step, i) => (
            <div key={step.title} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#1e90ff,#00c2ff)',
                  boxShadow: '0 0 12px 1px rgba(30,144,255,.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: 'rgba(200,225,255,.55)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Persona feature cards */}
      <section id="audiences" className="section-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: '120px 24px 0' }}>
        <h2 className="heading-md" style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, margin: '0 0 16px' }}>
          Built for every kind of focus
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(200,225,255,.55)', fontSize: 15, margin: '0 0 48px' }}>
          Same tool, different reasons to lock in.
        </p>
        <div className="audiences-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {AUDIENCES.map((a) => (
            <div key={a.label} style={{ ...cardStyle, padding: 26 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#4fc3ff', margin: '0 0 8px', letterSpacing: '.5px' }}>
                {a.label}
              </p>
              <p style={{ fontSize: 14, color: 'rgba(200,225,255,.6)', lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full feature list */}
      <section id="features" className="section-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: '120px 24px 0' }}>
        <h2 className="heading-md" style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, margin: '0 0 16px' }}>
          Everything you need to stay focused
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(200,225,255,.55)', fontSize: 15, margin: '0 0 48px' }}>
          Free to start. Upgrade when you&apos;re ready for the full toolkit.
        </p>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card" style={{ ...cardStyle, borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{f.title}</h3>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: f.tier === 'FREE' ? 'rgba(30,144,255,.15)' : 'rgba(30,144,255,.2)',
                    color: f.tier === 'FREE' ? 'rgba(200,225,255,.7)' : '#4fc3ff',
                    border: f.tier === 'FREE' ? '1px solid rgba(79,195,255,.3)' : '1px solid rgba(79,195,255,.4)',
                  }}
                >
                  {f.tier}
                </span>
              </div>
              <p style={{ color: 'rgba(200,225,255,.55)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof bento grid */}
      <section className="section-pad" style={{ maxWidth: 960, margin: '0 auto', padding: '120px 24px 0' }}>
        <h2 className="heading-md" style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, margin: '0 0 44px' }}>
          The proof is in the focus time
        </h2>
        <div className="proof-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 20 }}>
          <div style={{ ...cardStyle, borderRadius: 16, padding: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#4fc3ff', margin: '0 0 10px', letterSpacing: '.5px' }}>
              CATEGORY BLOCKING
            </p>
            <p style={{ fontSize: 14, color: 'rgba(200,225,255,.6)', lineHeight: 1.6, margin: 0 }}>
              Block entire categories — Social, Gaming, News — in one click.
            </p>
          </div>
          <div style={{ ...cardStyle, borderRadius: 16, padding: 28 }}>
            <p style={{ fontSize: 14, color: 'rgba(230,240,255,.8)', lineHeight: 1.6, margin: '0 0 14px', fontStyle: 'italic' }}>
              &ldquo;I finally finish my freelance projects before the deadline instead of the night before.&rdquo;
            </p>
            <p style={{ fontSize: 12, color: 'rgba(200,225,255,.45)', margin: 0 }}>— Priya M., freelance designer</p>
          </div>
          <div
            className="proof-wide"
            style={{
              position: 'relative',
              gridColumn: '1/3',
              border: '1px solid rgba(79,195,255,.25)',
              borderRadius: 16,
              height: 180,
              overflow: 'hidden',
              background: 'rgba(10,18,48,.4)',
            }}
          >
            <Image
              src="/stats-dashboard.png"
              alt="LockedIn stats dashboard showing streaks and weekly focus time"
              fill
              sizes="(max-width: 960px) 100vw, 960px"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-pad" style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 0' }}>
        <h2 className="heading-md" style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, margin: '0 0 16px' }}>Simple pricing</h2>
        <p style={{ textAlign: 'center', color: 'rgba(200,225,255,.55)', fontSize: 15, margin: '0 0 48px' }}>
          Start free. Upgrade when you need more.
        </p>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="plan-card" style={{ ...cardStyle, borderRadius: 16, padding: '32px 28px' }}>
            <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>Free</h3>
            <p style={{ fontSize: 34, fontWeight: 800, margin: '0 0 4px' }}>$0</p>
            <p style={{ color: 'rgba(200,225,255,.4)', fontSize: 13, margin: '0 0 24px' }}>Forever free</p>
            {['Block up to 3 websites', 'Date and time restrictions', 'Instant blocking'].map((f, i, arr) => (
              <p
                key={f}
                style={{ fontSize: 14, color: 'rgba(230,240,255,.75)', margin: i === arr.length - 1 ? '0 0 24px' : '0 0 8px' }}
              >
                ✓ {f}
              </p>
            ))}
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noreferrer"
              className="ghost-btn"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: 12,
                borderRadius: 8,
                border: '1px solid rgba(79,195,255,.35)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Get started free
            </a>
          </div>

          <div
            className="plan-card"
            style={{
              background: 'linear-gradient(135deg, rgba(30,144,255,.14), rgba(0,194,255,.1))',
              border: '1px solid rgba(79,195,255,.4)',
              borderRadius: 16,
              padding: '32px 28px',
              position: 'relative',
              boxShadow: '0 0 24px 2px rgba(30,144,255,.2)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg,#1e90ff,#00c2ff)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: 20,
              }}
            >
              MOST POPULAR
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>Pro</h3>
            <p style={{ fontSize: 34, fontWeight: 800, margin: '0 0 4px' }}>
              $7<span style={{ fontSize: 15, fontWeight: 400, color: 'rgba(200,225,255,.55)' }}>/month</span>
            </p>
            <p style={{ color: 'rgba(200,225,255,.4)', fontSize: 13, margin: '0 0 24px' }}>
              14-day free trial · cancel anytime
            </p>
            {['Everything in Free', 'Recurring schedules & category blocking', 'Stats dashboard, strict mode, sync'].map(
              (f, i, arr) => (
                <p
                  key={f}
                  style={{ fontSize: 14, color: 'rgba(230,240,255,.75)', margin: i === arr.length - 1 ? '0 0 24px' : '0 0 8px' }}
                >
                  ✓ {f}
                </p>
              )
            )}
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noreferrer"
              className="cta-btn"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: 12,
                borderRadius: 8,
                background: 'linear-gradient(135deg,#1e90ff,#00c2ff)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-final" style={{ maxWidth: 600, margin: '0 auto', padding: '120px 24px 100px', textAlign: 'center' }}>
        <h2 className="heading-md" style={{ fontSize: 34, fontWeight: 800, margin: '0 0 16px' }}>Ready to take back your focus?</h2>
        <p style={{ color: 'rgba(200,225,255,.55)', fontSize: 16, margin: '0 0 36px', lineHeight: 1.7 }}>
          Join thousands of students and professionals who use LockedIn to stay on track every day.
        </p>
        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="cta-btn"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#1e90ff,#00c2ff)',
            boxShadow: '0 0 20px 3px rgba(30,144,255,.4)',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Add to Chrome
        </a>
      </section>

      <footer
        className="site-footer"
        style={{
          borderTop: '1px solid rgba(79,195,255,.15)',
          padding: '32px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <span style={{ color: 'rgba(200,225,255,.35)', fontSize: 13 }}>
          © {new Date().getFullYear()} LockedIn. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/privacy" className="footer-link" style={{ color: 'rgba(200,225,255,.35)', fontSize: 13, textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <Link href="/terms" className="footer-link" style={{ color: 'rgba(200,225,255,.35)', fontSize: 13, textDecoration: 'none' }}>
            Terms of Service
          </Link>
        </div>
      </footer>
    </main>
  );
}
