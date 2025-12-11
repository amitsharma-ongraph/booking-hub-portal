'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { authStorage } from '@/lib/storage/authStorage';
import { useAuthContext } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, fetchBasicCompanyInfo, validateToken } = useAuthContext();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Client-side protection check (backup for middleware)
  // Note: Auth initialization is handled by useAuth hook at root level
  // This only checks token existence, doesn't fetch company data
  useEffect(() => {
    // Check if token exists in both localStorage and cookie
    const token = authStorage.getToken();
    const cookieToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1];

    // If no token in either storage, redirect to login
    if (!token && !cookieToken) {
      window.location.href = '/login';
      return;
    }

    // Token validation and company data fetching is handled by useAuth hook
    // which runs once when AuthProvider mounts (at root layout level)
    // No need to call validateToken here as it would cause unnecessary API calls
  }, []); // Only run once on mount

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'background.default',
        }}
      >
        <TopBar onMenuClick={handleDrawerToggle} />
        
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            p: { xs: 2, sm: 3, md: 4 },
            // Hide scrollbar
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Edge
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
