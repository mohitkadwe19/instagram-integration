import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import Link from "next/link";
import {
  FaInstagram,
  FaSignInAlt,
  FaSpinner,
  FaRegComment,
  FaUserCircle,
  FaImages,
  FaUser,
  FaChartLine
} from "react-icons/fa";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // Landing page for users who aren't logged in
  if (!loading && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white overflow-hidden">
        <Head>
          <title>Instagram Integration App</title>
          <meta
            name="description"
            content="Connect your Instagram account to view your profile and media"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
        </Head>

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 right-60 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <FaInstagram className="h-8 w-8 text-pink-600" />
                  <div className="absolute -top-1 -right-1 -left-1 -bottom-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur opacity-30 animate-pulse"></div>
                </div>
                <span className="ml-3 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                  Instagram Integration
                </span>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <FaSignInAlt className="mr-2 -ml-1" />
                  Sign In
                </Link>
              </motion.div>
            </div>
          </header>

          {/* Hero Section */}
          <main className="py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                  <span className="block">Connect to</span>
                  <motion.span
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"
                    initial={{ backgroundPosition: "0% center" }}
                    animate={{ backgroundPosition: "100% center" }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    Instagram
                  </motion.span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-3xl leading-relaxed">
                  View your profile, posts, and engage with comments all in one
                  beautiful interface.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/auth/signin"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="#features"
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow hover:shadow-md transition-all duration-200"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="hidden md:block relative"
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative p-1 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-30 blur-xl"></div>
                  <div className="relative bg-white rounded-xl overflow-hidden">
                    <div className="aspect-w-4 aspect-h-5">
                      {/* Instagram UI mockup */}
                      <div className="absolute inset-0 flex flex-col">
                        {/* App header */}
                        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <div className="ml-3">
                              <div className="w-24 h-3 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>

                        {/* Instagram feed */}
                        <div className="flex-grow overflow-hidden bg-gray-50 p-2">
                          {/* Post 1 */}
                          <motion.div
                            className="bg-white rounded-lg shadow mb-3 overflow-hidden"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className="p-3 flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                              <div className="ml-2">
                                <div className="w-20 h-2 bg-gray-300 rounded"></div>
                              </div>
                            </div>
                            <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-purple-100 to-pink-100"></div>
                            <div className="p-3">
                              <div className="flex space-x-4 mb-2">
                                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                              <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                            </div>
                          </motion.div>

                          {/* Post 2 (partial) */}
                          <motion.div
                            className="bg-white rounded-lg shadow overflow-hidden"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            <div className="p-3 flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                              <div className="ml-2">
                                <div className="w-20 h-2 bg-gray-300 rounded"></div>
                              </div>
                            </div>
                            <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-blue-100 to-indigo-100"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -right-6 top-1/4 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <FaRegComment className="w-5 h-5" />
                </motion.div>

                <motion.div
                  className="absolute -left-6 top-1/2 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <FaUserCircle className="w-5 h-5" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 left-1/4 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <FaImages className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </div>

            {/* Features Section */}
            <div id="features" className="mt-24 mb-16 scroll-mt-16">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 inline-block">
                    Amazing Features
                  </h2>
                  <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
                    Everything you need to manage your Instagram presence
                  </p>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                  <div className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Rich Profile Display
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      View your Instagram profile details in a beautifully
                      designed, organized interface with all your important
                      stats.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="h-2 bg-gradient-to-r from-pink-600 to-rose-600"></div>
                  <div className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Interactive Media Feed
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Browse your Instagram photos, videos, and carousel posts
                      in a dynamic, responsive gallery with smooth transitions.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                  <div className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Smart Comment Management
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Reply to comments on your posts with an intuitive
                      interface that makes engaging with your audience
                      effortless.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* CTA Section */}
            <motion.div
              className="my-24 relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
              <div className="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
              <div className="relative px-6 py-12 md:py-16 md:px-12 text-center">
                <h2 className="text-3xl font-extrabold text-white md:text-4xl mb-6">
                  Ready to connect your Instagram?
                </h2>
                <p className="max-w-xl mx-auto text-lg text-purple-100 mb-10">
                  Join thousands of users who are already managing their
                  Instagram presence more effectively with our platform.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    href="/auth/signin"
                    className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition duration-200"
                  >
                    Connect Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="py-12 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <FaInstagram className="h-6 w-6 text-pink-500" />
                <span className="ml-2 font-semibold text-gray-900">
                  Instagram Integration
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Instagram Integration App © {new Date().getFullYear()}
              </p>
              <p className="text-xs text-gray-400 mt-2 md:mt-0">
                Not affiliated with Instagram or Meta Platforms, Inc.
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-purple-200"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600">
            Loading your Instagram data...
          </p>
        </div>
      </Layout>
    );
  }

  // Logged in state with welcome message instead of repeating profile and media sections
  return (
    <Layout title="Instagram Integration - Dashboard">
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.username || session.user.name}
                    className="w-20 h-20 rounded-full border-4 border-white"
                  />
                ) : (
                  <FaUser className="h-12 w-12 text-white" />
                )}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold mb-4 text-gray-900"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">{session.user.username || session.user.name}!</span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 mb-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Your Instagram account is connected successfully.
            What would you like to do next?
          </motion.p>
          
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link href="/profile" className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FaUser className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">View Profile</h3>
              <p className="text-gray-500 text-sm text-center">See your account details and stats</p>
            </Link>
            
            <Link href="/feed" className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <FaImages className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Browse Media</h3>
              <p className="text-gray-500 text-sm text-center">View your photos and videos</p>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}