import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotes } from '../../hooks/useNotes';
import { Plus, Home, FileText, Trash2, LogOut, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { notes, isLoading, error, createNote, deleteNote } = useNotes();
  const [showError, setShowError] = useState(true);
  const navigate = useNavigate();

  const handleCreateNote = async () => {
    createNote.mutate('Untitled Note', {
      onSuccess: (newNote) => {
        navigate(`/notes/${newNote.id}`);
      },
      onError: () => {
        setShowError(true);
      }
    });
  };

  const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
        deleteNote.mutate(id, {
          onError: () => {
            setShowError(true);
          }
        });
        if (window.location.pathname.includes(id)) {
            navigate('/dashboard');
        }
    }
  }

  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-gray-200">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
          {user?.name?.[0] || user?.email?.[0] || 'U'}
        </div>
        <span className="font-medium truncate text-sm">{user?.name || user?.email}</span>
      </div>

      {error && showError && (
        <div className="mx-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-red-700">{typeof error === 'string' ? error : 'An error occurred'}</p>
            <button
              onClick={() => setShowError(false)}
              className="text-xs text-red-600 hover:text-red-700 mt-1 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100",
            isActive && "bg-gray-200 text-gray-900"
          )}
        >
          <Home className="w-4 h-4" />
          Dashboard
        </NavLink>
        
        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between items-center group">
           <span>Your Notes</span>
           <button onClick={handleCreateNote} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-600 transition-opacity" title="New Note">
             <Plus className="w-3 h-3" />
           </button>
        </div>

        {isLoading ? (
          <div className="px-3 py-2 text-sm text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-0.5">
            {notes?.map((note) => (
              <NavLink
                to={`/notes/${note.id}`}
                key={note.id}
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 group relative",
                  isActive && "bg-gray-200 text-gray-900"
                )}
              >
                <FileText className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                <span className="truncate">{note.title || 'Untitled'}</span>
                
                <button 
                    onClick={(e) => handleDeleteNote(e, note.id)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded text-gray-500"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
              </NavLink>
            ))}
            {notes?.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-400 italic">No notes created yet.</div>
            )}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
