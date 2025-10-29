import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Calendar, FileText, AlertCircle } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

type Document = Tables<"documents"> & {
  vehicles: { brand: string; model: string } | null;
};

interface ViewDocumentModalProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
}

const ViewDocumentModal = ({ document, open, onClose }: ViewDocumentModalProps) => {
  if (!document) return null;

  const handleDownload = () => {
    window.open(document.file_url, "_blank");
  };

  const isExpiringSoon = document.expiry_date 
    ? differenceInDays(parseISO(document.expiry_date), new Date()) <= 30
    : false;

  const isExpired = document.expiry_date
    ? differenceInDays(parseISO(document.expiry_date), new Date()) < 0
    : false;

  const isPdf = document.file_name.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(document.file_name);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{document.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
            {isPdf ? (
              <iframe
                src={document.file_url}
                className="w-full h-[400px]"
                title={document.title}
              />
            ) : isImage ? (
              <img
                src={document.file_url}
                alt={document.title}
                className="w-full h-auto max-h-[500px] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <FileText className="w-16 h-16 mb-4" />
                <p>Pré-visualização não disponível para este tipo de ficheiro</p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tipo</p>
              <p className="font-medium capitalize">{document.type.replace("_", " ")}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Veículo</p>
              <p className="font-medium">
                {document.vehicles ? `${document.vehicles.brand} ${document.vehicles.model}` : "N/D"}
              </p>
            </div>

            {document.expiry_date && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data de Validade
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {format(parseISO(document.expiry_date), "MMMM d, yyyy")}
                  </p>
                  {isExpired && (
                    <span className="text-xs text-destructive font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Expirado
                    </span>
                  )}
                  {!isExpired && isExpiringSoon && (
                    <span className="text-xs text-warning font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Expira em breve
                    </span>
                  )}
                </div>
              </div>
            )}

            {document.notes && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Notas</p>
                <p className="text-sm">{document.notes}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Tamanho do Ficheiro</p>
              <p className="text-sm">
                {document.file_size
                  ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB`
                  : "N/D"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Carregado</p>
              <p className="text-sm">
                {format(parseISO(document.created_at!), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Fechar
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Transferir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDocumentModal;
