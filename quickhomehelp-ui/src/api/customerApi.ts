import api from "./axios";
import type { Booking, BookingRequest, Notification } from "../types/bookingTypes";
import type { Rating } from "../types/ratingTypes";
import type { Customer } from "../types/authTypes";
import type { Service } from "../types/serviceTypes";

export const getCustomerProfile = (userId: string) => {
  return api.get<Customer>(`/customer/${userId}`);
};

export const getCustomerServices = () => {
  return api.get<Service[]>("/customer/services");
};

export const createCustomerBooking = (userId: string, payload: BookingRequest) => {
  return api.post(`/customer/bookings?userId=${userId}`, payload);
};

export const getCustomerBookings = (customerId: string) => {
  return api.get<Booking[]>(`/customer/bookings?customerId=${customerId}`);
};

export const submitCustomerRating = (payload: Rating) => {
  return api.post("/ratings", payload);
};

export const getCustomerNotifications = (userId: string) => {
  return api.get<Notification[]>(`/notifications/${userId}`);
};

export const markCustomerNotificationsRead = (userId: string) => {
  return api.patch(`/notifications/read-all/${userId}`);
};
