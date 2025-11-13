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
import { cn, formatDate } from "@/lib/utils";
import { useDocuments } from "@/hooks/useDocuments";
import { useVehicles } from "@/hooks/useVehicles";
import { toast } from "sonner";
import { t } from "@/lib/localization";

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
        toast.error(t('uploadDocumentModal.fileSizeError'));
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
      toast.error(t('uploadDocumentModal.pleaseSelectFile'));
      return;
    }

    if (!formData.vehicle_id) {
      toast.error(t('uploadDocumentModal.pleaseSelectVehicle'));
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
      
      toast.success(t('uploadDocumentModal.documentUploaded'));
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
      toast.error(error.message || t('uploadDocumentModal.failedToUpload'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('uploadDocumentModal.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>{t('uploadDocumentModal.file')}</Label>
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
                      {t('uploadDocumentModal.clickToUpload')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('uploadDocumentModal.fileTypes')}
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('uploadDocumentModal.title')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={t('uploadDocumentModal.titlePlaceholder')}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">{t('uploadDocumentModal.type')}</Label>
            <Select
              value={formData.type}
              onValueChange={(value: typeof documentTypes[number]) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('uploadDocumentModal.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {t(`uploadDocumentModal.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle */}
          <div className="space-y-2">
            <Label htmlFor="vehicle">{t('uploadDocumentModal.vehicle')}</Label>
            <Select
              value={formData.vehicle_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicle_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('uploadDocumentModal.selectVehicle')} />
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
            <Label>{t('uploadDocumentModal.expiryDate')}</Label>
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
                    formatDate(formData.expiry_date)
                  ) : (
                    <span>Pick a date</span>
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
            <Label htmlFor="notes">{t('uploadDocumentModal.notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t('uploadDocumentModal.cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? t('uploadDocumentModal.uploading') : t('uploadDocumentModal.upload')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
