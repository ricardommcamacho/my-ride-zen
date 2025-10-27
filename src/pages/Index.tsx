import VehicleHeader from "@/components/VehicleHeader";
import AlertBanner from "@/components/AlertBanner";
import QuickActions from "@/components/QuickActions";
import MonthlySummary from "@/components/MonthlySummary";
import UpcomingTimeline from "@/components/UpcomingTimeline";
import RecentActivity from "@/components/RecentActivity";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;