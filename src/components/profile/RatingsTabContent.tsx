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
import { mockRatings } from '@/data/mockData';

export default function RatingsTabContent() {
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

  return (
    <Grid container spacing={3}>
      {mockRatings.map((review) => (
        <Grid size={{ xs: 12 }} key={review.id}>
          <Card
            sx={{
              backgroundColor: theme.palette.custom.background.white,
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
                    color: theme.palette.custom.heading.dark,
                    fontSize: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  {review.customerName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating
                    value={review.rating}
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
                    {review.rating}
                  </Typography>
                </Box>
              </Box>

              {/* Second Row: Comment */}
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                {review.comment}
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
                  {formatDate(review.date)}
                </Typography>
                <Box
                  sx={{
                    width: '1px',
                    height: '12px',
                    backgroundColor: theme.palette.custom.border.divider,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem',
                  }}
                >
                  {review.time}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

