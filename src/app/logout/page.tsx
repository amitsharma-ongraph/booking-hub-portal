'use client';

import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Logout Page
 * Handles user logout and redirects to login
 */
export default function LogoutPage() {
  const { logout } = useAuthContext();

  useEffect(() => {
    // Perform logout (clears all storage and cookies)
    logout();
    
    // Small delay to ensure cookie is cleared before redirect
    // Then force full page reload to ensure middleware runs
    setTimeout(() => {
      window.location.replace('/login');
    }, 100);
  }, [logout]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1" color="text.secondary">
        Logging out...
      </Typography>
    </Box>
  );
}

