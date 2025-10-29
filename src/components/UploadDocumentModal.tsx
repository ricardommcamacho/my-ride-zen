import { useState } from "react";
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
import { Upload, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDocuments } from "@/hooks/useDocuments";
import { useVehicles } from "@/hooks/useVehicles";
import { toast } from "sonner";

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  vehicleId?: string;
}

const documentTypes = [
  "insurance",
  "registration",
  "inspection",
  "warranty",
  "invoice",
  "other",
] as const;

const UploadDocumentModal = ({ open, onClose, vehicleId }: UploadDocumentModalProps) => {
  const { vehicles } = useVehicles();
  const { uploadDocument } = useDocuments();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "other" as typeof documentTypes[number],
    vehicle_id: vehicleId || "",
    expiry_date: undefined as Date | undefined,
    notes: "",
    reminder_days_before: 30,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("O tamanho do ficheiro deve ser inferior a 10MB");
        return;
      }
      setFile(selectedFile);
      if (!formData.title) {
        setFormData((prev) => ({ ...prev, title: selectedFile.name }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Por favor selecione um ficheiro");
      return;
    }

    if (!formData.vehicle_id) {
      toast.error("Por favor selecione um veículo");
      return;
    }

    setLoading(true);
    try {
      await uploadDocument({
        file,
        vehicleId: formData.vehicle_id,
        data: {
          title: formData.title,
          type: formData.type,
          expiry_date: formData.expiry_date?.toISOString().split("T")[0] || null,
          notes: formData.notes || null,
          reminder_days_before: formData.reminder_days_before,
        },
      });
      
      toast.success("Documento carregado com sucesso");
      onClose();
      setFormData({
        title: "",
        type: "other",
        vehicle_id: vehicleId || "",
        expiry_date: undefined,
        notes: "",
        reminder_days_before: 30,
      });
      setFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carregar Documento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Ficheiro *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm text-foreground">{file.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique para carregar ou arraste e largue
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG (máx. 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

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
              {loading ? "A carregar..." : "Carregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
