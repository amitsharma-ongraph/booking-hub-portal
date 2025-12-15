'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { format } from 'date-fns';
import ScheduleCard, { ScheduleCardProps } from '@/components/cards/ScheduleCard';
import { useSchedulesContext } from '@/contexts/SchedulesContext';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import type { ScheduleDto } from '@/lib/api/schedules/types';

export interface TodayScheduleProps {
  schedules?: ScheduleCardProps[];
}

/**
 * Today's Schedule component
 * Displays a list of schedule cards for today
 * Integrates with SchedulesContext to show real booking data
 */
export default function TodaySchedule({ schedules: propSchedules }: TodayScheduleProps) {
  const { schedules, isLoading } = useSchedulesContext();

  /**
   * Format time from ISO string to 12-hour format (e.g., "09:00 AM")
   */
  const formatTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return format(date, 'hh:mm a');
    } catch {
      return isoString;
    }
  };

  /**
   * Map booking status to card status
   */
  const mapBookingStatus = (status: string): 'completed' | 'pending' | 'upcoming' => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') {
      return 'completed';
    }
    if (statusLower === 'pending' || statusLower === 'confirmed') {
      return 'pending';
    }
    return 'upcoming';
  };

  /**
   * Transform schedule data to schedule cards
   * Filters for today's schedules and extracts bookings
   */
  const transformedSchedules = useMemo(() => {
    // If prop schedules are provided, use them (for backward compatibility)
    if (propSchedules && propSchedules.length > 0) {
      return propSchedules;
    }

    // If no schedules from context, return empty array
    if (!schedules || schedules.length === 0) {
      return [];
    }

    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');

    // Collect all bookings from today's sessions with their original session start time for sorting
    const todayBookings: Array<ScheduleCardProps & { sessionStartTime: string }> = [];

    schedules.forEach((schedule: ScheduleDto) => {
      // Check if schedule date range includes today
      const scheduleStartDate = schedule.startDate.split('T')[0];
      const scheduleEndDate = schedule.endDate.split('T')[0];

      // Check if today falls within the schedule date range
      if (todayString >= scheduleStartDate && todayString <= scheduleEndDate) {
        // Process each session in the schedule
        schedule.sessions.forEach((session) => {
          // Check if session is today
          const sessionDate = session.startTime.split('T')[0];
          if (sessionDate === todayString) {
            // Extract bookings from this session
            if (session.bookings && session.bookings.length > 0) {
              session.bookings.forEach((booking) => {
                todayBookings.push({
                  time: formatTime(session.startTime),
                  serviceName: schedule.categoryOptionName || schedule.categoryName || 'Service',
                  clientName: booking.customerName || 'Customer',
                  status: mapBookingStatus(booking.status),
                  sessionStartTime: session.startTime, // Keep original for sorting
                });
              });
            }
          }
        });
      }
    });

    // Sort by session start time (ascending) using ISO string comparison
    return todayBookings
      .sort((a, b) => {
        return new Date(a.sessionStartTime).getTime() - new Date(b.sessionStartTime).getTime();
      })
      .map(({ sessionStartTime, ...booking }) => booking); // Remove sessionStartTime from final result
  }, [schedules, propSchedules]);

  // Show loading state
  if (isLoading) {
    return (
      <Card
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '15.5796px',
          boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
          mt: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            sx={{
              color: '#0A0A0A',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              fontWeight: 600,
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            Today's Schedule
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <LoadingSpinner text="Loading schedule..." />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const displaySchedules = transformedSchedules;

  return (
    <Card
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '15.5796px',
        boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
        mt: 4,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Typography
          sx={{
            color: '#0A0A0A',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 3,
          }}
        >
          Today's Schedule
        </Typography>

        {/* Schedule Cards - One per row, full width, scrollable */}
        {displaySchedules.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: '400px',
              overflowY: 'auto',
              // Hide scrollbar
              scrollbarWidth: 'none', // Firefox
              '&::-webkit-scrollbar': {
                display: 'none', // Chrome, Safari, Edge
              },
            }}
          >
            {displaySchedules.map((schedule, index) => (
              <ScheduleCard
                key={`${schedule.time}-${schedule.clientName}-${index}`}
                time={schedule.time}
                serviceName={schedule.serviceName}
                clientName={schedule.clientName}
                status={schedule.status}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <Typography
              sx={{
                color: '#666666',
                fontSize: '0.9375rem',
                fontWeight: 400,
              }}
            >
              No bookings scheduled for today
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

