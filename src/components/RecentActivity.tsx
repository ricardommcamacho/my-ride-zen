import { Fuel, Wrench, FileText } from "lucide-react";

interface Activity {
  id: string;
  type: "fuel" | "maintenance" | "document";
  title: string;
  amount: string;
  timeAgo: string;
}

const activities: Activity[] = [
  { id: "1", type: "fuel", title: "Combustível", amount: "€45.30", timeAgo: "2 dias atrás" },
  { id: "2", type: "maintenance", title: "Mudança de óleo", amount: "€85.00", timeAgo: "1 semana atrás" },
  { id: "3", type: "document", title: "Seguro carregado", amount: "", timeAgo: "2 semanas atrás" },
];

const iconMap = {
  fuel: Fuel,
  maintenance: Wrench,
  document: FileText,
};

const RecentActivity = () => {
  return (
    <div className="bg-card shadow-card rounded-xl p-5 mb-20 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <h2 className="text-lg font-semibold mb-4 text-foreground">Atividade Recente</h2>
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