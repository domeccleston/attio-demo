"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Intercom from "@intercom/messenger-js-sdk";
import { ChevronsUpDown, Menu, ArrowUpRight, BarChart2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircularGauge } from "@/components/ui/gauge";
import { createTeam } from "@/app/actions/create-team";

const tabs = ["Models", "Logs", "Environments", "Integrations", "Monitoring"];

interface Model {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive";
  lastUpdated: string;
  version: string;
  analytics: {
    requests: number;
    accuracy: number;
  };
  trend: number[];
}

const sampleModels: Model[] = [
  {
    id: "1",
    name: "Sentiment Analysis",
    type: "NLP",
    status: "active",
    lastUpdated: "2023-04-15",
    version: "1.2.0",
    analytics: { requests: 15234, accuracy: 0.92 },
    trend: [65, 59, 80, 81, 56, 55, 40],
  },
  {
    id: "2",
    name: "Image Classification",
    type: "Computer Vision",
    status: "active",
    lastUpdated: "2023-04-10",
    version: "2.1.0",
    analytics: { requests: 8765, accuracy: 0.89 },
    trend: [30, 40, 35, 50, 49, 60, 70],
  },
  {
    id: "3",
    name: "Fraud Detection",
    type: "Machine Learning",
    status: "inactive",
    lastUpdated: "2023-03-28",
    version: "1.0.1",
    analytics: { requests: 3210, accuracy: 0.95 },
    trend: [80, 75, 65, 60, 55, 45, 40],
  },
  {
    id: "4",
    name: "Recommendation Engine",
    type: "Machine Learning",
    status: "active",
    lastUpdated: "2023-04-12",
    version: "3.0.2",
    analytics: { requests: 21098, accuracy: 0.88 },
    trend: [40, 45, 50, 55, 60, 75, 80],
  },
];

export default function Dashboard() {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Models");
  const [selectedWorkspace, setSelectedWorkspace] =
    useState("Personal Account");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const [teamName, setTeamName] = useState("");
  const [teamSlug, setTeamSlug] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      try {
        const id = await createTeam(formData);
        setDialogOpen(false);
        router.push(`/dashboard/teams/${id}`);
      } catch (error) {
        console.error("Error creating team:", error);
      }
    }
  };

  Intercom({
    app_id: "kr3tjdn6",
    user_id: user?.id ?? undefined,
    name: user?.firstName ?? undefined,
    email: user?.primaryEmailAddress?.emailAddress ?? undefined,
    created_at: user?.createdAt
      ? Math.floor(user.createdAt.getTime() / 1000)
      : undefined,
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team to collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label
              htmlFor="teamName"
              className="block text-sm font-medium text-gray-700"
            >
              Team Name
            </label>
            <input
              type="text"
              name="teamName"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="teamSlug"
              className="block text-sm font-medium text-gray-700"
            >
              Team Slug
            </label>
            <input
              type="text"
              name="teamSlug"
              id="teamSlug"
              value={teamSlug}
              onChange={(e) => setTeamSlug(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Team
            </button>
          </div>
        </form>
      </DialogContent>
      <div className="min-h-screen bg-gray-50">
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="font-bold text-xl tracking-tight">
              <Link href="/">ModelFlow</Link>
            </h3>
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={() =>
                    setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)
                  }
                >
                  {user && user.imageUrl && (
                    <Image
                      src={user.imageUrl}
                      alt="User avatar"
                      className="w-6 h-6 rounded-full"
                      width={24}
                      height={24}
                      loading="eager"
                      placeholder="blur"
                      blurDataURL={user.imageUrl}
                    />
                  )}
                  <span className="inline-flex items-center">
                    {selectedWorkspace}
                  </span>
                  <ChevronsUpDown className="h-5 w-5" />
                </button>
                {isWorkspaceDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                        onClick={() => {
                          setSelectedWorkspace("Personal Account");
                          setIsWorkspaceDropdownOpen(false);
                        }}
                      >
                        Personal Account
                      </a>
                      <DialogTrigger
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        Create Team
                      </DialogTrigger>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Contact Sales
            </Link>
            <div className="w-8 h-8">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600"
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
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                      userButtonTrigger: "focus:shadow-none focus:ring-0",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => (
                <a
                  key={tab}
                  href="#"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === tab
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab}
                </a>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600"
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
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-8 h-8",
                          userButtonTrigger: "focus:shadow-none focus:ring-0",
                        },
                      }}
                    />
                  </SignedIn>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    User Name
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    user@example.com
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        )}

        <nav className="hidden md:block">
          <div className="max-w-7xl px-4">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="border-t border-gray-200"></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Deployed Models
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleModels.map((model) => (
              <div
                key={model.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {model.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        model.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {model.status}
                    </span>
                  </div>
                  <div className="space-y-1 mb-2 text-sm">
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-700">Type:</span>{" "}
                      {model.type}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-700">
                        Version:
                      </span>{" "}
                      {model.version}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-700">
                        Updated:
                      </span>{" "}
                      {model.lastUpdated}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <BarChart2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {model.analytics.requests.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-700">
                          {(model.analytics.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <CircularGauge
                      value={Math.round(model.analytics.accuracy * 100)}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-150">
                    Explore model <ArrowUpRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
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
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Explore
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Templates
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Docs
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Changelog
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Pricing
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Community
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Partners
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Dialog>
  );
}
