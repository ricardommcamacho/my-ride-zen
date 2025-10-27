import { Check, Clock, FileText } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  cost?: string;
}

const timelineItems: TimelineItem[] = [
  { id: "1", title: "Oil change", date: "Jan 24", completed: true, cost: "€85" },
  { id: "2", title: "Insurance renewal", date: "Feb 8", completed: false, cost: "€420" },
  { id: "3", title: "Annual inspection", date: "Mar 15", completed: false, cost: "€45" },
];

const UpcomingTimeline = () => {
  return (
    <div className="bg-card shadow-card rounded-xl p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <h2 className="text-lg font-semibold mb-4 text-foreground">Upcoming</h2>
      <div className="space-y-3">
        {timelineItems.map((item, index) => (
          <div key={item.id} className="flex items-start gap-3 group hover:bg-secondary/30 p-2 rounded-lg transition-colors -mx-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.completed 
                ? "bg-success/20" 
                : "bg-primary/10"
            }`}>
              {item.completed ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Clock className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={`font-medium ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                {item.cost && (
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                    {item.cost}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTimeline;