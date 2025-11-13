import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "../lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: number | null;
  subtitle?: string;
}

const StatCard = ({ title, value, icon: Icon, change, subtitle }: StatCardProps) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-destructive";
    if (change < 0) return "text-success";
    return "text-muted-foreground";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card hover:shadow-elevated transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}

        {change !== undefined && change !== null && (
          <div className={`flex items-center gap-1 text-sm ${getChangeColor(change)}`}>
            {(() => {
              const ChangeIcon = getChangeIcon(change);
              return ChangeIcon ? <ChangeIcon className="w-3 h-3" /> : null;
            })()}
            <span className="font-medium">
              {formatNumber(Math.abs(change), 1)}% vs last period
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
