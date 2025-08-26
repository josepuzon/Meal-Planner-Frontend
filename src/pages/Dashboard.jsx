import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome back!</h1>
      <p>This is your dashboard. From here, you can manage your meals, pantry, and track progress.</p>

      <div style={{ marginTop: "20px" }}>
        <h2>Quick Actions</h2>
        <ul>
          <li><Link to="/meal-plans">View Meal Plans</Link></li>
          <li><Link to="/recipes">Explore Recipes</Link></li>
          <li><Link to="/profile">Edit Profile</Link></li>
          <li><Link to="/pantry">Manage Pantry</Link></li> {/* pantry will come later */}
        </ul>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Today’s Overview</h2>
        <p>Calories: --</p>
        <p>Proteins: --</p>
        <p>Carbs: --</p>
        <p>Fats: --</p>
      </div>
    </div>
  );
}

export default Dashboard;
