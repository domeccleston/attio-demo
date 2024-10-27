import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function CustomSignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full flex justify-center",
              card: "shadow-none",
              socialButtonsBlockButton:
                "w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50",
              footer: "hidden",
            },
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
        />

        <p className="mt-2 max-w-md text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
