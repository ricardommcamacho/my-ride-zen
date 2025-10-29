import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useDocuments } from "@/hooks/useDocuments";
import { useVehicles } from "@/hooks/useVehicles";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Document = Tables<"documents"> & {
  vehicles: { brand: string; model: string } | null;
};

interface EditDocumentModalProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
}

const documentTypes = [
  "insurance",
  "registration",
  "inspection",
  "warranty",
  "invoice",
  "other",
] as const;

const EditDocumentModal = ({ document, open, onClose }: EditDocumentModalProps) => {
  const { vehicles } = useVehicles();
  const { updateDocument } = useDocuments();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "other" as typeof documentTypes[number],
    vehicle_id: "",
    expiry_date: undefined as Date | undefined,
    notes: "",
    reminder_days_before: 30,
  });

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        type: document.type as typeof documentTypes[number],
        vehicle_id: document.vehicle_id,
        expiry_date: document.expiry_date ? parseISO(document.expiry_date) : undefined,
        notes: document.notes || "",
        reminder_days_before: document.reminder_days_before || 30,
      });
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document) return;

    setLoading(true);
    try {
      await updateDocument({
        id: document.id,
        data: {
          title: formData.title,
          type: formData.type,
          vehicle_id: formData.vehicle_id,
          expiry_date: formData.expiry_date?.toISOString().split("T")[0] || null,
          notes: formData.notes || null,
          reminder_days_before: formData.reminder_days_before,
        },
      });
      
      toast.success("Documento atualizado com sucesso");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update document");
    } finally {
      setLoading(false);
    }
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Documento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="ex.: Certificado de Seguro 2024"
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: typeof documentTypes[number]) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insurance">Seguro</SelectItem>
                <SelectItem value="registration">Registo</SelectItem>
                <SelectItem value="inspection">Inspeção</SelectItem>
                <SelectItem value="warranty">Garantia</SelectItem>
                <SelectItem value="invoice">Fatura</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle */}
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

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>Data de Validade (Opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expiry_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiry_date ? (
                    format(formData.expiry_date, "PPP")
                  ) : (
                    <span>Escolher data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expiry_date}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, expiry_date: date }))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas adicionais..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "A guardar..." : "Guardar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentModal;
