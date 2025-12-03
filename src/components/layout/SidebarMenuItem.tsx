'use client';

import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import Image from 'next/image';

export interface SidebarMenuItemProps {
  label: string;
  path: string;
  icon: React.ReactNode | string; // Can be React component or SVG path string
  isActive: boolean;
  onClick: (path: string) => void;
  variant?: 'default' | 'logout';
}

/**
 * Reusable sidebar menu item component
 * Supports both Material-UI icons and SVG icons from public folder
 */
export default function SidebarMenuItem({
  label,
  path,
  icon,
  isActive,
  onClick,
  variant = 'default',
}: SidebarMenuItemProps) {
  const isLogout = variant === 'logout';

  // Determine if icon is a string path (SVG) or React component
  const isSvgIcon = typeof icon === 'string';

  const handleClick = () => {
    onClick(path);
  };

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: '10px',
          py: 1.75,
          px: 2,
          backgroundColor: isActive && !isLogout ? '#D9B5A1' : 'transparent',
          color: isLogout ? '#E1000F' : isActive ? '#FFFFFF' : '#364153',
          minHeight: '53.42px',
          '&:hover': {
            backgroundColor: isLogout
              ? 'rgba(225, 0, 15, 0.1)'
              : isActive
              ? '#D9B5A1'
              : 'rgba(217, 181, 161, 0.1)',
          },
          '& .MuiListItemIcon-root': {
            color: isLogout ? '#E1000F' : isActive ? '#FFFFFF' : '#364153',
            minWidth: 40,
          },
        }}
      >
        <ListItemIcon>
          {isSvgIcon ? (
            <Box
              sx={{
                width: 24,
                height: 24,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={icon}
                alt={`${label} icon`}
                width={24}
                height={24}
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
                unoptimized
              />
            </Box>
          ) : (
            icon
          )}
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontWeight: isActive && !isLogout ? 500 : 400,
            fontSize: '0.9375rem',
            color: isLogout ? '#E1000F' : isActive ? '#FFFFFF' : '#364153',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

