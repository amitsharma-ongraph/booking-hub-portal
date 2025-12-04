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
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import FormTextField from '@/components/forms/FormTextField';
import FormCheckbox from '@/components/forms/FormCheckbox';
import FormButton from '@/components/forms/FormButton';
import { registerSchema, type RegisterFormData } from '@/lib/validations/schemas';

export default function RegisterPage() {
  const router = useRouter();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: 'Arwa Khalifa',
      lastName: '',
      email: 'arwakhalifa@gmail.com',
      countryCode: '+966',
      phoneNumber: '62 2851 9092',
      termsAccepted: false,
    },
  });

  const lastName = watch('lastName');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // TODO: Implement actual registration logic
      // await registerAPI(data);
      router.push('/otp');
    } catch (error) {
      console.error('Registration error:', error);
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
                    {errors.lastName.message}
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
                  {lastName?.length || 0}/50
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
                  fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                  lineHeight: 1.5,
                }}
              >
                Phone Number
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      error={!!error}
                      sx={{
                        width: { xs: '100px', sm: '120px' },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '7.5px',
                          backgroundColor: theme.palette.custom.background.white,
                          height: { xs: '44px', sm: '44px', md: '44px' },
                          fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                          '& fieldset': {
                            borderColor: error
                              ? theme.palette.error.main
                              : theme.palette.custom.border.default,
                            borderWidth: '1px',
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
                  )}
                />
                <FormTextField
                  name="phoneNumber"
                  control={control}
                  type="tel"
                  placeholder="Input your phone number"
                  showLabel={false}
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
                  {errors.phoneNumber.message}
                </Typography>
              )}
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
              />
            </Grid>

            {/* Sign Up Button */}
            <Grid size={{ xs: 12 }}>
              <FormButton disabled={isSubmitting} sx={{ mt: { xs: 1, sm: 1.5 } }}>
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
