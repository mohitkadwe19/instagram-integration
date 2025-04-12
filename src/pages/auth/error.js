import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  // User-friendly error messages
  const errorMessages = {
    default: "An error occurred during authentication. Please try again.",
    Configuration: "There's a server configuration issue. Please contact support.",
    AccessDenied: "You declined permission to access your Instagram data.",
    Verification: "We couldn't verify your identity. Please try signing in again.",
    OAuthSignin: "Could not begin the Instagram sign-in process.",
    OAuthCallback: "Something went wrong with the Instagram authentication process.",
    OAuthAccountNotLinked: "This account is already linked to a different profile.",
    OAuthCallbackError: "Instagram callback verification failed. Please try again.",
    Callback: "Something went wrong during the sign-in process.",
    "State cookie was missing": "The authentication session expired. Please try again.",
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Head>
        <title>Authentication Error | Instagram Integration</title>
      </Head>
      
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Authentication Error</h2>
          <p className="mt-2 text-gray-600">{errorMessage}</p>
          
          {/* Technical error details (only if useful) */}
          {error && error !== "default" && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500">Error code: {error}</p>
            </div>
          )}
          
          <div className="mt-6 space-y-4">
            <Link href="/auth/signin" className="block w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-center">
              Try Again
            </Link>
            
            <Link href="/" className="block w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center flex items-center justify-center">
              <FaArrowLeft className="mr-2" />
              Return to Home
            </Link>
          </div>
          
          <p className="mt-6 text-xs text-gray-500">
            If you continue to experience issues, please make sure you have granted the necessary permissions to the app in your Instagram settings.
          </p>
        </div>
      </div>
    </div>
  );
}