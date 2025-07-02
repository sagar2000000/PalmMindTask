import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../../src/components/HeaderBar';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error("All fields are required");

    try {
      const res = await axios.post(
        'http://localhost:9000/api/admin/register',
        { username, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || 'User created successfully!');
      setUsername('');
      setPassword('');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1F4B] pt-16">
      <HeaderBar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4 text-[#1E1F4B]">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-[#24285B]"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-[#24285B]"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#FF5E78] text-white w-full py-2 rounded hover:bg-[#e94f67] transition"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
