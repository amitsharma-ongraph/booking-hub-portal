'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

export interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void> | void;
  isLoading?: boolean;
}

export default function AddCategoryModal({
  open,
  onClose,
  onSave,
  isLoading = false,
}: AddCategoryModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
    }
  }, [open]);

  const handleSave = async () => {
    if (name.trim() && !isLoading) {
      try {
        await onSave(name.trim());
        // onSave handles closing the modal on success
      } catch (error) {
        // Error handling - modal stays open so user can retry
        console.error('Error saving category:', error);
      }
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          height: '206px',
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
              Add Category
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
            gap: '10px',
          }}
        >
          {/* Input Field Container */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Label */}
            <Typography
              sx={{
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '150%',
                color: '#313339',
                height: '18px',
              }}
            >
              Name
            </Typography>

            {/* Input Field */}
            <TextField
              fullWidth
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EDEDED',
                  height: '45px',
                  padding: '12px 16px',
                  boxSizing: 'border-box',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '1px solid #EDEDED',
                  },
                },
                '& .MuiInputBase-input': {
                  height: '21px',
                  padding: '0px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '150%',
                  color: '#313339',
                  '&::placeholder': {
                    color: '#B0B0B0',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
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
              onClick={handleClose}
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

            {/* Save Button */}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!name.trim() || isLoading}
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
                '&:disabled': {
                  backgroundColor: '#CFA09F',
                  opacity: 0.4,
                  color: '#FFFFFF',
                },
              }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
