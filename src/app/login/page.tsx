'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import FormTextField from '@/components/forms/FormTextField';
import FormButton from '@/components/forms/FormButton';
import { loginSchema, type LoginFormData } from '@/lib/validations/schemas';
import { useAuthContext } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const { requestOtp, error, clearError, isLoading } = useAuthContext();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      setLocalError(null);
      
      // Always prepend +966 for Saudi numbers
      const fullPhoneNumber = `+966${data.phoneNumber.replace(/\s/g, '')}`;
      
      // Request OTP
      await requestOtp(fullPhoneNumber);
      
      // Navigate to OTP page
      router.push('/otp');
    } catch (err) {
      const apiError = err as { errorCode?: string; errorMessage?: string };
      const errorMessage =
        apiError.errorCode === 'entity-not-found'
          ? 'User not found. Please register first.'
          : apiError.errorMessage || 'Failed to request OTP. Please try again.';
      setLocalError(errorMessage);
    }
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

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Grid container spacing={2.5}>
            {/* Error Alert */}
            {(error || localError) && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="error" onClose={() => { clearError(); setLocalError(null); }}>
                  {error || localError}
                </Alert>
              </Grid>
            )}

            {/* Phone Number Input */}
            <Grid size={{ xs: 12 }}>
              <FormTextField
                name="phoneNumber"
                control={control}
                label="Phone Number"
                type="tel"
                placeholder="Input your phone number"
                InputProps={{
                  inputProps: {
                    maxLength: 9,
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
                      // Only allow numbers, max 9 digits
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    },
                  },
                }}
              />
            </Grid>

            {/* Sign In Button */}
            <Grid size={{ xs: 12 }}>
              <FormButton disabled={isSubmitting || isLoading} sx={{ mt: { xs: 0.5, sm: 1 } }}>
                Sign In
              </FormButton>
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
                  <Link href="/register" sx={{ fontSize: 'inherit' }}>
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
