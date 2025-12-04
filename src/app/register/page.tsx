'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

export default function RegisterPage() {
  const router = useRouter();
  const theme = useTheme();

  const [firstName, setFirstName] = useState('Arwa Khalifa');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('arwakhalifa@gmail.com');
  const [countryCode, setCountryCode] = useState('+966');
  const [phoneNumber, setPhoneNumber] = useState('62 2851 9092');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    terms?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // First Name validation
    if (!firstName || firstName.trim() === '') {
      newErrors.firstName = 'First name must be filled';
    } else if (firstName.length > 20) {
      newErrors.firstName = 'First name must be under 20 characters';
    }

    // Last Name validation
    if (!lastName || lastName.trim() === '') {
      newErrors.lastName = 'Last name must be filled';
    } else if (lastName.length > 50) {
      newErrors.lastName = 'Last name must be under 50 characters';
    }

    // Email validation
    if (!email || email.trim() === '') {
      newErrors.email = 'Email must be filled';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Phone Number validation
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber || phoneNumber.trim() === '' || phoneDigits.length === 0) {
      newErrors.phoneNumber = 'Phone number must be filled';
    } else if (phoneDigits.length > 11) {
      newErrors.phoneNumber = 'Phone number must be under 11 digits';
    }

    // Terms validation
    if (!termsAccepted) {
      newErrors.terms = 'You must check terms & conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Implement actual registration logic
      router.push('/otp');
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    if (errors.firstName) {
      setErrors({ ...errors, firstName: undefined });
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    if (errors.lastName) {
      setErrors({ ...errors, lastName: undefined });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (errors.phoneNumber) {
      setErrors({ ...errors, phoneNumber: undefined });
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    if (errors.terms) {
      setErrors({ ...errors, terms: undefined });
    }
  };

  return (
    <AuthPageLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: 'auto',
        }}
      >
        {/* Register Heading */}
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
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Grid container spacing={2.5}>
            {/* First Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
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
                First Name
              </Typography>
              <TextField
                fullWidth
                value={firstName}
                onChange={handleFirstNameChange}
                placeholder="Input your first name"
                required
                error={!!errors.firstName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '7.5px',
                    backgroundColor: theme.palette.custom.background.white,
                    height: { xs: '44px', sm: '44px', md: '44px' },
                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                    '& fieldset': {
                      borderColor: errors.firstName ? theme.palette.error.main : theme.palette.custom.border.default,
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: errors.firstName ? theme.palette.error.main : theme.palette.custom.border.hover,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: errors.firstName ? theme.palette.error.main : theme.palette.custom.border.focus,
                      borderWidth: errors.firstName ? '1px' : '1.5px',
                    },
                    '&.Mui-error fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-error:hover fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-error.Mui-focused fieldset': {
                      borderColor: theme.palette.error.main,
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
              />
              {errors.firstName && (
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                    mt: 1,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  {errors.firstName}
                </Typography>
              )}
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
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
                Last Name
              </Typography>
              <TextField
                fullWidth
                value={lastName}
                onChange={handleLastNameChange}
                placeholder="Input your last name"
                required
                error={!!errors.lastName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '7.5px',
                    backgroundColor: theme.palette.custom.background.white,
                    height: { xs: '44px', sm: '44px', md: '44px' },
                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                    '& fieldset': {
                      borderColor: errors.lastName ? '#FF0000' : '#EDEDED',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: errors.lastName ? '#FF0000' : '#D1D5DB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: errors.lastName ? '#FF0000' : '#D2A298',
                      borderWidth: errors.lastName ? '1px' : '1.5px',
                    },
                    '&.Mui-error fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-error:hover fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-error.Mui-focused fieldset': {
                      borderColor: theme.palette.error.main,
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
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                {errors.lastName && (
                  <Typography
                    sx={{
                      color: theme.palette.error.main,
                      fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    {errors.lastName}
                  </Typography>
                )}
                <Typography
                  sx={{
                    color: theme.palette.custom.label.default,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                    ml: 'auto',
                  }}
                >
                  {lastName.length}/50
                </Typography>
              </Box>
            </Grid>

            {/* Email */}
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
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Input your email"
                required
                error={!!errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '7.5px',
                    backgroundColor: theme.palette.custom.background.white,
                    height: { xs: '44px', sm: '44px', md: '44px' },
                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                    '& fieldset': {
                      borderColor: errors.email ? '#FF0000' : '#EDEDED',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: errors.email ? '#FF0000' : '#D1D5DB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: errors.email ? '#FF0000' : '#D2A298',
                      borderWidth: errors.email ? '1px' : '1.5px',
                    },
                    '&.Mui-error fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-error:hover fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-error.Mui-focused fieldset': {
                      borderColor: theme.palette.error.main,
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
              />
              {errors.email && (
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                    mt: 1,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  {errors.email}
                </Typography>
              )}
            </Grid>

            {/* Phone Number */}
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
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  error={!!errors.phoneNumber}
                  sx={{
                    width: { xs: '100px', sm: '120px' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '7.5px',
                      backgroundColor: theme.palette.custom.background.white,
                      height: { xs: '44px', sm: '44px', md: '44px' },
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                      '& fieldset': {
                        borderColor: errors.phoneNumber ? '#FF0000' : '#EDEDED',
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.phoneNumber ? '#FF0000' : '#D1D5DB',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.phoneNumber ? '#FF0000' : '#D2A298',
                        borderWidth: errors.phoneNumber ? '1px' : '1.5px',
                      },
                      '&.Mui-error fieldset': {
                        borderColor: '#FF0000',
                      },
                      '&.Mui-error:hover fieldset': {
                        borderColor: '#FF0000',
                      },
                      '&.Mui-error.Mui-focused fieldset': {
                        borderColor: '#FF0000',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.custom.heading.primary,
                      py: { xs: 1.25, sm: 1.5 },
                      px: 1,
                      textAlign: 'center',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Input your phone number"
                  required
                  error={!!errors.phoneNumber}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '7.5px',
                      backgroundColor: theme.palette.custom.background.white,
                      height: { xs: '44px', sm: '44px', md: '44px' },
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                      '& fieldset': {
                        borderColor: errors.phoneNumber ? '#FF0000' : '#EDEDED',
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.phoneNumber ? '#FF0000' : '#D1D5DB',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.phoneNumber ? '#FF0000' : '#D2A298',
                        borderWidth: errors.phoneNumber ? '1px' : '1.5px',
                      },
                      '&.Mui-error fieldset': {
                        borderColor: '#FF0000',
                      },
                      '&.Mui-error:hover fieldset': {
                        borderColor: '#FF0000',
                      },
                      '&.Mui-error.Mui-focused fieldset': {
                        borderColor: '#FF0000',
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
                />
              </Box>
              {errors.phoneNumber && (
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                    mt: 1,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  {errors.phoneNumber}
                </Typography>
              )}
            </Grid>

            {/* Terms & Conditions */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={handleTermsChange}
                    sx={{
                      color: errors.terms ? theme.palette.error.main : theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: errors.terms ? theme.palette.error.main : theme.palette.primary.main,
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: theme.palette.custom.heading.medium,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    I agree with{' '}
                    <Link
                      href="#"
                      sx={{
                        color: theme.palette.custom.heading.medium,
                        textDecoration: 'underline',
                        fontWeight: 400,
                        '&:hover': {
                          color: theme.palette.custom.heading.primary,
                        },
                      }}
                    >
                      Terms & Conditions
                    </Link>
                  </Typography>
                }
                sx={{ 
                  alignItems: 'center',
                  mt: 1,
                  marginLeft: 0,
                  '& .MuiFormControlLabel-label': {
                    marginLeft: 1,
                  },
                }}
              />
              {errors.terms && (
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                    mt: 1,
                    ml: 4.5,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  {errors.terms}
                </Typography>
              )}
            </Grid>

            {/* Sign Up Button */}
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
                  mt: { xs: 1, sm: 1.5 },
                }}
              >
                Sign Up
              </Button>
            </Grid>

            {/* Login Link */}
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
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    sx={{
                      color: theme.palette.secondary.main,
                      textDecoration: 'none',
                      fontWeight: 400,
                      fontSize: 'inherit',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: theme.palette.secondary.light,
                      },
                    }}
                  >
                    Login
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

