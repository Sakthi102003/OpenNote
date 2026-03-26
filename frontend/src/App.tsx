import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LandingPage from './pages/index';
// Assuming backend runs on localhost:8000
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import NotePage from './pages/NotePage';
import DashboardPage from './pages/dashboard';
import Layout from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';

// Protected Route Component
const ProtectedRoute = () => {
  return <Layout />;
};

function App() {
  const login = useAuthStore(state => state.login);

  useEffect(() => {
    login("dummy-token", {
      id: "test-user-id",
      email: "test@example.com",
      name: "Test User"
    });
  }, [login]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notes/:id" element={<NotePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
