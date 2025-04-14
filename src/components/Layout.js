import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaInstagram, FaSignOutAlt, FaUser, FaChevronDown, FaImages } from "react-icons/fa";

export default function Layout({ children, title = "Instagram Integration App" }) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 transition-colors duration-200">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Instagram Integration App" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </Head>

      <header className={`sticky top-0 z-20 transition-all duration-200 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-md" 
          : "bg-white shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative">
                  <FaInstagram className="h-7 w-7 text-purple-600" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur opacity-30 animate-pulse"></div>
                </div>
                <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                  Instagram Integration
                </span>
              </Link>
              
              {/* Navigation Links - Only show when logged in */}
              {session && (
                <div className="hidden md:flex ml-8 space-x-4">
                  <Link href="/profile" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <FaUser className="mr-1.5 h-4 w-4 text-purple-500" />
                    <span>Profile</span>
                  </Link>
                  <Link href="/feed" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <FaImages className="mr-1.5 h-4 w-4 text-pink-500" />
                    <span>Feed</span>
                  </Link>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">              
              {session ? (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.username || session.user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaUser className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        @{session.user.username || session.user.name}
                      </span>
                      <FaChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown menu */}
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Profile
                        </Link>
                        <Link
                          href="/feed"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Media Feed
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <a
                          href={`https://instagram.com/${session.user.username || session.user.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Instagram Profile
                        </a>
                        <button
                          onClick={handleSignOut}
                          disabled={isLoggingOut}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {isLoggingOut ? "Signing out..." : "Sign out"}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign in
                  </Link>
                </motion.div>
              )}
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                >
                  <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                  <svg
                    className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {session ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-200">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.username || session.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        @{session.user.username || session.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Instagram User
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="mr-2 text-purple-500" />
                    View Profile
                  </Link>
                  
                  <Link
                    href="/feed"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <FaImages className="mr-2 text-pink-500" />
                    Media Feed
                  </Link>
                  
                  <a
                    href={`https://instagram.com/${session.user.username || session.user.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <FaInstagram className="mr-2 text-gray-500" />
                    Instagram Profile
                  </a>
                  
                  <button
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2 text-gray-500" />
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Sign in with Instagram
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <Link href="/" className="flex items-center">
                <FaInstagram className="h-5 w-5 text-purple-600" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Instagram Integration
                </span>
              </Link>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Instagram Integration App
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}