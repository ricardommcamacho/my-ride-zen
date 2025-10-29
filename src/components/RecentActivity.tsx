import { Fuel, Wrench, FileText } from "lucide-react";
import { useFuelRecords } from "@/hooks/useFuelRecords";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useDocuments } from "@/hooks/useDocuments";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";

interface RecentActivityProps {
  vehicleId: string;
}

interface Activity {
  id: string;
  type: "fuel" | "maintenance" | "document";
  title: string;
  amount: string;
  timeAgo: string;
  date: Date;
}

const iconMap = {
  fuel: Fuel,
  maintenance: Wrench,
  document: FileText,
};

const RecentActivity = ({ vehicleId }: RecentActivityProps) => {
  const { fuelRecords } = useFuelRecords(vehicleId);
  const { maintenanceLogs } = useMaintenance(vehicleId);
  const { documents } = useDocuments(vehicleId);

  const activities: Activity[] = useMemo(() => {
    const fuelActivities: Activity[] = fuelRecords.slice(0, 5).map(record => ({
      id: record.id,
      type: "fuel" as const,
      title: "Fuel",
      amount: `€${record.cost.toFixed(2)}`,
      timeAgo: formatDistanceToNow(new Date(record.fuel_date), { addSuffix: true }),
      date: new Date(record.fuel_date),
    }));

    const maintenanceActivities: Activity[] = maintenanceLogs.slice(0, 5).map(log => ({
      id: log.id,
      type: "maintenance" as const,
      title: log.description,
      amount: log.cost ? `€${log.cost.toFixed(2)}` : "",
      timeAgo: formatDistanceToNow(new Date(log.service_date), { addSuffix: true }),
      date: new Date(log.service_date),
    }));

    const documentActivities: Activity[] = documents.slice(0, 5).map(doc => ({
      id: doc.id,
      type: "document" as const,
      title: `${doc.title} uploaded`,
      amount: "",
      timeAgo: formatDistanceToNow(new Date(doc.created_at), { addSuffix: true }),
      date: new Date(doc.created_at),
    }));

    return [...fuelActivities, ...maintenanceActivities, ...documentActivities]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  }, [fuelRecords, maintenanceLogs, documents]);

  if (activities.length === 0) {
    return (
      <div className="bg-card shadow-card rounded-xl p-5 mb-20 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h2>
        <p className="text-sm text-muted-foreground text-center py-8">
          No activity yet. Start by adding fuel or maintenance records!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card shadow-card rounded-xl p-5 mb-20 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div key={activity.id} className="flex items-center gap-3 hover:bg-secondary/30 p-2 rounded-lg transition-colors -mx-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.timeAgo}</p>
              </div>
              {activity.amount && (
                <span className="text-sm font-semibold text-foreground">
                  {activity.amount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;