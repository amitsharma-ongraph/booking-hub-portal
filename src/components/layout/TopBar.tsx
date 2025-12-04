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
import { mockUser } from '@/data/mockData';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // User name from SVG design
  const userName = 'Arwa Khalifa';

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
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.custom.text.account,
                fontSize: '0.75rem',
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              Account #123456789
            </Typography>
          </Box>

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
            <Image
              src="/images/avatar.svg"
              alt="User Avatar"
              width={44.5131}
              height={44.5131}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              priority
              unoptimized
            />
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
