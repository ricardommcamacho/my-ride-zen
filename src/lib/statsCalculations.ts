import { Tables } from "@/integrations/supabase/types";

type FuelRecord = Tables<"fuel_records">;
type MaintenanceLog = Tables<"maintenance_logs">;

export interface StatsData {
  totalSpent: number;
  fuelSpent: number;
  maintenanceSpent: number;
  avgConsumption: number | null;
  fuelRecordsCount: number;
  maintenanceCount: number;
}

/**
 * Calculate average fuel consumption (L/100km) from fuel records
 * Only considers full tank refills for accurate calculation
 */
export const calculateConsumption = (fuelRecords: FuelRecord[]): number | null => {
  const fullTankRecords = fuelRecords
    .filter((r) => r.is_full_tank)
    .sort((a, b) => new Date(a.fuel_date).getTime() - new Date(b.fuel_date).getTime());

  if (fullTankRecords.length < 2) return null;

  let totalConsumption = 0;
  let totalDistance = 0;

  for (let i = 1; i < fullTankRecords.length; i++) {
    const prev = fullTankRecords[i - 1];
    const curr = fullTankRecords[i];

    const distance = curr.odometer - prev.odometer;
    if (distance > 0) {
      totalDistance += distance;
      totalConsumption += Number(curr.quantity);
    }
  }

  if (totalDistance === 0) return null;

  // L/100km = (total liters / total km) * 100
  return (totalConsumption / totalDistance) * 100;
};

/**
 * Calculate cost per kilometer
 */
export const calculateCostPerKm = (
  totalCost: number,
  startOdometer: number,
  endOdometer: number
): number | null => {
  const distance = endOdometer - startOdometer;
  if (distance <= 0) return null;
  return totalCost / distance;
};

/**
 * Calculate percentage change between two periods
 */
export const calculatePercentageChange = (current: number, previous: number): number | null => {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
};

/**
 * Aggregate stats for a given set of fuel and maintenance records
 */
export const aggregateStats = (
  fuelRecords: FuelRecord[],
  maintenanceLogs: MaintenanceLog[]
): StatsData => {
  const fuelSpent = fuelRecords.reduce((sum, record) => sum + Number(record.cost), 0);
  const maintenanceSpent = maintenanceLogs.reduce(
    (sum, log) => sum + Number(log.cost || 0),
    0
  );
  const totalSpent = fuelSpent + maintenanceSpent;

  const avgConsumption = calculateConsumption(fuelRecords);

  return {
    totalSpent,
    fuelSpent,
    maintenanceSpent,
    avgConsumption,
    fuelRecordsCount: fuelRecords.length,
    maintenanceCount: maintenanceLogs.length,
  };
};

/**
 * Group spending data by month for charts
 */
export interface MonthlySpending {
  month: string;
  fuel: number;
  maintenance: number;
}

export const groupByMonth = (
  fuelRecords: FuelRecord[],
  maintenanceLogs: MaintenanceLog[]
): MonthlySpending[] => {
  const monthMap = new Map<string, { fuel: number; maintenance: number }>();

  fuelRecords.forEach((record) => {
    const month = new Date(record.fuel_date).toLocaleDateString("pt-PT", {
      month: "short",
      year: "numeric",
    });
    const current = monthMap.get(month) || { fuel: 0, maintenance: 0 };
    current.fuel += Number(record.cost);
    monthMap.set(month, current);
  });

  maintenanceLogs.forEach((log) => {
    const month = new Date(log.service_date).toLocaleDateString("pt-PT", {
      month: "short",
      year: "numeric",
    });
    const current = monthMap.get(month) || { fuel: 0, maintenance: 0 };
    current.maintenance += Number(log.cost || 0);
    monthMap.set(month, current);
  });

  return Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      ...data,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-6); // Last 6 months
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
};
