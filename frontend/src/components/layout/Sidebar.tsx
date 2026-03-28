import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotes } from '../../hooks/useNotes';
import { useToast } from '../providers/ToastProvider';
import { Plus, Home, FileText, Trash2, LogOut, Search, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { notes, isLoading, createNote, deleteNote } = useNotes();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
     setIsDarkMode(!isDarkMode);
  };

  const filteredNotes = notes?.filter(note => 
     (note.title || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = async () => {
    createNote.mutate('Untitled Note', {
      onSuccess: (newNote) => {
        addToast('Note created successfully', 'success');
        navigate(`/notes/${newNote.id}`);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.detail || 'Failed to create note';
        addToast(errorMsg, 'error');
      }
    });
  };

  const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
        deleteNote.mutate(id, {
          onSuccess: () => {
            addToast('Note deleted successfully', 'success');
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            const errorMsg = error?.response?.data?.detail || 'Failed to delete note';
            addToast(errorMsg, 'error');
          }
        });
        if (window.location.pathname.includes(id)) {
            navigate('/dashboard');
        }
    }
  }

  return (
    <div className="w-64 h-full bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-colors">
      <div className="p-4 flex items-center gap-3 border-b border-gray-200 dark:border-slate-700">
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-slate-700 flex items-center justify-center text-amber-700 dark:text-gray-300 font-bold border border-amber-200 dark:border-slate-600">
          {user?.name?.[0] || user?.email?.[0] || 'U'}
        </div>
        <span className="font-medium truncate text-sm text-gray-900 dark:text-gray-100">{user?.name || user?.email}</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800",
            isActive && "bg-amber-100 dark:bg-slate-700 text-amber-900 dark:text-white"
          )}
        >
          <Home className="w-4 h-4" />
          Dashboard
        </NavLink>
        
        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider flex justify-between items-center group">
           <span>Your Notes</span>
           <button onClick={handleCreateNote} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-gray-600 dark:text-gray-300 transition-opacity" title="New Note">
             <Plus className="w-3 h-3" />
           </button>
        </div>

        <div className="px-2 mb-2">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-sm bg-gray-100 dark:bg-slate-800/50 border-none rounded-md text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-amber-400 dark:focus:ring-slate-500 outline-none"
                />
            </div>
        </div>

        {isLoading ? (
          <div className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500">Loading...</div>
        ) : (
          <div className="space-y-0.5">
            {filteredNotes?.map((note) => (
              <NavLink
                to={`/notes/${note.id}`}
                key={note.id}
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 group relative",
                  isActive && "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white"
                )}
              >
                <FileText className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 dark:text-slate-500" />
                <span className="truncate">{note.title || 'Untitled'}</span>
                
                <button 
                    onClick={(e) => handleDeleteNote(e, note.id)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 dark:hover:bg-slate-600 rounded text-gray-500 dark:text-gray-300"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
              </NavLink>
            ))}
            {filteredNotes?.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500 italic">No notes found.</div>
            )}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-between gap-2">
        <button 
            onClick={toggleDarkMode} 
            className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
