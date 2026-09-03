export interface Image {
  id: string;
  url: string;
  alt: string;
  isCover: boolean;
}

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  image: string;
  slug: string;
  description: string;
  propertyCount: number;
  coordinates: { lat: number; lng: number };
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: "essentials" | "entertainment" | "kitchen" | "comfort" | "safety" | "outdoor" | "bathroom";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  propertyCount: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: "guest" | "host" | "admin";
  bio?: string;
  joinedDate: string;
  isVerified: boolean;
  responseRate?: number;
  responseTime?: string;
  languages?: string[];
  hostSince?: string;
  totalProperties?: number;
  superhost?: boolean;
}

export interface Pricing {
  nightlyRate: number;
  cleaningFee: number;
  serviceFeeRate: number;
  currency: "NGN" | "USD";
  minNights: number;
  maxNights: number;
  cautionFee?: number;
  rates?: { label: string; price: number }[];
}

export interface Capacity {
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
}

export interface Ratings {
  average: number;
  count: number;
  breakdown: {
    cleanliness: number;
    accuracy: number;
    checkIn: number;
    communication: number;
    location: number;
    value: number;
  };
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: string;
  images: Image[];
  host: User;
  location: {
    city: City;
    neighborhood: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  pricing: Pricing;
  capacity: Capacity;
  amenities: Amenity[];
  categories: Category[];
  rules: string[];
  cancellationPolicy: "flexible" | "moderate" | "strict";
  cancellationDescription: string;
  ratings: Ratings;
  availability: { start: string; end: string }[];
  isFeatured: boolean;
  isNew: boolean;
  isLuxury: boolean;
  createdAt: string;
  viewsCount: number;
  saveCount: number;
}

export interface Review {
  id: string;
  propertyId: string;
  guest: User;
  rating: number;
  text: string;
  date: string;
  response?: string;
  responseDate?: string;
}

export interface Booking {
  id: string;
  property: Property;
  guest: User;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  createdAt: string;
  confirmationCode: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
