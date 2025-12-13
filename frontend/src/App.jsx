import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginScreen from './screens/login/login';
import Home from './screens/home/Home';
import RequestsScreen from './screens/requests/requests';
import ComplaintsScreen from './screens/complaints/complaints';
import TechnicianHome from './screens/technician/technician_home';
import AdminComplaints from './screens/admin/admin_complaints';
import AdminHome from './screens/admin/admin_home';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 20 }}>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestsScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician-home"
            element={
              <ProtectedRoute>
                <TechnicianHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-home"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-complaints"
            element={
              <ProtectedRoute>
                <AdminComplaints />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;