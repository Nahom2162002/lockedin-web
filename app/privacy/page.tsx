export default function PrivacyPolicy() {
  return (
    <main style={{
      fontFamily: 'Inter, sans-serif',
      background: '#0d0d0d',
      minHeight: '100vh',
      color: 'white',
      padding: '60px 24px'
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" style={{ color: '#0099ff', fontSize: 14, textDecoration: 'none' }}>← Back to LockedIn</a>

        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '32px 0 8px' }}>Privacy Policy</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 48 }}>
          Last updated: July 5, 2026
        </p>

        {[
          {
            title: '1. Who We Are',
            content: 'LockedIn is a Chrome extension and web service operated by Nahom Ashagrea. We help users block distracting websites to improve productivity. You can contact us at nahomashagrea2002@gmail.com.'
          },
          {
            title: '2. What Data We Collect',
            content: `We collect the following information when you use LockedIn:

- Account information: your username and email address when you create an account
- Blocked website data: the URLs, dates, and times you configure for blocking
- Subscription data: your plan status (free or pro) and Stripe customer ID for billing
- Usage data: focus session statistics and block events to power your stats dashboard
- Technical data: standard server logs including IP address and browser type`
          },
          {
            title: '3. How We Use Your Data',
            content: `We use your data to:

- Provide and operate the LockedIn service
- Sync your blocked sites across devices
- Process payments via Stripe
- Show you your focus stats and streaks
- Send password reset emails when requested
- Improve the product based on usage patterns

We do not sell your data to third parties. We do not use your data for advertising.`
          },
          {
            title: '4. Data Storage',
            content: 'Your data is stored securely in MongoDB Atlas (cloud database) hosted in the United States. Passwords are hashed using bcrypt and are never stored in plain text. Payment information is handled entirely by Stripe and never stored on our servers.'
          },
          {
            title: '5. Third Party Services',
            content: `We use the following third party services:

- Stripe — payment processing (stripe.com/privacy)
- MongoDB Atlas — database hosting (mongodb.com/legal/privacy-policy)
- Vercel — hosting and infrastructure (vercel.com/legal/privacy-policy)
- Resend — transactional email (resend.com/legal/privacy-policy)

Each of these services has their own privacy policy governing how they handle data.`
          },
          {
            title: '6. Data Retention',
            content: 'We retain your account data for as long as your account is active. If you delete your account, your personal data will be removed within 30 days. Anonymized usage statistics may be retained indefinitely.'
          },
          {
            title: '7. Your Rights',
            content: `You have the right to:

- Access the personal data we hold about you
- Request correction of inaccurate data
- Request deletion of your account and associated data
- Export your data

To exercise any of these rights, contact us at nahomashagrea2002@gmail.com.`
          },
          {
            title: '8. Cookies',
            content: 'LockedIn does not use cookies for tracking or advertising. We use browser local storage within the Chrome extension solely to store your authentication token and blocked site data locally on your device.'
          },
          {
            title: '9. Children\'s Privacy',
            content: 'LockedIn is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us and we will delete it promptly.'
          },
          {
            title: '10. Changes to This Policy',
            content: 'We may update this privacy policy from time to time. We will notify users of significant changes via email. Continued use of LockedIn after changes constitutes acceptance of the updated policy.'
          },
          {
            title: '11. Contact',
            content: 'If you have any questions about this privacy policy, contact us at nahomashagrea2002@gmail.com.'
          }
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'white' }}>
              {section.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}