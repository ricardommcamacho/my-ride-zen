import { Car, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<'vehicles'>;

interface VehicleHeaderProps {
  vehicle: Vehicle | null;
  vehicles: Vehicle[];
  onVehicleChange: (vehicleId: string) => void;
}

const VehicleHeader = ({ vehicle, vehicles, onVehicleChange }: VehicleHeaderProps) => {
  if (!vehicle) return null;

  return (
    <div className="bg-card shadow-card rounded-xl p-4 mb-4 animate-fade-in">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">
                  {vehicle.brand} {vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {vehicle.year} • {vehicle.current_km?.toLocaleString() || 0} km
                </p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        {vehicles.length > 1 && (
          <DropdownMenuContent align="start" className="w-[300px]">
            {vehicles.map((v) => (
              <DropdownMenuItem
                key={v.id}
                onClick={() => onVehicleChange(v.id)}
                className="flex items-center gap-3 p-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {v.brand} {v.model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {v.year} • {v.current_km?.toLocaleString() || 0} km
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
};

export default VehicleHeader;