'use client';

import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
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
              About {company.name}
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

      {/* Additional Information */}
      <Grid size={{ xs: 12, md: 6 }}>
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
              fontWeight={600}
              gutterBottom
              sx={{
                fontFamily: 'Roboto',
                fontSize: '16px',
                color: '#041C2C',
                mb: 2,
              }}
            >
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '12px',
                    color: '#B0B0B0',
                    mb: 0.5,
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    color: '#333333',
                  }}
                >
                  {company.emailAddress || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '12px',
                    color: '#B0B0B0',
                    mb: 0.5,
                  }}
                >
                  Phone Number
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    color: '#333333',
                  }}
                >
                  {company.phoneNumber || 'N/A'}
                </Typography>
              </Box>
              {company.whatsappNumber && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontSize: '12px',
                      color: '#B0B0B0',
                      mb: 0.5,
                    }}
                  >
                    WhatsApp
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontSize: '14px',
                      color: '#333333',
                    }}
                  >
                    {company.whatsappNumber}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
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
              fontWeight={600}
              gutterBottom
              sx={{
                fontFamily: 'Roboto',
                fontSize: '16px',
                color: '#041C2C',
                mb: 2,
              }}
            >
              Social Media & Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {company.location && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontSize: '12px',
                      color: '#B0B0B0',
                      mb: 0.5,
                    }}
                  >
                    Location
                  </Typography>
                  <Typography
                    component="a"
                    href={company.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontFamily: 'Roboto',
                      fontSize: '14px',
                      color: '#D2A298',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    View on Google Maps
                  </Typography>
                </Box>
              )}
              {company.tiktokUrl && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontSize: '12px',
                      color: '#B0B0B0',
                      mb: 0.5,
                    }}
                  >
                    TikTok
                  </Typography>
                  <Typography
                    component="a"
                    href={company.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontFamily: 'Roboto',
                      fontSize: '14px',
                      color: '#D2A298',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {company.tiktokUrl}
                  </Typography>
                </Box>
              )}
              {company.instagramUrl && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontSize: '12px',
                      color: '#B0B0B0',
                      mb: 0.5,
                    }}
                  >
                    Instagram
                  </Typography>
                  <Typography
                    component="a"
                    href={company.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontFamily: 'Roboto',
                      fontSize: '14px',
                      color: '#D2A298',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {company.instagramUrl}
                  </Typography>
                </Box>
              )}
              {!company.location && !company.tiktokUrl && !company.instagramUrl && (
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    color: '#B0B0B0',
                    fontStyle: 'italic',
                  }}
                >
                  No social media links available.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

