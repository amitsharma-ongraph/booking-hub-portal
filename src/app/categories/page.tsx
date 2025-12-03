'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import { mockCategories } from '@/data/mockData';

export default function CategoriesPage() {
  return (
    <MainLayout>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Categories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your service categories
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
          >
            Add Category
          </Button>
        </Box>

        {/* Categories Grid */}
        <Grid container spacing={3}>
          {mockCategories.map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  {/* Action Buttons */}
                  <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ bgcolor: 'background.paper', color: 'error.main' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Category Icon */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      mb: 2,
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 32 }} />
                  </Box>

                  {/* Category Name */}
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {category.name}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>

                  {/* Service Count */}
                  <Chip
                    label={`${category.serviceCount} services`}
                    size="small"
                    sx={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {mockCategories.length === 0 && (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No categories yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Get started by creating your first category
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Add Category
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </MainLayout>
  );
}
