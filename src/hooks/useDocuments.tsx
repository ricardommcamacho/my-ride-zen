import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type Document = Tables<'documents'>;
type DocumentInsert = TablesInsert<'documents'>;
type DocumentUpdate = TablesUpdate<'documents'>;

export const useDocuments = (vehicleId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', vehicleId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('documents')
        .select('*, vehicles(brand, model)')
        .order('created_at', { ascending: false });

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (Document & { vehicles: { brand: string; model: string } })[];
    },
    enabled: !!user,
  });

  const uploadDocument = useMutation({
    mutationFn: async ({ 
      file, 
      vehicleId, 
      data 
    }: { 
      file: File; 
      vehicleId: string; 
      data: Omit<DocumentInsert, 'vehicle_id' | 'file_url' | 'file_name' | 'file_size'> 
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${user.id}/${vehicleId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-documents')
        .getPublicUrl(filePath);

      // Insert document record
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          ...data,
          vehicle_id: vehicleId,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to upload document: ' + error.message);
    },
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: DocumentUpdate }) => {
      const { error } = await supabase
        .from('documents')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document updated successfully');
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      // Get document to find file path
      const { data: doc } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', id)
        .single();

      if (doc?.file_url) {
        // Extract path from URL and delete from storage
        const path = doc.file_url.split('/').slice(-3).join('/');
        await supabase.storage.from('vehicle-documents').remove([path]);
      }

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
  });

  return {
    documents,
    loading: isLoading,
    uploadDocument: uploadDocument.mutateAsync,
    updateDocument: updateDocument.mutateAsync,
    deleteDocument: deleteDocument.mutateAsync,
  };
};
