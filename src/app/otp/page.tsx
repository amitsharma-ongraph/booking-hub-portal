'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import FormTextField from '@/components/forms/FormTextField';
import FormButton from '@/components/forms/FormButton';
import OtpInput from '@/components/forms/OtpInput';
import {
  otpMethodSchema,
  otpVerificationSchema,
  type OtpMethodFormData,
  type OtpVerificationFormData,
} from '@/lib/validations/schemas';

const MOCK_VALID_OTP = '1234';

export default function OTPPage() {
  const router = useRouter();
  const theme = useTheme();
  const [step, setStep] = useState<'method' | 'otp'>('method');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [contactInfo, setContactInfo] = useState<string>('');

  // Method selection form
  const methodForm = useForm<OtpMethodFormData>({
    resolver: zodResolver(otpMethodSchema),
    defaultValues: {
      method: 'email',
      email: '',
      phoneNumber: '',
    },
  });

  // OTP verification form
  const otpForm = useForm<OtpVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: '',
    },
  });

  const selectedMethod = methodForm.watch('method');

  // Timer countdown
  useEffect(() => {
    if (step === 'otp' && timer > 0 && !canResend) {
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
  }, [timer, canResend, step]);

  const onMethodSubmit = async (data: OtpMethodFormData) => {
    try {
      // TODO: Implement actual send-OTP API
      // await sendOTPAPI(data);
      setContactInfo(data.method === 'email' ? data.email || '' : data.phoneNumber || '');
      setStep('otp');
      setTimer(60);
      setCanResend(false);
      otpForm.reset({ otp: '' });
    } catch (error) {
      console.error('Send OTP error:', error);
    }
  };

  const onOtpSubmit = async (data: OtpVerificationFormData) => {
    try {
      // Mock OTP verification
      if (data.otp === MOCK_VALID_OTP) {
        router.push('/');
      } else {
        otpForm.setError('otp', {
          type: 'manual',
          message: 'Incorrect OTP Code',
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    otpForm.reset({ otp: '' });
    setTimer(60);
    setCanResend(false);
    // TODO: Implement actual resend OTP logic
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('method');
      otpForm.reset();
    }
  };

  const renderRadio = (value: 'email' | 'sms', label: string) => (
    <Box
      onClick={() => methodForm.setValue('method', value)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          width: 15,
          height: 15,
          borderRadius: '50%',
          border: `1px solid ${
            selectedMethod === value
              ? theme.palette.primary.main
              : theme.palette.custom.border.radio
          }`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selectedMethod === value && (
          <Box
            sx={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
            }}
          />
        )}
      </Box>
      <Typography
        sx={{
          fontSize: { xs: '0.8125rem', sm: '0.875rem' },
          fontWeight: 400,
          color: theme.palette.custom.heading.medium,
        }}
      >
        {label}
      </Typography>
    </Box>
  );

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
          disabled={step === 'method'}
          sx={{
            position: 'absolute',
            left: { xs: '-48px', sm: '-56px', md: '-64px' },
            top: 0,
            color:
              step === 'method'
                ? theme.palette.custom.status.disabled
                : theme.palette.custom.heading.medium,
            p: 0.5,
            zIndex: 1,
            cursor: step === 'method' ? 'not-allowed' : 'pointer',
            '&:disabled': {
              color: theme.palette.custom.status.disabled,
            },
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
        {step === 'method' ? (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.custom.label.secondary,
              textAlign: 'center',
              mb: { xs: 4, sm: 5, md: 6 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
              fontWeight: 400,
              lineHeight: 1.6,
              width: '100%',
              px: { xs: 1, sm: 2 },
            }}
          >
            Please choose how you would like to receive your OTP and enter your contact
            information.
          </Typography>
        ) : (
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
            {selectedMethod === 'email'
              ? `Please check the OTP code sent to your email `
              : `Please enter the OTP code sent to your phone `}
            <Box component="span" sx={{ color: theme.palette.custom.heading.medium, fontWeight: 400 }}>
              {contactInfo}
            </Box>
          </Typography>
        )}

        {/* Method Selection Form */}
        {step === 'method' && (
          <Box component="form" onSubmit={methodForm.handleSubmit(onMethodSubmit)} sx={{ width: '100%' }}>
            <Grid container spacing={2.5}>
              {/* Delivery method choice */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: { xs: 3, sm: 4, md: 5 },
                    mb: { xs: 3, sm: 4, md: 5 },
                  }}
                >
                  {renderRadio('email', 'Email')}
                  {renderRadio('sms', 'SMS')}
                </Box>
              </Grid>

              {/* Contact Information Input */}
              <Grid size={{ xs: 12 }}>
                {selectedMethod === 'email' ? (
                  <FormTextField
                    name="email"
                    control={methodForm.control}
                    label="Email Address"
                    type="email"
                    sx={{ mb: { xs: 4, sm: 5, md: 6 } }}
                  />
                ) : (
                  <FormTextField
                    name="phoneNumber"
                    control={methodForm.control}
                    label="Phone Number"
                    type="tel"
                    sx={{ mb: { xs: 4, sm: 5, md: 6 } }}
                  />
                )}
                {methodForm.formState.errors.root && (
                  <Typography
                    sx={{
                      color: theme.palette.error.main,
                      textAlign: 'center',
                      mb: { xs: 2, sm: 2.5, md: 3 },
                      fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    {methodForm.formState.errors.root.message}
                  </Typography>
                )}
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
                  <FormButton disabled={methodForm.formState.isSubmitting}>
                    Send OTP
                  </FormButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* OTP Verification Form */}
        {step === 'otp' && (
          <Box component="form" onSubmit={otpForm.handleSubmit(onOtpSubmit)} sx={{ width: '100%' }}>
            <Grid container spacing={2.5}>
              {/* OTP Input */}
              <Grid size={{ xs: 12 }}>
                <OtpInput name="otp" control={otpForm.control} />
                {otpForm.formState.errors.otp && (
                  <Typography
                    sx={{
                      color: theme.palette.error.main,
                      textAlign: 'center',
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
                        sx={{
                          fontSize: 'inherit',
                          border: 'none',
                          background: 'none',
                          padding: 0,
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
                  <FormButton disabled={otpForm.formState.isSubmitting}>
                    Confirm
                  </FormButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </AuthPageLayout>
  );
}
