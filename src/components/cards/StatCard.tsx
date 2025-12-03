'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  color,
}: StatCardProps) {
  const theme = useTheme();
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: color
                ? `${color}15`
                : `${theme.palette.primary.main}15`,
              color: color || theme.palette.primary.main,
            }}
          >
            {icon}
          </Box>
          {change !== undefined && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: isPositive ? 'success.main' : 'error.main',
              }}
            >
              {isPositive ? (
                <TrendingUp fontSize="small" />
              ) : (
                <TrendingDown fontSize="small" />
              )}
              <Typography variant="body2" fontWeight={600}>
                {Math.abs(change)}%
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
