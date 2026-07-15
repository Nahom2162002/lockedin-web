'use client';

import { useState } from 'react';

const PERSONAS = {
  student: {
    label: 'Student',
    headline: 'Study time,\nactually spent studying.',
    subhead:
      'Block social feeds and games during study blocks and exam weeks — LockedIn keeps the syllabus winning.',
  },
  remote: {
    label: 'Remote worker',
    headline: 'Deep work,\non demand.',
    subhead:
      'Your inbox, Slack, and social feeds can wait. LockedIn locks distracting sites away during your work blocks — so your best hours actually go to your work.',
  },
  freelance: {
    label: 'Freelancer',
    headline: 'Bill the hours\nyou actually worked.',
    subhead:
      'No client, no clock — just you and the deadline. LockedIn keeps distractions out so your billable hours are real deep-work hours.',
  },
} as const;

type PersonaKey = keyof typeof PERSONAS;
const ORDER: PersonaKey[] = ['student', 'remote', 'freelance'];

export default function PersonaHero() {
  const [active, setActive] = useState<PersonaKey>('remote');
  const persona = PERSONAS[active];

  return (
    <>
      <div
        style={{
          display: 'inline-flex',
          gap: 6,
          background: 'rgba(30,144,255,.15)',
          border: '1px solid rgba(79,195,255,.3)',
          borderRadius: 20,
          padding: 5,
          marginBottom: 28,
        }}
      >
        {ORDER.map((key) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              style={{
                background: isActive ? '#fff' : 'transparent',
                border: 'none',
                color: isActive ? '#0a1230' : 'rgba(230,242,255,.75)',
                fontSize: 13,
                padding: '6px 16px',
                borderRadius: 16,
                fontFamily: 'inherit',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {PERSONAS[key].label}
            </button>
          );
        })}
      </div>
      <h1
        style={{
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1.12,
          margin: '0 0 22px',
          whiteSpace: 'pre-line',
          background: 'linear-gradient(135deg,#ffffff,#a9dcff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {persona.headline}
      </h1>
      <p
        style={{
          fontSize: 18,
          color: 'rgba(200,225,255,.65)',
          lineHeight: 1.7,
          margin: '0 0 36px',
          maxWidth: 520,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {persona.subhead}
      </p>
    </>
  );
}
