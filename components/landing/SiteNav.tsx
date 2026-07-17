import Link from 'next/link';
import Image from 'next/image';
import { CHROME_STORE_URL } from '@/lib/constants';

export default function SiteNav({ showLinks = false }: { showLinks?: boolean }) {
  return (
    <nav
      className="site-nav"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(79,195,255,.15)',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .site-nav { padding: 16px 20px !important; }
          .site-nav-logo-text { font-size: 17px !important; }
          .site-nav-links { gap: 16px !important; }
          .site-nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
        }
        @media (max-width: 420px) {
          .site-nav-link-item { display: none !important; }
        }
      `}</style>
      <Link
        href="/"
        style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}
      >
        <Image
          src="/lock-icon.png"
          alt="LockedIn"
          width={28}
          height={28}
          style={{ borderRadius: 6, objectFit: 'cover' }}
        />
        <span className="site-nav-logo-text" style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.2px' }}>
          LockedIn
        </span>
      </Link>
      <div className="site-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 14 }}>
        {showLinks && (
          <>
            <a
              href="#features"
              className="nav-link site-nav-link-item"
              style={{ color: 'rgba(200,225,255,.65)', textDecoration: 'none' }}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="nav-link site-nav-link-item"
              style={{ color: 'rgba(200,225,255,.65)', textDecoration: 'none' }}
            >
              Pricing
            </a>
          </>
        )}
        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="cta-btn site-nav-cta"
          style={{
            background: 'linear-gradient(135deg,#1e90ff,#00c2ff)',
            boxShadow: '0 0 16px 2px rgba(30,144,255,.4)',
            color: '#fff',
            padding: '9px 20px',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Add to Chrome
        </a>
      </div>
    </nav>
  );
}
