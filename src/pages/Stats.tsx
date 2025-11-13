import { useState } from 'react';
import { TrendingUp, Fuel, Wrench, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicles } from '@/hooks/useVehicles';
import { useFuelRecords } from '@/hooks/useFuelRecords';
import { useMaintenance } from '@/hooks/useMaintenance';
import BottomNav from '@/components/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { t } from '@/lib/localization';
import { formatNumber } from '@/lib/utils';

const Stats = () => {
  const { vehicles, primaryVehicle, loading: vehiclesLoading } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  
  const currentVehicleId = selectedVehicleId || primaryVehicle?.id;
  
  const { fuelRecords, loading: fuelLoading } = useFuelRecords(currentVehicleId);
  const { maintenanceLogs, loading: maintenanceLoading } = useMaintenance(currentVehicleId);

  // Calculate KPIs
  const totalFuelSpent = fuelRecords.reduce((sum, record) => sum + Number(record.cost), 0);
  const totalMaintenanceSpent = maintenanceLogs.reduce((sum, log) => sum + Number(log.cost), 0);
  const totalSpent = totalFuelSpent + totalMaintenanceSpent;

  // Calculate average consumption
  const fullTankRecords = fuelRecords
    .filter(r => r.is_full_tank)
    .sort((a, b) => a.odometer - b.odometer);

  let avgConsumption = 0;
  if (fullTankRecords.length >= 2) {
    let totalConsumption = 0;
    let validPairs = 0;

    for (let i = 1; i < fullTankRecords.length; i++) {
      const distance = fullTankRecords[i].odometer - fullTankRecords[i - 1].odometer;
      const fuel = Number(fullTankRecords[i].quantity);

      if (distance > 0) {
        totalConsumption += (fuel / distance) * 100;
        validPairs++;
      }
    }

    if (validPairs > 0) {
      avgConsumption = totalConsumption / validPairs;
    }
  }

  if (vehiclesLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">{t('stats.title')}</h1>
          <p className="text-muted-foreground">{t('stats.subtitle')}</p>
        </div>

        {/* Vehicle Selector */}
        <div className="mb-6">
          <Select 
            value={selectedVehicleId || primaryVehicle?.id || ''} 
            onValueChange={setSelectedVehicleId}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('stats.selectVehicle')} />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.brand} {v.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {t('stats.totalSpent')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">€{formatNumber(totalSpent, 2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                {t('stats.fuel')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">€{formatNumber(totalFuelSpent, 2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                {t('stats.maintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">€{formatNumber(totalMaintenanceSpent, 2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('stats.avgConsumption')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {avgConsumption > 0 ? `${formatNumber(avgConsumption, 1)}` : 'N/A'}
              </p>
              {avgConsumption > 0 && (
                <p className="text-xs text-muted-foreground">{t('stats.lPer100km')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('stats.recentTransactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            {fuelRecords.length === 0 && maintenanceLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t('stats.noTransactions')}
              </p>
            ) : (
              <div className="space-y-3">
                {[...fuelRecords, ...maintenanceLogs]
                  .sort((a, b) => {
                    const dateA = 'fuel_date' in a ? new Date(a.fuel_date) : new Date(a.service_date);
                    const dateB = 'fuel_date' in b ? new Date(b.fuel_date) : new Date(b.service_date);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .slice(0, 10)
                  .map((item, idx) => {
                    const isFuel = 'fuel_date' in item;
                    const date = isFuel ? item.fuel_date : item.service_date;
                    const cost = Number(item.cost);

                    return (
                      <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          {isFuel ? (
                            <Fuel className="w-4 h-4 text-primary" />
                          ) : (
                            <Wrench className="w-4 h-4 text-primary" />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {isFuel ? t('stats.fuelRefill') : item.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(date).toLocaleDateString('pt-PT')}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">€{cost.toFixed(2)}</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Stats;
