'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface Tab {
  id: string;
  label: string;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ProfileTabs({ tabs, activeTab, onTabChange }: ProfileTabsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px',
        gap: '10px',
        width: '100%',
        height: { xs: '44px', sm: '48px' },
        background: '#FFFFFF',
        borderRadius: '999px',
        mb: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          gap: '4px',
          width: '100%',
          height: { xs: '36px', sm: '40px' },
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Box
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: { xs: '6px 10px', sm: '8px 12px' },
                gap: '10px',
                flex: 1,
                height: { xs: '36px', sm: '40px' },
                background: isActive ? '#A3B899' : 'transparent',
                borderRadius: '99px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: isActive ? '#A3B899' : 'rgba(163, 184, 153, 0.1)',
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: { xs: '14px', sm: '16px' },
                  lineHeight: '150%',
                  color: isActive ? '#FFFFFF' : '#B0B0B0',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

