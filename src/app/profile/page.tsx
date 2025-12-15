'use client';

import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileTabContent from '@/components/profile/ProfileTabContent';
import AboutTabContent from '@/components/profile/AboutTabContent';
import RatingsTabContent from '@/components/profile/RatingsTabContent';
import { useCompanyContext } from '@/contexts/CompanyContext';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { company, isLoading, error } = useCompanyContext();

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'About' },
    { id: 'ratings', label: 'Ratings' },
  ];

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }

    if (!company) {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          No company data available. Please ensure you are logged in.
        </Alert>
      );
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileTabContent company={company} />;
      case 'settings':
        return <AboutTabContent company={company} />;
      case 'ratings':
        return <RatingsTabContent company={company} />;
      default:
        return <ProfileTabContent company={company} />;
    }
  };

  return (
    <MainLayout>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
          About Your Business
          </Typography>
          <Typography variant="body1" color="text.secondary">
          Manage your business information and details
          </Typography>
        </Box>

        {/* Tab Switcher */}
        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: { xs: 3, sm: 4, md: 5 },
            width: '100%',
          }}
        >
          {renderTabContent()}
        </Box>
      </Box>
    </MainLayout>
  );
}
