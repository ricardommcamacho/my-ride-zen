import { useEffect, useState } from "react";
import VehicleHeader from "@/components/VehicleHeader";
import AlertBanner from "@/components/AlertBanner";
import QuickActions from "@/components/QuickActions";
import MonthlySummary from "@/components/MonthlySummary";
import UpcomingTimeline from "@/components/UpcomingTimeline";
import RecentActivity from "@/components/RecentActivity";
import BottomNav from "@/components/BottomNav";
import { AddVehicleModal } from "@/components/AddVehicleModal";
import { useVehicles } from "@/hooks/useVehicles";

const FIRST_VISIT_KEY = "vehiclePulse_firstVisit";

const Index = () => {
  const { vehicles, primaryVehicle, loading, setPrimaryVehicle } = useVehicles();
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem(FIRST_VISIT_KEY);
    
    if (!loading && vehicles.length === 0 && !hasVisitedBefore) {
      setShowAddVehicle(true);
      localStorage.setItem(FIRST_VISIT_KEY, "true");
    }
  }, [vehicles, loading]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1 animate-fade-in">
            VehiclePulse
          </h1>
          <p className="text-muted-foreground animate-fade-in">
            Manage your vehicle with ease
          </p>
        </div>

        {vehicles.length > 0 && primaryVehicle ? (
          <>
            {/* Vehicle Selector */}
            <VehicleHeader 
              vehicle={primaryVehicle}
              vehicles={vehicles}
              onVehicleChange={setPrimaryVehicle}
            />

            {/* Alert Banner */}
            <AlertBanner vehicleId={primaryVehicle.id} />

            {/* Quick Actions */}
            <QuickActions />

            {/* Monthly Summary */}
            <MonthlySummary vehicleId={primaryVehicle.id} />

            {/* Upcoming Timeline */}
            <UpcomingTimeline vehicleId={primaryVehicle.id} />

            {/* Recent Activity */}
            <RecentActivity vehicleId={primaryVehicle.id} />
          </>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No vehicles yet. Add your first vehicle to get started!
              </p>
            </div>
          )
        )}
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal 
        open={showAddVehicle} 
        onClose={() => setShowAddVehicle(false)} 
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;