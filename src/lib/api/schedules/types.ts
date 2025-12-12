/**
 * Schedules API Types
 */

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

export interface Session {
  id: string;
  totalNumberOfSeats: number;
  availableNumberOfSeats: number;
  startTime: string;
  endTime: string;
  bookings: Booking[];
}

export interface ScheduleDto {
  id: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  categoryName: string;
  categoryOptionName: string;
  sessions: Session[];
}
