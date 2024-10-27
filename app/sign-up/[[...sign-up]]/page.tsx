import Link from "next/link";
import { cookies } from "next/headers";

import { SignUp } from "@clerk/nextjs";

export default function CustomSignUp() {
  cookies();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "shadow-none",
                socialButtonsBlockButton:
                  "w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50",
                footer: "hidden",
              },
            }}
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
          />
        </div>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
