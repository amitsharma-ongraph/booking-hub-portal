'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Avatar, IconButton, Typography, useTheme } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import Image from 'next/image';

interface ProfilePictureEditorProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  onChange?: (file: File) => void;
}

export default function ProfilePictureEditor({
  src,
  alt = 'Profile Picture',
  initials = 'JD',
  onChange,
}: ProfilePictureEditorProps) {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setImageError(false);

      // Call onChange callback
      if (onChange) {
        onChange(file);
      }
    }
  };

  // Determine which image to display: preview > src > null
  const displayImage = previewUrl || (src && !imageError ? src : null);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100px',
        height: '129px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        mx: 'auto',
      }}
    >
      {/* Logo Label */}

      {/* Profile Picture Container with Shadow Background */}
      <Box
        sx={{
          position: 'relative',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          overflow: 'visible',
        }}
      >
        {/* Shadow/Background Circle */}
        <Box
          sx={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#FFFFFF',
            opacity: 0.4,
            boxShadow: '0px 2px 5px rgba(128, 131, 140, 0.15)',
            zIndex: 0,
          }}
        />

        {/* Profile Picture Circle */}
        <Box
          sx={{
            position: 'relative',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
          }}
        >
          {/* Profile Picture or Avatar */}
          {displayImage ? (
            // Use regular img tag for blob URLs (preview) and external URLs
            displayImage.startsWith('http://') || 
            displayImage.startsWith('https://') || 
            displayImage.startsWith('blob:') ? (
              <Box
                component="img"
                src={displayImage}
                alt={alt}
                onError={() => setImageError(true)}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              // Use Next.js Image for local paths
              <Image
                src={displayImage}
                alt={alt}
                fill
                sizes="100px"
                style={{ objectFit: 'cover' }}
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <Avatar
              sx={{
                width: '100%',
                height: '100%',
                fontSize: '2.5rem',
                bgcolor: theme.palette.primary.main,
              }}
            >
              {initials}
            </Avatar>
          )}
        </Box>

        {/* Edit Button */}
        <IconButton
          onClick={handleEditClick}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '31px',
            height: '31px',
            background: '#FFFFFF',
            boxShadow: '0px 0px 18.6px rgba(0, 0, 0, 0.08)',
            borderRadius: '19px',
            padding: 0,
            zIndex: 2,
            '&:hover': {
              background: '#F5F5F5',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <EditIcon
            sx={{
              width: '18.6px',
              height: '18.6px',
              color: '#A3B899',
            }}
          />
        </IconButton>
      </Box>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}

