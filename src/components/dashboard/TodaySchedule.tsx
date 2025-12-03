'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import ScheduleCard, { ScheduleCardProps } from '@/components/cards/ScheduleCard';

export interface TodayScheduleProps {
  schedules?: ScheduleCardProps[];
}

/**
 * Today's Schedule component
 * Displays a list of schedule cards for today
 */
export default function TodaySchedule({ schedules }: TodayScheduleProps) {
  // Default mock data if no schedules provided
  const defaultSchedules: ScheduleCardProps[] = [
    {
      time: '09:00 AM',
      serviceName: 'Hair Cut',
      clientName: 'John Doe',
      status: 'completed',
    },
    {
      time: '10:30 AM',
      serviceName: 'Massage',
      clientName: 'Jane Smith',
      status: 'pending',
    },
    {
      time: '12:00 PM',
      serviceName: 'Facial',
      clientName: 'Mike Johnson',
      status: 'upcoming',
    },
    {
      time: '02:00 PM',
      serviceName: 'Yoga',
      clientName: 'Sarah Wilson',
      status: 'upcoming',
    },
    {
      time: '03:30 PM',
      serviceName: 'Hair Color',
      clientName: 'Emily Brown',
      status: 'upcoming',
    },
  ];

  const displaySchedules = schedules || defaultSchedules;

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
              key={index}
              time={schedule.time}
              serviceName={schedule.serviceName}
              clientName={schedule.clientName}
              status={schedule.status}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

