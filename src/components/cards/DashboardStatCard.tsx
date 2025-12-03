'use client';

import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import SvgIconWrapper from '@/components/icons/SvgIconWrapper';

export interface DashboardStatCardProps {
  title: string;
  /**
   * Icon can be:
   * - SVG component: import BookingsIcon from "@/assets/icons/bookings-icon.svg"
   * - String path: "/images/icons/bookings-icon.svg"
   */
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | string;
  value: string | number;
}

/**
 * Reusable dashboard stat card component
 * Matches the SVG design exactly:
 * - White background
 * - 15.5796px border radius
 * - Shadow effect (black with 0.1 opacity)
 * - Title on top left (#0A0A0A)
 * - Icon on top right (#CFA09F)
 * - Value on bottom left (#A3B899) with padding
 */
export default function DashboardStatCard({
  title,
  icon,
  value,
}: DashboardStatCardProps) {
  // Check if icon is a string path or SVG component
  const isStringPath = typeof icon === 'string';

  return (
    <Card
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '15.5796px',
        boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
        height: '131px',
        width: '100%',
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Header: Title (top left) and Icon (top right) */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 'auto',
          }}
        >
          {/* Title - Top Left */}
          <Typography
            sx={{
              color: '#0A0A0A',
              fontSize: '0.875rem',
              fontWeight: 400,
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            {title}
          </Typography>

          {/* Icon - Top Right */}
          <Box
            sx={{
              ml: 2,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SvgIconWrapper
              src={isStringPath ? (icon as string) : (icon as React.ComponentType<React.SVGProps<SVGSVGElement>>)}
              size={isStringPath ? 24 : undefined}
              sx={{
                color: '#CFA09F',
                fontSize: isStringPath ? undefined : '1.5rem',
              }}
            />
          </Box>
        </Box>

        {/* Value - Bottom Left with padding */}
        <Box
          sx={{
            mt: 'auto',
            pt: 1,
          }}
        >
          <Typography
            sx={{
              color: '#A3B899',
              fontSize: '1.5rem',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

