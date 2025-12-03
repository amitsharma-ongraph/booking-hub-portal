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
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

export default function OTPPage() {
  const router = useRouter();
  const MOCK_VALID_OTP = '1234';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'method' | 'otp'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email'>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input when we enter OTP step
  useEffect(() => {
    if (step === 'otp') {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  useEffect(() => {
    // Timer countdown (only when in OTP step)
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

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
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
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    // Focus the last filled input or the last input
    const lastFilledIndex = Math.min(pastedData.length - 1, 3);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Step 1: choose delivery method (SMS or Email)
    if (step === 'method') {
      // Validate input based on selected method
      if (selectedMethod === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          setError('Please enter a valid email address');
          return;
        }
      } else {
        if (!phoneNumber || phoneNumber.trim().length < 10) {
          setError('Please enter a valid phone number');
          return;
        }
      }
      
      // In real app, trigger send-OTP API here based on selectedMethod
      setOtp(['', '', '', '']);
      setTimer(60);
      setCanResend(false);
      setStep('otp');
      return;
    }

    // Step 2: verify OTP
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      setError('Please enter the complete 4-digit OTP code');
      return;
    }

    // Mock OTP verification flow using local constant
    if (otpValue === MOCK_VALID_OTP) {
      // For now, redirect to dashboard
      router.push('/');
    } else {
      setError('Incorrect OTP Code');
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setOtp(['', '', '', '']);
    setError('');
    setTimer(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    
    // TODO: Implement actual resend OTP logic
  };

  const renderRadio = (value: 'email' | 'sms', label: string) => (
    <Box
      onClick={() => setSelectedMethod(value)}
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
          border: `1px solid ${selectedMethod === value ? '#D2A298' : '#E0E0E0'}`,
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
              backgroundColor: '#D2A298',
            }}
          />
        )}
      </Box>
      <Typography
        sx={{
          fontSize: { xs: '0.8125rem', sm: '0.875rem' },
          fontWeight: 400,
          color: '#333333',
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
        {/* Back Button - Absolutely positioned at left, aligned with title, near card edge */}
        <IconButton 
          onClick={() => {
            if (step === 'otp') {
              setStep('method');
              setError('');
            }
          }}
          disabled={step === 'method'}
          sx={{ 
            position: 'absolute',
            left: { xs: '-48px', sm: '-56px', md: '-64px' }, // Position near card edge accounting for 80% width + padding
            top: 0,
            color: step === 'method' ? '#CCCCCC' : '#333333',
            p: 0.5,
            zIndex: 1,
            cursor: step === 'method' ? 'not-allowed' : 'pointer',
            '&:disabled': {
              color: '#CCCCCC',
            },
          }}
        >
          <ArrowBack sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
        </IconButton>

        {/* OTP Heading - Centered */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#333333',
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

        {/* Icon badge from Figma (loaded from public/images/otp/otp-badge.svg) */}
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
              color: '#747474',
              textAlign: 'center',
              mb: { xs: 4, sm: 5, md: 6 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
              fontWeight: 400,
              lineHeight: 1.6,
              width: '100%',
              px: { xs: 1, sm: 2 },
            }}
          >
            Please choose how you would like to receive your OTP and enter your contact information.
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: '#B0B0B0',
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
              : `Please enter the OTP code sent to your phone `
            }
            <Box component="span" sx={{ color: '#333333', fontWeight: 400 }}>
              {selectedMethod === 'email' ? email : phoneNumber}
            </Box>
          </Typography>
        )}


        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Grid container spacing={2.5}>
            {step === 'method' ? (
              <>
                {/* Delivery method choice row - matches Frame 628470 */}
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
                    <TextField
                      type="email"
                      label="Email Address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      fullWidth
                      required
                      sx={{
                        mb: { xs: 4, sm: 5, md: 6 },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          backgroundColor: '#FFFFFF',
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
                          fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B0B0B0',
                          fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                        },
                      }}
                    />
                  ) : (
                    <TextField
                      type="tel"
                      label="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setError('');
                      }}
                      fullWidth
                      required
                      sx={{
                        mb: { xs: 4, sm: 5, md: 6 },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          backgroundColor: '#FFFFFF',
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
                          fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B0B0B0',
                          fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                        },
                      }}
                    />
                  )}
                </Grid>
              </>
            ) : (
              <>
                {/* OTP Input Fields */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: 'flex',
          alignItems: 'center',
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
                              borderColor: error ? '#FF0000' : '#EDEDED',
                              borderWidth: '1px',
                            },
                            '&:hover fieldset': {
                              borderColor: error ? '#FF0000' : '#D1D5DB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: error ? '#FF0000' : '#D2A298',
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

                {/* Error Message */}
                {error && (
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      sx={{
                        color: '#FF0000',
                        textAlign: 'center',
                        mb: { xs: 2, sm: 2.5, md: 3 },
                        fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                        fontWeight: 400,
                        lineHeight: 1.5,
                      }}
                    >
                      Incorrect OTP Code
                    </Typography>
                  </Grid>
                )}

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
                          Resend
                        </Link>
                      )}
                    </Typography>
                    {!canResend && (
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          color: '#B0B0B0',
                          fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                          fontWeight: 400,
                          lineHeight: 1.5,
                          display: 'block',
                        }}
                      >
                        Resend again in{' '}
                        <Box component="span" sx={{ color: '#333333', fontWeight: 700 }}>
                          {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
                        </Box>
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </>
            )}

            {/* Primary Button */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  type="submit"
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
                  {step === 'method' ? 'Send OTP' : 'Confirm'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AuthPageLayout>
  );
}

