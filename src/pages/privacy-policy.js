import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <main style={{ padding: '2rem' }}>
        <h1>Privacy Policy</h1>
        <p>
          This Privacy Policy describes how we collect, use, and handle your information when you use our application.
        </p>
        <h2>Information Collection</h2>
        <p>
          We only collect basic public Instagram profile information (such as ID and username) after you authorize access. We do not collect personal data like email or password.
        </p>
        <h2>Use of Information</h2>
        <p>
          The collected data is used solely to display your Instagram media and profile inside our application.
        </p>
        <h2>Data Sharing</h2>
        <p>
          We do not share your data with third parties. Everything stays within the scope of this app.
        </p>
        <h2>Your Consent</h2>
        <p>
          By using our app and signing in with Instagram, you consent to this Privacy Policy.
        </p>
        <h2>Contact</h2>
        <p>
          For questions about this Privacy Policy, contact us at mohitpawar530@gmail.com.
        </p>
      </main>
    </>
  );
}
