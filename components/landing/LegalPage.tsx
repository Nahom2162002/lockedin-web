import Link from 'next/link';
import { inter } from '@/lib/fonts';
import SiteNav from './SiteNav';

export interface LegalSection {
  title: string;
  content: string;
}

export default function LegalPage({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <main
      className={inter.className}
      style={{
        background:
          'radial-gradient(ellipse 1000px 600px at 15% -10%, rgba(30,144,255,.2), transparent 60%), radial-gradient(ellipse 900px 700px at 95% 100%, rgba(0,194,255,.12), transparent 60%), #030713',
        color: '#fff',
        minHeight: '100vh',
      }}
    >
      <style>{`
        .back-link { transition: color 0.15s ease; }
        .back-link:hover { color: #8adfff !important; }

        @media (max-width: 640px) {
          .legal-section { padding: 40px 20px 72px !important; }
          .legal-title { font-size: 27px !important; margin: 24px 0 6px !important; }
          .legal-updated { margin-bottom: 32px !important; }
          .legal-item { margin-bottom: 28px !important; padding-bottom: 22px !important; }
          .legal-item h2 { font-size: 17px !important; }
          .legal-item p { font-size: 14px !important; line-height: 1.7 !important; }
        }
      `}</style>

      <SiteNav />

      <section className="legal-section" style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 100px' }}>
        <Link href="/" className="back-link" style={{ color: '#4fc3ff', fontSize: 14, textDecoration: 'none' }}>
          ← Back to LockedIn
        </Link>

        <h1 className="legal-title" style={{ fontSize: 36, fontWeight: 800, margin: '32px 0 8px' }}>{title}</h1>
        <p className="legal-updated" style={{ color: 'rgba(200,225,255,.45)', fontSize: 14, marginBottom: 48 }}>
          Last updated: {lastUpdated}
        </p>

        {sections.map((section) => (
          <div
            key={section.title}
            className="legal-item"
            style={{ marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid rgba(79,195,255,.15)' }}
          >
            <h2 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 12px', color: '#fff' }}>{section.title}</h2>
            <p style={{ color: 'rgba(200,225,255,.65)', fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>
              {section.content}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
