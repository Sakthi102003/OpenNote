import { FileText, Zap, Share2 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 font-sans selection:bg-amber-200">
      <div className="mb-8">
        <div className="w-20 h-20 rounded bg-amber-100 flex items-center justify-center mx-auto mb-6 border border-amber-200">
           <FileText className="w-10 h-10 text-amber-600" />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold text-stone-900 mb-2 tracking-tight">Welcome to OpenNotes</h1>
      <p className="text-lg text-stone-600 mb-8 max-w-md font-medium">
        A lightweight note-taking app. Simple, fast, and ready for your ideas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl w-full">
        <div className="p-4 bg-white rounded-xl border-2 border-stone-200 shadow-sm">
          <div className="w-10 h-10 rounded bg-amber-100 flex items-center justify-center mb-3 mx-auto border border-amber-200">
            <FileText className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Create Notes</h3>
          <p className="text-xs text-stone-600 font-medium">Click the + button in the sidebar</p>
        </div>

        <div className="p-4 bg-white rounded-xl border-2 border-stone-200 shadow-sm">
          <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center mb-3 mx-auto border border-emerald-200">
            <Zap className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Auto-Save</h3>
          <p className="text-xs text-stone-600 font-medium">Your notes sync in real-time</p>
        </div>

        <div className="p-4 bg-white rounded-xl border-2 border-stone-200 shadow-sm">
          <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center mb-3 mx-auto border border-blue-200">
            <Share2 className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Share & Fork</h3>
          <p className="text-xs text-stone-600 font-medium">Make notes public or fork others</p>
        </div>
      </div>

      <p className="text-sm text-stone-500 font-medium">
        Get started by creating a new note or viewing your existing notes
      </p>
    </div>
  );
}
