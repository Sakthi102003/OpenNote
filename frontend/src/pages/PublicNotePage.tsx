import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/providers/ToastProvider';
import api from '../lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GitFork, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface NoteData {
    id: string;
    title: string;
    content: string | null;
    created_at: string;
    updated_at: string;
}

export default function PublicNotePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const token = useAuthStore(state => state.token);
  const { addToast } = useToast();

  // Fetch public note
  const { data: note, isLoading } = useQuery({
    queryKey: ['public-note', slug],
    queryFn: async () => {
      const { data } = await api.get<NoteData>(`/notes/public/${slug}`);
      return data;
    },
    enabled: !!slug,
  });

  // Mutation for forking a note
  const forkNote = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<NoteData>(`/notes/${note?.id}/fork`);
      return data;
    },
    onSuccess: (data) => {
        addToast('Note forked successfully!', 'success');
        if (token) {
            navigate(`/notes/${data.id}`);
        }
    },
    onError: () => {
        addToast('Failed to fork note', 'error');
    }
  });

  if (isLoading) {
      return <div className="p-8 text-gray-400">Loading note...</div>;
  }

  if (!note) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Note not found</h2>
            <p className="text-gray-600 mb-6">This public note doesn't exist or has been removed.</p>
            <button
                onClick={() => navigate('/')}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
                Back to home
            </button>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-8 py-4 flex justify-between items-center">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                
                {token && (
                    <button
                        onClick={() => forkNote.mutate()}
                        disabled={forkNote.isPending}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        <GitFork className="w-4 h-4" />
                        Use This Note
                    </button>
                )}
                
                {!token && (
                    <p className="text-sm text-gray-600">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Sign in
                        </button>
                        {' '}to use this note
                    </p>
                )}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-8 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">{note.title}</h1>
                
                <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: note.content || '' }} />
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
                    <p>Last updated: {new Date(note.updated_at).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    </div>
  );
}
