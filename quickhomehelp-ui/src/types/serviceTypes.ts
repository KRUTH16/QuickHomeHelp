export interface ServiceForm {
  name: string;
  category: string;
  baseDuration: string;
  basePrice: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  baseDuration: number;
  basePrice: number;
}

export interface ServiceOption {
  id: number;
  name: string;
  category: string;
}

export interface UserPreview {
  id: number;
  name: string;
}

export interface ExpertProfile {
  id: number;
  user: UserPreview;
  services: ServiceOption[];
  pincode: string;
  address: string;
  trainingDone: boolean;
  verified: boolean;
  rejected?: boolean;
  online: boolean;
}

export interface ExpertProfileFormState {
  serviceIds: number[];
  pincode: string;
  address: string;
}
