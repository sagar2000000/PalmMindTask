import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AuthPage() {
  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const res = await login(username, password);
      if (res.success) {
        toast.success("Logged in successfully!");
        if (res.user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/chat");
        }
      } else {
        toast.error(res.message);
      }
    } else {
      const res = await register(username, password);
      if (res.success) {
        toast.success("Registered successfully!");
        if (res.user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/chat");
        }
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1F4B]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#24285B] text-white p-8 rounded-2xl shadow-xl w-80 font-sans"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        <input
          type="text"
          placeholder="Username"
          className="mb-4 w-full p-3 rounded-lg bg-[#1E1F4B] border border-gray-500 placeholder-gray-300 text-white focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full p-3 rounded-lg bg-[#1E1F4B] border border-gray-500 placeholder-gray-300 text-white focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-[#FF5E78] hover:bg-[#e14e66] text-white font-semibold px-4 py-2 rounded-lg w-full transition">
          {isLogin ? "Login" : "Register"}
        </button>
        <p className="text-sm text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#FF5E78] underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;
