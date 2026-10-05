export interface UserAddress {
  id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  addresses: UserAddress[];
  preferences?: {
    notifications?: boolean;
    darkTheme?: boolean;
  };
}
