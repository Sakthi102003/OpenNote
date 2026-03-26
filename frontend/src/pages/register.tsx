import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useToast } from '../components/providers/ToastProvider';
import api from '../lib/api';
import { Loader, FileText } from 'lucide-react';

export default function RegisterPage() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation with toast feedback
    if (!name.trim()) {
      const msg = 'Please enter your name';
      setError(msg);
      addToast(msg, 'error');
      return;
    }
    
    if (!email.trim()) {
      const msg = 'Please enter your email';
      setError(msg);
      addToast(msg, 'error');
      return;
    }
    
    if (password.length < 8) {
      const msg = 'Password must be at least 8 characters long';
      setError(msg);
      addToast(msg, 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('/auth/register', { email, password, name });
      addToast('Account created successfully! Please log in.', 'success');
      navigate('/login', { state: { email } });
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMsg = 'Registration failed. Please try again.';
      
      if (err.response?.status === 400) {
        errorMsg = 'Email already registered. Please login instead.';
      } else if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.message === 'Network Error') {
        errorMsg = 'Unable to connect to server. Please check if the backend is running.';
      }
      
      setError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12 sm:px-6 lg:px-8 font-sans selection:bg-amber-200">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link to="/" className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded bg-amber-400 flex items-center justify-center shadow-sm border border-amber-500 hover:bg-amber-500 transition-colors">
              <FileText className="w-6 h-6 text-stone-900" />
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-stone-900">Create your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="relative block w-full rounded-t-md border-0 py-2.5 text-stone-900 ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 pl-3 bg-white font-medium"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full border-0 py-2.5 text-stone-900 ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 pl-3 bg-white font-medium"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-b-md border-0 py-2.5 text-stone-900 ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 pl-3 bg-white font-medium"
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-100 font-semibold">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={isLoading || !email || !password || !name}
              className="group relative flex w-full justify-center rounded-md bg-amber-400 px-3 py-2.5 text-sm font-bold text-stone-900 hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-amber-500 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin text-stone-900" />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
          <div className="text-center">
            <Link to="/login" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
