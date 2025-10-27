import { Home, FileText, BarChart3, Settings } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: FileText, label: "Docs", active: false },
    { icon: BarChart3, label: "Stats", active: false },
    { icon: Settings, label: "More", active: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;