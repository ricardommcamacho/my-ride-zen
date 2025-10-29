import { useMemo } from "react";
import { useFuelRecords } from "./useFuelRecords";
import { useMaintenance } from "./useMaintenance";
import { aggregateStats, groupByMonth } from "@/lib/statsCalculations";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

interface UseStatsOptions {
  vehicleId?: string;
  startDate?: Date;
  endDate?: Date;
}

export const useStats = ({ vehicleId, startDate, endDate }: UseStatsOptions = {}) => {
  const { fuelRecords, loading: fuelLoading } = useFuelRecords(vehicleId, startDate, endDate);
  const { maintenanceLogs, loading: maintenanceLoading } = useMaintenance(vehicleId);

  // Filter maintenance logs by date range if provided
  const filteredMaintenanceLogs = useMemo(() => {
    if (!startDate || !endDate) return maintenanceLogs;
    
    return maintenanceLogs.filter((log) => {
      const logDate = new Date(log.service_date);
      return logDate >= startDate && logDate <= endDate;
    });
  }, [maintenanceLogs, startDate, endDate]);

  // Current period stats
  const currentStats = useMemo(
    () => aggregateStats(fuelRecords, filteredMaintenanceLogs),
    [fuelRecords, filteredMaintenanceLogs]
  );

  // Previous period stats for comparison
  const { fuelRecords: prevFuelRecords } = useFuelRecords(
    vehicleId,
    startDate ? subMonths(startDate, 1) : undefined,
    startDate ? subMonths(endOfMonth(startDate), 1) : undefined
  );

  const { maintenanceLogs: prevMaintenanceLogs } = useMaintenance(vehicleId);

  const filteredPrevMaintenanceLogs = useMemo(() => {
    if (!startDate) return [];
    
    const prevStart = subMonths(startDate, 1);
    const prevEnd = subMonths(endOfMonth(startDate), 1);
    
    return prevMaintenanceLogs.filter((log) => {
      const logDate = new Date(log.service_date);
      return logDate >= prevStart && logDate <= prevEnd;
    });
  }, [prevMaintenanceLogs, startDate]);

  const previousStats = useMemo(
    () => aggregateStats(prevFuelRecords, filteredPrevMaintenanceLogs),
    [prevFuelRecords, filteredPrevMaintenanceLogs]
  );

  // Monthly spending data for charts
  const monthlySpending = useMemo(
    () => groupByMonth(fuelRecords, filteredMaintenanceLogs),
    [fuelRecords, filteredMaintenanceLogs]
  );

  // Calculate percentage changes
  const percentageChanges = useMemo(() => {
    const totalChange =
      previousStats.totalSpent > 0
        ? ((currentStats.totalSpent - previousStats.totalSpent) / previousStats.totalSpent) * 100
        : null;

    const fuelChange =
      previousStats.fuelSpent > 0
        ? ((currentStats.fuelSpent - previousStats.fuelSpent) / previousStats.fuelSpent) * 100
        : null;

    const maintenanceChange =
      previousStats.maintenanceSpent > 0
        ? ((currentStats.maintenanceSpent - previousStats.maintenanceSpent) /
            previousStats.maintenanceSpent) *
          100
        : null;

    return {
      total: totalChange,
      fuel: fuelChange,
      maintenance: maintenanceChange,
    };
  }, [currentStats, previousStats]);

  return {
    currentStats,
    previousStats,
    percentageChanges,
    monthlySpending,
    loading: fuelLoading || maintenanceLoading,
  };
};
