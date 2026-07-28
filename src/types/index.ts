import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);

export type PortfolioRecord = {
  id: string;
  title: string;
  clientName: string;
  category: string;
  description: string;
  thumbnail?: string;
  gallery?: string[];
  youtubeLink?: string;
  vimeoLink?: string;
  completionDate?: string;
  featured: boolean;
  published: boolean;
  created: string;
  updated: string;
};

export type ServiceRecord = {
  id: string;
  title: string;
  description: string;
  icon: string;
  startingPrice: number;
  coverImage?: string;
  featured: boolean;
  published: boolean;
  created: string;
  updated: string;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created: string;
  updated: string;
};

export type ProductRecord = {
  id: string;
  name: string;
  description: string;
  category?: string;
  categoryExpand?: CategoryRecord;
  salePrice: number;
  rentalPrice: number;
  stock: number;
  condition: string;
  images?: string[];
  brand: string;
  serialNumber: string;
  available: boolean;
  featured: boolean;
  productType: string;
  published: boolean;
  created: string;
  updated: string;
};

export type RentalBookingRecord = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  product: string;
  productExpand?: ProductRecord;
  pickupDate: string;
  returnDate: string;
  status: string;
  notes: string;
  created: string;
  updated: string;
};

export type TestimonialRecord = {
  id: string;
  customerName: string;
  photo?: string;
  company: string;
  review: string;
  rating: number;
  published: boolean;
  featured: boolean;
  created: string;
  updated: string;
};

export type GalleryRecord = {
  id: string;
  image: string;
  category: string;
  altText: string;
  featured: boolean;
  displayOrder: number;
  created: string;
  updated: string;
};

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: string;
  featured: boolean;
  created: string;
  updated: string;
};

export type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  archived: boolean;
  created: string;
  updated: string;
};

export type HomepageSettingsRecord = {
  id: string;
  heroImage?: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  created: string;
  updated: string;
};

export type SiteSettingsRecord = {
  id: string;
  logo?: string;
  favicon?: string;
  businessName: string;
  address: string;
  openingHours: string;
  seoTitle: string;
  seoDescription: string;
  analyticsIds: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  created: string;
  updated: string;
};
