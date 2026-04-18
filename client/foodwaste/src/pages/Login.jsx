import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-lg w-[400px]"
      >
        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-xl"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          New user?{" "}
          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;