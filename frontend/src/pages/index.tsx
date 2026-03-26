import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { FileText, Zap, Share2, GitFork, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const isAuthenticated = useAuthStore(state => !!state.token);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">OpenNotes</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="ml-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-40">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/50 border border-indigo-200 mb-6 hover:bg-indigo-100 transition-colors">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <p className="text-sm font-medium text-indigo-700">Introducing OpenNotes</p>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mt-6 leading-tight">
                Write. Share.
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Reuse Ideas.</span>
              </h1>

              <p className="mt-8 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A lightning-fast note-taking app with zero distractions. Write privately, share publicly, and discover brilliant templates from the community.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-2xl transition-all hover:scale-105"
                >
                  Start Writing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:border-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Everything you need
              </h2>
              <p className="text-xl text-gray-600">Minimal. Powerful. Built for modern note-takers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors mb-4">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rich Editing</h3>
                <p className="text-gray-600">
                  Powerful formatting with slash commands. Headings, lists, code blocks, and more—all with zero friction.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Auto Save</h3>
                <p className="text-gray-600">
                  Never lose work again. Changes sync automatically as you type. Your ideas are always safe.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors mb-4">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Instantly</h3>
                <p className="text-gray-600">
                  Make notes public with one click. Share links with anyone. Control exactly what you want visible.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors mb-4">
                  <GitFork className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fork Templates</h3>
                <p className="text-gray-600">
                  Discover brilliant templates from the community. Use them as starting points for your own ideas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to simplify your note-taking?
            </h2>
            <p className="text-xl text-indigo-100 mb-10">
              Join writers who've ditched complicated tools for pure simplicity.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-6 sm:mb-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">OpenNotes</span>
              </Link>
              <p className="text-gray-600 mt-2 text-sm">Where ideas flow freely.</p>
            </div>
            <div className="text-center sm:text-right text-sm text-gray-600">
              <p>© 2025 OpenNotes. Built with simplicity in mind.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
