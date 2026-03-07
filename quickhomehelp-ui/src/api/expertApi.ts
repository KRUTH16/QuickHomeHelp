import api from "./axios";
import type { Job, Notification } from "../types/bookingTypes";
import type { Review } from "../types/ratingTypes";
import type { ExpertProfile, ServiceOption } from "../types/serviceTypes";

export const getExpertProfile = (userId: string) => {
  return api.get<ExpertProfile>(`/expert/profile/${userId}`);
};

export const getServicesForExpertProfile = () => {
  return api.get<ServiceOption[]>("/admin/services");
};

export const updateExpertProfile = (payload: {
  userId: number;
  serviceIds: number[];
  pincode: string;
  address: string;
}) => {
  return api.patch("/expert/profile/update", payload);
};

export const setExpertOnlineStatus = (profileId: number, status: boolean) => {
  return api.patch(`/expert/profile/${profileId}/online?status=${status}`);
};

export const getExpertJobs = (expertId: string, status: string) => {
  return api.get<Job[]>(`/expert/bookings?expertId=${expertId}&status=${status}`);
};

export const acceptExpertJob = (bookingId: number) => {
  return api.patch(`/expert/bookings/${bookingId}/accept`);
};

export const rejectExpertJob = (bookingId: number) => {
  return api.patch(`/expert/bookings/${bookingId}/reject`);
};

export const startExpertJob = (bookingId: number) => {
  return api.patch(`/expert/bookings/${bookingId}/start`);
};

export const pauseExpertJob = (bookingId: number) => {
  return api.patch(`/expert/bookings/${bookingId}/pause`);
};

export const resumeExpertJob = (bookingId: number) => {
  return api.patch(`/expert/bookings/${bookingId}/resume`);
};

export const completeExpertJob = (bookingId: number) => {
  return api.patch(`/expert/bookings/${bookingId}/complete`);
};

export const verifyExpertJobOtp = (bookingId: number, otp: string) => {
  return api.post(`/expert/bookings/${bookingId}/verify-otp`, { otp });
};

export const getBookingRating = (bookingId: number) => {
  return api.get<Review>(`/ratings/booking/${bookingId}`);
};

export const collectBookingPayment = (bookingId: number, method: string) => {
  return api.post("/payments/collect", null, {
    params: {
      bookingId,
      method,
    },
  });
};

export const getExpertNotifications = (userId: string) => {
  return api.get<Notification[]>(`/notifications/${userId}`);
};

export const markExpertNotificationsRead = (userId: string) => {
  return api.patch(`/notifications/read-all/${userId}`);
};
