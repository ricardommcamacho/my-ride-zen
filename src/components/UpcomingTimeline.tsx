import { Check, Clock, FileText, Wrench } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useMaintenance } from "@/hooks/useMaintenance";
import { format, parseISO, addDays, isPast } from "date-fns";
import { useMemo } from "react";
import { cn, formatDateFromISO, formatNumber } from "@/lib/utils";
import { t } from "@/lib/localization";

interface UpcomingTimelineProps {
  vehicleId: string;
}

interface TimelineItem {
  id: string;
  type: "document" | "maintenance";
  title: string;
  date: Date;
  dateStr: string;
  completed: boolean;
  cost?: string;
}

const UpcomingTimeline = ({ vehicleId }: UpcomingTimelineProps) => {
  const { documents } = useDocuments(vehicleId);
  const { maintenanceLogs } = useMaintenance(vehicleId);

  const timelineItems: TimelineItem[] = useMemo(() => {
    const now = new Date();
    const futureLimit = addDays(now, 60);

    const docItems: TimelineItem[] = documents
      .filter(doc => {
        if (!doc.expiry_date) return false;
        const expiryDate = parseISO(doc.expiry_date);
        return expiryDate >= now && expiryDate <= futureLimit;
      })
      .map(doc => ({
        id: doc.id,
        type: "document" as const,
        title: `${doc.title} ${t("upcomingTimeline.expires")}`,
        date: parseISO(doc.expiry_date!),
        dateStr: formatDateFromISO(doc.expiry_date!, 'dd MMM'),
        completed: false,
        cost: undefined,
      }));

    const maintenanceItems: TimelineItem[] = maintenanceLogs
      .filter(log => {
        if (!log.next_service_date) return false;
        const serviceDate = parseISO(log.next_service_date);
        return serviceDate >= now && serviceDate <= futureLimit;
      })
      .map(log => ({
        id: log.id,
        type: "maintenance" as const,
        title: log.description,
        date: parseISO(log.next_service_date!),
        dateStr: formatDateFromISO(log.next_service_date!, 'dd MMM'),
        completed: isPast(parseISO(log.next_service_date!)),
        cost: log.cost ? `€${formatNumber(log.cost, 0)}` : undefined,
      }));

    return [...docItems, ...maintenanceItems]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [documents, maintenanceLogs]);

  if (timelineItems.length === 0) {
    return (
      <div className="bg-card shadow-card rounded-xl p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-semibold mb-4 text-foreground">{t("upcomingTimeline.upcoming")}</h2>
        <p className="text-sm text-muted-foreground text-center py-8">
          {t("upcomingTimeline.noUpcomingEvents")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card shadow-card rounded-xl p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <h2 className="text-lg font-semibold mb-4 text-foreground">{t("upcomingTimeline.upcoming")}</h2>
      <div className="space-y-3">
        {timelineItems.map((item) => {
          const Icon = item.type === "document" ? FileText : Wrench;
          return (
            <div key={item.id} className="flex items-start gap-3 group hover:bg-secondary/30 p-2 rounded-lg transition-colors -mx-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.completed ? 'bg-success/20' : 'bg-primary/10'
              }`}>
                {item.completed ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Icon className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-medium ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.dateStr}</p>
                  </div>
                  {item.cost && (
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                      {item.cost}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingTimeline;