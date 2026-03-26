import { FileText, Sparkles, Share2 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="mb-8">
        <FileText className="w-20 h-20 opacity-10 mx-auto mb-6" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to OpenNotes</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        A lightweight, Notion-inspired note-taking app for simplicity and fast note creation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl w-full">
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="text-indigo-600 mb-2">
            <FileText className="w-6 h-6 mx-auto" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Create Notes</h3>
          <p className="text-xs text-gray-600">Click the + button in the sidebar</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <div className="text-purple-600 mb-2">
            <Sparkles className="w-6 h-6 mx-auto" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Auto-Save</h3>
          <p className="text-xs text-gray-600">Your notes sync in real-time</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-blue-600 mb-2">
            <Share2 className="w-6 h-6 mx-auto" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Share & Fork</h3>
          <p className="text-xs text-gray-600">Make notes public or fork others'</p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Get started by creating a new note or viewing your existing notes
      </p>
    </div>
  );
}
