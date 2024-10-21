"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './CarouselStyles.module.css';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [carouselPosition, setCarouselPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselPosition((prevPosition) => (prevPosition + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Links */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 mr-8">
              <Link href="/" className="flex items-center">
               <h3 className="font-bold text-xl tracking-tight">ModelFlow</h3>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-5">
              <Link href="/explore" className="text-gray-600 hover:text-gray-700">Explore</Link>
              <Link href="/templates" className="text-gray-600 hover:text-gray-700">Templates</Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-700">Docs</Link>
              <Link href="/changelog" className="text-gray-600 hover:text-gray-700">Changelog</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-700">Pricing</Link>
              <Link href="/community" className="text-gray-600 hover:text-gray-700">Community</Link>
              <Link href="/partners" className="text-gray-600 hover:text-gray-700">Partners</Link>
            </div>
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-1.5">
            <a href="https://github.com/pipedream/pipedream" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Star
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 rounded-full">9.2k</span>
            </a>
            <Link href="/signin" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sign in
            </Link>
            <Link href="/signup" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/explore" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Explore</Link>
            <Link href="/templates" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Templates</Link>
            <Link href="/docs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Docs</Link>
            <Link href="/changelog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Changelog</Link>
            <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Pricing</Link>
            <Link href="/community" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Community</Link>
            <Link href="/partners" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Partners</Link>
            <a href="https://github.com/pipedream/pipedream" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Star on GitHub</a>
            <Link href="/signin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-300">Sign in</Link>
            <Link href="/signup" className="block w-full px-5 py-3 text-center font-medium text-white bg-black hover:bg-gray-800">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
    <div className="flex justify-center mt-10 relative top-7">
      <a href="/announcement" className="inline-block px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg">
        Announcing our $33m series B
      </a>
    </div>
    <div className="pt-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl md:text-6xl lg:text-8xl tracking-tight font-medium text-center mt-10 mb-6">
        <span className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-900 text-transparent bg-clip-text">
          Serverless infra for
        </span>
        <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 text-transparent bg-clip-text">
          {" "}modern ML teams
        </span>
      </h1>
      <p className="text-md md:text-lg lg:text-xl text-center text-gray-700 max-w-2xl mx-auto mb-10">
        Inference at scale, in our cloud or yours. Built for performance, security, and reliability—with a developer experience you'll love.
      </p>
      <div className="flex justify-center space-x-4">
        <Link href="/signup" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800">
          Get started
        </Link>
        <Link href="/contact" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Talk to sales
        </Link>
      </div>
      <div className="mt-16 mb-20">
        <p className="text-center text-lg font-medium text-gray-600 mb-14">
          Trusted in production by the best ML engineers in the world, from startups to Fortune 500s
        </p>
        <div className={styles.carouselContainer}>
          <div className={styles.carouselTrack}>
            {/* First set of logos */}
            <div className={styles.carouselSlide}>
              <Image alt="Company 1 logo" src="/amazon.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 2 logo" src="/bmw.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 3 logo" src="/google.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 4 logo" src="/marriott.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 5 logo" src="/salesforce.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 1 logo" src="/shopify.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 2 logo" src="/whatsapp.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 3 logo" src="/zara.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 1 logo" src="/amazon.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 2 logo" src="/bmw.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 3 logo" src="/google.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 4 logo" src="/marriott.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 5 logo" src="/salesforce.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 1 logo" src="/shopify.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 2 logo" src="/whatsapp.svg" width={220} height={120} />
            </div>
            <div className={styles.carouselSlide}>
              <Image alt="Company 3 logo" src="/zara.svg" width={220} height={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
