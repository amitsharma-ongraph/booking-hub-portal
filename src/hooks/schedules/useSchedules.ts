/**
 * useSchedules Hook
 * Provides schedule-specific operations and data transformations
 * Note: For detailed schedule data, use SchedulesContext instead
 * This hook is kept for backward compatibility and specific use cases
 */

import { useCallback } from 'react';
import { useSchedulesContext } from '@/contexts/SchedulesContext';
import type { ScheduleDto, Session, Booking } from '@/lib/api/schedules/types';

/**
 * Booking session data for calendar UI
 */
export interface BookingSession {
  id: string;
  totalNumberOfSeats: number;
  availableNumberOfSeats: number;
  startTime: string;
  endTime: string;
  bookings: Booking[];
}

/**
 * Date event data for calendar
 */
export interface DateEvent {
  date: string; // YYYY-MM-DD format
  sessions: BookingSession[];
  totalBookings: number;
  categories: string[];
}

export function useSchedules() {
  const { schedules, isLoading, error, refreshSchedules, clearError } = useSchedulesContext();

  /**
   * Transform schedules data to get events grouped by date
   * Returns a map of dates with their associated events
   */
  const getDateEvents = useCallback((): Map<string, DateEvent> => {
    const eventsMap = new Map<string, DateEvent>();

    schedules.forEach((schedule) => {
      const datePart = schedule.startDate.split('T')[0]; // Extract YYYY-MM-DD

      if (!eventsMap.has(datePart)) {
        eventsMap.set(datePart, {
          date: datePart,
          sessions: [],
          totalBookings: 0,
          categories: [],
        });
      }

      const dateEvent = eventsMap.get(datePart)!;

      // Add sessions from this schedule
      schedule.sessions.forEach((session) => {
        dateEvent.sessions.push({
          id: session.id,
          totalNumberOfSeats: session.totalNumberOfSeats,
          availableNumberOfSeats: session.availableNumberOfSeats,
          startTime: session.startTime,
          endTime: session.endTime,
          bookings: session.bookings,
        });
        dateEvent.totalBookings += session.bookings.length;
      });

      // Add category name if not already present
      if (!dateEvent.categories.includes(schedule.categoryName)) {
        dateEvent.categories.push(schedule.categoryName);
      }
    });

    return eventsMap;
  }, [schedules]);

  return {
    // State
    schedules,
    isLoading,
    error,

    // Functions
    refreshSchedules,
    clearError,
    getDateEvents,
  };
}
