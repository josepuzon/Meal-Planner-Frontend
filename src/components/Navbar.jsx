import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/meal-plans">Meal Plans</Link> |{" "}
      <Link to="/recipes">Recipes</Link> |{" "}
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

export default Navbar;
