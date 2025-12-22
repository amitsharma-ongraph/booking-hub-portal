'use client';

import React, { useMemo } from 'react';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStatCard from '@/components/cards/DashboardStatCard';
import TodaySchedule from '@/components/dashboard/TodaySchedule';
import { useCompanyContext } from '@/contexts/CompanyContext';

export default function DashboardPage() {
  const theme = useTheme();
  const { getDashboardData } = useCompanyContext();
  
  const dashboardData = useMemo(() => getDashboardData(), [getDashboardData]);

  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  // Format rating to 1 decimal place
  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };

  return (
    <MainLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.custom.heading.dashboard,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.custom.text.subtitle,
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Welcome back! Here's your business overview.
          </Typography>
        </Box>

        {/* Dashboard Stat Cards - Matching SVG Design */}
        <Grid container spacing={3}>
          {/* Card 1 */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <DashboardStatCard
              title="Total Bookings"
              icon="/images/icons/bookings-icon.svg"
              value={formatNumber(dashboardData.totalBookings)}
            />
          </Grid>

          {/* Card 2 */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <DashboardStatCard
              title="Upcoming Schedules"
              icon="/images/icons/calendar-icon.svg"
              value={formatNumber(dashboardData.upcomingSchedules)}
            />
          </Grid>

          {/* Card 3 */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <DashboardStatCard
              title="Average Rating"
              icon="/images/icons/star.svg"
              value={formatRating(dashboardData.averageRating)}
            />
          </Grid>
        </Grid>

        {/* Today's Schedule Section */}
        <TodaySchedule />
      </Box>
    </MainLayout>
  );
}
