import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type MaintenanceLog = Tables<'maintenance_logs'>;
type MaintenanceInsert = TablesInsert<'maintenance_logs'>;
type MaintenanceUpdate = TablesUpdate<'maintenance_logs'>;

export const useMaintenance = (vehicleId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: maintenanceLogs = [], isLoading } = useQuery({
    queryKey: ['maintenance', vehicleId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('maintenance_logs')
        .select('*, vehicles(brand, model)')
        .order('service_date', { ascending: false });

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (MaintenanceLog & { vehicles: { brand: string; model: string } })[];
    },
    enabled: !!user,
  });

  const addMaintenance = useMutation({
    mutationFn: async (data: MaintenanceInsert) => {
      const { data: log, error } = await supabase
        .from('maintenance_logs')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return log;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Registo de manutenção adicionado');
    },
  });

  const updateMaintenance = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MaintenanceUpdate }) => {
      const { error } = await supabase
        .from('maintenance_logs')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Registo de manutenção atualizado');
    },
  });

  const deleteMaintenance = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('maintenance_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Registo de manutenção eliminado');
    },
  });

  return {
    maintenanceLogs,
    loading: isLoading,
    addMaintenance: addMaintenance.mutateAsync,
    updateMaintenance: updateMaintenance.mutateAsync,
    deleteMaintenance: deleteMaintenance.mutateAsync,
  };
};
