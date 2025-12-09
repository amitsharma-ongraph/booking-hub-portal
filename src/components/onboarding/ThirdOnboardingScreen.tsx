'use client';

import React from 'react';
import { Box, Paper } from '@mui/material';
import Image from 'next/image';

interface ThirdOnboardingScreenProps {}

interface LocationCardProps {
  imageSrc: string;
  alt: string;
  position: {
    top?: { xs: string; sm: string; md: string; lg: string };
    bottom?: { xs: string; sm: string; md: string; lg: string };
    left?: { xs: string; sm: string; md: string; lg: string };
    right?: { xs: string; sm: string; md: string; lg: string };
  };
  size: {
    width: { xs: number; sm: number; md: number; lg: number };
    height: { xs: number; sm: number; md: number; lg: number };
  };
  animation?: string;
}

function LocationCard({ imageSrc, alt, position, size, animation }: LocationCardProps) {
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
        ...(animation && { animation }),
      }}
    >
      {/* Pin above card - responsive */}
      <Box
        sx={{
          width: { xs: 20, sm: 24, md: 28, lg: 32 },
          height: { xs: 25, sm: 30, md: 35, lg: 40 },
          position: 'relative',
          mb: { xs: 0.5, sm: 0.75, md: 1 },
        }}
      >
        <Image
          src="/images/onboarding/page3-pin.svg"
          alt="Location pin"
          fill
          sizes="(max-width: 600px) 20px, (max-width: 960px) 28px, 32px"
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </Box>

      {/* Card with image - responsive pixel sizes */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: size.width.xs, sm: size.width.sm, md: size.width.md, lg: size.width.lg },
          height: { xs: size.height.xs, sm: size.height.sm, md: size.height.md, lg: size.height.lg },
          position: 'relative',
          borderRadius: { xs: '16px', sm: '18px', md: '21.8px' },
          overflow: 'hidden',
          backgroundColor: '#EDEDED',
          boxShadow: '0px 0px 29px rgba(215, 215, 215, 0.5)',
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 600px) 125px, (max-width: 960px) 175px, 200px"
          style={{ objectFit: 'cover' }}
          loading="lazy"
        />
      </Paper>
    </Box>
  );
}

export default function ThirdOnboardingScreen({}: ThirdOnboardingScreenProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        maxWidth: { xs: '100%', sm: 650, md: 800, lg: 950 },
        p: { xs: 1, sm: 2, md: 3, lg: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Map background block - positioning context for cards */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: { xs: 8, sm: 10, md: 12 },
          overflow: 'visible',
          position: 'relative',
          '@keyframes fadeInScale': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.95)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
          '@keyframes slideInFromLeft': {
            '0%': {
              opacity: 0,
              transform: 'translateX(-40px) translateY(0)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateX(0) translateY(0)',
            },
          },
          '@keyframes slideInFromRight': {
            '0%': {
              opacity: 0,
              transform: 'translateX(40px) translateY(0)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateX(0) translateY(0)',
            },
          },
          '@keyframes slideInFromBottom': {
            '0%': {
              opacity: 0,
              transform: 'translateY(40px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        {/* Map image container */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            borderRadius: 'inherit',
            overflow: 'hidden',
            animation: 'fadeInScale 0.8s ease-out 0.2s both',
          }}
        >
          <Image
            src="/images/onboarding/page3-map.png"
            alt="Nearby wellness locations"
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 960px) 80vw, 950px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>

        {/* Location cards with integrated pins - positioned relative to map container */}
        <LocationCard
          imageSrc="/images/onboarding/page3-card-top-left.png"
          alt="Top left location"
          position={{
            top: { xs: '8%', sm: '10%', md: '12%', lg: '12%' },
            left: { xs: '4%', sm: '6%', md: '8%', lg: '-3%' },
          }}
          size={{
            width: { xs: 100, sm: 125, md: 140, lg: 165 },
            height: { xs: 50, sm: 60, md: 65, lg: 80 },
          }}
          animation="slideInFromLeft 0.8s ease-out 0.6s both"
        />

        <LocationCard
          imageSrc="/images/onboarding/page3-card-bottom-left.jpg"
          alt="Bottom left location"
          position={{
            top: { xs: '50%', sm: '52%', md: '54%', lg: '60%' },
            left: { xs: '6%', sm: '10%', md: '12%', lg: '8%' },
          }}
          size={{
            width: { xs: 125, sm: 150, md: 175, lg: 200 },
            height: { xs: 60, sm: 70, md: 75, lg: 90 },
          }}
          animation="slideInFromBottom 0.8s ease-out 0.8s both"
        />

        <LocationCard
          imageSrc="/images/onboarding/page3-card-right.jpg"
          alt="Right location"
          position={{
            top: { xs: '22%', sm: '24%', md: '26%', lg: '26%' },
            right: { xs: '2%', sm: '4%', md: '6%', lg: '-3%' },
          }}
          size={{
            width: { xs: 110, sm: 135, md: 160, lg: 185 },
            height: { xs: 55, sm: 65, md: 70, lg: 85 },
          }}
          animation="slideInFromRight 0.8s ease-out 1s both"
        />
      </Box>
    </Box>
  );
}


