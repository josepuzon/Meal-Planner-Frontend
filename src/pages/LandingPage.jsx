import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-black">
        <h1 className="text-xl md:text-2xl font-bold text-gray-50">Keelo</h1>
        <nav className="flex gap-6">
          <Link
            to="/login"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center flex-grow px-6 py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Eat Smarter. <br /> Plan Better. Live Healthier.
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl">
          Keelo helps you create personalized meal plans, track nutrition, and
          achieve your fitness goals with ease.
        </p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow"
          >
            Start Free
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16 bg-gray-800">
        <h3 className="text-2xl font-bold text-center text-gray-100 mb-10">
          Why Choose Keelo?
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-gray-900 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">
              Personalized Plans
            </h4>
            <p className="text-gray-300">
              Generate AI-powered meal plans tailored to your goals—whether
              it’s fat loss, muscle gain, or healthy living.
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">
              Nutrition Tracking
            </h4>
            <p className="text-gray-300">
              Stay on top of your daily calories and macros with automatic
              ingredient and recipe analysis.
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">
              Simple & Intuitive
            </h4>
            <p className="text-gray-300">
              A clean, easy-to-use interface that makes planning your meals
              quick and stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Keelo. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
