import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../lib/api';

export interface Note {
  id: string;
  title: string;
  is_public: boolean;
  updated_at: string;
  user_id: string;
}

export const useNotes = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: notes, isLoading, error: queryError } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/notes');
        setError(null);
        return data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Failed to load notes';
        setError(errorMessage);
        throw err;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const createNote = useMutation({
    mutationFn: async (title: string = 'Untitled Note') => {
      try {
        const { data } = await api.post('/notes', { title });
        setError(null);
        return data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Failed to create note';
        setError(errorMessage);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.detail || 'Failed to create note';
      setError(errorMessage);
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.delete(`/notes/${id}`);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Failed to delete note';
        setError(errorMessage);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.detail || 'Failed to delete note';
      setError(errorMessage);
    },
  });

  return { notes, isLoading, error: error || queryError, createNote, deleteNote, setError };
};
