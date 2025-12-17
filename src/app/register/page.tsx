'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Link,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@mui/material';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import FormTextField from '@/components/forms/FormTextField';
import FormCheckbox from '@/components/forms/FormCheckbox';
import FormButton from '@/components/forms/FormButton';
import { registerSchema, type RegisterFormData } from '@/lib/validations/schemas';
import { useAuthContext } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const theme = useTheme();
  const { register, error, clearError, isLoading } = useAuthContext();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      termsAccepted: false,
    },
  });

  const lastName = watch('lastName');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      
      // Always prepend 966 for Saudi numbers (without + sign)
      const fullPhoneNumber = `966${data.phoneNumber.replace(/\s/g, '')}`;
      
      // Call registration API (termsAccepted is frontend-only validation)
      await register({
        emailAddress: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: fullPhoneNumber,
      });
      
      // Redirect to success page on success
      router.push('/register-success');
    } catch (error) {
      // Error is handled by useAuthContext and displayed via error state
      console.error('Registration error:', error);
    }
  };

  return (
    <AuthPageLayout cardHeight={{ xs: 'auto', sm: 600 }}>
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

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <Grid container spacing={2.5}>
            {/* First Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField
                name="firstName"
                control={control}
                label="First Name"
                placeholder="Input your first name"
              />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField
                name="lastName"
                control={control}
                label="Last Name"
                placeholder="Input your last name"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
                <Typography
                  sx={{
                    color: theme.palette.custom.label.default,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                </Typography>
              </Box>
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12 }}>
              <FormTextField
                name="email"
                control={control}
                label="Email"
                type="email"
                placeholder="Input your email"
              />
            </Grid>

            {/* Phone Number */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.custom.label.default,
                  fontWeight: 400,
                  mb: 1.5,
                  fontSize: '0.75rem', // 12px - handled by theme
                  lineHeight: 1.5,
                }}
              >
                Phone Number
              </Typography>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Box sx={{ display: 'flex', gap: 0 }}>
                      <TextField
                        value="966"
                        disabled
                        sx={{
                          width: '60px', // Exact width from SVG
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8.5px 0 0 8.5px', // Rounded left corners only, 8.5px from SVG
                            backgroundColor: '#EDEDED', // Gray background from SVG
                            height: '46px', // Exact height from SVG
                            padding: '0 8px',
                            // fontSize handled by theme global override
                            '& fieldset': {
                              borderColor: '#D2A298', // Primary color border from SVG
                              borderWidth: '1px',
                              borderRight: 'none', // Remove right border to connect with phone input
                            },
                            '&.Mui-disabled': {
                              backgroundColor: '#EDEDED',
                              '& fieldset': {
                                borderColor: theme.palette.custom.border.default,
                              },
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#333333', // Text color from SVG
                            py: 0,
                            px: 0,
                            textAlign: 'center',
                            // fontSize handled by theme global override
                            '&.Mui-disabled': {
                              color: '#333333',
                              WebkitTextFillColor: '#333333',
                            },
                          },
                        }}
                      />
                      <TextField
                        {...field}
                        type="tel"
                        placeholder="Input your phone number"
                        fullWidth
                        error={!!error}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '0 8.5px 8.5px 0', // Rounded right corners only, 8.5px from SVG
                            backgroundColor: theme.palette.custom.background.white,
                            height: '46px', // Exact height from SVG
                            // fontSize handled by theme global override
                            '& fieldset': {
                              borderColor: error
                                ? theme.palette.error.main
                                : theme.palette.custom.border.default,
                              borderWidth: '1px',
                              borderLeft: 'none', // Remove left border to connect with country code
                            },
                            '&:hover fieldset': {
                              borderColor: error
                                ? theme.palette.error.main
                                : theme.palette.custom.border.hover,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: error
                                ? theme.palette.error.main
                                : theme.palette.custom.border.focus,
                              borderWidth: error ? '1px' : '1.5px',
                              borderLeft: 'none',
                            },
                            '&.Mui-error fieldset': {
                              borderColor: theme.palette.error.main,
                              borderLeft: 'none',
                            },
                            '&.Mui-error:hover fieldset': {
                              borderColor: theme.palette.error.main,
                              borderLeft: 'none',
                            },
                            '&.Mui-error.Mui-focused fieldset': {
                              borderColor: theme.palette.error.main,
                              borderLeft: 'none',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: theme.palette.custom.heading.primary,
                            py: 0,
                            px: 1,
                            '&::placeholder': {
                              color: theme.palette.custom.label.default,
                              opacity: 1,
                              // fontSize handled by theme global override
                            },
                          },
                        }}
                        inputProps={{
                          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                            // Allow: backspace, delete, tab, escape, enter, home, end, left, right arrow keys
                            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'];
                            if (allowedKeys.includes(e.key)) {
                              return;
                            }
                            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                            if ((e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x') && e.ctrlKey) {
                              return;
                            }
                            // Only allow numbers
                            if (!/^[0-9]$/.test(e.key)) {
                              e.preventDefault();
                            }
                          },
                          onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                            // Only allow numbers, no length restriction
                            e.target.value = e.target.value.replace(/\D/g, '');
                          },
                        }}
                      />
                    </Box>
                    {error && (
                      <Typography
                        sx={{
                          color: theme.palette.error.main,
                          mt: 1,
                          fontSize: '0.75rem', // 12px - handled by theme
                          fontWeight: 400,
                          lineHeight: 1.5,
                        }}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>

            {/* Terms & Conditions */}
            <Grid size={{ xs: 12 }}>
              <FormCheckbox
                name="termsAccepted"
                control={control}
                error={errors.termsAccepted?.message}
                label={
                  <Typography
                    sx={{
                      color: theme.palette.custom.heading.medium,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                      fontWeight: 400,
                      lineHeight: 1.5,
                      marginLeft:"10px"
                    }} 
                  >
                    I agree with{' '}
                    <Link
                      href="#"
                      sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: 400,
                        '&:hover': {
                          color: theme.palette.secondary.main,
                          fontWeight:600
                        },
                      }}
                    >
                      Terms & Conditions
                    </Link>
                  </Typography>
                }
              />
            </Grid>

            {/* Sign Up Button */}
            <Grid size={{ xs: 12 }}>
              <FormButton disabled={isSubmitting || isLoading} sx={{ mt: { xs: 1, sm: 1.5 } }}>
                Sign Up
              </FormButton>
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
                      fontSize: 'inherit',
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
