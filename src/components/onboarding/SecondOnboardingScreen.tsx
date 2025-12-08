'use client';

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Image from 'next/image';

interface SecondOnboardingScreenProps {}

interface OptionCardProps {
  label: string;
  iconSrc: string;
  position: {
    top?: string | { xs: string; sm: string; md: string };
    bottom?: string | { xs: string; sm: string; md: string };
    left?: string | { xs: string; sm: string; md: string };
    right?: string | { xs: string; sm: string; md: string };
    transform?: string;
  };
}

function OptionCard({ label, iconSrc, position }: OptionCardProps) {
  return (
    <Paper
      elevation={6}
      sx={{
        position: 'absolute',
        px: { xs: 2, sm: 2.5, md: 3 },
        py: { xs: 1.5, sm: 1.75, md: 2 },
        borderRadius: '21.8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: { xs: 150, sm: 170, md: 190 },
        maxWidth: { xs: 150, sm: 170, md: 190 },
        backgroundColor: '#EDEDED',
        boxShadow: '0px 0px 29px rgba(215, 215, 215, 0.5)',
        zIndex: 2,
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        transform: position.transform,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.95rem',
          color: '#333333',
          mr: 2,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          width: 32,
          height: 32,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Image
          src={iconSrc}
          alt={`${label} icon`}
          fill
          sizes="32px"
          style={{ objectFit: 'contain' }}
          unoptimized
        />
      </Box>
    </Paper>
  );
}

export default function SecondOnboardingScreen({}: SecondOnboardingScreenProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        maxWidth: 1200,
        p: { xs: 1, sm: 2, md: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Inner box with 10:7 aspect ratio (width:height = 10:7, height = width * 0.7) */}
      <Box
        sx={{
          position: 'relative',
          width: '85%',
          height: 0,
          paddingBottom: '59.5%', // 10:7 ratio (height = width * 0.7, 85% * 0.7 = 59.5%)
          maxWidth: '85%',
        }}
      >
        {/* Absolute positioned container for all elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            '@keyframes fadeInScale': {
              '0%': {
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0.8)',
              },
              '100%': {
                opacity: 1,
                transform: 'translate(-50%, -50%) scale(1)',
              },
            },
            '@keyframes slideInFromLeft': {
              '0%': {
                opacity: 0,
                transform: 'translate(-100%, -50%) translateX(-25%) translateX(-40px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translate(-100%, -50%) translateX(-25%)',
              },
            },
            '@keyframes slideInFromTopRight': {
              '0%': {
                opacity: 0,
                transform: 'translate(15%, -100%) translateY(-15%) translateY(-30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translate(15%, -100%) translateY(-15%)',
              },
            },
            '@keyframes slideInFromBottomRight': {
              '0%': {
                opacity: 0,
                transform: 'translate(15%, 100%) translateY(15%) translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translate(15%, 100%) translateY(15%)',
              },
            },
          }}
        >
          {/* Large circular background image - centered, maintaining perfect circle */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '60%', sm: '50%', md: '45%' },
              aspectRatio: '1 / 1', // Ensures perfect circle
              maxWidth: 380,
              maxHeight: 380,
              minWidth: 260,
              minHeight: 260,
              borderRadius: '50%',
              overflow: 'hidden',
              zIndex: 1,
              animation: 'fadeInScale 0.8s ease-out 0.2s both',
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src="/images/onboarding/page2-main.png"
                alt="Service selection"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </Box>
            {/* Black overlay mask with 70% opacity */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '50%',
                zIndex: 2,
              }}
            />
          </Box>

          {/* Floating option cards - positioned relative to circle center */}
          {/* Left side card - starting from left, going into the circle */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 3,
              animation: 'slideInFromLeft 0.8s ease-out 0.6s both',
            }}
          >
            <OptionCard
              label="Yoga"
              iconSrc="/images/onboarding/page2-yoga.svg"
              position={{
                transform: 'translate(-100%, -50%) translateX(-25%)',
              }}
            />
          </Box>

          {/* Top right card - inside circle, ending at top right */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 3,
              animation: 'slideInFromTopRight 0.8s ease-out 0.8s both',
            }}
          >
            <OptionCard
              label="Hair salon"
              iconSrc="/images/onboarding/page2-hair-salon.svg"
              position={{
                transform: 'translate(15%, -100%) translateY(-15%)',
              }}
            />
          </Box>

          {/* Bottom right card - inside circle, ending at bottom right */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 3,
              animation: 'slideInFromBottomRight 0.8s ease-out 1s both',
            }}
          >
            <OptionCard
              label="Spa"
              iconSrc="/images/onboarding/page2-spa.svg"
              position={{
                transform: 'translate(15%, 100%) translateY(15%)',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


