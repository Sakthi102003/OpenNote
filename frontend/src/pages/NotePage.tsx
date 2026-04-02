import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from '../components/editor/NoteEditor';
import { useToast } from '../components/providers/ToastProvider';
import api from '../lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { Globe, Copy, Check, GitFork, Download, Upload } from 'lucide-react';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { useAuthStore } from '../store/useAuthStore';

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
  const { addToast } = useToast();
  const token = useAuthStore((state) => state.token);
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
    enabled: !!id && !!token,
    queryFn: async () => {
      const { data } = await api.get<NoteData>(`/notes/${id}`);
      return data;
    },
    retry: false,
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
  }, [note]);

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
        // Only toast on explicit save or first save to avoid noise
    },
    onError: () => {
        setSaveStatus('Error');
        addToast('Failed to save note', 'error');
    },
    retry: false,
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
        addToast(data.is_public ? 'Note is now public' : 'Note is now private', 'success');
    },
    onError: () => {
        addToast('Failed to update sharing status', 'error');
    }
  });

  // Mutation for forking a note
  const forkNote = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<NoteData>(`/notes/${id}/fork`);
      return data;
    },
    onSuccess: () => {
        addToast('Note forked successfully to your workspace!', 'success');
    },
    onError: () => {
        addToast('Failed to fork note', 'error');
    }
  });

  const copyShareLink = () => {
    if (shareSlug) {
      const link = `${window.location.origin}/public/${shareSlug}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      addToast('Share link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportMarkdown = () => {
    const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    const markdown = turndownService.turndown(content);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'Untitled'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Markdown exported successfully', 'success');
  };

  const importMarkdown = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
        const text = await file.text();
        const htmlFromMd = await marked.parse(text);
        
        const newTitle = file.name.replace('.md', '');
        setContent(htmlFromMd);
        setTitle(newTitle);
        
        updateNote.mutate({
          title: newTitle,
          content: htmlFromMd
        });
        
        addToast('Markdown imported successfully', 'success');
    } catch (error) {
        console.error("Error importing formatting", error);
        addToast('Failed to parse markdown', 'error');
    } finally {
        e.target.value = ''; // reset file input
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
      return <div className="p-8 text-stone-400 dark:text-slate-500 font-medium">Loading note...</div>;
  }

  if (!note && !isLoading) {
      return <div className="p-8 text-stone-400 dark:text-slate-500 font-medium">Note not found. Select a note from the sidebar.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#fcfbf9] dark:bg-slate-900 max-w-4xl mx-auto w-full relative selection:bg-amber-200 dark:selection:bg-slate-700 font-sans transition-colors">
        <div className="pt-8 px-8 pb-4 flex justify-between items-center bg-[#fcfbf9] dark:bg-slate-900 z-10 sticky top-0 border-b-2 border-stone-100 dark:border-slate-800 transition-colors">
            <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="text-4xl font-extrabold tracking-tight outline-none placeholder:text-stone-300 dark:placeholder:text-slate-600 text-stone-900 dark:text-white flex-1 bg-transparent border-none focus:ring-0 p-0" 
                placeholder="Untitled Note"
            />
            <div className="flex items-center gap-4">
                <div className={`text-xs w-24 text-right font-medium transition-colors duration-300 flex-shrink-0 ${saveStatus === 'Error' ? 'text-red-600 dark:text-red-400' : 'text-stone-400 dark:text-slate-500'}`}>
                    {saveStatus}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportMarkdown}
                        className="p-2 rounded-md bg-white dark:bg-slate-800 text-stone-600 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 shadow-sm transition-colors"
                        title="Export Markdown"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => document.getElementById('md-upload')?.click()}
                        className="p-2 rounded-md bg-white dark:bg-slate-800 text-stone-600 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 shadow-sm transition-colors relative"
                        title="Import Markdown"
                    >
                        <Upload className="w-4 h-4" />
                        <input type="file" id="md-upload" className="opacity-0 absolute inset-0 w-0 h-0" accept=".md" onChange={importMarkdown} />
                    </button>
                    
                    <div className="w-px h-6 bg-stone-200 dark:bg-slate-700 mx-1"></div>

                    <button
                        onClick={() => togglePublic.mutate()}
                        disabled={togglePublic.isPending}
                        className={`p-2 rounded-md flex items-center gap-2 text-sm font-bold transition-colors shadow-sm border ${
                            isPublic 
                                ? 'bg-amber-300 dark:bg-amber-500 text-amber-900 dark:text-amber-950 hover:bg-amber-400 dark:hover:bg-amber-400 border-amber-400 dark:border-amber-500' 
                                : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-slate-700 border-stone-200 dark:border-slate-700'
                        }`}
                        title={isPublic ? 'Make private' : 'Make public'}
                    >
                        <Globe className="w-4 h-4" />
                        {isPublic ? 'Public' : 'Private'}
                    </button>
                    
                    {isPublic && shareSlug && (
                        <button
                            onClick={copyShareLink}
                            className="p-2 rounded-md bg-white dark:bg-slate-800 text-stone-600 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 shadow-sm transition-colors"
                            title="Copy share link"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    )}

                    {isPublic && (
                        <button
                            onClick={() => forkNote.mutate()}
                            disabled={forkNote.isPending}
                            className="p-2 rounded-md bg-white dark:bg-slate-800 text-stone-600 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 shadow-sm transition-colors"
                            title="Fork this note to your workspace"
                        >
                            <GitFork className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-20 mt-4">
             {/* Key forces remount on note switch to clear editor internal state */}
             <div className="prose prose-stone dark:prose-invert max-w-none px-4">
               <NoteEditor 
                  key={id} 
                  content={content} 
                  onChange={(newContent) => setContent(newContent)} 
               />
             </div>
        </div>
    </div>
  );
}
