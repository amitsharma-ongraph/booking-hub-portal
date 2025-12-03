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
} from '@mui/material';
import {
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

export default function LoginPage() {
  const router = useRouter();
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
        {/* Login Heading - Color from SVG: #041C2C */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#041C2C', // Exact color from SVG
            textAlign: 'center',
            mb: { xs: 3, sm: 4, md: 4.5 },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem' }, // Approximately 32px
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
            {/* Phone Number Label - Color from SVG: #B0B0B0 */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#B0B0B0', // Exact color from SVG
                  fontWeight: 400,
                  mb: 1.5,
                  fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                  lineHeight: 1.5,
                }}
              >
                Phone Number
              </Typography>
            </Grid>

            {/* Phone Number Input - Dimensions from SVG: width="512" height="44" rx="7.5" border="#EDEDED" */}
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
                    borderRadius: '7.5px', // Exact from SVG rx="7.5"
                    backgroundColor: '#FFFFFF',
                    height: { xs: '44px', sm: '44px', md: '44px' }, // Exact height from SVG
                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                    '& fieldset': {
                      borderColor: '#EDEDED', // Exact border color from SVG
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D2A298', // Button color for focus
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#041C2C',
                    py: { xs: 1.25, sm: 1.5 },
                    px: 1,
                    '&::placeholder': {
                      color: '#B0B0B0', // Same as label color
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
                          color: '#B0B0B0', 
                          fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' } 
                        }} 
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Sign In Button - Dimensions from SVG: width="513" height="41" rx="10" fill="#D2A298" */}
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  height: { xs: '44px', sm: '41px', md: '41px' }, // Exact height from SVG
                  borderRadius: '10px', // Exact from SVG rx="10"
                  textTransform: 'none',
                  fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                  fontWeight: 700,
                  backgroundColor: '#D2A298', // Exact color from SVG
                  color: '#FFFFFF',
                  boxShadow: 'none',
                  mt: { xs: 0.5, sm: 1 },
                  '&:hover': {
                    backgroundColor: '#C8968A',
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: '#BE8A7C',
                  },
                }}
              >
                Sign In
              </Button>
            </Grid>

            {/* Sign Up Link - Colors from SVG: text="#B0B0B0" link="#A3B899" */}
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
                    color: '#B0B0B0', // Exact color from SVG
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    sx={{
                      color: '#A3B899', // Exact green color from SVG
                      textDecoration: 'none',
                      fontWeight: 400,
                      fontSize: 'inherit',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#8FA68A',
                      },
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
