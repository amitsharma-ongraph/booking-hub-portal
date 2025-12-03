'use client';

import React from 'react';
import {
  Drawer,
  List,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
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
    label: 'Categories', 
    icon: '/images/icons/categories-icon.svg', // Replace with actual SVG path
    path: '/categories',
  },
  { 
    label: 'Calendar', 
    icon: '/images/icons/calendar-icon.svg', // Replace with actual SVG path
    path: '/calendar',
  },
];

const logoutItem: Omit<SidebarMenuItemProps, 'isActive' | 'onClick'> = {
  label: 'Logout',
  icon: <LogoutIcon />, // Using Material-UI icon for logout
  path: '/login',
  variant: 'logout',
};

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
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
            unoptimized
          />
        </Box>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          height: '1px',
          backgroundColor: '#E5E7EB',
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
          borderTop: '1px solid #E5E7EB',
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
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #E5E7EB',
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
            borderRight: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
