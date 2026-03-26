import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function LandingPage() {
  const isAuthenticated = useAuthStore(state => !!state.token);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">OpenNotes</h1>
        <div>
          <Link to="/login" className="text-gray-600 hover:text-gray-900 mr-4">Login</Link>
          <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Write your own notes. <br className="hidden sm:inline" />
          <span className="text-indigo-600">Or reuse the best ones.</span>
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          A lightweight, Notion-inspired note-taking app focused on simplicity, fast note creation, and a unique public note reuse system.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg md:px-10">
            Start Writing
          </Link>
        </div>
      </main>
    </div>
  );
}
