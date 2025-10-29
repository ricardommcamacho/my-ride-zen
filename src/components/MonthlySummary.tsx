import { TrendingDown, Euro, Gauge } from "lucide-react";

const MonthlySummary = () => {
  return (
    <div className="bg-card shadow-card rounded-xl p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-lg font-semibold mb-4 text-foreground">Este Mês</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Euro className="w-4 h-4" />
            <span>Total Gasto</span>
          </div>
          <p className="text-2xl font-bold text-foreground">€182</p>
          <div className="flex items-center gap-1 text-success text-sm">
            <TrendingDown className="w-3 h-3" />
            <span>12% menos</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Gauge className="w-4 h-4" />
            <span>Consumo Médio</span>
          </div>
          <p className="text-2xl font-bold text-foreground">8.1</p>
          <p className="text-sm text-muted-foreground">L/100km</p>
        </div>
      </div>
      <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-gradient-accent w-2/3 rounded-full"></div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">68% do orçamento mensal usado</p>
    </div>
  );
};

export default MonthlySummary;