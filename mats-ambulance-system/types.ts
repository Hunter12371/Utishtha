
export enum AmbulanceStatus {
  AVAILABLE = 'available',
  ENROUTE = 'enroute',
  HOSPITAL = 'hospital',
  OFFLINE = 'offline'
}

export enum TripStatus {
  REQUESTED = 'requested',
  ASSIGNED = 'assigned',
  ENROUTE = 'enroute',
  ARRIVED = 'arrived',
  COMPLETED = 'completed'
}

export type AuthRole = 'admin' | 'vendor';

export interface User {
  id: string;
  email: string;
  role: AuthRole;
  name: string;
  unitId?: string; // For vendors
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Ambulance {
  id: string;
  driver_name: string;
  driver_phone: string;
  location: Location;
  status: AmbulanceStatus;
  last_updated: string;
}

export interface Hospital {
  name: string;
  location: Location;
  distance?: string;
}

export interface Trip {
  id: string;
  ambulance_id?: string;
  patient_name: string;
  patient_phone: string;
  pickup_location: Location;
  hospital_name: string;
  hospital_location: Location;
  status: TripStatus;
  start_time: string;
  end_time?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface DispatchRecommendation {
  nearestAmbulanceId: string;
  hospitals: Hospital[];
  rationale: string;
}
