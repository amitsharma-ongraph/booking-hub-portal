'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { EditOutlined as EditIcon, DeleteOutlined as DeleteIcon } from '@mui/icons-material';

export interface CategoryOptionCardProps {
  id: string;
  name: string;
  price: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CategoryOptionCard({
  id,
  name,
  price,
  onEdit,
  onDelete,
}: CategoryOptionCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        minHeight: '56px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      {/* Option Name - Left Side */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#0A0A0A',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
      </Box>

      {/* Actions - Right Side */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* Amount Text */}
        <Typography
          sx={{
            color: '#CFA09F',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.2,
            marginRight: '8px',
          }}
        >
          {price} ﷼
        </Typography>

        {/* Edit Button */}
        <IconButton
          onClick={onEdit}
          sx={{
            width: '24px',
            height: '24px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            color: '#A3B899',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#F9FAFB',
            },
          }}
        >
          <EditIcon sx={{ fontSize: '16px' }} />
        </IconButton>

        {/* Delete Button */}
        <IconButton
          onClick={onDelete}
          sx={{
            width: '24px',
            height: '24px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            color: '#E11D48',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
