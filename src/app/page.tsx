'use client';

import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStatCard from '@/components/cards/DashboardStatCard';
import TodaySchedule from '@/components/dashboard/TodaySchedule';

export default function DashboardPage() {
  return (
    <MainLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#0A0A0A',
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
              color: '#6A7282',
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardStatCard
              title="Total Bookings"
              icon="/images/icons/bookings-icon.svg"
              value="1,234"
            />
          </Grid>

          {/* Card 2 */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardStatCard
              title="Active Customers"
              icon="/images/icons/calendar-icon.svg"
              value="856"
            />
          </Grid>

          {/* Card 3 */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardStatCard
              title="Revenue"
              icon="/images/icons/star.svg"
              value="$45,678"
            />
          </Grid>
        </Grid>

        {/* Today's Schedule Section */}
        <TodaySchedule />
      </Box>
    </MainLayout>
  );
}
