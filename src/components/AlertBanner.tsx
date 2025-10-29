import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/hooks/useDocuments";
import { differenceInDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";

interface AlertBannerProps {
  vehicleId: string;
}

const AlertBanner = ({ vehicleId }: AlertBannerProps) => {
  const { documents } = useDocuments(vehicleId);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('dismissed-alerts');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out dismissed alerts older than 24h
      const valid = parsed.filter((item: any) => {
        return Date.now() - item.timestamp < 24 * 60 * 60 * 1000;
      });
      setDismissed(valid.map((item: any) => item.id));
      localStorage.setItem('dismissed-alerts', JSON.stringify(valid));
    }
  }, []);

  const expiringDocs = documents.filter((doc) => {
    if (!doc.expiry_date || dismissed.includes(doc.id)) return false;
    const daysUntilExpiry = differenceInDays(parseISO(doc.expiry_date), new Date());
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  });

  if (expiringDocs.length === 0) return null;

  const handleDismiss = (docId: string) => {
    const stored = localStorage.getItem('dismissed-alerts');
    const parsed = stored ? JSON.parse(stored) : [];
    parsed.push({ id: docId, timestamp: Date.now() });
    localStorage.setItem('dismissed-alerts', JSON.stringify(parsed));
    setDismissed([...dismissed, docId]);
  };

  const firstDoc = expiringDocs[0];
  const daysLeft = differenceInDays(parseISO(firstDoc.expiry_date!), new Date());

  return (
    <div className="bg-warning/10 border-l-4 border-warning rounded-lg p-4 mb-4 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-warning-foreground">{firstDoc.title} Due Soon</h3>
            <p className="text-sm text-foreground/80 mt-1">
              Expires in <span className="font-semibold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
              {expiringDocs.length > 1 && ` (+${expiringDocs.length - 1} more)`}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 -mt-1 -mr-1"
          onClick={() => handleDismiss(firstDoc.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AlertBanner;