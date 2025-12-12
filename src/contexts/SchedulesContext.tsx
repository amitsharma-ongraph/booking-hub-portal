/**
 * Schedules Context
 * Provides centralized schedule data throughout the app
 * Auto-fetches schedule data when company ID is available
 */

'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { schedulesService } from '@/lib/api/schedules/schedulesService';
import { useAuthContext } from './AuthContext';
import type { ScheduleDto } from '@/lib/api/schedules/types';
import type { ApiError } from '@/lib/api/client';

interface SchedulesContextType {
  schedules: ScheduleDto[];
  isLoading: boolean;
  error: string | null;
  refreshSchedules: () => Promise<void>;
  clearError: () => void;
  // State update methods for optimistic updates
  addSchedule: (schedule: ScheduleDto) => void;
  updateSchedule: (scheduleId: string, updatedSchedule: Partial<ScheduleDto>) => void;
  removeSchedule: (scheduleId: string) => void;
  updateSession: (scheduleId: string, sessionId: string, updatedSession: Partial<ScheduleDto['sessions'][0]>) => void;
  removeSession: (scheduleId: string, sessionId: string) => void;
  addSession: (scheduleId: string, session: ScheduleDto['sessions'][0]) => void;
}

const SchedulesContext = createContext<SchedulesContextType | undefined>(undefined);

export function SchedulesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthContext();
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);

  /**
   * Fetch schedules data by company ID
   * Internal function used by auto-fetch and refresh
   */
  const fetchSchedules = useCallback(async (companyId: string) => {
    // If we already have schedules for this company and no error, don't fetch again
    if (currentCompanyId === companyId && schedules.length > 0 && !error) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const schedulesData = await schedulesService.getSchedulesByCompanyId(companyId);
      console.log('📅 Schedules data fetched in SchedulesContext:', schedulesData);
      setSchedules(schedulesData);
      setCurrentCompanyId(companyId);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.errorMessage || 'Failed to fetch schedules');
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompanyId, schedules.length, error]);

  /**
   * Auto-fetch schedules data when user is authenticated
   * Only fetches if:
   * - User is authenticated
   * - User ID (company ID) is available
   * - Schedules data is not already loaded
   * - Not currently loading
   */
  useEffect(() => {
    if (isAuthenticated && user?.id && schedules.length === 0 && !isLoading) {
      fetchSchedules(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]); // Only fetch when auth state or user ID changes

  /**
   * Refresh schedules data (re-fetch current company's schedules)
   * Useful when you need fresh data (e.g., after updates)
   */
  const refreshSchedules = useCallback(async () => {
    if (currentCompanyId) {
      await fetchSchedules(currentCompanyId);
    } else if (user?.id) {
      // If no currentCompanyId but we have user ID, fetch it
      await fetchSchedules(user.id);
    }
  }, [currentCompanyId, user?.id, fetchSchedules]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Add a new schedule to the state
   */
  const addSchedule = useCallback((schedule: ScheduleDto) => {
    setSchedules((prev) => [...prev, schedule]);
  }, []);

  /**
   * Update an existing schedule in the state
   */
  const updateSchedule = useCallback((scheduleId: string, updatedSchedule: Partial<ScheduleDto>) => {
    setSchedules((prev) =>
      prev.map((schedule) => (schedule.id === scheduleId ? { ...schedule, ...updatedSchedule } : schedule))
    );
  }, []);

  /**
   * Remove a schedule from the state
   */
  const removeSchedule = useCallback((scheduleId: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== scheduleId));
  }, []);

  /**
   * Update a session in a schedule
   */
  const updateSession = useCallback(
    (scheduleId: string, sessionId: string, updatedSession: Partial<ScheduleDto['sessions'][0]>) => {
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === scheduleId
            ? {
                ...schedule,
                sessions: schedule.sessions.map((session) =>
                  session.id === sessionId ? { ...session, ...updatedSession } : session
                ),
              }
            : schedule
        )
      );
    },
    []
  );

  /**
   * Remove a session from a schedule
   */
  const removeSession = useCallback((scheduleId: string, sessionId: string) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, sessions: schedule.sessions.filter((session) => session.id !== sessionId) }
          : schedule
      )
    );
  }, []);

  /**
   * Add a session to a schedule
   */
  const addSession = useCallback((scheduleId: string, session: ScheduleDto['sessions'][0]) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, sessions: [...schedule.sessions, session] } : schedule
      )
    );
  }, []);

  return (
    <SchedulesContext.Provider
      value={{
        schedules,
        isLoading,
        error,
        refreshSchedules,
        clearError,
        addSchedule,
        updateSchedule,
        removeSchedule,
        updateSession,
        removeSession,
        addSession,
      }}
    >
      {children}
    </SchedulesContext.Provider>
  );
}

export function useSchedulesContext() {
  const context = useContext(SchedulesContext);
  if (context === undefined) {
    throw new Error('useSchedulesContext must be used within a SchedulesProvider');
  }
  return context;
}
