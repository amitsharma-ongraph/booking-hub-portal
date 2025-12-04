'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';

/**
 * Reusable form button component with consistent styling
 * Matches the theme button styles
 */
export default function FormButton({
  children,
  ...buttonProps
}: ButtonProps) {
  return (
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
        ...buttonProps.sx,
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

