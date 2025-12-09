'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsOutlined as NotificationsIcon,
  AccountCircle,
} from '@mui/icons-material';
import Image from 'next/image';
import { useAuthContext } from '@/contexts/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Handle client-side only rendering to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Get user name from auth context (only after mount to avoid hydration issues)
  const userName = mounted && user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddress
    : '';
  
  // Get account number from user ID (last 9 characters for readability)
  const accountNumber = mounted && user?.id 
    ? `Account #${user.id.replace(/-/g, '').slice(-9)}` 
    : '';
  
  // Get profile picture or fallback to default avatar
  const profilePicture = mounted && user?.profilePicture && !imageError
    ? user.profilePicture 
    : '/images/avatar.svg';
  
  // Reset image error when user changes
  React.useEffect(() => {
    if (user?.profilePicture) {
      setImageError(false);
    }
  }, [user?.profilePicture]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.custom.background.white,
        borderBottom: `1px solid ${theme.palette.custom.border.divider}`,
        color: theme.palette.custom.heading.dark,
        height: '80px',
      }}
    >
      <Toolbar
        sx={{
          height: '100%',
          px: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: { md: 'none' },
            color: theme.palette.custom.heading.dark,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Spacer for desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />

        {/* Right side group: Notifications + User Avatar and Name */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            ml: 'auto',
          }}
        >
          {/* Notifications */}
          <IconButton
            color="inherit"
            sx={{
              color: theme.palette.text.secondary,
              p: 1,
            }}
          >
            <Badge
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: theme.palette.custom.status.notification,
                  right: 4,
                  top: 4,
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: '1.5rem' }} />
            </Badge>
          </IconButton>

          {/* Account Name and Number */}
          {mounted && userName && (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.25,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.custom.heading.dark,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {userName}
              </Typography>
              {accountNumber && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.custom.text.account,
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  {accountNumber}
                </Typography>
              )}
            </Box>
          )}

          {/* User Avatar */}
          <Box
            sx={{
              cursor: 'pointer',
              width: '44.5131px',
              height: '44.5131px',
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
            }}
            onClick={handleMenu}
          >
            {profilePicture.startsWith('http://') || profilePicture.startsWith('https://') ? (
              // External URL (S3) - use regular img tag (Next.js Image doesn't support external URLs without config)
              <Box
                component="img"
                src={profilePicture}
                alt={userName || 'User Avatar'}
                onError={() => setImageError(true)}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            ) : (
              // Local path - use Next.js Image
              <Image
                src={profilePicture}
                alt={userName || 'User Avatar'}
                fill
                sizes="45px"
                style={{ objectFit: 'cover' }}
                onError={() => setImageError(true)}
              />
            )}
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={handleClose}>
            <AccountCircle sx={{ mr: 1.5 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
