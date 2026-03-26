import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../components/providers/ToastProvider';
import api from '../lib/api';
import { Loader, FileText } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Use URLSearchParams for proper form-urlencoded data
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      const response = await api.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const { access_token } = response.data;
      
      if (!access_token) {
        const msg = 'No token received from server';
        setError(msg);
        addToast(msg, 'error');
        setIsLoading(false);
        return;
      }
      
      // Create a temporary axios instance for this request without the automatic interceptor
      // since the token isn't in the store yet
      const tempAuth = { Authorization: `Bearer ${access_token}` };
      
      // Fetch user details with the new token
      const userResponse = await api.get('/auth/me', {
        headers: tempAuth
      });
      
      // Store authentication data - this will update the store
      const userData = userResponse.data;
      login(access_token, userData);
      
      // Show success toast and navigate after storing auth data
      addToast(`Welcome back, ${userData.email}!`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMsg = 'Login failed. Please try again.';
      
      if (err.response?.status === 401) {
        errorMsg = 'Invalid email or password';
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
    <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 font-sans selection:bg-amber-200 dark:selection:bg-slate-700 transition-colors">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link to="/" className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded bg-amber-400 dark:bg-amber-500 flex items-center justify-center shadow-sm border border-amber-500 dark:border-amber-600 hover:bg-amber-500 dark:hover:bg-amber-400 transition-colors">
              <FileText className="w-6 h-6 text-stone-900 dark:text-amber-950" />
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-2.5 text-stone-900 dark:text-white ring-1 ring-inset ring-stone-300 dark:ring-slate-700 placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-amber-500 dark:focus:ring-amber-400 sm:text-sm sm:leading-6 pl-3 bg-white dark:bg-slate-800 font-medium transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-2.5 text-stone-900 dark:text-white ring-1 ring-inset ring-stone-300 dark:ring-slate-700 placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-amber-500 dark:focus:ring-amber-400 sm:text-sm sm:leading-6 pl-3 bg-white dark:bg-slate-800 font-medium transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/30 p-3 rounded-md border border-red-100 dark:border-red-800 font-semibold">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="group relative flex w-full justify-center rounded-md bg-amber-400 dark:bg-amber-500 px-3 py-2.5 text-sm font-bold text-stone-900 dark:text-amber-950 hover:bg-amber-500 dark:hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-amber-500 dark:border-amber-600 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin text-stone-900 dark:text-amber-950" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          <div className="text-center">
            <Link to="/register" className="font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
