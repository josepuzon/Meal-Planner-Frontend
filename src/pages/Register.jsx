import { useForm } from "react-hook-form";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function Register() {
  const { register, handleSubmit } = useForm();
  const signup = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await signup(data);
    if (result.success) {
      navigate("/dashboard");
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label>
          <input type="text" {...register("name")} required />
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
          <input type="password" {...register("passwordConfirmation")} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
