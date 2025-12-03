'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

export interface ScheduleCardProps {
  time: string;
  serviceName: string;
  clientName: string;
  status?: 'completed' | 'pending' | 'upcoming';
}

/**
 * Reusable schedule card component
 * Matches the SVG design:
 * - White background
 * - 9.75px border radius
 * - Border: #C3C1C1 with 0.5px width
 * - Two column layout: Time in first column, Service name and Client name in second column
 */
export default function ScheduleCard({
  time,
  serviceName,
  clientName,
  status = 'upcoming',
}: ScheduleCardProps) {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '9.75px',
        border: '0.5px solid #C3C1C1',
        p: 2,
        minHeight: '73.9158px',
        width: '100%',
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
      }}
    >
      {/* First Column: Time */}
      <Box
        sx={{
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            color: '#6A7282',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          {time}
        </Typography>
      </Box>

      {/* Second Column: Service Name and Client Name */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        {/* Service Name */}
        <Typography
          sx={{
            color: '#101828',
            fontSize: '0.9375rem',
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {serviceName}
        </Typography>

        {/* Client Name */}
        <Typography
          sx={{
            color: '#6A7282',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {clientName}
        </Typography>
      </Box>
    </Box>
  );
}

