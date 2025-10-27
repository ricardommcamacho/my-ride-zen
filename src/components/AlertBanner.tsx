import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AlertBanner = () => {
  return (
    <div className="bg-warning/10 border-l-4 border-warning rounded-lg p-4 mb-4 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-warning-foreground">Inspection Due Soon</h3>
            <p className="text-sm text-foreground/80 mt-1">
              Your vehicle inspection expires in <span className="font-semibold">5 days</span>
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AlertBanner;