'use client';

import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  useTheme,
} from '@mui/material';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

export interface FormCheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: React.ReactNode;
  error?: string;
}

/**
 * Reusable form checkbox component that integrates React Hook Form with MUI Checkbox
 * Automatically handles validation errors and theming
 */
export default function FormCheckbox<T extends FieldValues>({
  name,
  control,
  label,
  error,
}: FormCheckboxProps<T>) {
  const theme = useTheme();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value || false}
                sx={{
                  color: error ? theme.palette.error.main : theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: error ? theme.palette.error.main : theme.palette.primary.main,
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  },
                }}
              />
            }
            label={label}
            sx={{
              alignItems: 'center',
              mt: 1,
              marginLeft: 0,
              '& .MuiFormControlLabel-label': {
                marginLeft: 1,
              },
            }}
          />
        )}
      />
      {error && (
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
          {error}
        </Typography>
      )}
    </>
  );
}

