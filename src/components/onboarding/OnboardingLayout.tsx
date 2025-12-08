'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onNext: () => void;
  onSkip: () => void;
  children: React.ReactNode; // The design/content area
}

export default function OnboardingLayout({
  currentStep,
  totalSteps,
  title,
  description,
  onNext,
  onSkip,
  children,
}: OnboardingLayoutProps) {
  return (
    <Box
      sx={{
        height: { xs: '100vh', sm: '100vh', md: '100vh' },
        minHeight: { xs: '100vh', sm: '100vh', md: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
        backgroundColor: '#FFFFFF',
        overflow: { xs: 'auto', sm: 'auto', md: 'hidden' },
      }}
    >
      {/* Upper Section: Design Area (flexible on large screens, auto on small screens) */}
      <Box
        sx={{
          flex: { xs: '0 0 auto', sm: '0 0 auto', md: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1, sm: 2, md: 4 },
          minHeight: { xs: 0, sm: 0, md: 0 },
        }}
      >
        {children}
      </Box>

      {/* Lower Section: Content (slider, text, buttons) - auto height on small screens, fixed on large */}
      <Box
        sx={{
          flexShrink: 0,
          height: { xs: 'auto', sm: 'auto', md: 360 },
          minHeight: { xs: 280, sm: 320, md: 360 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: { xs: 2, sm: 3, md: 4 },
          animation: 'fadeInUp 0.8s ease-out 1.4s both',
          '@keyframes fadeInUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Pager dots with step animation */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: { xs: 2, sm: 2.5 },
            }}
          >
            {Array.from({ length: totalSteps }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: index === currentStep ? 20 : 6,
                  height: 6,
                  borderRadius: index === currentStep ? 999 : '50%',
                  backgroundColor: index === currentStep ? '#D2A298' : '#D8D8D8',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{
              fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
              fontWeight: 600,
              color: '#333333',
              mb: 1.5,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: '#8B8B8B',
              mb: { xs: 3, sm: 3.5 },
              maxWidth: 420,
            }}
          >
            {description}
          </Typography>

          <Button
            variant="contained"
            fullWidth={false}
            onClick={onNext}
            sx={{
              minWidth: 260,
              maxWidth: 320,
              height: 44,
              borderRadius: 999,
              backgroundColor: '#D2A298',
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              mb: 1.5,
              '&:hover': {
                backgroundColor: '#C8968A',
              },
            }}
          >
            Next
          </Button>

          <Button
            variant="text"
            onClick={onSkip}
            sx={{
              color: '#8B8B8B',
              textTransform: 'none',
              fontSize: '0.9rem',
            }}
          >
            Skip
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

