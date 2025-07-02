import { Route, Routes } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Chat from '../pages/Chat';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserList from '../pages/Admin/UserList';
import AddUser from '../pages/Admin/AddUser';
import AdminRoute from './components/AdminRoute';

import UpdateProfile from '../pages/UpdateProfile';

function App() {
  const { user } = useAuth();

  return (
   
    <Routes>
      {/* Public routes */}
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/" element={<AuthPage />} />
      <Route path="/chat" element={<Chat />} />
       
      {/* Admin protected routes */}
      <Route
      
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserList />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/register"
        element={
          <AdminRoute>
            <AddUser />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/update-profile"
        element={
          <AdminRoute>
            <UpdateProfile />
          </AdminRoute>
        }
      />
      
      <Route
        path="/admin/chat"
        element={
          <AdminRoute>
            <Chat />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
