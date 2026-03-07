import api from "./axios";
import type { ExpertProfile, Service } from "../types/serviceTypes";

export const addService = (payload: {
  name: string;
  category: string;
  baseDuration: number;
  basePrice: number;
}) => {
  return api.post("/admin/services", payload);
};

export const getAdminServices = () => {
  return api.get<Service[]>("/admin/services");
};

export const deleteAdminService = (id: number) => {
  return api.delete(`/admin/services/${id}`);
};

export const updateAdminService = (id: number, payload: Service) => {
  return api.put(`/admin/services/${id}`, payload);
};

export const getExpertsForVerification = () => {
  return api.get<ExpertProfile[] | { data: ExpertProfile[] }>("/admin/experts");
};

export const markExpertTrainingDone = (id: number) => {
  return api.patch(`/admin/experts/${id}/training`);
};

export const verifyExpert = (id: number) => {
  return api.patch(`/admin/experts/${id}/verify`);
};

export const rejectExpert = (id: number) => {
  return api.patch(`/admin/experts/${id}/reject`);
};
