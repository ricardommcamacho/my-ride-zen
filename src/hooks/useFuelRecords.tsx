import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type FuelRecord = Tables<'fuel_records'>;
type FuelInsert = TablesInsert<'fuel_records'>;
type FuelUpdate = TablesUpdate<'fuel_records'>;

export const useFuelRecords = (vehicleId?: string, startDate?: Date, endDate?: Date) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: fuelRecords = [], isLoading } = useQuery({
    queryKey: ['fuel_records', vehicleId, startDate, endDate],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('fuel_records')
        .select('*, vehicles(brand, model)')
        .order('fuel_date', { ascending: false });

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      if (startDate) {
        query = query.gte('fuel_date', startDate.toISOString().split('T')[0]);
      }

      if (endDate) {
        query = query.lte('fuel_date', endDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (FuelRecord & { vehicles: { brand: string; model: string } })[];
    },
    enabled: !!user,
  });

  const addFuelRecord = useMutation({
    mutationFn: async (data: FuelInsert) => {
      const { data: record, error } = await supabase
        .from('fuel_records')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel_records'] });
      toast.success('Registo de combustível adicionado');
    },
  });

  const updateFuelRecord = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FuelUpdate }) => {
      const { error } = await supabase
        .from('fuel_records')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel_records'] });
      toast.success('Registo de combustível atualizado');
    },
  });

  const deleteFuelRecord = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fuel_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel_records'] });
      toast.success('Registo de combustível eliminado');
    },
  });

  return {
    fuelRecords,
    loading: isLoading,
    addFuelRecord: addFuelRecord.mutateAsync,
    updateFuelRecord: updateFuelRecord.mutateAsync,
    deleteFuelRecord: deleteFuelRecord.mutateAsync,
  };
};
