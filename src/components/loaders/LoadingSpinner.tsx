'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  text?: string;
  size?: number;
}

/**
 * Loading spinner component matching Figma design
 * Features 12 dots arranged in a circle with rotation animation
 * Positions and colors match the exact Figma specifications
 */
export default function LoadingSpinner({ text = 'Loading', size = 100 }: LoadingSpinnerProps) {
  // Define the 12 dots with exact positions and colors from Figma
  // Each dot is 9.68px (9.68% of 100px)
  const dotSize = size * 0.0968; // 9.68px for 100px size
  
  // Radius from center (approximately 40% of size based on SVG)
  const radius = size * 0.4;
  
  // Define dots with angles (in degrees) and colors matching Figma
  // Angles start from top (0°) and go clockwise
  const dotConfigs = [
    { angle: 0, color: '#383A39' },      // Top (12 o'clock)
    { angle: 30, color: '#77807F' },      // 1 o'clock
    { angle: 60, color: '#9FAAA9' },      // 2 o'clock
    { angle: 90, color: '#B2BBBA' },      // Right (3 o'clock)
    { angle: 120, color: '#C5CCCB' },     // 4 o'clock
    { angle: 150, color: '#D9DDDD' },     // 5 o'clock
    { angle: 180, color: '#ECEEEE' },     // Bottom (6 o'clock)
    { angle: 210, color: '#F2F4F4' },     // 7 o'clock
    { angle: 240, color: '#F2F7F7' },     // 8 o'clock
    { angle: 270, color: '#FFFFFF' },     // Left (9 o'clock)
    { angle: 300, color: '#000000' },      // 10 o'clock
    { angle: 330, color: '#111111' },     // 11 o'clock
  ];
  
  // Calculate positions for each dot
  const dots = dotConfigs.map((config) => {
    const angleRad = (config.angle * Math.PI) / 180;
    // Calculate position relative to center (50%, 50%)
    const x = 50 + (radius / size) * 100 * Math.sin(angleRad);
    const y = 50 - (radius / size) * 100 * Math.cos(angleRad);
    return {
      left: x,
      top: y,
      color: config.color,
    };
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 0,
        gap: '44.26px',
        width: '444.07px',
        height: 'auto',
        flex: 'none',
      }}
    >
      {/* Spinner Container */}
      <Box
        sx={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          flex: 'none',
          animation: 'spin 1.2s linear infinite',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        }}
      >
        {dots.map((dot, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              transform: 'translate(-50%, -50%)',
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              borderRadius: '50%',
              backgroundColor: dot.color,
              flex: 'none',
            }}
          />
        ))}
      </Box>

      {/* Loading Text */}
      <Typography
        sx={{
          width: '444.07px',
          height: '27px',
          fontFamily: 'Roboto',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '18px',
          lineHeight: '150%',
          textAlign: 'center',
          color: '#B0B0B0',
          flex: 'none',
          alignSelf: 'stretch',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

