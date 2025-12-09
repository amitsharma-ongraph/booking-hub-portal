'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Image from 'next/image';

export interface BookedSeat {
  seatNumber: string;
  customerName: string;
  email: string;
  phone: string;
}

interface BookedSeatCardProps {
  seat: BookedSeat;
}

export default function BookedSeatCard({ seat }: BookedSeatCardProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here if needed
  };

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '12px 8px',
        gap: '8px',
        width: '100%',
        minHeight: '121px',
        border: '1px solid #EDEDED',
        borderRadius: '14px',
        flex: 'none',
        alignSelf: 'stretch',
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0px 8px',
          width: '100%',
          height: '21px',
        }}
      >
        {/* Seat Number */}
        <Typography
          sx={{
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '150%',
            color: '#333333',
            flex: '1 1 0',
          }}
        >
          {seat.seatNumber}
        </Typography>

        {/* Customer Name */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '8px',
            flex: '1 1 0',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '150%',
              color: '#CFA09F',
            }}
          >
            {seat.customerName}
          </Typography>
        </Box>
      </Box>

      {/* Details Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '8px 12px',
          gap: '4px',
          width: '100%',
          minHeight: '68px',
          background: '#FBFBFF',
          borderRadius: '10px',
        }}
      >
        {/* Email Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            width: '100%',
            height: '24px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '14px',
              flex: '1 1 0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
                width: '80px',
                height: '18px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#1E1E1E',
                }}
              >
                Email
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#AAAAAA',
                display: 'flex',
                alignItems: 'flex-end',
                flex: '1 1 0',
              }}
            >
              {seat.email}
            </Typography>
          </Box>
          <IconButton
            onClick={() => handleCopy(seat.email)}
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '6px',
              width: '24px',
              height: '24px',
              background: '#FFFFFF',
              border: '0.75px solid #EDEDED',
              borderRadius: '6px',
              flex: 'none',
            }}
          >
            <Image
              src="/images/icons/copy.svg"
              alt="Copy"
              width={15}
              height={15}
              style={{ width: '15px', height: '15px' }}
            />
          </IconButton>
        </Box>

        {/* Phone Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            width: '100%',
            height: '24px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '14px',
              flex: '1 1 0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
                width: '80px',
                height: '18px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#1E1E1E',
                }}
              >
                Phone
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#AAAAAA',
                display: 'flex',
                alignItems: 'flex-end',
                flex: '1 1 0',
              }}
            >
              {seat.phone}
            </Typography>
          </Box>
          <IconButton
            onClick={() => handleCopy(seat.phone)}
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '6px',
              width: '24px',
              height: '24px',
              background: '#FFFFFF',
              border: '0.75px solid #EDEDED',
              borderRadius: '6px',
              flex: 'none',
            }}
          >
            <Image
              src="/images/icons/copy.svg"
              alt="Copy"
              width={15}
              height={15}
              style={{ width: '15px', height: '15px' }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

