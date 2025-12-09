'use client';

import React from 'react';
import {
  Drawer,
  List,
  Box,
  useTheme as useMuiTheme,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import SidebarMenuItem, { SidebarMenuItemProps } from './SidebarMenuItem';

const drawerWidth = 285; // Match SVG width

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

// Menu items configuration - can use either Material-UI icons or SVG paths
// For now using placeholder paths - replace with actual SVG paths from Figma
const menuItems: Omit<SidebarMenuItemProps, 'isActive' | 'onClick'>[] = [
  { 
    label: 'Dashboard', 
    icon: '/images/icons/dashboard-icon.svg', // Replace with actual SVG path
    path: '/',
  },
  { 
    label: 'Bookings', 
    icon: '/images/icons/bookings-icon.svg', // Replace with actual SVG path
    path: '/bookings',
  },
  { 
    label: 'Calendar', 
    icon: '/images/icons/calendar-icon.svg', // Replace with actual SVG path
    path: '/calendar',
  },
  { 
    label: 'Categories', 
    icon: '/images/icons/categories-icon.svg', // Replace with actual SVG path
    path: '/categories',
  },

];

const logoutItem: Omit<SidebarMenuItemProps, 'isActive' | 'onClick'> = {
  label: 'Logout',
  icon: <LogoutIcon />, // Using Material-UI icon for logout
  path: '/logout',
  variant: 'logout',
};

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useMuiTheme();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    // For protected routes, ensure middleware runs by checking if we need full reload
    // Middleware will handle protection, but we use normal navigation for better UX
    if (isMobile) {
      onClose();
    }
    router.push(path);
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.custom.background.white,
      }}
    >
      {/* Logo/Brand - Height: 80px */}
      <Box
        sx={{
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            position: 'relative',
          }}
        >
          <Image
            src="/images/login/logo.svg"
            alt="Booking Hub Logo"
            width={40}
            height={40}
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
            }}
            priority
            sizes="40px"
          />
        </Box>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          height: '1px',
          backgroundColor: theme.palette.custom.border.divider,
          width: '100%',
        }}
      />

      {/* Navigation Menu */}
      <List
        sx={{
          flex: 1,
          px: 2.25, // ~18px
          py: 2,
          overflow: 'auto',
        }}
      >
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={item.icon}
            isActive={pathname === item.path}
            onClick={handleNavigation}
            variant={item.variant || 'default'}
          />
        ))}
      </List>

      {/* Footer Section with Logout */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.custom.border.divider}`,
          pt: 2,
          pb: 2,
        }}
      >
        <List sx={{ px: 2.25 }}>
          <SidebarMenuItem
            label={logoutItem.label}
            path={logoutItem.path}
            icon={logoutItem.icon}
            isActive={false}
            onClick={handleNavigation}
            variant={logoutItem.variant}
          />
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.custom.background.white,
            borderRight: `1px solid ${theme.palette.custom.border.divider}`,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.custom.border.divider}`,
            backgroundColor: theme.palette.custom.background.white,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
