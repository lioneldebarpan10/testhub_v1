import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6">
      <div className="text-center animate-fade-in">
        {/* Giant 404 */}
        <p className="text-[10rem] font-black leading-none text-gray-800 select-none sm:text-[14rem]">
          404
        </p>

        {/* Icon */}
        <div className="mx-auto mb-6 -mt-6 flex h-16 w-16 items-center justify-center rounded-full border border-gray-800 bg-gray-900">
          <Search className="h-7 w-7 text-gray-400" />
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-gray-400">
          The page you're looking for doesn't exist or has been moved.
          Head back home and continue your DSA journey.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            to="/sheets"
            className="rounded-xl border border-gray-700 px-6 py-3 font-semibold text-white transition hover:border-gray-500 hover:bg-gray-900"
          >
            Browse Sheets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;