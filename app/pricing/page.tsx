"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "For small teams and individual developers",
      monthlyPrice: "$99",
      annualPrice: "$990",
      features: {
        "GPU Instances": "1",
        "Storage": "100 GB",
        "Concurrent Jobs": "5",
        "Support": "Community",
        "Monitoring": "Basic",
        "Custom Domain": false,
        "API Access": false,
        "SSO": false,
        "Custom Integrations": false,
        "On-premises Deployment": false,
      },
    },
    {
      name: "Pro",
      description: "For growing teams with advanced needs",
      monthlyPrice: "$299",
      annualPrice: "$2,990",
      features: {
        "GPU Instances": "5",
        "Storage": "500 GB",
        "Concurrent Jobs": "20",
        "Support": "Priority",
        "Monitoring": "Advanced",
        "Custom Domain": true,
        "API Access": true,
        "SSO": false,
        "Custom Integrations": false,
        "On-premises Deployment": false,
      },
    },
    {
      name: "Enterprise",
      description: "For large-scale operations and high-performance requirements",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      features: {
        "GPU Instances": "Unlimited",
        "Storage": "Unlimited",
        "Concurrent Jobs": "Unlimited",
        "Support": "24/7 Dedicated",
        "Monitoring": "Advanced",
        "Custom Domain": true,
        "API Access": true,
        "SSO": true,
        "Custom Integrations": true,
        "On-premises Deployment": true,
      },
    },
  ]

  return (
    <div className="min-h-screen">
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

            <SignedOut>
              <Link href="/sign-in" className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ">
              Sign in
            </Link>
            </SignedOut>
            <SignedIn>
            <Link href="/dashboard" className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ">
              Home
            </Link>
            </SignedIn>
            <Link href="/sign-up" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
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
      <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight font-medium text-center mt-10 mb-6">
        <span className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-900 text-transparent bg-clip-text">
          Pricing
        </span>
      </h1>
        <p className="text-md md:text-lg lg:text-xl text-center text-gray-700 max-w-xl mx-auto mb-8">
        Flexible pricing that scales as well as our GPUs do. Monthly contracts, no hidden fees. 
      </p>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                billingPeriod === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                billingPeriod === 'annual'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${index === 1 ? "shadow-md relative" : ""} flex flex-col`}>
              {index === 1 && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                  </div>
                  <p className="text-gray-600">
                    {plan.name === "Enterprise" ? "per month" : `per ${billingPeriod === 'monthly' ? 'month' : 'year'}`}
                  </p>
                </div>
                <ul className="space-y-2">
                  {Object.entries(plan.features).slice(0, 5).map(([feature, value], featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>{typeof value === 'boolean' ? feature : `${feature}: ${value}`}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-gray-50 mt-auto">
                <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>


      </div>
      <footer className="bg-gray-100 border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © 2024 Modelflow. All rights reserved.
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
                <a href="#" className="text-gray-600 hover:text-gray-900">Explore</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Templates</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Docs</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Changelog</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Community</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Partners</a>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
