import { useForm } from "react-hook-form";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function Register() {
  const { register, handleSubmit } = useForm();
  const signup = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const payload = {
      registration: {
        user: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          password_confirmation: data.passwordConfirmation,
          role: data.role || "user",
        },
      },
    };

    const result = await signup(payload);
    if (result.success) {
      navigate("/dashboard");
    } else {
      alert(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Create an Account
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="space-y-5"
        >
          <div>
            <label className="block text-gray-300 mb-1">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          <div>
            <label className="block text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("passwordConfirmation")}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Role</label>
            <select
              {...register("role")}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign up
          </button>
        </form>

        {/* Navigate to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-blue-400 hover:text-blue-500 font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
