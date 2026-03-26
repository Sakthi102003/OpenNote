import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

  const { data: notes, isLoading, error } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data } = await api.get('/notes');
      return data;
    },
  });

  const createNote = useMutation({
    mutationFn: async (title: string = 'Untitled Note') => {
      const { data } = await api.post('/notes', { title });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return { notes, isLoading, error, createNote, deleteNote };
};
