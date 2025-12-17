'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { EditOutlined as EditIcon, AddOutlined as AddIcon, DeleteOutlined as DeleteIcon } from '@mui/icons-material';
import CategoryOptionCard from './CategoryOptionCard';

export interface CategoryOption {
  id: string;
  name: string;
  price: number;
}

export interface CategoryCardProps {
  id: string;
  name: string;
  options: CategoryOption[];
  onEdit?: (id: string) => void;
  onAddOption?: (categoryId: string) => void;
  onDelete?: (id: string) => void;
  onEditOption?: (categoryId: string, optionId: string) => void;
  onDeleteOption?: (categoryId: string, optionId: string) => void;
}

export default function CategoryCard({
  id,
  name,
  options,
  onEdit,
  onAddOption,
  onDelete,
  onEditOption,
  onDeleteOption,
}: CategoryCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        mb: 2,
        p: { xs: '6px', sm: '10px' },
        backgroundColor: '#F5F5F5',
        borderRadius:"17px"
      }}
    >
      {/* Main Category Card */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          minHeight: '60px',
          borderRadius: '8px',
          alignItems: 'center',
          mb: 1,
        }}
      >
        {/* First Section: Category Name and Options Count */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
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
                color: '#0A0A0A',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {name}
            </Typography>
          </Box>

          {/* Options Count - Right */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#0A0A0A',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              {options.length}
            </Typography>
          </Box>
        </Box>

        {/* Second Section: Actions - Right Aligned */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
            px: 2,
          }}
        >
          {/* Edit Button */}
          <IconButton
            onClick={() => onEdit?.(id)}
            sx={{
              width: '24px',
              height: '24px',
              borderRadius: '10px',
              backgroundColor: 'rgba(163, 184, 153, 0.2)',
              color: '#A3B899',
              '&:hover': {
                backgroundColor: 'rgba(163, 184, 153, 0.3)',
              },
            }}
          >
            <EditIcon sx={{ fontSize: '16px' }} />
          </IconButton>

          {/* Add Button */}
          <IconButton
            onClick={() => onAddOption?.(id)}
            sx={{
              width: '24px',
              height: '24px',
              borderRadius: '10px',
              backgroundColor: 'rgba(207, 160, 159, 0.2)',
              color: '#CFA09F',
              '&:hover': {
                backgroundColor: 'rgba(207, 160, 159, 0.3)',
              },
            }}
          >
            <AddIcon sx={{ fontSize: '16px' }} />
          </IconButton>

          {/* Delete Button */}
          <IconButton
            onClick={() => onDelete?.(id)}
            sx={{
              width: '24px',
              height: '24px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              color: '#E11D48',
              '&:hover': {
                backgroundColor: '#F5F5F5',
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Sub-Category Options */}
      {options.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: { xs: '8px', sm: '12px' },
            border:"1px solid #EDEDED",
            borderRadius:"8px"
          }}
        >
          {options.map((option) => (
            <CategoryOptionCard
              key={option.id}
              id={option.id}
              name={option.name}
              price={option.price}
              onEdit={() => onEditOption?.(id, option.id)}
              onDelete={() => onDeleteOption?.(id, option.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
