'use client';

import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import Image from 'next/image';

interface SecondOnboardingScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

interface OptionCardProps {
  label: string;
  iconSrc: string;
  position: {
    top?: { xs: string; sm: string };
    bottom?: { xs: string; sm: string };
    left?: { xs: string; sm: string };
    right?: { xs: string; sm: string };
  };
}

function OptionCard({ label, iconSrc, position }: OptionCardProps) {
  return (
    <Paper
      elevation={6}
      sx={{
        position: 'absolute',
        px: 3,
        py: 2,
        borderRadius: '21.8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 190,
        backgroundColor: '#EDEDED',
        boxShadow: '0px 0px 29px rgba(215, 215, 215, 0.5)',
        ...position,
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

export default function SecondOnboardingScreen({
  onNext,
  onSkip,
}: SecondOnboardingScreenProps) {
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
        {/* Large circular background image */}
        <Box
          sx={{
            width: { xs: 260, sm: 320, md: 380 },
            height: { xs: 260, sm: 320, md: 380 },
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            mx: 'auto',
            mb: { xs: 4, sm: 5 },
          }}
        >
          <Image
            src="/images/onboarding/page2-main.png"
            alt="Service selection"
            fill
            sizes="(max-width: 768px) 260px, 380px"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        </Box>

        {/* Floating option cards built as rounded rectangles with text + SVG icon */}
        <OptionCard
          label="Hair salon"
          iconSrc="/images/onboarding/page2-hair-salon.svg"
          position={{
            top: { xs: '23%', sm: '24%' },
            right: { xs: '8%', sm: '16%' },
          }}
        />

        <OptionCard
          label="Yoga"
          iconSrc="/images/onboarding/page2-yoga.svg"
          position={{
            top: { xs: '34%', sm: '36%' },
            left: { xs: '8%', sm: '16%' },
          }}
        />

        <OptionCard
          label="Spa"
          iconSrc="/images/onboarding/page2-spa.svg"
          position={{
            bottom: { xs: '32%', sm: '32%' },
            right: { xs: '8%', sm: '16%' },
          }}
        />

        {/* Content section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mt: { xs: 4, sm: 5 },
          }}
        >
          {/* Pager dots (second active) */}
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
            Discover Your Radiance
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: '#8B8B8B',
              mb: { xs: 3, sm: 3.5 },
              maxWidth: 420,
            }}
          >
            Unveil the Glow Within and Shine Brighter Than Ever
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


