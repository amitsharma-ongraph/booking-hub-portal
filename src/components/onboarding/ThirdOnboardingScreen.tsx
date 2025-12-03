'use client';

import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import Image from 'next/image';

interface ThirdOnboardingScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

interface LocationCardProps {
  imageSrc: string;
  alt: string;
  position: {
    top?: { xs: string; sm: string };
    bottom?: { xs: string; sm: string };
    left?: { xs: string; sm: string };
    right?: { xs: string; sm: string };
  };
  size: {
    widthXs: number;
    widthSm: number;
    heightXs: number;
    heightSm: number;
  };
}

function LocationCard({ imageSrc, alt, position, size }: LocationCardProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
        ...position,
        transform: 'translateY(0)',
      }}
    >
      {/* Pin above card */}
      <Box
        sx={{
          width: 32,
          height: 40,
          position: 'relative',
          mb: 1,
        }}
      >
        <Image
          src="/images/onboarding/page3-pin.svg"
          alt="Location pin"
          fill
          sizes="32px"
          style={{ objectFit: 'contain' }}
          unoptimized
        />
      </Box>

      {/* Card with image */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: size.widthXs, sm: size.widthSm },
          height: { xs: size.heightXs, sm: size.heightSm },
          position: 'relative',
          borderRadius: '21.8px',
          overflow: 'hidden',
          backgroundColor: '#EDEDED',
          boxShadow: '0px 0px 29px rgba(215, 215, 215, 0.5)',
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="210px"
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </Paper>
    </Box>
  );
}

export default function ThirdOnboardingScreen({
  onNext,
  onSkip,
}: ThirdOnboardingScreenProps) {
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
        {/* Map background block */}
        <Box
          sx={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 40,
            overflow: 'hidden',
            position: 'relative',
            mb: { xs: 4, sm: 5 },
          }}
        >
          <Image
            src="/images/onboarding/page3-map.png"
            alt="Nearby wellness locations"
            fill
            sizes="(max-width: 768px) 100vw, 960px"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        </Box>

        {/* Location cards with integrated pins (pin just above each card), allowed to overflow map */}
        <LocationCard
          imageSrc="/images/onboarding/page3-card-top-left.png"
          alt="Top left location"
          position={{
            top: { xs: '10%', sm: '12%' },
            left: { xs: '6%', sm: '10%' },
          }}
          size={{
            widthXs: 140,
            widthSm: 170,
            heightXs: 70,
            heightSm: 80,
          }}
        />

        <LocationCard
          imageSrc="/images/onboarding/page3-card-bottom-left.jpg"
          alt="Bottom left location"
          position={{
            top: { xs: '52%', sm: '54%' },
            left: { xs: '10%', sm: '14%' },
          }}
          size={{
            widthXs: 180,
            widthSm: 210,
            heightXs: 80,
            heightSm: 90,
          }}
        />

        <LocationCard
          imageSrc="/images/onboarding/page3-card-right.jpg"
          alt="Right location"
          position={{
            top: { xs: '24%', sm: '26%' },
            right: { xs: '4%', sm: '8%' },
          }}
          size={{
            widthXs: 160,
            widthSm: 190,
            heightXs: 75,
            heightSm: 85,
          }}
        />

        {/* Content section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Pager dots (third active) */}
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
          </Box>

          <Typography
            sx={{
              fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
              fontWeight: 600,
              color: '#333333',
              mb: 1.5,
            }}
          >
            Unlock Your Inner Goddess
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: '#8B8B8B',
              mb: { xs: 3, sm: 3.5 },
              maxWidth: 420,
            }}
          >
            Embrace Your True Power and Beauty with Confidence
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


