import Head from 'next/head';

export default function DeleteAccount() {
  return (
    <>
      <Head>
        <title>Delete My Data</title>
      </Head>
      <main style={{ padding: '2rem' }}>
        <h1>Delete My Instagram Data</h1>
        <p>
          If you wish to delete your account data from our app, please send a request to:
        </p>
        <p>
          <strong>Email:</strong> support@instagram-integration.com
        </p>
        <p>
          We will process your request within 7 business days and confirm via email.
        </p>
      </main>
    </>
  );
}
