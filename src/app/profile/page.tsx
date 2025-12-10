'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileTabContent from '@/components/profile/ProfileTabContent';
import AboutTabContent from '@/components/profile/AboutTabContent';
import RatingsTabContent from '@/components/profile/RatingsTabContent';

// Mock data for now
const mockUserData = {
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'john.doe@example.com',
  phoneNumber: '+1 234-567-8900',
  userId: '123456789',
  accountNumber: 'Account #123456789',
  profilePicture: null,
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'About' },
    { id: 'ratings', label: 'Ratings' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTabContent initialData={mockUserData} />;
      case 'settings':
        return <AboutTabContent />;
      case 'ratings':
        return <RatingsTabContent />;
      default:
        return <ProfileTabContent initialData={mockUserData} />;
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
