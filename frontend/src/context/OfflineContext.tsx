import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from '../services/apiClient';

interface OfflineContextType {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOnline: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  toggleSimulatedOffline: () => void;
  queuePriceReport: (report: any) => void;
  queueSafetyReport: (report: any) => void;
  syncNow: () => Promise<{ success: boolean; message: string }>;
  offlinePack: any;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [pendingPriceReports, setPendingPriceReports] = useState<any[]>([]);
  const [pendingSafetyReports, setPendingSafetyReports] = useState<any[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [offlinePack, setOfflinePack] = useState<any>(null);

  // Load queued reports and cached pack from local storage on mount
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const savedPrices = localStorage.getItem('truetransit_offline_prices');
    if (savedPrices) setPendingPriceReports(JSON.parse(savedPrices));

    const savedSafety = localStorage.getItem('truetransit_offline_safety');
    if (savedSafety) setPendingSafetyReports(JSON.parse(savedSafety));

    const savedPack = localStorage.getItem('truetransit_offline_pack');
    if (savedPack) {
      setOfflinePack(JSON.parse(savedPack));
    } else {
      // Bootstrap offline pack once
      fetchOfflineBootstrap();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchOfflineBootstrap = async () => {
    try {
      const res = await ApiClient.getOfflineBootstrap('Delhi');
      if (res.data) {
        setOfflinePack(res.data);
        localStorage.setItem('truetransit_offline_pack', JSON.stringify(res.data));
      }
    } catch {
      // If server unreachable, use hardcoded baseline
      const fallbackPack = {
        cityName: 'Delhi',
        emergencyNumbers: { police: '112', womenHelpline: '1091', touristPolice: '8750871111' },
      };
      setOfflinePack(fallbackPack);
    }
  };

  const effectiveOnline = isOnline && !isSimulatedOffline;

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline(prev => !prev);
  };

  const queuePriceReport = (report: any) => {
    const enriched = {
      ...report,
      clientUuid: `offline-price-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      queuedAt: new Date().toISOString(),
    };
    const updated = [...pendingPriceReports, enriched];
    setPendingPriceReports(updated);
    localStorage.setItem('truetransit_offline_prices', JSON.stringify(updated));
  };

  const queueSafetyReport = (report: any) => {
    const enriched = {
      ...report,
      clientUuid: `offline-safety-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      queuedAt: new Date().toISOString(),
    };
    const updated = [...pendingSafetyReports, enriched];
    setPendingSafetyReports(updated);
    localStorage.setItem('truetransit_offline_safety', JSON.stringify(updated));
  };

  const syncNow = async () => {
    if (!effectiveOnline) {
      return { success: false, message: 'Cannot sync while offline. Reconnect or disable simulated offline mode.' };
    }

    if (pendingPriceReports.length === 0 && pendingSafetyReports.length === 0) {
      return { success: true, message: 'All reports are up to date! Nothing to synchronize.' };
    }

    try {
      const res = await ApiClient.syncPending({
        priceReports: pendingPriceReports,
        safetyReports: pendingSafetyReports,
      });

      // Clear local queue upon successful sync
      setPendingPriceReports([]);
      setPendingSafetyReports([]);
      localStorage.removeItem('truetransit_offline_prices');
      localStorage.removeItem('truetransit_offline_safety');
      setLastSyncedAt(new Date().toLocaleTimeString());

      return {
        success: true,
        message: `Successfully synchronized ${res.syncSummary?.priceReportsSynced || 0} price reports and ${res.syncSummary?.safetyReportsSynced || 0} safety reports!`,
      };
    } catch (err: any) {
      return { success: false, message: `Sync failed: ${err.message}` };
    }
  };

  // Auto-sync when effectiveOnline becomes true and items are queued
  useEffect(() => {
    if (effectiveOnline && (pendingPriceReports.length > 0 || pendingSafetyReports.length > 0)) {
      syncNow();
    }
  }, [effectiveOnline]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSimulatedOffline,
        effectiveOnline,
        pendingCount: pendingPriceReports.length + pendingSafetyReports.length,
        lastSyncedAt,
        toggleSimulatedOffline,
        queuePriceReport,
        queueSafetyReport,
        syncNow,
        offlinePack,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within an OfflineProvider');
  return context;
};
