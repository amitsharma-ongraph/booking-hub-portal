'use client';

import React from 'react';
import { TextField, TextFieldProps, Typography, useTheme } from '@mui/material';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

export interface FormTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'control'> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  showLabel?: boolean;
}

/**
 * Reusable form text field component that integrates React Hook Form with MUI TextField
 * Automatically handles validation errors and theming
 */
export default function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  showLabel = true,
  ...textFieldProps
}: FormTextFieldProps<T>) {
  const theme = useTheme();

  return (
    <>
      {showLabel && label && (
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
          {label}
        </Typography>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <TextField
              {...textFieldProps}
              {...field}
              fullWidth
              error={!!error}
              sx={{
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
                ...textFieldProps.sx,
              }}
            />
            {error && (
              <Typography
                sx={{
                  color: theme.palette.error.main,
                  mt: 1,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
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
    </>
  );
}

