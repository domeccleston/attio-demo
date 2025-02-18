import Link from "next/link";

export function Hero() {
  return (
    <div className="pt-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-5xl md:text-6xl lg:text-8xl tracking-tight font-medium text-center mt-10 mb-6">
          <span className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-900 text-transparent bg-clip-text">
            Serverless infra for
          </span>
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 text-transparent bg-clip-text">
            {" "}
            modern ML teams
          </span>
        </h1>
        <p className="text-md md:text-lg lg:text-xl text-center text-gray-700 max-w-2xl mx-auto mb-8">
          The fastest way to deploy and scale your ML models.
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <Link
          href="/signup"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          Get started
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Talk to sales
        </Link>
      </div>
    </div>
  );
}
