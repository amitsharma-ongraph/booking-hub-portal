'use client';

import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

export interface DeleteCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryName: string;
  onDelete: () => void;
}

export default function DeleteCategoryModal({
  open,
  onClose,
  categoryName,
  onDelete,
}: DeleteCategoryModalProps) {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '343px',
          height: '186px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0px 24px 48px rgba(78, 78, 78, 0.12)',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            width: '100%',
            height: '62px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 0px',
            gap: '16px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '30px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px 16px',
            }}
          >
            <Typography
              sx={{
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '150%',
                color: '#333333',
                flex: 1,
              }}
            >
              Delete Category
            </Typography>
          </Box>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            width: '100%',
            flex: 1,
            padding: '0px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '150%',
              color: '#333333',
            }}
          >
            are you sure want to delete {categoryName} category ?
          </Typography>
        </Box>

        {/* Footer Section with Buttons */}
        <Box
          sx={{
            width: '100%',
            height: '73px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            gap: '16px',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Button Group */}
          <Box
            sx={{
              width: '100%',
              height: '41px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Cancel Button */}
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                flex: 1,
                height: '41px',
                borderRadius: '4px',
                border: '1px solid #CFA09F',
                backgroundColor: '#FFFFFF',
                color: '#CFA09F',
                padding: '14px 20px',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '150%',
                textTransform: 'none',
                boxSizing: 'border-box',
                '&:hover': {
                  border: '1px solid #CFA09F',
                  backgroundColor: '#FFFFFF',
                },
              }}
            >
              Cancel
            </Button>

            {/* Delete Button */}
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{
                flex: 1,
                height: '41px',
                borderRadius: '4px',
                backgroundColor: '#CFA09F',
                color: '#FFFFFF',
                padding: '14px 20px',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '150%',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#B8908F',
                  boxShadow: 'none',
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
