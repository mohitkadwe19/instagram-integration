import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service</title>
      </Head>
      <main style={{ padding: '2rem' }}>
        <h1>Terms of Service</h1>
        <p>By using this application, you agree to the following terms:</p>

        <ul>
          <li>You must be at least 13 years old to use this service.</li>
          <li>You must own or be authorized to use the Instagram account you connect.</li>
          <li>We only use your Instagram data to display your profile and media.</li>
          <li>We may modify or discontinue our service at any time.</li>
        </ul>

        <p>
          Continued use of the application constitutes acceptance of these terms.
        </p>

        <p>Contact us for any concerns: support@instagram-integration.com</p>
      </main>
    </>
  );
}
