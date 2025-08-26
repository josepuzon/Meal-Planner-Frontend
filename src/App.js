import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MealPlans from "./pages/MealPlans";
import Recipes from "./pages/Recipes";
import Pantry from "./pages/Pantry";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meal-plans" element={<MealPlans />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/pantry" element={<Pantry />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
