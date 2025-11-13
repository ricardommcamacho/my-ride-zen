import { FileText, MoreVertical, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, differenceInDays, parseISO } from "date-fns";
import { cn, formatDateFromISO } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";
import { t } from "@/lib/localization";

type Document = Tables<"documents"> & {
  vehicles: { brand: string; model: string } | null;
};

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentCard = ({ document, onView, onEdit, onDelete }: DocumentCardProps) => {
  const getExpiryBadge = () => {
    if (!document.expiry_date) return null;

    const daysUntilExpiry = differenceInDays(parseISO(document.expiry_date), new Date());

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">{t("documentCard.expired")}</Badge>;
    } else if (daysUntilExpiry <= 7) {
      return <Badge className="bg-warning text-warning-foreground">{t("documentCard.expiresIn")} {daysUntilExpiry}d</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="secondary">{t("documentCard.expiresIn")} {daysUntilExpiry}d</Badge>;
    }
    return null;
  };

  const handleDownload = () => {
    window.open(document.file_url, "_blank");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevated transition-all group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{document.title}</h3>
              {document.vehicles && (
                <p className="text-sm text-muted-foreground">
                  {document.vehicles.brand} {document.vehicles.model}
                </p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(document)}>
                  <Eye className="w-4 h-4 mr-2" />
                  {t("documentCard.view")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  {t("documentCard.download")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(document)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  {t("documentCard.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(document.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("documentCard.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs capitalize">
              {document.type.replace('_', ' ')}
            </Badge>
            {getExpiryBadge()}
          </div>

          {document.expiry_date && (
            <p className="text-xs text-muted-foreground mt-2">
              {t("documentCard.expires")}: {formatDateFromISO(document.expiry_date, "d MMM yyyy")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
