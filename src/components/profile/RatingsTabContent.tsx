'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Rating,
  Box,
  useTheme,
} from '@mui/material';
import type { CompanyDto } from '@/lib/api/companies/types';

interface RatingsTabContentProps {
  company: CompanyDto;
}

export default function RatingsTabContent({ company }: RatingsTabContentProps) {
  const theme = useTheme();

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time from date string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const ratings = company.ratings || [];

  if (ratings.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Roboto',
            fontSize: '14px',
            color: '#B0B0B0',
            fontStyle: 'italic',
          }}
        >
          No ratings available yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {ratings.map((rating) => (
        <Grid size={{ xs: 12 }} key={rating.id}>
          <Card
            sx={{
              backgroundColor: theme.palette.custom?.background?.white || '#FFFFFF',
              borderRadius: '15.5796px',
              boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
              width: '100%',
            }}
          >
            <CardContent
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {/* First Row: Name on left, Rating stars and number on right */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{
                    color: theme.palette.custom?.heading?.dark || '#041C2C',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  {rating.customerName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating
                    value={rating.score}
                    readOnly
                    size="small"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#FFB800', // Gold color for filled stars
                      },
                      '& .MuiRating-iconEmpty': {
                        color: '#E0E0E0', // Light gray for empty stars
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {rating.score}
                  </Typography>
                </Box>
              </Box>

              {/* Second Row: Comment/Feedback */}
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                {rating.feedback || 'No feedback provided.'}
              </Typography>

              {/* Third Row: Date and Time */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem',
                  }}
                >
                  {formatDate(rating.creationDate)}
                </Typography>
                <Box
                  sx={{
                    width: '1px',
                    height: '12px',
                    backgroundColor: theme.palette.custom?.border?.divider || '#E0E0E0',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem',
                  }}
                >
                  {formatTime(rating.creationDate)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

