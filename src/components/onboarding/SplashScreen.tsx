'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after component mounts (client-side only)
    setMounted(true);

    // Auto-complete after 4 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleClick = () => {
    onComplete();
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        minHeight: '100vh',
        position: 'relative',
        cursor: 'pointer',
        // Background gradient from PNG: white -> #D2A298
        background: 'linear-gradient(180deg, #FFFFFF 0%, #D2A298 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: mounted ? 1 : 1,
        transition: mounted ? 'opacity 0.5s ease-in' : 'none',
      }}
    >
      {/* Background Decorative Leaves - Top Left (going left to right) */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          top: 100,
          left: 50,
          width: '544px',
          height: '544px',
          zIndex: 0,
          transform: 'translate(-10%, -10%)',
          backgroundImage: 'url(/images/onboarding/leaves-decoration.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top left',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Background Decorative Leaves - Bottom Right (going right to left - flipped horizontally) */}
      <Box
        component="div"
        sx={{
          position: 'absolute',
          bottom: -40,
          right: -120,
          width: '544px',
          height: '544px',          zIndex: 0,
          transform: 'translate(10%, 10%) scaleX(-1)',
          backgroundImage: 'url(/images/onboarding/leaves-decoration.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom right',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Main Content - Centered */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: { xs: 2, sm: 3 },
          transform: mounted ? 'translateY(0)' : 'translateY(0)',
          transition: mounted ? 'transform 0.6s ease-out' : 'none',
        }}
      >
        {/* Logo Illustration */}
        <Box
          sx={{
            width: { xs: 280, sm: 350, md: 420, lg: 500 },
            height: { xs: 200, sm: 250, md: 300, lg: 360 },
            position: 'relative',
            opacity: mounted ? 1 : 1,
            transition: mounted ? 'opacity 0.8s ease-in 0.4s' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src="/images/login/logo.svg"
            alt="Booking Hub Logo"
            width={500}
            height={360}
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            priority
            sizes="(max-width: 600px) 280px, (max-width: 960px) 350px, (max-width: 1280px) 420px, 500px"
          />
        </Box>
      </Box>
    </Box>
  );
}

