import type { Service } from "./serviceTypes";

export interface Booking {
  id: number;
  status: string;
  address: string;
  pincode: string;
  amount: number;
  otp?: string;
  paymentStatus: string;
  rated: boolean;
}

export interface Job {
  id: number;
  address: string;
  pincode: string;
  amount: number;
  status: string;
  paymentStatus: string;
  startTime?: string;
  pauseTime?: string;
  pausedSeconds?: number;
}

export interface BookingRequest {
  serviceId: number;
  durationMinutes: number;
  address: string;
  pincode: string;
}
export interface Notification {
  id: number;
  message: string;
  readStatus: boolean;
}
export interface BookingFormProps {
  service: Service;
  close: () => void;
}
export interface PaymentProps {
  bookingId: number;
  amount: number;
  refresh: () => void;
}
export interface OtpModalProps {
  bookingId: number;
  close: () => void;
  refresh: () => void;
}
export interface JobCardProps {
  job: Job;
  refresh: () => void;
}
