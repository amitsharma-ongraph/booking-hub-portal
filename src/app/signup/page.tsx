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
  IconButton,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // TODO: Implement actual signup logic
    // For now, redirect to login
    router.push('/login');
  };

  return (
    <AuthPageLayout>
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
        {/* Signup Heading - Color from SVG: #041C2C */}
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
          Sign Up
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

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Grid container spacing={2.5}>
            {/* Name Label */}
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
                Full Name
              </Typography>
            </Grid>

            {/* Name Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Input your full name"
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
                      <PersonIcon 
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

            {/* Email Label */}
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
                Email Address
              </Typography>
            </Grid>

            {/* Email Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="Input your email address"
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
                      <EmailIcon 
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
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
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

            {/* Password Label */}
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
                Password
              </Typography>
            </Grid>

            {/* Password Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="Input your password"
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
                      <LockIcon 
                        sx={{ 
                          color: '#B0B0B0', 
                          fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' } 
                        }} 
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#B0B0B0' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Confirm Password Label */}
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
                Confirm Password
              </Typography>
            </Grid>

            {/* Confirm Password Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Confirm your password"
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
                      <LockIcon 
                        sx={{ 
                          color: '#B0B0B0', 
                          fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' } 
                        }} 
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: '#B0B0B0' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Sign Up Button - Dimensions from SVG: width="513" height="41" rx="10" fill="#D2A298" */}
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
                Sign Up
              </Button>
            </Grid>

            {/* Sign In Link - Colors from SVG: text="#B0B0B0" link="#A3B899" */}
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
                  Already have an account?{' '}
                  <Link
                    href="/login"
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
                    Sign In
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

