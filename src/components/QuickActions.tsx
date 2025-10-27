import { Plus, Camera, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuickActions = () => {
  return (
    <div className="flex gap-3 mb-4 animate-scale-in" style={{ animationDelay: "0.1s" }}>
      <Button
        size="lg"
        className="flex-1 bg-primary hover:bg-primary/90 shadow-elevated"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Entry
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="flex-1 hover:bg-secondary"
      >
        <Camera className="w-5 h-5 mr-2" />
        Scan Doc
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="hover:bg-secondary"
      >
        <Fuel className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default QuickActions;