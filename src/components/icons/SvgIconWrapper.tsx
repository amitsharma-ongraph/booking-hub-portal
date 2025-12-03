'use client';

import React from 'react';
import { SvgIcon, SvgIconProps, Box } from '@mui/material';
import Image from 'next/image';

export interface SvgIconWrapperProps extends Omit<SvgIconProps, 'component'> {
  /**
   * Can be:
   * - SVG component (React component): import Icon from "@/assets/icons/icon.svg"
   * - String path: "/images/icons/icon.svg"
   */
  src: React.ComponentType<React.SVGProps<SVGSVGElement>> | string;
  /**
   * Size in pixels (for string paths only)
   */
  size?: number;
}

/**
 * Wrapper component that uses MUI's SvgIcon for SVG components (with color control)
 * or Next.js Image for string paths (with CSS filter for color approximation)
 * 
 * Usage with SVG component:
 * ```tsx
 * import BookingsIcon from "@/assets/icons/bookings-icon.svg";
 * <SvgIconWrapper src={BookingsIcon} sx={{ color: "#CFA09F", fontSize: 24 }} />
 * ```
 * 
 * Usage with string path:
 * ```tsx
 * <SvgIconWrapper src="/images/icons/bookings-icon.svg" size={24} sx={{ color: "red" }} />
 * ```
 */
export default function SvgIconWrapper({ 
  src, 
  size = 24,
  sx,
  ...props 
}: SvgIconWrapperProps) {
  // Check if src is a string (path) or a component
  const isStringPath = typeof src === 'string';

  // Extract color from sx prop if provided
  const color = sx && typeof sx === 'object' && sx !== null && 'color' in sx 
    ? sx.color 
    : undefined;

  if (isStringPath) {
    // For string paths, use an img tag with CSS filter for color approximation
    // Note: CSS filters are approximations. For exact colors, use SVG components.
    return (
      <Box
        component="img"
        src={src}
        alt="Icon"
        sx={{
          width: size,
          height: size,
          objectFit: 'contain',
          // Apply color filter if color is specified
          ...(color && typeof color === 'string' && color !== 'inherit' 
            ? { 
                filter: getColorFilter(color),
              }
            : {}),
          ...sx,
        }}
      />
    );
  }

  // Use SvgIcon for SVG components (allows proper color control)
  return (
    <SvgIcon
      {...props}
      component={src as React.ComponentType<React.SVGProps<SVGSVGElement>>}
      inheritViewBox
      sx={sx}
    />
  );
}

/**
 * Helper function to convert color to CSS filter
 * This is an approximation - for accurate colors, use SVG components
 */
function getColorFilter(color: string): string {
  // Normalize color string
  const normalizedColor = color.toLowerCase().trim();
  
  // For black (#000000 or #000)
  if (normalizedColor === 'black' || normalizedColor === '#000000' || normalizedColor === '#000') {
    // Black filter - invert to black
    return 'brightness(0)';
  }
  
  // For white (#FFFFFF or #FFF)
  if (normalizedColor === 'white' || normalizedColor === '#ffffff' || normalizedColor === '#fff') {
    // White filter - invert to white
    return 'brightness(0) invert(1)';
  }
  
  // For #CFA09F (pinkish/beige color used in dashboard cards)
  if (normalizedColor === '#cfa09f' || normalizedColor === '#CFA09F') {
    // Approximate filter for #CFA09F - this is a pinkish beige color
    // CSS filters can't perfectly match this, but we can approximate it
    return 'brightness(0) saturate(100%) invert(75%) sepia(15%) saturate(500%) hue-rotate(320deg) brightness(110%) contrast(90%)';
  }
  
  // For red
  if (normalizedColor === 'red' || normalizedColor === '#ff0000' || normalizedColor === '#f00') {
    return 'invert(27%) sepia(100%) saturate(7482%) hue-rotate(0deg) brightness(100%) contrast(100%)';
  }
  
  // For other colors, return empty string (no filter applied)
  // CSS filters are limited - for exact colors, use SVG components
  return '';
}

