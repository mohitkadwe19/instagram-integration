import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { FaCheckCircle, FaInstagram, FaSpinner } from "react-icons/fa";

export default function AuthSuccess() {
  const router = useRouter();
  const { username } = router.query;
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!username) return;

    // Simulate loading user data
    setTimeout(() => {
      setUserData({ username });
      setLoading(false);
    }, 1000);

    // Optional: You could fetch additional profile data here
  }, [username]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Head>
        <title>Authentication Successful</title>
      </Head>

      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        {loading ? (
          <div className="text-center">
            <FaSpinner className="mx-auto h-12 w-12 text-purple-500 animate-spin" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Completing Authentication
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we finish setting up your connection...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Successful!
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              Welcome, <span className="font-medium">@{username}</span>!
            </p>
            <p className="mt-2 text-gray-600">
              Your Instagram account has been successfully connected.
            </p>

            <div className="mt-8 space-y-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full"
              >
                <FaInstagram className="mr-2" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}