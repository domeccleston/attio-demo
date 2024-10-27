import Link from "next/link";
import Image from "next/image";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ChevronsUpDown, Menu } from "lucide-react";
import { useState } from "react";
import { UserResource } from "@clerk/types";
import { DialogTrigger } from "../ui/dialog";

export function Header({
  user,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  user: UserResource | null | undefined;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}) {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState("Personal Account");

  return (
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
  );
}
