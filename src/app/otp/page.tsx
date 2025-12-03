'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Timer countdown
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

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    // Focus the last filled input or the last input
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP code');
      return;
    }

    // TODO: Implement actual OTP verification logic
    // For now, redirect to dashboard
    router.push('/');
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    
    // TODO: Implement actual resend OTP logic
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
        {/* OTP Heading */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#041C2C',
            textAlign: 'center',
            mb: { xs: 2, sm: 2.5, md: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem' },
            lineHeight: 1.2,
            fontFamily: 'inherit',
            width: '100%',
          }}
        >
          OTP Confirmation
        </Typography>

        {/* Description Text */}
        <Typography
          variant="body2"
          sx={{
            color: '#B0B0B0',
            textAlign: 'center',
            mb: { xs: 3, sm: 4, md: 4.5 },
            fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
            fontWeight: 400,
            lineHeight: 1.5,
            width: '100%',
          }}
        >
          Please enter the 6-digit code sent to your phone number
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
          <Grid container spacing={2}>
            {/* OTP Input Fields */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  mb: { xs: 3, sm: 4 },
                }}
              >
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={digit}
                    onChange={handleChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: 'center',
                        fontWeight: 700,
                        padding: 0,
                      },
                    }}
                    sx={{
                      width: { xs: '48px', sm: '56px', md: '64px' },
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '7.5px',
                        backgroundColor: '#FFFFFF',
                        height: { xs: '56px', sm: '64px', md: '72px' },
                        '& fieldset': {
                          borderColor: '#EDEDED',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#D1D5DB',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#D2A298',
                          borderWidth: '1.5px',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#041C2C',
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                        fontWeight: 700,
                      },
                    }}
                  />
                ))}
              </Box>
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
                    color: '#B0B0B0',
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  Didn't receive the code?{' '}
                  {canResend ? (
                    <Link
                      component="button"
                      type="button"
                      onClick={handleResend}
                      sx={{
                        color: '#A3B899',
                        textDecoration: 'none',
                        fontWeight: 400,
                        fontSize: 'inherit',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#8FA68A',
                        },
                      }}
                    >
                      Resend OTP
                    </Link>
                  ) : (
                    <Typography
                      component="span"
                      sx={{
                        color: '#B0B0B0',
                        fontSize: 'inherit',
                        fontWeight: 400,
                      }}
                    >
                      Resend OTP in {timer}s
                    </Typography>
                  )}
                </Typography>
              </Box>
            </Grid>

            {/* Confirm Button */}
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
                  backgroundColor: '#D2A298',
                  color: '#FFFFFF',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#C8968A',
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: '#BE8A7C',
                  },
                }}
              >
                Confirm
              </Button>
            </Grid>

            {/* Back to Login Link */}
            <Grid size={{ xs: 12 }}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  mt: { xs: 2, sm: 2.5, md: 3 },
                }}
              >
                <Link
                  href="/login"
                  sx={{
                    color: '#A3B899',
                    textDecoration: 'none',
                    fontWeight: 400,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#8FA68A',
                    },
                  }}
                >
                  Back to Login
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AuthPageLayout>
  );
}

