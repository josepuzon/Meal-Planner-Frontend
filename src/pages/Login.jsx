import { useForm } from "react-hook-form";
import useAuthStore from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { register, handleSubmit } = useForm();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      navigate("/dashboard");
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input type="email" {...register("email")} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register("password")} required />
        </div>
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
