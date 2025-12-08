'use client';

import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';

interface FirstOnboardingScreenProps {}

export default function FirstOnboardingScreen({}: FirstOnboardingScreenProps) {
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
                '@keyframes fadeInSlideLeft': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(-30px) scale(0.9)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0) scale(1)',
                  },
                },
                '@keyframes fadeInSlideRight': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(30px) scale(0.9)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0) scale(1)',
                  },
                },
                '@keyframes fadeInSlideUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(-50%) translateY(30px) scale(0.9)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(-50%) translateY(0) scale(1)',
                  },
                },
                '@keyframes fadeInSlideLeafTop': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(-50%) rotateY(180deg) translateY(-40px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(-50%) rotateY(180deg) translateY(0)',
                  },
                },
                '@keyframes fadeInSlideLeafLeft': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(-40px) translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0) translateY(0)',
                  },
                },
                '@keyframes fadeInSlideLeafRight': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(40px) translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0) translateY(0)',
                  },
                },
              }}
            >
              {/* Images arranged in upside-down triangle pattern */}
              {/* All sizes relative to container (2:1 aspect ratio) */}
              {/* Top Left - page1-left: reduced to prevent overlapping */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '5%',
                  left: '10%',
                  width: '30%',
                  height: '60%',
                  zIndex: 2,
                  animation: 'fadeInSlideLeft 0.8s ease-out 0.2s both',
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src="/images/onboarding/page1-left.png"
                    alt="Relaxation magazine"
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </Box>
              </Box>

              {/* Top Right - page1-right: reduced to prevent overlapping */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '5%',
                  right: '10%',
                  width: '29%',
                  height: '52%',
                  zIndex: 2,
                  animation: 'fadeInSlideRight 0.8s ease-out 0.4s both',
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src="/images/onboarding/page1-right.png"
                    alt="Sauna room"
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </Box>
              </Box>

              {/* Bottom Center - page1-center: reduced to prevent overlapping */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '5%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '28%',
                  height: '56%',
                  zIndex: 2,
                  animation: 'fadeInSlideUp 0.8s ease-out 0.6s both',
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src="/images/onboarding/page1-center.png"
                    alt="Spa treatment"
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </Box>
              </Box>

              {/* Leaves arranged in upright triangle pattern (pointing up) - taller than upside-down image triangle */}
              {/* Leaves: 15.3% width, 32.8% height of container */}
              {/* Top Center point of upright triangle */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '15%',
                  left: '50%',
                  transform: 'translateX(-50%) rotateY(180deg)',
                  width: '15.3%',
                  height: '32.8%',
                  zIndex: 1,
                  animation: 'fadeInSlideLeafTop 1s ease-out 0.8s both',
                }}
              >
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    transform: 'rotate(-45deg)',
                  }}
                >
                  <Image
                    src="/images/onboarding/leaves-decoration.svg"
                    alt=""
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </Box>
              </Box>

              {/* Bottom Left corner of upright triangle - moved lower for taller triangle */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '12%',
                  width: '15.3%',
                  height: '32.8%',
                  zIndex: 1,
                  animation: 'fadeInSlideLeafLeft 1s ease-out 1s both',
                }}
              >
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    transform: 'rotate(-90deg)',
                  }}
                >
                  <Image
                    src="/images/onboarding/leaves-decoration.svg"
                    alt=""
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </Box>
              </Box>

              {/* Bottom Right corner of upright triangle - moved lower for taller triangle */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '12%',
                  width: '15.3%',
                  height: '32.8%',
                  zIndex: 1,
                  animation: 'fadeInSlideLeafRight 1s ease-out 1.2s both',
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src="/images/onboarding/leaves-decoration.svg"
                    alt=""
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </Box>
              </Box>
            </Box>
          </Box>
    </Box>
  );
}


