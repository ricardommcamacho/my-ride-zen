import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicles } from '@/hooks/useVehicles';
import { toast } from 'sonner';
import { z } from 'zod';
import { t } from '@/lib/localization';

const vehicleSchema = z.object({
  brand: z.string().min(2, 'Brand is required').max(50),
  model: z.string().min(1, 'Model is required').max(50),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  plate: z.string().min(2, 'Plate is required').max(20),
  type: z.enum(['car', 'motorcycle', 'electric']),
  fuel_type: z.enum(['gasoline', 'diesel', 'electric', 'hybrid', 'lpg']),
});

interface AddVehicleModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddVehicleModal = ({ open, onClose }: AddVehicleModalProps) => {
  const { addVehicle, vehicles } = useVehicles();
  const [loading, setLoading] = useState(false);
  
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [plate, setPlate] = useState('');
  const [type, setType] = useState<'car' | 'motorcycle' | 'electric'>('car');
  const [fuelType, setFuelType] = useState<'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg'>('gasoline');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = vehicleSchema.parse({
        brand: brand.trim(),
        model: model.trim(),
        year,
        plate: plate.trim().toUpperCase(),
        type,
        fuel_type: fuelType,
      });

      setLoading(true);

      await addVehicle({
        brand: validated.brand,
        model: validated.model,
        year: validated.year,
        plate: validated.plate,
        type: validated.type,
        fuel_type: validated.fuel_type,
        is_primary: vehicles.length === 0,
        current_km: 0,
      });

      onClose();
      setBrand('');
      setModel('');
      setYear(new Date().getFullYear());
      setPlate('');
      setType('car');
      setFuelType('gasoline');
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addVehicleModal.title')}</DialogTitle>
          <DialogDescription>
            {t('addVehicleModal.subtitle')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">{t('addVehicleModal.brand')} *</Label>
            <Input
              id="brand"
              placeholder={t('addVehicleModal.brandPlaceholder')}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">{t('addVehicleModal.model')} *</Label>
            <Input
              id="model"
              placeholder={t('addVehicleModal.modelPlaceholder')}
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">{t('addVehicleModal.year')} *</Label>
              <Input
                id="year"
                type="number"
                min={1900}
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate">{t('addVehicleModal.plate')} *</Label>
              <Input
                id="plate"
                placeholder={t('addVehicleModal.platePlaceholder')}
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">{t('addVehicleModal.type')} *</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">{t('addVehicleModal.car')}</SelectItem>
                <SelectItem value="motorcycle">{t('addVehicleModal.motorcycle')}</SelectItem>
                <SelectItem value="electric">{t('addVehicleModal.electric')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuel_type">{t('addVehicleModal.fuelType')} *</Label>
            <Select value={fuelType} onValueChange={(value: any) => setFuelType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">{t('addVehicleModal.gasoline')}</SelectItem>
                <SelectItem value="diesel">{t('addVehicleModal.diesel')}</SelectItem>
                <SelectItem value="electric">{t('addVehicleModal.electric')}</SelectItem>
                <SelectItem value="hybrid">{t('addVehicleModal.hybrid')}</SelectItem>
                <SelectItem value="lpg">{t('addVehicleModal.lpg')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t('addVehicleModal.cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? t('addVehicleModal.adding') : t('addVehicleModal.addVehicle')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
