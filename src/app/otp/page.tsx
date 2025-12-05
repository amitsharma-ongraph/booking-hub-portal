'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Link,
  IconButton,
  useTheme,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import FormButton from '@/components/forms/FormButton';
import OtpInput from '@/components/forms/OtpInput';
import { otpVerificationSchema, type OtpVerificationFormData } from '@/lib/validations/schemas';
import { useAuthContext } from '@/contexts/AuthContext';
import { authStorage } from '@/lib/storage/authStorage';

export default function OTPPage() {
  const router = useRouter();
  const theme = useTheme();
  const { verifyOtpAndLogin, requestOtp, error, clearError, isLoading } = useAuthContext();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // OTP verification form
  const otpForm = useForm<OtpVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Get phone number from storage and auto-request OTP on mount
  useEffect(() => {
    const pendingPhone = authStorage.getPendingPhone();
    if (!pendingPhone) {
      // No phone number found, redirect to login
      router.push('/login');
      return;
    }

    setPhoneNumber(pendingPhone);

    // Auto-request OTP
    const requestOtpOnMount = async () => {
      try {
        clearError();
        setLocalError(null);
        await requestOtp(pendingPhone);
        setTimer(60);
        setCanResend(false);
      } catch (err) {
        const apiError = err as { errorCode?: string; errorMessage?: string };
        const errorMessage =
          apiError.errorCode === 'entity-not-found'
            ? 'User not found. Please register first.'
            : apiError.errorMessage || 'Failed to request OTP. Please try again.';
        setLocalError(errorMessage);
      }
    };

    requestOtpOnMount();
  }, [router, requestOtp, clearError]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  const onOtpSubmit = async (data: OtpVerificationFormData) => {
    if (!phoneNumber) {
      setLocalError('Phone number not found. Please try again.');
      return;
    }

    try {
      clearError();
      setLocalError(null);
      
      // Verify OTP and get auth token
      await verifyOtpAndLogin(phoneNumber, data.otp);
      
      // Force full page reload to ensure middleware runs
      window.location.href = '/';
    } catch (err) {
      const apiError = err as { errorCode?: string; errorMessage?: string };
      const errorMessage =
        apiError.errorCode === 'invalid-otp'
          ? 'Incorrect OTP Code'
          : apiError.errorMessage || 'Failed to verify OTP. Please try again.';
      
      otpForm.setError('otp', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  const handleResend = async () => {
    if (!canResend || !phoneNumber) return;

    try {
      clearError();
      setLocalError(null);
      
      await requestOtp(phoneNumber);
      otpForm.reset({ otp: '' });
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      const apiError = err as { errorCode?: string; errorMessage?: string };
      const errorMessage = apiError.errorMessage || 'Failed to resend OTP. Please try again.';
      setLocalError(errorMessage);
    }
  };

  const handleBack = () => {
    router.push('/login');
  };

  if (!phoneNumber) {
    return null; // Will redirect to login
  }

  return (
    <AuthPageLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '80%',
          height: 'auto',
          position: 'relative',
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            left: { xs: '-48px', sm: '-56px', md: '-64px' },
            top: 0,
            color: theme.palette.custom.heading.medium,
            p: 0.5,
            zIndex: 1,
          }}
        >
          <ArrowBack sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
        </IconButton>

        {/* OTP Heading */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.custom.heading.medium,
            textAlign: 'center',
            mb: { xs: 2, sm: 2.5, md: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem' },
            lineHeight: 1.2,
            fontFamily: 'inherit',
            width: '100%',
          }}
        >
          OTP Verification
        </Typography>

        {/* Icon badge */}
        <Box
          sx={{
            mb: { xs: 3, sm: 3.5, md: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src="/images/otp/otp-badge.svg"
            alt="OTP badge"
            sx={{
              width: { xs: 70, sm: 80, md: 90 },
              height: { xs: 70, sm: 80, md: 90 },
              display: 'block',
            }}
          />
        </Box>

        {/* Description Text */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.custom.label.default,
            textAlign: 'center',
            mb: { xs: 4, sm: 5, md: 6 },
            fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
            fontWeight: 400,
            lineHeight: 1.6,
            width: '100%',
          }}
        >
          Please enter the OTP code sent to your phone{' '}
          <Box component="span" sx={{ color: theme.palette.custom.heading.medium, fontWeight: 400 }}>
            {phoneNumber}
          </Box>
        </Typography>

        {/* OTP Verification Form */}
        <Box component="form" onSubmit={otpForm.handleSubmit(onOtpSubmit)} sx={{ width: '100%' }}>
          <Grid container spacing={2.5}>
            {/* Error Alert */}
            {(error || localError) && (
              <Grid size={{ xs: 12 }}>
                <Alert
                  severity="error"
                  onClose={() => {
                    clearError();
                    setLocalError(null);
                  }}
                  sx={{ mb: 2 }}
                >
                  {error || localError}
                </Alert>
              </Grid>
            )}

            {/* OTP Input */}
            <Grid size={{ xs: 12 }}>
              <OtpInput name="otp" control={otpForm.control} />
              {otpForm.formState.errors.otp && (
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                    textAlign: 'center',
                    mt: 1,
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  {otpForm.formState.errors.otp.message}
                </Typography>
              )}
            </Grid>

            {/* Resend OTP Link */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  mb: { xs: 2, sm: 2.5, md: 3 },
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
                    display: 'block',
                    mb: canResend ? 0 : 1,
                  }}
                >
                  Did not receive OTP?{' '}
                  {canResend && (
                    <Link
                      component="button"
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      sx={{
                        fontSize: 'inherit',
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Resend
                    </Link>
                  )}
                </Typography>
                {!canResend && (
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      color: theme.palette.custom.label.default,
                      fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                      fontWeight: 400,
                      lineHeight: 1.5,
                      display: 'block',
                    }}
                  >
                    Resend again in{' '}
                    <Box component="span" sx={{ color: theme.palette.custom.heading.medium, fontWeight: 700 }}>
                      {String(Math.floor(timer / 60)).padStart(2, '0')}:
                      {String(timer % 60).padStart(2, '0')}
                    </Box>
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FormButton disabled={otpForm.formState.isSubmitting || isLoading}>
                  Confirm
                </FormButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AuthPageLayout>
  );
}
