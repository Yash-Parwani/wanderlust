// Filter types
export interface Filters {
  category: string
  priceRange: [number, number]
  guestCount: number
  startDate: Date | null
  endDate: Date | null
}

// Listing types
export interface Host {
  name: string;
  rating: number;
  image?: string; // Make image optional
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  category: string;
  maxGuests: number;
  images: string[];
  rating: number;
  latitude: number;
  longitude: number;
  amenities: string[];
  host: Host;
}

// Component Props
export interface FilterBarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export interface ListingCardProps {
  listing: Listing
}

export interface ClientMapProps {
  listings: Listing[]
} 