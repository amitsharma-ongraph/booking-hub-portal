'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';

interface FirstOnboardingScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function FirstOnboardingScreen({
  onNext,
  onSkip,
}: FirstOnboardingScreenProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 960,
          p: { xs: 3, sm: 4, md: 6 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top images row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 4, sm: 5 },
            flexWrap: 'wrap',
          }}
        >
          {/* Left circular image */}
          <Box
            sx={{
              width: { xs: 140, sm: 180, md: 220 },
              height: { xs: 140, sm: 180, md: 220 },
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              mx: 'auto',
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/onboarding/page1-left.png"
              alt="Relaxation magazine"
              fill
              sizes="(max-width: 768px) 140px, 220px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </Box>

          {/* Center rounded-square image */}
          <Box
            sx={{
              width: { xs: 160, sm: 200, md: 240 },
              height: { xs: 160, sm: 200, md: 240 },
              borderRadius: 40,
              overflow: 'hidden',
              position: 'relative',
              mx: 'auto',
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/onboarding/page1-center.png"
              alt="Spa treatment"
              fill
              sizes="(max-width: 768px) 160px, 240px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </Box>

          {/* Right rounded-square image */}
          <Box
            sx={{
              width: { xs: 140, sm: 180, md: 220 },
              height: { xs: 140, sm: 180, md: 220 },
              borderRadius: 40,
              overflow: 'hidden',
              position: 'relative',
              mx: 'auto',
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/onboarding/page1-right.png"
              alt="Sauna room"
              fill
              sizes="(max-width: 768px) 140px, 220px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </Box>
        </Box>

        {/* Decorative small leaves */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '18%', sm: '18%' },
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.6,
            width: 60,
            height: 60,
          }}
        >
          <Image
            src="/images/onboarding/leaves-decoration.svg"
            alt=""
            fill
            sizes="60px"
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '22%', sm: '22%' },
            left: { xs: '10%', sm: '16%' },
            width: 90,
            height: 60,
            opacity: 0.6,
          }}
        >
          <Image
            src="/images/onboarding/leaves-decoration.svg"
            alt=""
            fill
            sizes="90px"
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '22%', sm: '22%' },
            right: { xs: '10%', sm: '16%' },
            width: 90,
            height: 60,
            opacity: 0.6,
            transform: 'scaleX(-1)',
          }}
        >
          <Image
            src="/images/onboarding/leaves-decoration.svg"
            alt=""
            fill
            sizes="90px"
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        </Box>

        {/* Content section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mt: { xs: 2, sm: 3 },
          }}
        >
          {/* Pager dots */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: { xs: 2, sm: 2.5 },
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#D8D8D8',
              }}
            />
            <Box
              sx={{
                width: 20,
                height: 6,
                borderRadius: 999,
                backgroundColor: '#D2A298',
              }}
            />
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#D8D8D8',
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
              fontWeight: 600,
              color: '#333333',
              mb: 1.5,
            }}
          >
            Refresh, Renew, Rejuvenate
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: '#8B8B8B',
              mb: { xs: 3, sm: 3.5 },
              maxWidth: 420,
            }}
          >
            Experience the Ultimate Revival of Mind, Body, and Soul
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


