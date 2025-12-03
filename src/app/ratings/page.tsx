'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
  Grid,
  LinearProgress,
  Divider,
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import { mockRatings } from '@/data/mockData';

export default function RatingsPage() {
  const averageRating = mockRatings.reduce((acc, r) => acc + r.rating, 0) / mockRatings.length;
  const totalReviews = mockRatings.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: mockRatings.filter((r) => r.rating === star).length,
    percentage: (mockRatings.filter((r) => r.rating === star).length / totalReviews) * 100,
  }));

  return (
    <MainLayout>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Ratings & Reviews
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Customer feedback and ratings
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Rating Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Overall Rating
                </Typography>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h2" fontWeight={700} color="primary">
                    {averageRating.toFixed(1)}
                  </Typography>
                  <Rating value={averageRating} precision={0.1} readOnly size="large" sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Based on {totalReviews} reviews
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Rating Distribution */}
                <Box>
                  {ratingDistribution.map((item) => (
                    <Box key={item.star} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 60 }}>
                        {item.star} <StarIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} />
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                        {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Reviews List */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockRatings.map((review) => (
                <Card key={review.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                        {review.customerName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {review.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {review.date} • {review.service}
                            </Typography>
                          </Box>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {review.comment}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
