import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function HeaderBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center bg-[#1E1F4B] p-2 border-b shadow-md fixed top-0 left-0 right-0 z-50">
      {/* Message icon goes home */}
      <button
        onClick={() => navigate("/admin")}
        className="p-1 rounded hover:bg-[#24285B] transition"
        aria-label="Go to Admin Dashboard"
        title="Admin Dashboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h6m-6 4h4m5 0a9 9 0 10-8-14.32L3 12l3 4v2a2 2 0 002 2h8z"
          />
        </svg>
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-[#FF5E78] hover:bg-[#e94f67] text-white px-4 py-1 rounded text-sm shadow-md"
      >
        Logout
      </button>
    </header>
  );
}
