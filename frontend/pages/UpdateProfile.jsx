import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const { user, token, logout } = useAuth();
  const [username, setUsername] = useState(user.username);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:9000/api/users/${user._id}/update`,
        {
          username,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Updated successfully. Please login again.");
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1F4B]">
      <form
        onSubmit={handleUpdate}
        className="bg-[#24285B] text-white p-8 rounded-2xl shadow-xl w-96 font-sans"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
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
          placeholder="Old Password"
          className="mb-4 w-full p-3 rounded-lg bg-[#1E1F4B] border border-gray-500 placeholder-gray-300 text-white focus:outline-none"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="mb-6 w-full p-3 rounded-lg bg-[#1E1F4B] border border-gray-500 placeholder-gray-300 text-white focus:outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-[#FF5E78] hover:bg-[#e14e66] text-white font-semibold px-4 py-2 rounded-lg w-full transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
