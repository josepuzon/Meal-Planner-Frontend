import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav style={{ background: "#eee", padding: "10px" }}>
        <h1>AI Meal Planner</h1>
        <div style={{ marginTop: "8px" }}>
          <Link to="/dashboard" style={{ marginRight: "10px" }}>
            Dashboard
          </Link>
          <Link to="/meal-plans" style={{ marginRight: "10px" }}>
            Meal Plans
          </Link>
          <Link to="/recipes" style={{ marginRight: "10px" }}>
            Recipes
          </Link>
          <Link to="/pantry" style={{ marginRight: "10px" }}>
            Pantry
          </Link>
          <Link to="/profile" style={{ marginRight: "10px" }}>
            Profile
          </Link>
          <Link to="/">Logout</Link>
        </div>
      </nav>

      {/* Page content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;