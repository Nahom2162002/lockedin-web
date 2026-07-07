export default function TermsOfService() {
  return (
    <main style={{
      fontFamily: 'Inter, sans-serif',
      background: `
        radial-gradient(ellipse 900px 500px at 15% -5%, rgba(0, 170, 255, 0.14), transparent 60%),
        radial-gradient(ellipse 900px 600px at 85% 105%, rgba(0, 120, 255, 0.12), transparent 60%),
        linear-gradient(180deg, #050726 0%, #000004 100%)`,
      minHeight: '100vh',
      color: 'white',
      padding: '60px 24px'
    }}>
      <style>{`
        .back-link { transition: color 0.15s ease; }
        .back-link:hover { color: rgba(120, 210, 255, 1) !important; }
      `}</style>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" className="back-link" style={{ color: 'rgb(0, 170, 255)', fontSize: 14, textDecoration: 'none' }}>← Back to LockedIn</a>

        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '32px 0 8px', textShadow: '0 0 12px rgba(0, 170, 255, 0.4)' }}>Terms of Service</h1>
        <p style={{ color: 'rgba(180, 225, 255, 0.45)', fontSize: 14, marginBottom: 48 }}>
          Last updated: July 5, 2026
        </p>

        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By installing or using LockedIn, you agree to these Terms of Service. If you do not agree, do not use the service. These terms apply to all users of the LockedIn Chrome extension and associated web services.'
          },
          {
            title: '2. Description of Service',
            content: 'LockedIn is a Chrome extension that allows users to block access to specified websites during defined time windows. LockedIn offers a free tier and a paid Pro tier with additional features. We reserve the right to modify, suspend, or discontinue any part of the service at any time.'
          },
          {
            title: '3. Account Registration',
            content: `To use LockedIn you must create an account with a valid email address and password. You are responsible for:

- Maintaining the confidentiality of your account credentials
- All activity that occurs under your account
- Notifying us immediately of any unauthorized use of your account

You must be at least 13 years old to create an account.`
          },
          {
            title: '4. Free and Pro Plans',
            content: `LockedIn offers two plans:

Free Plan: Allows blocking of up to 3 websites with basic scheduling. Available at no cost.

Pro Plan: $7 per month, billed monthly. Includes unlimited blocking, recurring schedules, category blocking, stats dashboard, strict mode, and cross-device sync.

We reserve the right to change pricing with 30 days notice to existing subscribers.`
          },
          {
            title: '5. Payments and Billing',
            content: `Pro subscriptions are billed monthly through Stripe. By subscribing to Pro you authorize us to charge your payment method on a recurring monthly basis.

Subscriptions automatically renew unless cancelled. You may cancel at any time through the in-extension customer portal. Cancellation takes effect at the end of the current billing period.

We do not offer refunds for partial months. If you cancel mid-cycle you will retain Pro access until the end of the paid period.`
          },
          {
            title: '6. Acceptable Use',
            content: `You agree not to:

- Use LockedIn for any unlawful purpose
- Attempt to reverse engineer, modify, or hack the extension or web service
- Share your account credentials with others
- Use automated tools to access the service
- Interfere with the security or integrity of the service

We reserve the right to suspend or terminate accounts that violate these terms.`
          },
          {
            title: '7. Disclaimer of Warranties',
            content: 'LockedIn is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the service will be uninterrupted, error-free, or that it will successfully block all websites in all circumstances. Browser updates or changes to Chrome\'s extension policies may affect functionality.'
          },
          {
            title: '8. Limitation of Liability',
            content: 'To the maximum extent permitted by law, Nahom Ashagrea shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of LockedIn. Our total liability for any claim arising from use of the service shall not exceed the amount you paid us in the 3 months prior to the claim.'
          },
          {
            title: '9. Intellectual Property',
            content: 'LockedIn and all associated branding, code, and content are the property of Nahom Ashagrea. You may not reproduce, distribute, or create derivative works without explicit written permission.'
          },
          {
            title: '10. Termination',
            content: 'We may terminate or suspend your account at any time for violation of these terms. You may delete your account at any time by contacting us at nahomashagrea2002@gmail.com. Upon termination, your right to use the service ceases immediately.'
          },
          {
            title: '11. Changes to Terms',
            content: 'We may update these terms from time to time. We will notify you of significant changes via email. Continued use of LockedIn after changes constitutes acceptance of the updated terms.'
          },
          {
            title: '12. Governing Law',
            content: 'These terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of the United States.'
          },
          {
            title: '13. Contact',
            content: 'For questions about these terms, contact us at nahomashagrea2002@gmail.com.'
          }
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid rgba(0, 170, 255, 0.15)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'white' }}>
              {section.title}
            </h2>
            <p style={{ color: 'rgba(200, 225, 255, 0.65)', fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
