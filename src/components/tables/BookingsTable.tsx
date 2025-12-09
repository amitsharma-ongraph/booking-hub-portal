'use client';

import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  [key: string]: string | number | React.ReactNode;
}

interface BookingsTableProps {
  columns: TableColumn[];
  rows: TableRow[];
  sx?: SxProps<Theme>;
}

export default function BookingsTable({
  columns,
  rows,
  sx,
}: BookingsTableProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 0,
        gap: '10px',
        width: '100%',
        ...sx,
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 0,
          width: '100%',
          height: '54.31px',
          borderBottom: '0.890263px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 0,
        }}
      >
        {columns.map((column) => (
          <Box
            key={column.key}
            sx={{
              width: '100%',
              height: '54.31px',
              borderRadius: 0,
              flex: '1 1 0',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '7.98px',
              paddingRight: '7.98px',
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
              {column.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Data Rows */}
      {rows.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 0,
            width: '100%',
            height: '34px',
          }}
        >
          {columns.map((column) => (
            <Box
              key={column.key}
              sx={{
                width: '100%',
                height: '34px',
                borderRadius: 0,
                flex: '1 1 0',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '7.98px',
                paddingRight: '7.98px',
              }}
            >
              {typeof row[column.key] === 'string' ||
              typeof row[column.key] === 'number' ? (
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '15.5796px',
                    lineHeight: '22px',
                    color: '#0A0A0A',
                  }}
                >
                  {row[column.key]}
                </Typography>
              ) : (
                row[column.key]
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

