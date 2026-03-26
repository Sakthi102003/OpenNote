import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from '../components/editor/NoteEditor';
import api from '../lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { Globe, Copy, Check, Share2, GitFork } from 'lucide-react';

interface NoteData {
    id: string;
    title: string;
    content: string | null;
    updated_at: string;
    is_public: boolean;
    share_slug: string | null;
}

export default function NotePage() {
  const { id } = useParams<{ id: string }>();
  // Local state for immediate UI feedback
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [lastSavedContent, setLastSavedContent] = useState<string>('');
  const [lastSavedTitle, setLastSavedTitle] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...' | 'Error'>('Saved');
  const [isPublic, setIsPublic] = useState(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch Note
  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const { data } = await api.get<NoteData>(`/notes/${id}`);
      return data;
    },
    enabled: !!id,
  });

  // Initial load effect - only runs when ID changes or first load
  useEffect(() => {
    if (note) {
        setTitle(note.title || 'Untitled');
        setContent(note.content || '');
        setLastSavedTitle(note.title || 'Untitled');
        setLastSavedContent(note.content || '');
        setIsPublic(note.is_public || false);
        setShareSlug(note.share_slug || null);
    }
  }, [note?.id, note?.title, note?.content, note?.is_public, note?.share_slug]);

  // Mutation for saving
  const updateNote = useMutation({
    mutationFn: async (vars: { title: string, content: string }) => {
      await api.put(`/notes/${id}`, vars);
      return vars;
    },
    onMutate: () => {
        setSaveStatus('Saving...');
    },
    onSuccess: (vars) => {
        setSaveStatus('Saved');
        setLastSavedTitle(vars.title);
        setLastSavedContent(vars.content);
    },
    onError: () => {
        setSaveStatus('Error');
    }
  });

  // Mutation for toggling public status
  const togglePublic = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<NoteData>(`/notes/${id}/toggle-public`);
      return data;
    },
    onSuccess: (data) => {
        setIsPublic(data.is_public);
        setShareSlug(data.share_slug);
    }
  });

  // Mutation for forking a note
  const forkNote = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<NoteData>(`/notes/${id}/fork`);
      return data;
    },
    onSuccess: () => {
        alert('Note forked successfully!');
    },
    onError: () => {
        alert('Failed to fork note');
    }
  });

  const copyShareLink = () => {
    if (shareSlug) {
      const link = `${window.location.origin}/public/${shareSlug}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const debouncedContent = useDebounce(content, 1000);
  const debouncedTitle = useDebounce(title, 1000);

  // Auto-save logic
  useEffect(() => {
      if (!note) return;
      
      const hasTitleChanged = debouncedTitle !== lastSavedTitle;
      const hasContentChanged = debouncedContent !== lastSavedContent;

      if (hasTitleChanged || hasContentChanged) {
          updateNote.mutate({ 
            title: debouncedTitle, 
            content: debouncedContent 
          });
      }
  }, [debouncedTitle, debouncedContent, lastSavedTitle, lastSavedContent, note]);

  if (isLoading) {
      return <div className="p-8 text-gray-400">Loading note...</div>;
  }

  if (!note && !isLoading) {
      return <div className="p-8 text-gray-400">Note not found. Select a note from the sidebar.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white max-w-4xl mx-auto w-full relative">
        <div className="pt-8 px-8 pb-4 flex justify-between items-center bg-white z-10 sticky top-0 border-b border-gray-200">
            <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="text-4xl font-bold outline-none placeholder:text-gray-300 flex-1 bg-transparent border-none focus:ring-0 p-0" 
                placeholder="Untitled Note"
            />
            <div className="flex items-center gap-4">
                <div className={`text-xs w-24 text-right transition-colors duration-300 ${saveStatus === 'Error' ? 'text-red-500' : 'text-gray-400'}`}>
                    {saveStatus}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => togglePublic.mutate()}
                        disabled={togglePublic.isPending}
                        className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                            isPublic 
                                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={isPublic ? 'Make private' : 'Make public'}
                    >
                        <Globe className="w-4 h-4" />
                        {isPublic ? 'Public' : 'Private'}
                    </button>
                    
                    {isPublic && shareSlug && (
                        <button
                            onClick={copyShareLink}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Copy share link"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    )}

                    {isPublic && (
                        <button
                            onClick={() => forkNote.mutate()}
                            disabled={forkNote.isPending}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Fork this note to your workspace"
                        >
                            <GitFork className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-20">
             {/* Key forces remount on note switch to clear editor internal state */}
             <NoteEditor 
                key={id} 
                content={content} 
                onChange={(newContent) => setContent(newContent)} 
             />
        </div>
    </div>
  );
}
