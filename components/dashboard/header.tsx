import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { UserResource } from "@clerk/types";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import { ChevronsUpDown, Menu } from "lucide-react";
import { DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user: UserResource | null | undefined;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export function Header({
  user,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: HeaderProps) {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<{
    name: string;
    image: string | null;
  }>({ name: "Loading...", image: null });

  const { userMemberships, isLoaded: orgsLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const pathname = window.location.pathname;

  useEffect(() => {
    if (!orgsLoaded || !userLoaded) return;

    const currentUser = user || clerkUser;
    if (!currentUser) return;

    // Check if we're in a team route
    const teamMatch = pathname.match(/\/dashboard\/teams\/([^\/]+)/);
    if (teamMatch) {
      const teamId = teamMatch[1];
      const teamMembership = userMemberships?.data?.find(
        (membership) => membership.organization.id === teamId
      );

      if (teamMembership) {
        setCurrentWorkspace({
          name: teamMembership.organization.name,
          image:
            teamMembership.organization.imageUrl ||
            currentUser.imageUrl ||
            null,
        });
        return;
      }
    }

    // Personal account - ensure we always show user's avatar
    setCurrentWorkspace({
      name: "Personal Account",
      image: currentUser.imageUrl || null,
    });
  }, [
    pathname,
    orgsLoaded,
    userLoaded,
    userMemberships?.data,
    user,
    clerkUser,
  ]);

  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h3 className="font-bold text-xl tracking-tight">
          <Link href="/">ModelFlow</Link>
        </h3>

        {/* Workspace Dropdown - Desktop Only */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              onClick={() =>
                setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)
              }
            >
              {currentWorkspace.image && (
                <Image
                  src={currentWorkspace.image}
                  alt={`${currentWorkspace.name} avatar`}
                  className="w-6 h-6 rounded-full"
                  width={24}
                  height={24}
                  loading="eager"
                />
              )}
              <span className="inline-flex items-center">
                {currentWorkspace.name}
              </span>
              <ChevronsUpDown className="h-5 w-5" />
            </button>

            {isWorkspaceDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link
                    href="/dashboard"
                    className={cn(
                      "block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left",
                      !pathname.includes("/teams/") && "bg-gray-100"
                    )}
                    role="menuitem"
                    onClick={() => setIsWorkspaceDropdownOpen(false)}
                  >
                    Personal Account
                  </Link>
                  {orgsLoaded &&
                    userMemberships?.data?.map((membership) => (
                      <Link
                        key={membership.organization.id}
                        href={`/dashboard/teams/${membership.organization.id}`}
                        className={cn(
                          "block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left",
                          pathname.includes(
                            `/teams/${membership.organization.id}`
                          ) && "bg-gray-100"
                        )}
                        role="menuitem"
                        onClick={() => setIsWorkspaceDropdownOpen(false)}
                      >
                        {membership.organization.name}
                      </Link>
                    ))}
                  <div className="border-t border-gray-200"></div>
                  <DialogTrigger
                    className="block w-full px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-left -mt-[1px]"
                    role="menuitem"
                  >
                    + Create Team
                  </DialogTrigger>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
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

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
}
