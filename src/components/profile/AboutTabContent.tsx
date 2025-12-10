'use client';

import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function AboutTabContent() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              About my tenant
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur. Penatibus commodo semper magna tincidunt velit ac. Massa vitae duis pharetra quam id mi facilisi at tristique. Elit non viverra pulvinar diam. Mauris odio etiam integer sapien laoreet turpis adipiscing integer vitae. Lorem ipsum dolor sit amet consectetur. Penatibus commodo semper magna tincidunt velit ac. Massa vitae duis pharetra quam id mi facilisi at tristique. Elit non viverra pulvinar diam. Mauris odio etiam integer sapien laoreet turpis adipiscing integer vitae.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

