import { useEffect, useState, useRef } from "react";
import VehicleHeader from "@/components/VehicleHeader";
import AlertBanner from "@/components/AlertBanner";
import QuickActions from "@/components/QuickActions";
import MonthlySummary from "@/components/MonthlySummary";
import UpcomingTimeline from "@/components/UpcomingTimeline";
import RecentActivity from "@/components/RecentActivity";
import BottomNav from "@/components/BottomNav";
import { AddVehicleModal } from "@/components/AddVehicleModal";
import { useVehicles } from "@/hooks/useVehicles";

const Index = () => {
  const { vehicles, loading } = useVehicles();
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const hasShownModal = useRef(false);

  useEffect(() => {
    if (!loading && vehicles.length === 0 && !hasShownModal.current) {
      setShowAddVehicle(true);
      hasShownModal.current = true;
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

        {vehicles.length > 0 ? (
          <>
            {/* Vehicle Selector */}
            <VehicleHeader />

            {/* Alert Banner */}
            <AlertBanner />

            {/* Quick Actions */}
            <QuickActions />

            {/* Monthly Summary */}
            <MonthlySummary />

            {/* Upcoming Timeline */}
            <UpcomingTimeline />

            {/* Recent Activity */}
            <RecentActivity />
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