import { TrendingDown, TrendingUp, Euro, Gauge } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import { startOfMonth, endOfMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlySummaryProps {
  vehicleId: string;
}

const MonthlySummary = ({ vehicleId }: MonthlySummaryProps) => {
  const now = new Date();
  const { currentStats, percentageChanges, loading } = useStats({
    vehicleId,
    startDate: startOfMonth(now),
    endDate: endOfMonth(now),
  });

  const monthlyBudget = 300; // Default budget
  const budgetPercentage = (currentStats.totalSpent / monthlyBudget) * 100;

  if (loading) {
    return (
      <div className="bg-card shadow-card rounded-xl p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card shadow-card rounded-xl p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-lg font-semibold mb-4 text-foreground">This Month</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Euro className="w-4 h-4" />
            <span>Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            €{currentStats.totalSpent.toFixed(0)}
          </p>
          {percentageChanges.total !== null && (
            <div className={`flex items-center gap-1 text-sm ${
              percentageChanges.total > 0 ? 'text-destructive' : 'text-success'
            }`}>
              {percentageChanges.total > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(percentageChanges.total).toFixed(0)}% vs last month</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Gauge className="w-4 h-4" />
            <span>Avg. Consumption</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {currentStats.avgConsumption > 0 ? currentStats.avgConsumption.toFixed(1) : '--'}
          </p>
          <p className="text-sm text-muted-foreground">L/100km</p>
        </div>
      </div>
      <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-accent rounded-full transition-all duration-500"
          style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {budgetPercentage.toFixed(0)}% of monthly budget used (€{monthlyBudget})
      </p>
    </div>
  );
};

export default MonthlySummary;