'use client';

import React from 'react';
import { Box, Card, useTheme } from '@mui/material';
import Image from 'next/image';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  cardHeight?: string | number | { xs?: string | number; sm?: string | number; md?: string | number };
}

export default function AuthPageLayout({ children, cardHeight }: AuthPageLayoutProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        // Background gradient
        background: `linear-gradient(180deg, ${theme.palette.custom.background.gradient.start} 0%, ${theme.palette.custom.background.gradient.middle} 44.71%, ${theme.palette.custom.background.gradient.end} 100%)`,
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
          top: -300,
          right:'-325px',
          width: "1046px",
          height: "1046px",
          opacity: 0.18,
          zIndex: 0,
          transform: 'rotateY(180deg)',
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
          bottom: -580,
          left: -200,
          width: 1046,
          height: 1046,
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

      {/* Auth Card - Responsive dimensions: 585px width at 1440px, 750px height at 1024px */}
      <Card
        sx={{
          position: 'relative',
          zIndex: 1,
          // Width: 585px at 1440px viewport = ~40.6%, responsive for different sizes
          width: { 
            xs: 'calc(100% - 32px)', 
            sm: 'min(585px, calc(100% - 48px))',
            md: 585, // Fixed 585px from 900px+ to match 1200px+ behavior
            lg: 585 
          },
          maxWidth: 585,
          // Height: 750px at 1024px viewport = ~73.2%, responsive for different sizes
          height: cardHeight || { 
            xs: 'auto',
            sm: 'min(750px, 73.24vh)', // 750/1024 = 73.24%
            md: 'min(750px, 73.24vh)',
            lg: 750
          },
          borderRadius: { xs: 3, sm: '30px' },
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          backgroundColor: theme.palette.custom.background.white,
          p: { xs: 3, sm: 4, md: '36.5px' },
          // Center children content within the card
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Card>
    </Box>
  );
}

