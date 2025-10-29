import { useState } from "react";
import { Fuel, Wrench, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddFuelModal from "./AddFuelModal";
import LogServiceModal from "./LogServiceModal";
import UploadDocumentModal from "./UploadDocumentModal";

const QuickActions = () => {
  const [fuelModalOpen, setFuelModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3 mb-4 animate-scale-in" style={{ animationDelay: "0.1s" }}>
        <Button
          size="lg"
          onClick={() => setFuelModalOpen(true)}
          className="flex-1 bg-primary hover:bg-primary/90 shadow-elevated"
        >
          <Fuel className="w-5 h-5 mr-2" />
          Add Fuel
        </Button>
        <Button
          size="lg"
          onClick={() => setServiceModalOpen(true)}
          variant="outline"
          className="flex-1 hover:bg-secondary"
        >
          <Wrench className="w-5 h-5 mr-2" />
          Log Service
        </Button>
        <Button
          size="lg"
          onClick={() => setUploadModalOpen(true)}
          variant="outline"
          className="hover:bg-secondary"
        >
          <Upload className="w-5 h-5" />
        </Button>
      </div>

      <AddFuelModal open={fuelModalOpen} onClose={() => setFuelModalOpen(false)} />
      <LogServiceModal open={serviceModalOpen} onClose={() => setServiceModalOpen(false)} />
      <UploadDocumentModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </>
  );
};

export default QuickActions;