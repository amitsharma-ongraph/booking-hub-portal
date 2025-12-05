'use client';

import React, { useRef, useEffect } from 'react';
import { TextField, Box, useTheme } from '@mui/material';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

export interface OtpInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  length?: number;
}

/**
 * Reusable OTP input component that integrates React Hook Form
 * Supports auto-focus, paste, and backspace navigation
 */
export default function OtpInput<T extends FieldValues>({
  name,
  control,
  length = 6,
}: OtpInputProps<T>) {
  const theme = useTheme();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const otpValue = (field.value || '').toString().padEnd(length, '').slice(0, length);
        const otpArray = otpValue.split('');

        const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
          const newOtp = [...otpArray];
          newOtp[index] = value;
          const newValue = newOtp.join('');
          field.onChange(newValue);

          // Auto-focus next input
          if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
          }
        };

        const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
          // Handle backspace
          if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
          }
        };

        const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
          e.preventDefault();
          const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
          field.onChange(pastedData);
          // Focus the last filled input or the last input
          const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
          inputRefs.current[lastFilledIndex]?.focus();
        };

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1, sm: 1.5, md: 2 },
              mb: { xs: 3, sm: 4 },
            }}
          >
            {Array.from({ length }).map((_, index) => (
              <TextField
                key={index}
                inputRef={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={otpArray[index] || ''}
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
                    backgroundColor: theme.palette.custom.background.white,
                    height: { xs: '56px', sm: '64px', md: '72px' },
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
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.custom.heading.primary,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                    fontWeight: 700,
                  },
                }}
              />
            ))}
          </Box>
        );
      }}
    />
  );
}

