'use client';

import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import type { CompanyDto } from '@/lib/api/companies/types';

interface AboutTabContentProps {
  company: CompanyDto;
}

export default function AboutTabContent({ company }: AboutTabContentProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: 'none',
            border: '1px solid #EDEDED',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{
                fontFamily: 'Roboto',
                fontSize: '18px',
                color: '#041C2C',
                mb: 2,
              }}
            >
              About My Tenant
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontSize: '14px',
                lineHeight: '150%',
                color: '#333333',
                whiteSpace: 'pre-wrap',
              }}
            >
              {company.description || 'No description available.'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

