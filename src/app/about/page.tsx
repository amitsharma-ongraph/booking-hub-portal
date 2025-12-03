'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';

const features = [
  {
    icon: <SpeedIcon />,
    title: 'Fast & Efficient',
    description: 'Streamlined booking process for quick appointments',
  },
  {
    icon: <SecurityIcon />,
    title: 'Secure & Reliable',
    description: 'Your data is protected with industry-standard security',
  },
  {
    icon: <SupportIcon />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for your convenience',
  },
];

const benefits = [
  'Easy appointment scheduling',
  'Real-time availability updates',
  'Automated reminders and notifications',
  'Comprehensive reporting and analytics',
  'Multi-category service management',
  'Customer feedback and ratings',
];

export default function AboutPage() {
  return (
    <MainLayout>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            About Booking Hub
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Your all-in-one solution for managing bookings, schedules, and customer relationships
          </Typography>
        </Box>

        {/* Hero Card */}
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)', color: 'white' }}>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto',
                mb: 3,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              BH
            </Avatar>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Simplify Your Booking Management
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', opacity: 0.95 }}>
              Booking Hub is designed to help businesses manage their appointments, schedules, and customer
              interactions efficiently. Whether you're running a salon, clinic, consulting firm, or any
              service-based business, we've got you covered.
            </Typography>
          </CardContent>
        </Card>

        {/* Features */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ py: 4 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Benefits */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Key Benefits
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Everything you need to manage your bookings effectively
            </Typography>
            <List>
              {benefits.map((benefit, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h3" fontWeight={700} color="primary">
                  10K+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h3" fontWeight={700} color="primary">
                  50K+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bookings Managed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h3" fontWeight={700} color="primary">
                  99%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer Satisfaction
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
