/**
 * Companies API Types
 */

export interface CompanyDto {
  id: string;
  name: string;
  emailAddress: string;
  accountNumber: string;
  location: string;
  description: string;
  phoneNumber: string;
  whatsappNumber: string;
  logo: string;
  tiktokUrl: string;
  instagramUrl: string;
  firebaseToken: string;
  images: string[];
  categories: Category[];
  services: Service[];
  ratings: Rating[];
  bookings: Booking[];
}

export interface Category {
  id: string;
  name: string;
  options: CategoryOption[];
}

export interface CategoryOption {
  id: string;
  name: string;
  price: number;
  schedules: Schedule[];
}

export interface Schedule {
  id: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  categoryName: string;
  categoryOptionName: string;
  sessions: Session[];
}

export interface Session {
  id: string;
  totalNumberOfSeats: number;
  availableNumberOfSeats: number;
  startTime: string;
  endTime: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  companyId: string;
  customerId: string;
  price: number;
  status: string;
  customerName: string;
  rated: boolean;
  numberOfSeats: number;
}

export interface Service {
  id: string;
  name: string;
  image: string | null;
}

export interface Rating {
  id: string;
  customerName: string;
  score: number;
  feedback: string;
  creationDate: string;
}

/**
 * Basic company info (from companies list endpoint)
 */
export interface CompanyBasicDto {
  id: string;
  name: string;
  emailAddress: string;
  accountNumber: string;
  location: string;
  description: string;
  phoneNumber: string;
  whatsappNumber: string;
  logo: string;
  tiktokUrl: string;
  instagramUrl: string;
  firebaseToken: string;
  images: string[];
  categories: Category[];
}

/**
 * Request DTO for updating a company
 */
export interface UpdateCompanyRequestDto {
  name: string;
  emailAddress: string;
  accountNumber: string;
  location: string;
  description: string;
  phoneNumber: string;
  whatsappNumber: string;
  logo: string;
  tiktokUrl: string;
  instagramUrl: string;
  firebaseToken: string;
  services: string[];
}

/**
 * Request DTO for creating a new company
 * Matches POST /companies request body
 */
export interface CreateCompanyRequestDto {
  name: string;
  emailAddress: string;
  accountNumber: string;
  location: string;
  description: string;
  phoneNumber: string;
  logo: string;
  tiktokUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  bankName: string;
  firebaseToken: string;
  services: string[];
}



