import { FileText, Zap, Share2 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 font-sans selection:bg-amber-200 dark:selection:bg-slate-700 bg-[#fcfbf9] dark:bg-slate-900 transition-colors">
      <div className="mb-8">
        <div className="w-20 h-20 rounded bg-amber-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 border border-amber-200 dark:border-slate-700">
           <FileText className="w-10 h-10 text-amber-600 dark:text-gray-300" />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white mb-2 tracking-tight">Welcome to OpenNotes</h1>
      <p className="text-lg text-stone-600 dark:text-gray-400 mb-8 max-w-md font-medium">
        A lightweight note-taking app. Simple, fast, and ready for your ideas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl w-full">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-stone-200 dark:border-slate-700 shadow-sm transition-colors">
          <div className="w-10 h-10 rounded bg-amber-100 dark:bg-slate-700 flex items-center justify-center mb-3 mx-auto border border-amber-200 dark:border-slate-600">
            <FileText className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <h3 className="font-bold text-stone-900 dark:text-white mb-1">Create Notes</h3>
          <p className="text-xs text-stone-600 dark:text-gray-400 font-medium">Click the + button in the sidebar</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-stone-200 dark:border-slate-700 shadow-sm transition-colors">
          <div className="w-10 h-10 rounded bg-emerald-100 dark:bg-slate-700 flex items-center justify-center mb-3 mx-auto border border-emerald-200 dark:border-slate-600">
            <Zap className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h3 className="font-bold text-stone-900 dark:text-white mb-1">Auto-Save</h3>
          <p className="text-xs text-stone-600 dark:text-gray-400 font-medium">Your notes sync in real-time</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-stone-200 dark:border-slate-700 shadow-sm transition-colors">
          <div className="w-10 h-10 rounded bg-blue-100 dark:bg-slate-700 flex items-center justify-center mb-3 mx-auto border border-blue-200 dark:border-slate-600">
            <Share2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-stone-900 dark:text-white mb-1">Share & Fork</h3>
          <p className="text-xs text-stone-600 dark:text-gray-400 font-medium">Make notes public or fork others</p>
        </div>
      </div>

      <p className="text-sm text-stone-500 dark:text-slate-500 font-medium">
        Get started by creating a new note or viewing your existing notes
      </p>
    </div>
  );
}
