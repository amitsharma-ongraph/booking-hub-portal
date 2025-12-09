'use client';

import React from 'react';
import { Box, Typography, Card, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import FormButton from '@/components/forms/FormButton';
import Image from 'next/image';

export default function RegisterSuccessPage() {
  const router = useRouter();
  const theme = useTheme();

  const handleContinue = () => {
    router.push('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.custom.background.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: 'auto' },
          maxWidth: 422,
          height: 'auto',
          borderRadius: '10px',
          backgroundColor: theme.palette.custom.background.white,
          boxShadow: 'none',
          border: 'none',
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        {/* Success Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 192,
            height: 92,
          }}
        >
          <Image
            src="/images/icons/success-check-icon.svg"
            alt="Success Checkmark"
            width={192}
            height={92}
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
            }}
            priority
            sizes="192px"
          />
        </Box>

        {/* Success Message */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1rem', sm: '1.5rem', md: '1.75rem' },
              fontWeight: 500,
              color: '#333333',
              lineHeight: 1.2,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            Account Created Successfully
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.5rem', sm: '0.75rem', md: '0.875rem' },
              fontWeight: 400,
              color: '#333333',
              fontFamily: 'inherit',
            }}
          >
            Thank you for signing up and please login to try and explore the places you like.
          </Typography>
        </Box>

        {/* Continue Button */}
        <Box sx={{ width: '100%', mt: 1 }}>
          <FormButton
            onClick={handleContinue}
            fullWidth
            sx={{
              height: 41,
              borderRadius: '10px',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.custom.background.white,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            Login
          </FormButton>
        </Box>
      </Card>
    </Box>
  );
}

