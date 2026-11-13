/**
 * TrueTransit Frontend API Client
 * Manages communication with backend REST API, auth headers,
 * and seamless fallback when offline.
 */

import { LocalItineraryEngine } from './localItineraryEngine';
import { LocalPriceEngine } from './localPriceEngine';

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  ((import.meta as any).env?.PROD ? '/api/v1' : 'http://localhost:5000/api/v1');

export class ApiClient {
  private static getToken(): string | null {
    return localStorage.getItem('truetransit_token');
  }

  public static async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      // If network is offline, handle gracefully
      if (!navigator.onLine || err.message?.includes('Failed to fetch')) {
        console.warn('Network offline or backend unreachable; offline fallback available for:', endpoint);
      }
      throw err;
    }
  }

  // Price API
  public static async searchPrices(params: {
    category?: string;
    itemName: string;
    distanceKm?: number;
    timeOfDay?: string;
    quantity?: number;
    localityName?: string;
    quotedPrice?: number;
  }) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    query.append('itemName', params.itemName);
    if (params.distanceKm) query.append('distanceKm', params.distanceKm.toString());
    if (params.timeOfDay) query.append('timeOfDay', params.timeOfDay);
    if (params.quantity) query.append('quantity', params.quantity.toString());
    if (params.localityName) query.append('localityName', params.localityName);
    if (params.quotedPrice) query.append('quotedPrice', params.quotedPrice.toString());

    try {
      return await this.request(`/prices/search?${query.toString()}`);
    } catch (err: any) {
      console.warn('Backend unavailable for price check, using local offline statutory benchmark:', err.message);
      return LocalPriceEngine.calculate(params);
    }
  }

  public static async submitPriceReport(data: any) {
    return this.request('/prices/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public static async getCategories() {
    try {
      return await this.request('/prices/categories');
    } catch (err: any) {
      return {
        categories: [
          { key: 'TRANSPORT', label: 'Transportation & Fares' },
          { key: 'FOOD', label: 'Food & Dining' },
          { key: 'COMMODITY', label: 'Daily Commodities & MRP' },
          { key: 'SERVICE', label: 'Tourist Services' },
        ],
      };
    }
  }

  // Safety API
  public static async getHeatmap(hour: number) {
    return this.request(`/safety/heatmap?hour=${hour}`);
  }

  public static async calculateRoutes(origin: any, destination: any, hour: number) {
    return this.request('/safety/routes', {
      method: 'POST',
      body: JSON.stringify({
        originName: origin.name,
        originLat: origin.lat,
        originLng: origin.lng,
        destName: destination.name,
        destLat: destination.lat,
        destLng: destination.lng,
        hour,
      }),
    });
  }

  public static async submitSafetyReport(data: any) {
    return this.request('/safety/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public static async getEmergencyFacilities(lat?: number, lng?: number, type?: string) {
    const query = new URLSearchParams();
    if (lat) query.append('lat', lat.toString());
    if (lng) query.append('lng', lng.toString());
    if (type) query.append('type', type);
    return this.request(`/safety/emergency-facilities?${query.toString()}`);
  }

  // Itinerary API
  public static async generateItinerary(payload: any) {
    try {
      return await this.request('/itineraries/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      console.warn('Backend unreachable for itinerary generation; falling back to local deterministic engine:', err.message);
      const localData = LocalItineraryEngine.generate(payload);
      return {
        success: true,
        itineraryId: 'offline-local-session',
        data: localData,
        offlineFallback: true,
      };
    }
  }

  // Emergency & SOS
  public static async triggerSOS(payload: { lat?: number; lng?: number; message?: string }) {
    try {
      return await this.request('/emergency/sos', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      return {
        success: true,
        message: 'SOS triggered in offline mode. Use device cellular dialer to connect to 112 or 1091.',
        dialNumbers: [
          { name: 'National Emergency', number: '112' },
          { name: 'Women Helpline', number: '1091' },
          { name: 'Delhi Police', number: '100' },
          { name: 'Delhi Tourist Police', number: '8750871111' },
        ],
      };
    }
  }

  public static async getOfflineBootstrap(city: string = 'Delhi') {
    return this.request(`/emergency/bootstrap?city=${city}`);
  }

  // Offline Sync
  public static async syncPending(payload: { priceReports: any[]; safetyReports: any[] }) {
    return this.request('/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Admin
  public static async getAdminOverview() {
    return this.request('/admin/overview');
  }

  public static async getAdminReports() {
    return this.request('/admin/reports');
  }

  public static async moderatePriceReport(id: string, action: string, reason?: string) {
    return this.request(`/admin/reports/price/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action, reason }),
    });
  }

  public static async moderateSafetyReport(id: string, action: string, reason?: string) {
    return this.request(`/admin/reports/safety/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action, reason }),
    });
  }
}
