export interface RestaurantItem {
  id: string;
  name: string;
  slug: string;
  cuisine: string[];
  rating: number;
  image?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'pending_approval' | 'suspended';
}
