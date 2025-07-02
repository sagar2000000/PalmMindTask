import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserForm from "./EditUserForm";
import { useAuth } from "../../context/AuthContext";
import HeaderBar from "../../src/components/HeaderBar";

function UserList() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:9000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="min-h-screen bg-[#1E1F4B] text-white pt-16">
      {editingUser && (
        <EditUserForm
          user={editingUser}
          onDone={() => {
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
      <HeaderBar />
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <table className="w-full border border-[#24285B] shadow-lg rounded overflow-hidden">
          <thead>
            <tr className="bg-[#24285B] text-white">
              <th className="p-3 border border-[#1E1F4B] text-left">Username</th>
              <th className="p-3 border border-[#1E1F4B] text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="bg-[#1E1F4B] hover:bg-[#2c2e5e] transition">
                <td className="p-3 border border-[#24285B]">{u.username}</td>
                <td className="p-3 border border-[#24285B] space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-400 px-3 py-1 rounded text-white text-sm"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[#FF5E78] hover:bg-[#e94f67] px-3 py-1 rounded text-white text-sm"
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
