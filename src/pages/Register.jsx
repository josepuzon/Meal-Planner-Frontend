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
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div>
          <label>First Name:</label>
          <input type="text" {...register("firstName")} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" {...register("lastName")} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" {...register("email")} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register("password")} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            {...register("passwordConfirmation")}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select {...register("role")} required>
            <option value="">Select role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
