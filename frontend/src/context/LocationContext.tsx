import React, { createContext, useContext, useState, useEffect } from 'react';
import { GeocodingService } from '../services/geocodingService';

export interface LocationState {
  originName: string;
  originInput: string;
  originCoords: { lat: number; lng: number };
  destName: string;
  destInput: string;
  destCoords: { lat: number; lng: number };
  userLocation: { lat: number; lng: number; label: string; accuracy?: number } | null;
  activeRouteDistanceKm: number;
  activeRouteDurationMinutes: number;
  selectedRouteName: string;
  selectedRouteType: 'SAFEST' | 'FASTEST' | 'BALANCED';
  activeHour: number;
}

interface LocationContextType extends LocationState {
  setOrigin: (name: string, coords: { lat: number; lng: number }, input?: string) => void;
  setOriginInput: (input: string) => void;
  setDestination: (name: string, coords: { lat: number; lng: number }, input?: string) => void;
  setDestInput: (input: string) => void;
  setUserLocation: (loc: { lat: number; lng: number; label: string; accuracy?: number } | null) => void;
  setActiveRouteInfo: (distanceKm: number, durationMinutes?: number, routeName?: string, routeType?: 'SAFEST' | 'FASTEST' | 'BALANCED') => void;
  setActiveHour: (hour: number) => void;
  swapWaypoints: () => void;
}

const defaultState: LocationState = {
  originName: 'Connaught Place',
  originInput: 'Connaught Place',
  originCoords: { lat: 28.6315, lng: 77.2167 },
  destName: 'India Gate',
  destInput: 'India Gate',
  destCoords: { lat: 28.6129, lng: 77.2295 },
  userLocation: null,
  activeRouteDistanceKm: 4.5,
  activeRouteDurationMinutes: 18,
  selectedRouteName: 'Safest Route (Well-lit Arterials)',
  selectedRouteType: 'SAFEST',
  activeHour: new Date().getHours(),
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LocationState>(defaultState);

  const setOrigin = (name: string, coords: { lat: number; lng: number }, input?: string) => {
    setState((prev) => ({
      ...prev,
      originName: name,
      originInput: input !== undefined ? input : name,
      originCoords: coords,
    }));
  };

  const setOriginInput = (input: string) => {
    setState((prev) => ({ ...prev, originInput: input }));
  };

  const setDestination = (name: string, coords: { lat: number; lng: number }, input?: string) => {
    setState((prev) => ({
      ...prev,
      destName: name,
      destInput: input !== undefined ? input : name,
      destCoords: coords,
    }));
  };

  const setDestInput = (input: string) => {
    setState((prev) => ({ ...prev, destInput: input }));
  };

  const setUserLocation = (loc: { lat: number; lng: number; label: string } | null) => {
    setState((prev) => ({
      ...prev,
      userLocation: loc,
      ...(loc
        ? {
            originName: loc.label,
            originInput: loc.label,
            originCoords: { lat: loc.lat, lng: loc.lng },
          }
        : {}),
    }));
  };

  const setActiveRouteInfo = (
    distanceKm: number,
    durationMinutes: number = 20,
    routeName: string = 'Arterial Route',
    routeType: 'SAFEST' | 'FASTEST' | 'BALANCED' = 'SAFEST'
  ) => {
    setState((prev) => ({
      ...prev,
      activeRouteDistanceKm: Math.max(0.5, Math.round(distanceKm * 10) / 10),
      activeRouteDurationMinutes: durationMinutes,
      selectedRouteName: routeName,
      selectedRouteType: routeType,
    }));
  };

  const setActiveHour = (hour: number) => {
    setState((prev) => ({
      ...prev,
      activeHour: hour,
    }));
  };

  const swapWaypoints = () => {
    setState((prev) => ({
      ...prev,
      originName: prev.destName,
      originInput: prev.destInput,
      originCoords: prev.destCoords,
      destName: prev.originName,
      destInput: prev.originInput,
      destCoords: prev.originCoords,
    }));
  };

  return (
    <LocationContext.Provider
      value={{
        ...state,
        setOrigin,
        setOriginInput,
        setDestination,
        setDestInput,
        setUserLocation,
        setActiveRouteInfo,
        setActiveHour,
        swapWaypoints,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationState = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationState must be used within a LocationProvider');
  }
  return context;
};
