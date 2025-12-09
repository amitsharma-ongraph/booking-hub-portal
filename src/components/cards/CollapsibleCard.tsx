'use client';

import React, { useState } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

interface CollapsibleCardProps {
  title: string;
  labelValuePairs: string[];
  isPrimary?: boolean;
  children?: React.ReactNode;
}

export default function CollapsibleCard({
  title,
  labelValuePairs,
  isPrimary = true,
  children,
}: CollapsibleCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const headingColor = isPrimary ? '#AA7474' : '#000000'; // Primary color from design or black for secondary
  
  // For secondary cards: white with border when collapsed, gray with no border when expanded
  // For primary cards: always white with no border
  const getBackgroundColor = () => {
    if (isPrimary) {
      return '#FFFFFF';
    }
    // Secondary: white when collapsed, gray when expanded
    return expanded ? '#F3F3F5' : '#FFFFFF';
  };

  const getBorder = () => {
    // Secondary cards: 1px black border when collapsed, no border when expanded
    if (!isPrimary && !expanded) {
      return '1px solid #00000022';
    }
    return 'none';
  };

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '16px',
        gap: '10px',
        width: '100%',
        maxWidth: '100%',
        minHeight: '82px',
        background: getBackgroundColor(),
        border: getBorder(),
        borderRadius: '15.5796px',
        alignSelf: 'stretch',
        transition: 'background-color 0.3s ease, border 0.3s ease',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
          gap: { xs: 2, sm: 4 },
          width: '100%',
          minHeight: '50px',
          flex: 'none',
        }}
      >
        {/* Left Side: Title and Label-Value Pairs */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 0,
            gap: '4px',
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '22px',
              color: headingColor,
              flex: 'none',
              width: '100%',
            }}
          >
            {title}
          </Typography>

          {/* Label-Value Pairs Row */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 0,
              gap: '12px',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {labelValuePairs.map((pair, index) => (
              <React.Fragment key={index}>
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '22px',
                    color: '#808080',
                    flex: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pair}
                </Typography>
                {index < labelValuePairs.length - 1 && (
                  <Box
                    component="span"
                    sx={{
                      width: '1px',
                      height: '23px',
                      backgroundColor: '#808080',
                      flex: 'none',
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {/* Right Side: Chevron Icon */}
        <IconButton
          onClick={handleToggle}
          sx={{
            width: '24px',
            height: '24px',
            padding: 0,
            flex: 'none',
            transition: 'transform 0.3s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <KeyboardArrowDown
            sx={{
              width: '24px',
              height: '24px',
              color: '#000000',
            }}
          />
        </IconButton>
      </Box>

      {/* Expandable Content */}
      {children && (
        <Collapse 
          in={expanded} 
          timeout="auto" 
          unmountOnExit
          sx={{
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              paddingTop: '10px',
              background: isPrimary ? '#FFFFFF' : '#F3F3F5',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

