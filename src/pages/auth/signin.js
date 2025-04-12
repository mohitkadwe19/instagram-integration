import { getProviders, signIn } from "next-auth/react";
import { FaInstagram, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignIn({ providers: initialProviders }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState(initialProviders);
  
  const router = useRouter();
  const { callbackUrl, error: routeError } = router.query;

  // If no providers were fetched server-side, try client-side
  useEffect(() => {
    if (!initialProviders || Object.keys(initialProviders).length === 0) {
      const fetchProviders = async () => {
        try {
          const providers = await getProviders();
          console.log("Client-side providers:", providers);
          setProviders(providers);
        } catch (err) {
          console.error("Error fetching providers client-side:", err);
          setError("Failed to load authentication providers. Please refresh the page and try again.");
        }
      };
      fetchProviders();
    }
  }, [initialProviders]);

  // Handle route error params
  useEffect(() => {
    if (routeError) {
      setError(
        routeError === "OAuthSignin" 
          ? "Could not start the Instagram sign-in process. Please try again." 
          : routeError === "OAuthCallback" 
            ? "There was a problem with the Instagram authentication." 
            : "An error occurred during sign in. Please try again."
      );
    }
  }, [routeError]);

  const handleSignIn = async (providerId) => {
    if (!providerId) {
      setError("Invalid provider. Please try again later.");
      return;
    }
    
    try {
      console.log("Signing in with provider:", providerId);
      
      // Use environment variable for the base URL if available, otherwise use window.location.origin
      const baseUrl = process.env.NEXTAUTH_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : '');
                     
      // Set the effective callback URL
      const effectiveCallbackUrl = callbackUrl || `${baseUrl}/`;
      console.log("Callback URL:", effectiveCallbackUrl);
      
      setIsLoading(true);
      setError(null);
      
      // Use the correct redirect URL for ngrok
      await signIn(providerId, {
        callbackUrl: effectiveCallbackUrl,
        redirect: true
      });
      
      // If code execution reaches here, the redirect didn't happen
      // This timeout will only run if the redirect fails
      setTimeout(() => {
        setIsLoading(false);
        setError("Redirect to authentication provider failed. You might need to allow popups or try again.");
      }, 5000);
      
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  // Extract the Instagram provider specifically
  const instagramProvider = providers && Object.values(providers).find(p => p.id === "instagram");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Head>
        <title>Sign In with Instagram</title>
      </Head>
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <FaInstagram className="mx-auto h-12 w-12 text-pink-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Instagram Integration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect your Instagram account to view your profile and media
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          {/* Use Instagram provider if available */}
          {instagramProvider ? (
            <button
              onClick={() => handleSignIn("instagram")}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaInstagram className="h-5 w-5" />
                  </span>
                  Sign in with Instagram
                </>
              )}
            </button>
          ) : (
            // Fallback button if no Instagram provider found
            <button
              onClick={() => handleSignIn("instagram")}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaInstagram className="h-5 w-5" />
                  </span>
                  Sign in with Instagram
                </>
              )}
            </button>
          )}
          
          <div className="text-center">
            <Link 
              href="/"
              className="inline-block text-sm text-purple-600 hover:text-purple-800"
            >
              Return to home
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to connect your Instagram account with this
            application.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const providers = await getProviders();
    console.log("Server-side providers:", providers);

    return {
      props: { providers: providers || null },
    };
  } catch (error) {
    console.error("Error fetching providers:", error);
    return {
      props: { providers: null },
    };
  }
}