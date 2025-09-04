import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function Layout() {
  const { logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-500">
      {/* Navbar */}
      <nav className="bg-black shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-50">Keelo</h1>
          {/* Hamburger Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Links */}
        <div
          className={`mt-2 md:mt-0 flex flex-col md:flex-row md:items-center gap-5 ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <Link
            to="/dashboard"
            className="text-gray-50 hover:text-blue-500 transition"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/meal-plans"
            className="text-gray-50 hover:text-blue-500 transition"
            onClick={() => setMenuOpen(false)}
          >
            Meal Plans
          </Link>
          <Link
            to="/recipes"
            className="text-gray-50 hover:text-blue-500 transition"
            onClick={() => setMenuOpen(false)}
          >
            Recipes
          </Link>
          <Link
            to="/pantry"
            className="text-gray-50 hover:text-blue-500 transition"
            onClick={() => setMenuOpen(false)}
          >
            Pantry
          </Link>
          <Link
            to="/profile"
            className="text-gray-50 hover:text-blue-500 transition"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
