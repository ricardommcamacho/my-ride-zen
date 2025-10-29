import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useFuelRecords } from "@/hooks/useFuelRecords";
import { useVehicles } from "@/hooks/useVehicles";
import { toast } from "sonner";

interface AddFuelModalProps {
  open: boolean;
  onClose: () => void;
  vehicleId?: string;
}

const AddFuelModal = ({ open, onClose, vehicleId }: AddFuelModalProps) => {
  const { vehicles } = useVehicles();
  const { addFuelRecord } = useFuelRecords();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: vehicleId || "",
    fuel_date: new Date(),
    fuel_type: "gasoline",
    quantity: "",
    cost: "",
    price_per_unit: "",
    odometer: "",
    station_name: "",
    location: "",
    is_full_tank: true,
    notes: "",
  });

  const handleQuantityChange = (quantity: string) => {
    setFormData((prev) => {
      const newData = { ...prev, quantity };
      if (newData.price_per_unit) {
        newData.cost = (Number(quantity) * Number(newData.price_per_unit)).toFixed(2);
      }
      return newData;
    });
  };

  const handlePricePerUnitChange = (price_per_unit: string) => {
    setFormData((prev) => {
      const newData = { ...prev, price_per_unit };
      if (newData.quantity) {
        newData.cost = (Number(newData.quantity) * Number(price_per_unit)).toFixed(2);
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicle_id) {
      toast.error("Por favor selecione um veículo");
      return;
    }

    setLoading(true);
    try {
      await addFuelRecord({
        vehicle_id: formData.vehicle_id,
        fuel_date: format(formData.fuel_date, "yyyy-MM-dd"),
        fuel_type: formData.fuel_type,
        quantity: Number(formData.quantity),
        cost: Number(formData.cost),
        price_per_unit: Number(formData.price_per_unit),
        odometer: Number(formData.odometer),
        station_name: formData.station_name || null,
        location: formData.location || null,
        is_full_tank: formData.is_full_tank,
        notes: formData.notes || null,
      });

      toast.success("Registo de combustível adicionado com sucesso");
      onClose();
      setFormData({
        vehicle_id: vehicleId || "",
        fuel_date: new Date(),
        fuel_type: "gasoline",
        quantity: "",
        cost: "",
        price_per_unit: "",
        odometer: "",
        station_name: "",
        location: "",
        is_full_tank: true,
        notes: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add fuel record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Registo de Combustível</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Veículo *</Label>
            <Select
              value={formData.vehicle_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicle_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} ({vehicle.plate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.fuel_date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.fuel_date}
                  onSelect={(date) => date && setFormData((prev) => ({ ...prev, fuel_date: date }))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade (L) *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="45.50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_unit">Preço/L (€) *</Label>
              <Input
                id="price_per_unit"
                type="number"
                step="0.001"
                value={formData.price_per_unit}
                onChange={(e) => handlePricePerUnitChange(e.target.value)}
                placeholder="1.659"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Custo Total (€) *</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData((prev) => ({ ...prev, cost: e.target.value }))}
              placeholder="75.48"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="odometer">Quilómetros (km) *</Label>
            <Input
              id="odometer"
              type="number"
              value={formData.odometer}
              onChange={(e) => setFormData((prev) => ({ ...prev, odometer: e.target.value }))}
              placeholder="45230"
              required
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="is_full_tank" className="cursor-pointer">
              Depósito Cheio
            </Label>
            <Switch
              id="is_full_tank"
              checked={formData.is_full_tank}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_full_tank: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="station_name">Nome da Estação</Label>
            <Input
              id="station_name"
              value={formData.station_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, station_name: e.target.value }))}
              placeholder="ex.: BP, Shell"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Cidade ou morada"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas adicionais..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "A adicionar..." : "Adicionar Registo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFuelModal;
