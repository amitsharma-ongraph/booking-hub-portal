'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }
    // TODO: Implement actual login logic
    // Redirect to OTP confirmation page
    router.push('/otp');
  };

  return (
    <AuthPageLayout cardHeight={{ xs: 'auto', sm: 758 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '100%',
        }}
      >
        {/* Login Heading */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.custom.heading.primary,
            textAlign: 'center',
            mb: { xs: 3, sm: 4, md: 4.5 },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem' },
            lineHeight: 1.2,
            fontFamily: 'inherit',
            width: '100%',
          }}
        >
          Login
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              width: '100%',
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Grid container spacing={2.5}>
            {/* Phone Number Label */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.custom.label.default,
                  fontWeight: 400,
                  mb: 1.5,
                  fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                  lineHeight: 1.5,
                }}
              >
                Phone Number
              </Typography>
            </Grid>

            {/* Phone Number Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Input your phone number"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '7.5px',
                    backgroundColor: theme.palette.custom.background.white,
                    height: { xs: '44px', sm: '44px', md: '44px' },
                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                    '& fieldset': {
                      borderColor: theme.palette.custom.border.default,
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.custom.border.hover,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.custom.border.focus,
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.custom.heading.primary,
                    py: { xs: 1.25, sm: 1.5 },
                    px: 1,
                    '&::placeholder': {
                      color: theme.palette.custom.label.default,
                      opacity: 1,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <PhoneIcon 
                        sx={{ 
                          color: theme.palette.custom.label.default, 
                          fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' } 
                        }} 
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Sign In Button */}
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  height: { xs: '44px', sm: '41px', md: '41px' },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                  fontWeight: 700,
                  mt: { xs: 0.5, sm: 1 },
                }}
              >
                Sign In
              </Button>
            </Grid>

            {/* Sign Up Link */}
            <Grid size={{ xs: 12 }}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  mt: { xs: 2, sm: 2.5, md: 3 },
                }}
              >
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    color: theme.palette.custom.label.default,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    sx={{
                      fontSize: 'inherit',
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AuthPageLayout>
  );
}
