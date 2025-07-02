import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HeaderBar from "../../src/components/HeaderBar";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const Box = ({ title, color, onClick }) => (
    <div
      className={`flex-1 p-12 rounded-2xl shadow-lg text-white text-center cursor-pointer hover:scale-105 transition-transform ${color}`}
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1E1F4B] px-8 py-12 font-sans mt-15 ">
      <HeaderBar />

      <h1 className="text-4xl font-bold mb-12 text-center text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <Box
          title="View Users"
          color="bg-[#4F77FF]"
          onClick={() => navigate("/admin/users")}
        />
        <Box
          title="Add User"
          color="bg-[#22C55E]"
          onClick={() => navigate("/admin/register")}
        />
        <Box
          title="Change Details"
          color="bg-[#8B5CF6]"
          onClick={() => navigate("/admin/update-profile")}
        />
        <Box
          title="Live Chat"
          color="bg-[#FF5E78]"
          onClick={() => navigate("/admin/chat")}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
