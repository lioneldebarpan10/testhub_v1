import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, User, Menu, X, Shield } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors text-sm ${
      isActive
        ? "text-white font-medium"
        : "text-gray-400 hover:text-white"
    }`;

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-blue-400 transition"
        >
          TestHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/sheets" className={navLinkClass}>
                Sheets
              </NavLink>

              <NavLink to="/problems" className={navLinkClass}>
                Problems
              </NavLink>

              <NavLink to="/courses" className={navLinkClass}>
                Courses
              </NavLink>

              <NavLink to="/bookmarks" className={navLinkClass}>
                Bookmarks
              </NavLink>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-800 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm text-white">
                  {user.name}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-800 bg-gray-900 shadow-lg">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition rounded-t-lg"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition border-t border-gray-800"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4 text-yellow-400" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 transition rounded-b-lg border-t border-gray-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline rounded-lg px-4 py-2 text-gray-300 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-white px-4 py-2 font-medium text-black transition hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-800 bg-gray-900 px-6 py-4 md:hidden space-y-3">
          <Link
            to="/"
            className="block py-2 text-gray-300 hover:text-white transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/sheets"
                className="block py-2 text-gray-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sheets
              </Link>

              <Link
                to="/problems"
                className="block py-2 text-gray-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Problems
              </Link>

              <Link
                to="/courses"
                className="block py-2 text-gray-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>

              <Link
                to="/bookmarks"
                className="block py-2 text-gray-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bookmarks
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="block py-2 text-yellow-400 hover:text-yellow-300 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="block py-2 text-gray-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;