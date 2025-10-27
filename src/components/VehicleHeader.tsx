import { Car, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const VehicleHeader = () => {
  return (
    <div className="bg-card shadow-card rounded-xl p-4 mb-4 animate-fade-in">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground">Toyota Corolla</p>
            <p className="text-sm text-muted-foreground">2021 • 45,230 km</p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default VehicleHeader;