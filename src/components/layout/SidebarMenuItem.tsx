'use client';

import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import SvgIconWrapper from '@/components/icons/SvgIconWrapper';

export interface SidebarMenuItemProps {
  label: string;
  path: string;
  /**
   * Icon can be:
   * - SVG component: import DashboardIcon from "@/assets/icons/dashboard-icon.svg"
   * - String path: "/images/icons/dashboard-icon.svg"
   * - Material-UI icon: <DashboardIcon />
   */
  icon: React.ReactNode | React.ComponentType<React.SVGProps<SVGSVGElement>> | string;
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

  // Check if icon is a string path, SVG component, or React element
  const isStringPath = typeof icon === 'string';
  const isSvgComponent = typeof icon === 'function' && !React.isValidElement(icon);
  const isReactElement = React.isValidElement(icon);

  const handleClick = () => {
    onClick(path);
  };

  // Icon color: black when not selected, white when selected (for non-logout items)
  const theme = useTheme();
  const iconColor = isLogout ? theme.palette.custom.status.logout : isActive ? theme.palette.common.white : theme.palette.common.black;

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: '10px',
          py: 1.75,
          px: 2,
          backgroundColor: isActive && !isLogout ? theme.palette.custom.background.sidebar.active : 'transparent',
          color: isLogout ? theme.palette.custom.status.logout : isActive ? theme.palette.common.white : theme.palette.text.primary,
          minHeight: '53.42px',
          '&:hover': {
            backgroundColor: isLogout
              ? 'rgba(225, 0, 15, 0.1)'
              : isActive
              ? theme.palette.custom.background.sidebar.active
              : 'rgba(217, 181, 161, 0.1)',
          },
          '& .MuiListItemIcon-root': {
            color: iconColor,
            minWidth: 40,
          },
        }}
      >
        <ListItemIcon>
          {isStringPath ? (
            <SvgIconWrapper 
              src={icon as string} 
              size={24}
              sx={{
                color: iconColor,
              }}
            />
          ) : isSvgComponent ? (
            <SvgIconWrapper
              src={icon as React.ComponentType<React.SVGProps<SVGSVGElement>>}
              sx={{
                color: iconColor,
                fontSize: '1.5rem',
              }}
            />
          ) : (
            icon
          )}
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontWeight: isActive && !isLogout ? 500 : 400,
            fontSize: '0.9375rem',
            color: isLogout ? theme.palette.custom.status.logout : isActive ? theme.palette.common.white : theme.palette.text.primary,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

