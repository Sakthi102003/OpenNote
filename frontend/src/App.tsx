import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/index';
// Assuming backend runs on localhost:8000
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import NotePage from './pages/NotePage';
import PublicNotePage from './pages/PublicNotePage';
import DashboardPage from './pages/dashboard';
import Layout from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';
import { ToastProvider } from './components/providers/ToastProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

// Protected Route Component
const ProtectedRoute = () => {
  const token = useAuthStore(state => state.token);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/public/:slug" element={<PublicNotePage />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/notes/:id" element={<NotePage />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
