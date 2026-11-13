import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SafetyHeatPoint, RouteAlternative } from '../types';

interface MapViewProps {
  heatPoints?: SafetyHeatPoint[];
  routes?: RouteAlternative[];
  selectedRouteId?: string;
  onSelectRoute?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number; label?: string; accuracy?: number } | null;
  isActive?: boolean;
  onSetOriginFromCoords?: (coords: { lat: number; lng: number }) => void;
  onSetDestFromCoords?: (coords: { lat: number; lng: number }) => void;
  pinningMode?: 'NONE' | 'ORIGIN' | 'DESTINATION';
  onResetPinningMode?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  heatPoints = [],
  routes = [],
  selectedRouteId,
  onSelectRoute,
  center = [28.6250, 77.2150], // Central Delhi / Connaught Place
  zoom = 13,
  userLocation,
  isActive = true,
  onSetOriginFromCoords,
  onSetDestFromCoords,
  pinningMode = 'NONE',
  onResetPinningMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const onSetOriginRef = useRef(onSetOriginFromCoords);
  const onSetDestRef = useRef(onSetDestFromCoords);
  const pinningModeRef = useRef(pinningMode);
  const onResetPinningModeRef = useRef(onResetPinningMode);

  useEffect(() => {
    onSetOriginRef.current = onSetOriginFromCoords;
    onSetDestRef.current = onSetDestFromCoords;
    pinningModeRef.current = pinningMode;
    onResetPinningModeRef.current = onResetPinningMode;
  }, [onSetOriginFromCoords, onSetDestFromCoords, pinningMode, onResetPinningMode]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
      });

      // OpenStreetMap raster tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Interactive Click on Map to Set Waypoints
      map.on('click', (e: L.LeafletMouseEvent) => {
        const mode = pinningModeRef.current;
        if (mode === 'ORIGIN') {
          onSetOriginRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
          onResetPinningModeRef.current?.();
          return;
        }
        if (mode === 'DESTINATION') {
          onSetDestRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
          onResetPinningModeRef.current?.();
          return;
        }

        // Default: Open quick popup with Set Origin / Set Destination options
        const popupDiv = document.createElement('div');
        popupDiv.style.fontFamily = 'sans-serif';
        popupDiv.style.fontSize = '12px';
        popupDiv.style.padding = '4px';
        popupDiv.style.minWidth = '180px';
        popupDiv.innerHTML = `
          <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">📍 Pinpoint Location</div>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">(${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})</div>
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <button id="leaflet-set-origin-btn" style="background: #10b981; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              📍 Set as Departure Point (A)
            </button>
            <button id="leaflet-set-dest-btn" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              🏁 Set as Destination (B)
            </button>
          </div>
        `;

        L.popup()
          .setLatLng(e.latlng)
          .setContent(popupDiv)
          .openOn(map);

        setTimeout(() => {
          const originBtn = document.getElementById('leaflet-set-origin-btn');
          const destBtn = document.getElementById('leaflet-set-dest-btn');
          if (originBtn) {
            originBtn.onclick = () => {
              onSetOriginRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
              map.closePopup();
            };
          }
          if (destBtn) {
            destBtn.onclick = () => {
              onSetDestRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
              map.closePopup();
            };
          }
        }, 10);
      });

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
    };
  }, []);

  // Update cursor styling based on pinning mode
  useEffect(() => {
    if (mapContainerRef.current) {
      if (pinningMode !== 'NONE') {
        mapContainerRef.current.style.cursor = 'crosshair';
      } else {
        mapContainerRef.current.style.cursor = '';
      }
    }
  }, [pinningMode]);

  // Update map overlays when heatPoints, routes, or userLocation change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Render Safety Heat Circles
    heatPoints.forEach((point) => {
      const circle = L.circleMarker([point.lat, point.lng], {
        radius: point.level === 'LOWER_CONCERN' ? 14 : point.level === 'CAUTION' ? 16 : 18,
        fillColor: point.colorCode,
        color: '#ffffff',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.5,
      });

      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; max-width: 240px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #0f172a;">${point.name}</strong>
            <span style="background: ${point.colorCode}22; color: ${point.colorCode}; border: 1px solid ${point.colorCode}55; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">
              ${point.safetyScore}/100
            </span>
          </div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
            Zone: ${point.zoneType} • Hour: ${point.hour}:00
          </div>
          <div style="margin-bottom: 6px;">
            <div style="font-weight: 600; color: #334155; margin-bottom: 2px;">Indicators:</div>
            <ul style="padding-left: 14px; margin: 0; color: #475569; font-size: 11px;">
              ${point.evidenceRationale.map((r) => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          <div style="font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            ${point.disclaimer}
          </div>
        </div>
      `;

      circle.bindPopup(popupHtml);
      layerGroup.addLayer(circle);
    });

    // 2. Render Route Polylines
    routes.forEach((route) => {
      const isSelected = route.id === selectedRouteId;
      const latLngs = route.waypoints.map((w) => [w.lat, w.lng] as [number, number]);

      let color = '#3b82f6'; // blue default
      let weight = isSelected ? 6 : 4;
      let opacity = isSelected ? 0.95 : 0.6;
      let dashArray = undefined;

      if (route.type === 'SAFEST') {
        color = '#0d9488'; // teal
        if (isSelected) weight = 7;
      } else if (route.type === 'FASTEST') {
        color = '#f59e0b'; // amber
        dashArray = '6, 6';
      } else if (route.type === 'BALANCED') {
        color = '#6366f1'; // indigo
      }

      const polyline = L.polyline(latLngs, {
        color,
        weight,
        opacity,
        dashArray,
      });

      polyline.on('click', () => {
        if (onSelectRoute) onSelectRoute(route.id);
      });

      const routePopup = `
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong>${route.name}</strong><br/>
          <span>${route.distanceKm} km • ${route.durationMinutes} mins</span><br/>
          <span style="color: ${route.type === 'SAFEST' ? '#0d9488' : '#d97706'}; font-weight: bold;">
            Safety Score: ${route.safetyScore}/100 (${route.safetyLevel})
          </span><br/>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 11px;">${route.tradeOffSummary}</p>
        </div>
      `;
      polyline.bindPopup(routePopup);
      layerGroup.addLayer(polyline);

      // Add Start and End draggable markers for the selected route
      if (isSelected && latLngs.length > 0) {
        // Departure (Origin) Pin A
        const originIcon = L.divIcon({
          className: 'custom-pin-a',
          html: `<div style="background:#10b981;color:#ffffff;width:28px;height:28px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;cursor:grab;" title="Drag to adjust Departure Point">A</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const startMarker = L.marker(latLngs[0], {
          icon: originIcon,
          draggable: true,
          title: 'Departure Point (A) - Drag to adjust',
        }).bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <span style="font-size: 10px; text-transform: uppercase; color: #10b981; font-weight: bold;">Departure Point (A)</span>
            <div style="font-weight: bold; color: #0f172a; margin-top: 2px;">${(route.waypoints[0] as any).name || 'Origin Point'}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">💡 Drag this pin to pinpoint your exact departure address</div>
          </div>
        `);

        startMarker.on('dragend', (e: any) => {
          const newLatLng = e.target.getLatLng();
          onSetOriginRef.current?.({ lat: newLatLng.lat, lng: newLatLng.lng });
        });

        // Destination Pin B
        const destIcon = L.divIcon({
          className: 'custom-pin-b',
          html: `<div style="background:#ef4444;color:#ffffff;width:28px;height:28px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;cursor:grab;" title="Drag to adjust Destination Point">B</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const endMarker = L.marker(latLngs[latLngs.length - 1], {
          icon: destIcon,
          draggable: true,
          title: 'Destination Point (B) - Drag to adjust',
        }).bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <span style="font-size: 10px; text-transform: uppercase; color: #ef4444; font-weight: bold;">Destination Point (B)</span>
            <div style="font-weight: bold; color: #0f172a; margin-top: 2px;">${(route.waypoints[route.waypoints.length - 1] as any).name || 'Destination Point'}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">💡 Drag this pin to adjust your destination</div>
          </div>
        `);

        endMarker.on('dragend', (e: any) => {
          const newLatLng = e.target.getLatLng();
          onSetDestRef.current?.({ lat: newLatLng.lat, lng: newLatLng.lng });
        });

        layerGroup.addLayer(startMarker);
        layerGroup.addLayer(endMarker);

        // Smoothly fit map to show departure, destination, and the route
        try {
          const bounds = L.latLngBounds(latLngs);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
        } catch {
          // ignore map bounds error
        }
      }
    });

    // 3. Render User GPS Location Marker if available
    if (userLocation) {
      const userCircle = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 10,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 3,
        fillOpacity: 1,
      }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px;">
          <span style="font-size: 10px; text-transform: uppercase; color: #3b82f6; font-weight: bold;">📍 Current Position Detected</span>
          <div style="font-weight: bold; color: #0f172a; margin-top: 2px;">${userLocation.label || 'Your Current Position'}</div>
          ${userLocation.accuracy ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">Accuracy: ±${Math.round(userLocation.accuracy)}m</div>` : ''}
          <div style="font-size: 10px; color: #0d9488; font-weight: bold; margin-top: 4px;">💡 If off, drag Pin A or click anywhere to adjust</div>
        </div>
      `);

      const pulseCircle = L.circle([userLocation.lat, userLocation.lng], {
        radius: userLocation.accuracy ? Math.min(userLocation.accuracy, 1500) : 150,
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.15,
        weight: 1,
        dashArray: '3, 3',
      });

      layerGroup.addLayer(pulseCircle);
      layerGroup.addLayer(userCircle);
    }
  }, [heatPoints, routes, selectedRouteId, userLocation]);

  // Ensure map tiles redraw properly when tab is shown
  useEffect(() => {
    if (mapInstanceRef.current && isActive) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />

      {/* Active Pinning Mode Top Banner */}
      {pinningMode !== 'NONE' && (
        <div className="absolute top-3 left-3 right-3 z-[500] bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl shadow-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {pinningMode === 'ORIGIN'
                ? '🎯 Click anywhere on the map to set Departure Point'
                : '🎯 Click anywhere on the map to set Destination'}
            </span>
          </div>
          <button
            type="button"
            onClick={onResetPinningMode}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[10px] font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Interactive Helper Banner */}
      {pinningMode === 'NONE' && (
        <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-[11px] text-slate-700 flex items-center space-x-2 pointer-events-auto">
          <span>💡</span>
          <span className="font-semibold text-slate-800">
            Click map or drag pins <strong className="text-emerald-700 font-extrabold">(A)</strong> / <strong className="text-rose-700 font-extrabold">(B)</strong> to adjust exact locations
          </span>
        </div>
      )}
      
      {/* Visual map legend overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-slate-200 shadow-lg text-[11px] text-slate-700 pointer-events-auto">
        <div className="font-bold text-slate-900 mb-1 flex items-center space-x-1.5">
          <span>Safety Legend</span>
        </div>
        <div className="flex items-center space-x-1.5 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Lower Concern (75-100)</span>
        </div>
        <div className="flex items-center space-x-1.5 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Caution (50-74)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          <span>Elevated Concern (&lt;50)</span>
        </div>
      </div>
    </div>
  );
};
