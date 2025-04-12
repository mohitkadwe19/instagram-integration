import { useSession, getProviders, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [envVars, setEnvVars] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch providers
        const providersData = await getProviders();
        setProviders(providersData);
        
        // Fetch environment variables (public only)
        const res = await fetch('/api/debug-env');
        const envData = await res.json();
        setEnvVars(envData);
      } catch (error) {
        console.error("Error fetching debug data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Layout title="Debug - Instagram Integration">
      <div className="max-w-4xl mx-auto">
        <Head>
          <title>Debug - Instagram Integration</title>
        </Head>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Debug Information</h1>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-gray-600">Loading debug information...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Auth Status */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Authentication Status</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p><strong>Status:</strong> {status}</p>
                    {session ? (
                      <div className="mt-2">
                        <p><strong>Logged in as:</strong> {session.user?.username || session.user?.name || 'Unknown'}</p>
                        <p><strong>User ID:</strong> {session.user?.userId || session.user?.id || 'Unknown'}</p>
                        <p><strong>Access Token:</strong> {session.user?.accessToken ? `${session.user.accessToken.substring(0, 10)}...` : 'Not available'}</p>
                      </div>
                    ) : (
                      <p className="mt-2">Not authenticated</p>
                    )}
                  </div>
                </div>
                
                {/* Providers */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Auth Providers</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {providers && Object.keys(providers).length > 0 ? (
                      <pre className="overflow-auto p-2 bg-gray-100 rounded">
                        {JSON.stringify(providers, null, 2)}
                      </pre>
                    ) : (
                      <p>No providers available. This indicates a configuration issue.</p>
                    )}
                    
                    <div className="mt-4">
                      <h3 className="text-md font-medium mb-2">Test Sign In</h3>
                      {providers && Object.values(providers).map((provider) => (
                        <button
                          key={provider.id}
                          onClick={() => signIn(provider.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mr-2 mb-2"
                        >
                          Sign in with {provider.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Environment */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Environment</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p><strong>NEXTAUTH_URL:</strong> {envVars.NEXTAUTH_URL || 'Not set'}</p>
                    <p><strong>NODE_ENV:</strong> {envVars.NODE_ENV || 'Not set'}</p>
                    <p><strong>Instagram API URL:</strong> {envVars.INSTAGRAM_API_URL || 'Not set'}</p>
                    <p><strong>Instagram Client ID:</strong> {envVars.INSTAGRAM_CLIENT_ID ? 'Set' : 'Not set'}</p>
                    <p><strong>Instagram Client Secret:</strong> {envVars.INSTAGRAM_CLIENT_SECRET ? 'Set' : 'Not set'}</p>
                  </div>
                </div>
                
                {/* Troubleshooting */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Troubleshooting Steps</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Verify that your <code>.env.local</code> file contains all required variables</li>
                      <li>Ensure your Facebook App has the Instagram Basic Display product added</li>
                      <li>Check that your redirect URIs are correctly set in Facebook Developer Console</li>
                      <li>Verify that your app is in Development Mode and your account is added as a tester</li>
                      <li>Check the browser console and server logs for detailed error messages</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}