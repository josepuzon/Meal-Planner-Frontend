import { useForm } from "react-hook-form";
import useAuthStore from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import useFlashStore from "../store/useFlashStore";


function Login() {
  const { register, handleSubmit } = useForm();
  const login = useAuthStore((state) => state.login);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await login(data);

    if (!result.success) {
      useFlashStore.getState().setFlash({ type: "error", text: result.error });
      return;
    }

    useFlashStore.getState().setFlash({ type: "success", text: "Logged in successfully!" });

    try {
      // Fetch full profile after login
      await fetchProfile();

      // Use the updated user from the store
      const currentUser = useAuthStore.getState().user;

      const isNewUser =
        (!currentUser?.dietary_preferences || currentUser.dietary_preferences.length === 0) &&
        (!currentUser?.health_goals || currentUser.health_goals.length === 0);

      navigate(isNewUser ? "/profile" : "/dashboard");
    } catch (err) {
      console.error("Error fetching profile after login:", err);
      alert("Login succeeded, but fetching profile failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Sign in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-500 font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
