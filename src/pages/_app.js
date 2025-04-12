import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

// Global error handler for fetch requests (improved version)
const setupGlobalErrorHandling = () => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    // For ngrok development: convert localhost URLs to ngrok URLs
    if (process.env.NODE_ENV === 'development' && process.env.NEXTAUTH_URL) {
      // If the request is to localhost and we have a ngrok URL
      if (typeof args[0] === 'string' && args[0].includes('localhost:3000')) {
        // Replace localhost with ngrok URL
        args[0] = args[0].replace(
          'http://localhost:3000', 
          process.env.NEXTAUTH_URL
        );
        console.log('Redirecting fetch to:', args[0]);
      }
    }
    
    try {
      const response = await originalFetch(...args);
      return response;
    } catch (error) {
      console.error("Fetch error caught by global handler:", error);
      
      // Don't rethrow the error if it's a network error during development,
      // as these are often expected when using ngrok or other tunneling services
      if (process.env.NODE_ENV === 'development' && error.message === 'Failed to fetch') {
        console.warn("Network error during development - this may be expected with ngrok");
        
        // For NextAuth CSRF requests specifically, create a mock response
        if (typeof args[0] === 'string' && args[0].includes('/api/auth/signin?csrf=true')) {
          console.log('Mocking CSRF response');
          return new Response(JSON.stringify({
            csrfToken: "mock-csrf-token-for-development"
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Return a mock response for other fetch errors
        return new Response(JSON.stringify({
          error: "network_error",
          message: "Network error occurred. If using ngrok, this may be expected."
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw error;
    }
  };
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Setup global error handling
  useEffect(() => {
    setupGlobalErrorHandling();
  }, []);

  // Handle JSON parsing errors
  useEffect(() => {
    const handleError = (event) => {
      const error = event.error || event.reason;
      const errorString = String(error);
      
      // Detect specific error types
      if (errorString.includes("Unexpected token '<'") && errorString.includes("JSON")) {
        console.error("JSON parsing error detected, likely due to authentication issue");
        
        // Check if this is related to an auth flow and redirect if needed
        if (window.location.pathname.includes('/api/auth/')) {
          router.push('/auth/error?error=OAuthCallbackError');
        }
      }
    };

    // Listen for unhandled errors and promise rejections
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [router]);

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;