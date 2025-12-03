'use client';

import React from 'react';
import { Box, Card } from '@mui/material';
import Image from 'next/image';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  cardHeight?: string | number | { xs?: string | number; sm?: string | number; md?: string | number };
}

export default function AuthPageLayout({ children, cardHeight }: AuthPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        // Background gradient from SVG: white -> #D6DFD1 -> #A3B899
        background: 'linear-gradient(180deg, #FFFFFF 0%, #D6DFD1 44.71%, #A3B899 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 0 },
      }}
    >
      {/* Background Decorative Leaves - Top Right (going left to right) */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          top: 0,
          right: -220,
          width: { xs: '50%', sm: '45%', md: '40%', lg: '35%' },
          height: { xs: '40%', sm: '45%', md: '50%' },
          opacity: 0.18,
          zIndex: 0,
          transform: 'rotateY(180deg)',
          scale:1.5,
          backgroundImage: 'url(/images/login/leaves-decoration.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Background Decorative Leaves - Bottom Left (going right to left - flipped horizontally) */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: { xs: '50%', sm: '45%', md: '40%', lg: '35%' },
          height: { xs: '40%', sm: '45%', md: '50%' },
          opacity: 0.18,
          zIndex: 0,
          backgroundImage: 'url(/images/login/leaves-decoration.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom left',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Logo in top-left - Position from SVG: x="87.5" y="58.5" */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 24, md: 32, lg: 58 },
          left: { xs: 16, sm: 24, md: 32, lg: 88 },
          zIndex: 1,
          width: { xs: 80, sm: 90, md: 100 },
          height: { xs: 80, sm: 90, md: 100 },
        }}
      >
        <Image
          src="/images/login/logo.svg"
          alt="Booking Hub Logo"
          width={100}
          height={100}
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          }}
          priority
          unoptimized
        />
      </Box>

      {/* Auth Card - Centered on all screens */}
      <Card
        sx={{
          position: 'relative',
          zIndex: 1,
          width: { xs: 'calc(100% - 32px)', sm: 585 },
          maxWidth: { xs: 'calc(100% - 32px)', sm: 585 },
          height: cardHeight || { xs: 'auto', sm: 'auto' },
          borderRadius: { xs: 3, sm: '30px' },
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
          p: { xs: 3, sm: 4, md: '36.5px' },
          // Centered via flexbox parent on all screen sizes
        }}
      >
        {children}
      </Card>
    </Box>
  );
}

