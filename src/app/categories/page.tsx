'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, useTheme, Card } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import CategoryCard, { CategoryOption } from '@/components/categories/CategoryCard';

// Sample data structure - replace with actual data from API/context
interface Category {
  id: string;
  name: string;
  options: CategoryOption[];
}

export default function CategoriesPage() {
  const theme = useTheme();
  
  // Sample data - replace with actual data fetching
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Hair treatment',
      options: [
        { id: '1-1', name: 'Hair Cutting', price: 24 },
        { id: '1-2', name: 'Hair Coloring', price: 50 },
        { id: '1-3', name: 'Hair Styling', price: 30 },
      ],
    },
    {
      id: '2',
      name: 'Body massage',
      options: [
        { id: '2-1', name: 'Swedish Massage', price: 80 },
        { id: '2-2', name: 'Deep Tissue Massage', price: 100 },
      ],
    },
  ]);

  const handleEditCategory = (id: string) => {
    console.log('Edit category:', id);
    // TODO: Implement edit category
  };

  const handleAddOption = (categoryId: string) => {
    console.log('Add option to category:', categoryId);
    // TODO: Implement add option
  };

  const handleDeleteCategory = (id: string) => {
    console.log('Delete category:', id);
    // TODO: Implement delete category
  };

  const handleEditOption = (categoryId: string, optionId: string) => {
    console.log('Edit option:', categoryId, optionId);
    // TODO: Implement edit option
  };

  const handleDeleteOption = (categoryId: string, optionId: string) => {
    console.log('Delete option:', categoryId, optionId);
    // TODO: Implement delete option
  };

  return (
    <MainLayout>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        {/* Categories Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: { xs: 'auto', sm: '66.77px' },
            minHeight: '66.77px',
            mb: { xs: 3, sm: 4 },
            gap: 2,
          }}
        >
          {/* Categories Heading and Subheading */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Typography
              sx={{
                color: '#0A0A0A',
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Categories
            </Typography>
            <Typography
              sx={{
                color: '#6A7282',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Manage your service categories
            </Typography>
          </Box>

          {/* Add Category Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: '20px' }} />}
            onClick={() => {
              // TODO: Handle add category action
              console.log('Add category clicked');
            }}
            sx={{
              backgroundColor: '#CFA09F',
              color: '#FFFFFF',
              borderRadius: '4px',
              width: { xs: 'auto', sm: '148px' },
              height: '41px',
              minWidth: '148px',
              padding: '0px 16px',
              fontSize: '14px',
              fontWeight: 400,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#B8908F',
                boxShadow: 'none',
              },
              '&:active': {
                backgroundColor: '#A6807F',
              },
            }}
          >
            Add Category
          </Button>
        </Box>

        {/* Categories Card - Outer Card with rounded corners */}
        <Box
          sx={{
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            p:'24px'
          }}
        >
          {/* Inner White Card */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              boxShadow: 'none',
              borderRadius: 0,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                height: '44.51px',
                borderBottom: '0.890263px solid rgba(0, 0, 0, 0.1)',
                padding: 0,
                boxSizing: 'border-box',
                mb:"10px"
              }}
            >
              {/* First Section: Category Name and Options */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '44.51px',
                  paddingLeft: '8.9px',
                  paddingRight: '8.9px',
                }}
              >
                {/* Category Name - Left */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '15.5796px',
                      lineHeight: '22px',
                      color: '#808080',
                    }}
                  >
                    Category Name
                  </Typography>
                </Box>

                {/* Options - Right */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '15.5796px',
                      lineHeight: '22px',
                      color: '#808080',
                    }}
                  >
                    Options
                  </Typography>
                </Box>
              </Box>

              {/* Second Section: Actions - Centered */}
              <Box
                sx={{
                  flex: 1,
                  height: '44.51px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '8.9px',
                  paddingRight: '8.9px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '15.5796px',
                    lineHeight: '22px',
                    color: '#808080',
                  }}
                >
                  Actions
                </Typography>
              </Box>
            </Box>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    options={category.options}
                    onEdit={handleEditCategory}
                    onAddOption={handleAddOption}
                    onDelete={handleDeleteCategory}
                    onEditOption={handleEditOption}
                    onDeleteOption={handleDeleteOption}
                  />
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 8,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#808080',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    No categories available. Click "Add Category" to create one.
                  </Typography>
                </Box>
              )}
          </Card>
        </Box>
      </Box>
    </MainLayout>
  );
}
