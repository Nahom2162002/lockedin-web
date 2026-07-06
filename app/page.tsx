import Link from 'next/link';

export default function LandingPage() {
  return (
    <main style={{
      fontFamily: 'Inter, sans-serif',
      background: 'radial-gradient(circle at 50% 0%, #1a1a2e, #0d0d0d)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>🔒 LockedIn</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#features" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ color: 'rgab(255, 255, 255, 0.6)', fontSize: 14, textDecoration: 'none' }}>Pricing</a>
          <a href="https://chrome.google.com/webstore/detail/lockedin/bhkgkhhdenaaeoiflaonmmpojndbpkam"
             target="_blank"
             rel="noreferrer"
             style={{
              background: 'linear-gradient(135deg, #0099ff, #0055ff)',
              color: 'white',
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none'
             }}
           >
            Add to Chrome - Free 
           </a>
        </div>
      </nav>

      <section style={{
        textAlign: 'center',
        padding: '100px 24px 80px',
        maxWidth: 760,
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(0, 153, 255, 0.1)',
          border: '1px solid rgba(0, 153, 255, 0.3)',
          borderRadius: 20,
          padding: '6px 16px',
          fontSize: 13,
          color: '#0099ff',
          marginBottom: 24 
        }}>
          Chrome Extension - Free to install 
        </div>
        <h1 style={{
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.15,
          margin: '0 0 24px',
          background: 'linear-gradient(135deg, #fffff, rgba(255, 255, 255, 0.7))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Stop getting distracted.<br />Start getting things done.
        </h1>
        <p style={{
          fontSize: 18,
          color: 'rgba(255, 255, 255, 0.55)',
          lineHeight: 1.7,
          margin: '0 0 40px',
          maxWidth: 560,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          LockedIn blocks distracting websites so you can focus on what actually matters.
          Built for students, remote workers, and anyone serious about their productivity.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://chrome.google.com/webstore/detail/lockedin/bhkgkhhdennaeoiflaonmmpojndbpkam"
             target="_blank"
             rel="noreferrer"
             style={{
              background: 'linear-gradient(135deg, #0099ff, #0055ff)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block'
             }}
          >
            Add to Chrome - It's Free 
          </a>
          <a href="#features"
             style={{
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block'
             }}
          >
            See how it works 
          </a>
        </div>
      </section>

      <section style={{
        textAlign: 'center',
        padding: '0 24px 80px',
        color: 'rgba(255, 255, 255, 0.35)',
        fontSize: 13 
      }}>
        Trusted by students, freelancers, and remote workers to stay focused 
      </section>

      <section id="features" style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 16
        }}>
          Everything you need to stay focused 
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: 16,
          marginBottom: 56,
          maxWidth: 500,
          margin: '0 auto 56px'
        }}>
          Free to start. Upgrade when you're ready for the full toolkit.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20 
        }}>
          {[
            {
              emoji: '🔒',
              title: 'Website Blocking',
              desc: 'Block any websites during specific dates and times. Set it and forget it.',
              free: true 
            },
            {
              emoji: '🔁',
              title: 'Recurring Schedules',
              desc: 'Block sites every weekday 9-5 without re-adding them each day.',
              free: false 
            },
            {
              emoji: '🗂',
              title: 'Category Blocking',
              desc: 'Block entire categories like Social Media, Gaming, or News in one click.',
              free: false 
            },
            {
              emoji: '📊',
              title: 'Stats Dashboard',
              desc: 'Track your focus time, streaks, and which sites tried to steal your attention.',
              free: false 
            },
            {
              emoji: '🚨',
              title: 'Strict Mode',
              desc: 'Make it harder to disable blocks mid-session with a confirmation phrase.',
              free: false 
            },
            {
              emoji: '🔄',
              title: 'Cross-Device Sync',
              desc: 'Your blocks stay in sync across all your Chrome browsers automatically.',
              free: false 
            }
           ].map((f, i) => (
             <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '28px 24px'
             }}>
              <p style={{ fontSize: 32, margin: '0 0 12px' }}>{f.emoji}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{f.title}</h3>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: f.free ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 153, 255, 0.15)',
                  color: f.free ? 'rgba(255, 255, 255, 0.5)' : '#0099ff',
                  border: f.free ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 153, 255, 0.3)'
                }}>
                  {f.free ? 'FREE' : 'PRO'}
                </span>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
             </div>
           ))}
        </div>
      </section>

      <section style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          How it works 
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 16, marginBottom: 56 }}>
          Up and running in under a minute 
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}>
          {[
            { step: '1', title: 'Install the extension', desc: 'Add LockedIn to Chrome for free from the Chrome Web Store.' },
            { step: '2', title: 'Add sites to block', desc: 'Enter any URL and set the date and time window you want it blocked.' },
            { step: '3', title: 'Stay focused', desc: 'LockedIn handles the rest. Try to visit a blocked site and you\'ll be redirected automatically.' },
            { step: '4', title: 'Upgrade to more', desc: 'Unlock recurring schedules, category blocking, stats, and strict mode with Pro.' }
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0099ff, #0055ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
                flexShrink: 0
              }}>
                {s.step}
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          Simple pricing 
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', fontSize: 16, marginBottom: 56 }}>
          Start free. Upgrade when you need more.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '32px 28px'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Free</h3>
            <p style={{ fontSize: 36, fontWeight: 800, margin: '0 0 4px' }}>$0</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 13, margin: '0 0 28px' }}>Forever free</p>
            {[
              'Block up to 3 websites',
              'Date and time restrictions',
              'Instant blocking'
            ].map((f, i) => (
              <p key={i} style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, margin: '0 0 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#4CAF50' }}>✓</span> {f}
              </p>
            ))}
            <a href="https://chrome.google.com/webstore/detail/lockedin/bhkgkhhdenaaeoiflaonmmpojndbpkam"
               target="_blank"
               rel="noreferrer"
               style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 28,
                padding: '12px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600 
               }}
            >
              Get started free 
            </a>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 153, 255, 0.1), rgba(0, 85, 255, 0.1))',
            border: '1px solid rgba(0, 153, 255, 0.3)',
            borderRadius: 16,
            padding: '32px 28px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #0099ff, #0055ff)',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 20 
            }}>
              MOST POPULAR 
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Pro</h3>
            <p style={{ fontSize: 36, fontWeight: 800, margin: '0 0 4px' }}>$7<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255, 255, 255, 0.5)' }}>/month</span></p>
            <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 13, margin: '0 0 28px' }}>Cancel anytime</p>
            {[
              'Everything in Free',
              'Unlimited site blocking',
              'Recurring schedules',
              'Category blocking',
              'Stats dashboard',
              'Strict mode',
              'Cross-device sync'
            ].map((f, i) => (
              <p key={i} style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, margin: '0 0 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#0099ff' }}>✓</span> {f}
              </p>
            ))}
            <a href="https://chrome.google.com/webstore/detail/lockedin/bhkgkhhdenaaeoiflaonmmpojndbpkam"
               target="_blank"
               rel="noreferrer"
               style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 28,
                padding: '12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0099ff, #0055ff)',
                color: 'white',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700
               }}
            >
              Upgrade to Pro 
            </a>
          </div>
        </div>
      </section>

      <section style={{
        textAlign: 'center',
        padding: '80px 24px 100px',
        maxWidth: 600,
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          Ready to take back your focus?
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
          Join thousands of students and professionals who use LockedIn to stay on track every day.
        </p>
        <a href="https://chrome.google.com/webstore/detail/lockedin/bhkgkhhdenaaeoiflaonmmpojndbpkam"
           target="_blank"
           rel="noreferrer"
           style={{
            background: 'linear-gradient(135deg, #0099ff, #0055ff)',
            color: 'white',
            padding: '16px 40px',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block'
           }}
        >
          Add to Chrome - It's Free 
        </a>
      </section>

      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '32px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16 
      }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: 13 }}>
          © {new Date().getFullYear()} LockedIn. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/privacy" style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: 13, textDecoration: 'none' }}>
            Privacy Policy 
          </Link>
          <Link href="/terms" style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: 13, textDecoration: 'none' }}>
            Terms of Service 
          </Link>
        </div>
      </footer>

    </main>
  );
}