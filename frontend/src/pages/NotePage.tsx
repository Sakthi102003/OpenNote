import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from '../components/editor/NoteEditor';
import api from '../lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';

interface NoteData {
    id: string;
    title: string;
    content: string | null;
    updated_at: string;
}

export default function NotePage() {
  const { id } = useParams<{ id: string }>();
  // Local state for immediate UI feedback
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [lastSavedContent, setLastSavedContent] = useState<string>('');
  const [lastSavedTitle, setLastSavedTitle] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...' | 'Error'>('Saved');

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
    }
  }, [note?.id, note?.title, note?.content]); 

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
        // Do NOT invalidate query here, otherwise we re-fetch and overwrite local state if user is typing fast!
    },
    onError: () => {
        setSaveStatus('Error');
    }
  });

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
        <div className="pt-8 px-8 pb-4 flex justify-between items-center bg-white z-10 sticky top-0">
            <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="text-4xl font-bold outline-none placeholder:text-gray-300 w-full bg-transparent border-none focus:ring-0 p-0" 
                placeholder="Untitled Note"
            />
            <div className={`text-xs w-24 text-right transition-colors duration-300 ${saveStatus === 'Error' ? 'text-red-500' : 'text-gray-400'}`}>
                {saveStatus}
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
