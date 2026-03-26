import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { FileText, Zap, Share2, GitFork, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const isAuthenticated = useAuthStore(state => !!state.token);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-['Outfit'] text-stone-900 selection:bg-amber-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200 tracking-tight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-400 flex items-center justify-center shadow-sm border border-amber-500">
              <FileText className="w-5 h-5 text-stone-900" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">OpenNotes</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link to="/login" className="text-stone-600 hover:text-stone-900 font-medium transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-amber-400 text-stone-900 rounded-md font-semibold hover:bg-amber-500 transition-colors border border-amber-500 shadow-sm"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white pt-16 pb-20 sm:pt-32 sm:pb-40 border-b border-stone-200 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-100/80 text-amber-900 font-semibold text-sm mb-6 sm:mb-8 border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Introducing OpenNotes</span>
            </div>

            <h1 className="font-['Caveat'] text-6xl sm:text-7xl lg:text-8xl font-bold text-stone-900 mb-6 leading-none tracking-normal">
              Write. Share. <br className="sm:hidden" />
              <span className="relative inline-block mt-2 sm:mt-0 px-2"><span className="relative z-10">Reuse Ideas.</span><span className="absolute bottom-2 left-0 w-full h-4 sm:h-6 bg-amber-300 -rotate-1 rounded-sm opacity-80 mix-blend-multiply"></span></span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-xl text-stone-600 mb-8 sm:mb-10 leading-relaxed font-medium px-2">
              A lightning-fast note-taking app with zero distractions. Write privately, share publicly, and discover brilliant templates from the community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-amber-400 text-stone-900 rounded-md font-bold text-lg hover:bg-amber-500 transition-colors border border-amber-500 shadow-sm"
              >
                Start Writing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border-2 border-stone-200 text-stone-700 rounded-md font-bold text-lg hover:bg-stone-50 hover:border-stone-300 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="font-['Caveat'] text-5xl sm:text-6xl font-bold text-stone-900 mb-4 tracking-normal">
                Everything you need
              </h2>
              <p className="text-base sm:text-lg text-stone-600 font-medium">Minimal. Powerful. Built for modern note-takers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* Feature 1 */}
              <div className="p-6 sm:p-8 rounded-xl bg-white border-2 border-stone-200 shadow-sm hover:border-amber-300 transition-colors">
                <div className="w-12 h-12 rounded bg-amber-100 flex items-center justify-center mb-4 sm:mb-6 border border-amber-200">
                  <FileText className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="font-['Caveat'] text-3xl font-bold text-stone-900 mb-2">Rich Editing</h3>
                <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                  Powerful formatting with slash commands. Headings, lists, code blocks, and more—all with zero friction.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 sm:p-8 rounded-xl bg-white border-2 border-stone-200 shadow-sm hover:border-amber-300 transition-colors">
                <div className="w-12 h-12 rounded bg-emerald-100 flex items-center justify-center mb-4 sm:mb-6 border border-emerald-200">
                  <Zap className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="font-['Caveat'] text-3xl font-bold text-stone-900 mb-2">Auto Save</h3>
                <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                  Never lose work again. Changes sync automatically as you type. Your ideas are always safe.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 sm:p-8 rounded-xl bg-white border-2 border-stone-200 shadow-sm hover:border-amber-300 transition-colors">
                <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center mb-4 sm:mb-6 border border-blue-200">
                  <Share2 className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="font-['Caveat'] text-3xl font-bold text-stone-900 mb-2">Share Instantly</h3>
                <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                  Make notes public with one click. Share links with anyone. Control exactly what you want visible.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 sm:p-8 rounded-xl bg-white border-2 border-stone-200 shadow-sm hover:border-amber-300 transition-colors">
                <div className="w-12 h-12 rounded bg-rose-100 flex items-center justify-center mb-4 sm:mb-6 border border-rose-200">
                  <GitFork className="w-6 h-6 text-rose-700" />
                </div>
                <h3 className="font-['Caveat'] text-3xl font-bold text-stone-900 mb-2">Fork Templates</h3>
                <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                  Discover brilliant templates from the community. Use them as starting points for your own ideas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-amber-400 border-y border-amber-500">
          <div className="max-w-3xl mx-auto text-center px-2 sm:px-0">
            <h2 className="font-['Caveat'] text-5xl sm:text-6xl font-bold text-stone-900 mb-4 tracking-normal leading-tight">
              Ready to simplify your note-taking?
            </h2>
            <p className="text-base sm:text-lg text-amber-900 mb-8 sm:mb-10 font-medium">
              Join writers who've ditched complicated tools for pure simplicity.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-stone-900 text-white rounded-md font-bold text-lg hover:bg-stone-800 transition-colors shadow-md border border-stone-900"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center border border-amber-500">
              <FileText className="w-3 h-3 text-stone-900" />
            </div>
            <span className="font-bold text-stone-900 tracking-tight">OpenNotes</span>
          </div>
          <div className="text-sm text-stone-500">
            © {new Date().getFullYear()} OpenNotes. Built with simplicity in mind.
          </div>
        </div>
      </footer>
    </div>
  );
}
