import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useVehicles } from "@/hooks/useVehicles";
import { toast } from "sonner";

interface LogServiceModalProps {
  open: boolean;
  onClose: () => void;
  vehicleId?: string;
}

const maintenanceTypes = [
  "oil_change",
  "tire_rotation",
  "brake_service",
  "battery_replacement",
  "inspection",
  "repair",
  "other",
] as const;

const LogServiceModal = ({ open, onClose, vehicleId }: LogServiceModalProps) => {
  const { vehicles } = useVehicles();
  const { addMaintenance } = useMaintenance();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: vehicleId || "",
    service_date: new Date(),
    type: "oil_change" as typeof maintenanceTypes[number],
    description: "",
    cost: "",
    odometer: "",
    service_provider: "",
    next_service_date: undefined as Date | undefined,
    next_service_km: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicle_id) {
      toast.error("Por favor selecione um veículo");
      return;
    }

    setLoading(true);
    try {
      await addMaintenance({
        vehicle_id: formData.vehicle_id,
        service_date: format(formData.service_date, "yyyy-MM-dd"),
        type: formData.type,
        description: formData.description,
        cost: formData.cost ? Number(formData.cost) : null,
        odometer: Number(formData.odometer),
        service_provider: formData.service_provider || null,
        next_service_date: formData.next_service_date
          ? format(formData.next_service_date, "yyyy-MM-dd")
          : null,
        next_service_km: formData.next_service_km ? Number(formData.next_service_km) : null,
        notes: formData.notes || null,
      });

      toast.success("Registo de manutenção adicionado com sucesso");
      onClose();
      setFormData({
        vehicle_id: vehicleId || "",
        service_date: new Date(),
        type: "oil_change",
        description: "",
        cost: "",
        odometer: "",
        service_provider: "",
        next_service_date: undefined,
        next_service_km: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add maintenance log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registar Serviço</DialogTitle>
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
            <Label>Data do Serviço *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.service_date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.service_date}
                  onSelect={(date) =>
                    date && setFormData((prev) => ({ ...prev, service_date: date }))
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: typeof maintenanceTypes[number]) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oil_change">Mudança de óleo</SelectItem>
                <SelectItem value="tire_rotation">Rotação de pneus</SelectItem>
                <SelectItem value="brake_service">Serviço de travões</SelectItem>
                <SelectItem value="battery_replacement">Substituição de bateria</SelectItem>
                <SelectItem value="inspection">Inspeção</SelectItem>
                <SelectItem value="repair">Reparação</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="ex.: Mudança de óleo e filtro do motor"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Custo (€)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData((prev) => ({ ...prev, cost: e.target.value }))}
                placeholder="85.00"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_provider">Prestador de Serviço</Label>
            <Input
              id="service_provider"
              value={formData.service_provider}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, service_provider: e.target.value }))
              }
              placeholder="ex.: AutoService Pro"
            />
          </div>

          <div className="space-y-2">
            <Label>Próxima Data de Serviço</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.next_service_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.next_service_date ? (
                    format(formData.next_service_date, "PPP")
                  ) : (
                    <span>Escolher data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.next_service_date}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, next_service_date: date }))
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_service_km">Próximo Serviço Quilómetros (km)</Label>
            <Input
              id="next_service_km"
              type="number"
              value={formData.next_service_km}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, next_service_km: e.target.value }))
              }
              placeholder="50000"
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
              {loading ? "A adicionar..." : "Adicionar Serviço"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogServiceModal;
