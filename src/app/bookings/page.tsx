'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  TextField,
  Modal,
  IconButton,
  Fade,
} from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, CalendarToday as CalendarIcon, FilterList as FilterListIcon, Close as CloseIcon } from '@mui/icons-material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';

export default function BookingsPage() {
  const theme = useTheme();
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateInputRef = useRef<HTMLDivElement>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleServiceChange = (event: SelectChangeEvent) => {
    setServiceFilter(event.target.value);
  };

  const dateInputRefForModal = useRef<HTMLDivElement>(null);
  const [datePickerOpenModal, setDatePickerOpenModal] = useState(false);

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
        {/* Page Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: { xs: 3, sm: 4 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 2, md: 0 },
            width: '100%',
          }}
        >
          {/* Title on the left */}
          <Box
            sx={{
              width: { xs: '100%', sm: 'auto' },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.custom.heading.dashboard,
                fontWeight: 700,
                mb: 0.5,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              Bookings
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#6A7282',
                fontSize: '0.875rem',
                fontWeight: 400,
              }}
            >
              Manage all your customer bookings
            </Typography>
          </Box>

          {/* Total Revenue Card and Filter Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 0 },
              width: { xs: '100%', sm: 'auto' },
              flexDirection: { xs: 'row', sm: 'row' },
            }}
          >
            <Card
              sx={{
                width: { xs: 'calc(100% - 48px)', sm: '199px' },
                minWidth: { xs: 'auto', sm: '199px' },
                height: '39px',
                borderRadius: '7.5px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EDEDED',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <CardContent
                sx={{
                  p: '8px 12px !important',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  '&:last-child': {
                    pb: '8px',
                  },
                }}
              >
                <Typography
                  sx={{
                    color: '#6A7282',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  Total Revenue
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    lineHeight: 1,
                    color: '#CFA09F'
                  }}
                >
                  512 ﷼
                </Typography>
              </CardContent>
            </Card>
            
            {/* Filter Icon Button - Mobile Only */}
            <IconButton
              onClick={() => setFiltersModalOpen(true)}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                width: '40px',
                height: '40px',
                borderRadius: '7.5px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EDEDED',
                color: '#6A7282',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              <FilterListIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Filters Section - Hidden on Mobile */}
        <Card
          sx={{
            borderRadius: '15.5796px',
            backgroundColor: '#FFFFFF',
            boxShadow: 'none',
            mb: { xs: 3, sm: 4 },
            minHeight: { xs: 'auto', sm: '68px' },
            height: { xs: 'auto', sm: '68px' },
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <CardContent
            sx={{
              p: { xs: '12px', sm: '14px' },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '12px', sm: '8px' },
              height: '100%',
              width: '100%',
              '&:last-child': {
                pb: { xs: '12px', sm: '14px' },
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: { xs: '12px', sm: '12px', md: '12px' },
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: { xs: 'nowrap', sm: 'wrap', md: 'nowrap' },
                alignItems: { xs: 'stretch', sm: 'flex-start' },
                width: '100%',
              }}
            >
              {/* Date Filter */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  ref={dateInputRef}
                  sx={{
                    width: { xs: '100%', sm: 'calc(50% - 6px)', md: '255.31px' },
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 6px)', md: '1 1 auto' },
                    minWidth: { xs: '100%', sm: 'calc(50% - 6px)', md: '255.31px' },
                    position: 'relative',
                  }}
                >
                  <Box
                    onClick={() => setDatePickerOpen(true)}
                    sx={{
                      height: '40px',
                      borderRadius: '8.90263px',
                      backgroundColor: '#F3F3F5',
                      border: 'none',
                      padding: '0px 13.354px 0px 13.3539px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#0A0A0A',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '16px',
                        flex: 1,
                      }}
                    >
                      {dateFilter ? format(dateFilter, 'MMM dd, yyyy') : 'Date'}
                    </Typography>
                    <CalendarIcon
                      sx={{
                        color: '#717182',
                        width: '16px',
                        height: '16px',
                        fontSize: '16px',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '40px',
                      pointerEvents: 'none',
                      zIndex: 0,
                    }}
                  >
                    <DesktopDatePicker
                      enableAccessibleFieldDOMStructure={false}
                      open={datePickerOpen}
                      onClose={() => setDatePickerOpen(false)}
                      value={dateFilter}
                      onChange={(newValue) => {
                        setDateFilter(newValue);
                        setDatePickerOpen(false);
                      }}
                      slotProps={{
                        textField: {
                          sx: { 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '40px',
                            opacity: 0,
                            pointerEvents: 'none',
                            '& .MuiInputBase-root': {
                              height: '40px',
                            },
                            '& .MuiInputBase-input': {
                              height: '40px',
                              padding: '0px 13.354px 0px 13.3539px',
                            },
                          },
                        },
                        popper: {
                          anchorEl: dateInputRef.current,
                          placement: 'bottom-start',
                          sx: {
                            zIndex: 1300,
                            '& .MuiPaper-root': {
                              borderRadius: '8px',
                              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            },
                          },
                        },
                        actionBar: {
                          actions: ['clear', 'accept'],
                        },
                      }}
                    />
                  </Box>
                </Box>
              </LocalizationProvider>

              {/* All Categories Filter */}
              <FormControl
                sx={{
                  width: { xs: '100%', sm: 'calc(50% - 6px)', md: '255.31px' },
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 6px)', md: '1 1 auto' },
                  minWidth: { xs: '100%', sm: 'calc(50% - 6px)', md: '255.31px' },
                }}
              >
                <Select
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    height: '40px',
                    borderRadius: '8.90263px',
                    backgroundColor: '#F3F3F5',
                    border: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      color: '#0A0A0A',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '16px',
                      padding: '12px',
                      paddingRight: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      boxSizing: 'border-box',
                    },
                    '& .MuiSelect-icon': {
                      color: '#717182',
                      right: '12px',
                      width: '16px',
                      height: '16px',
                      '& svg': {
                        fontSize: '16px',
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="haircut">Haircut</MenuItem>
                  <MenuItem value="spa">Spa</MenuItem>
                  <MenuItem value="massage">Massage</MenuItem>
                  <MenuItem value="facial">Facial</MenuItem>
                </Select>
              </FormControl>

              {/* All services Filter */}
              <FormControl
                sx={{
                  width: { xs: '100%', sm: 'calc(50% - 6px)', md: '255.31px' },
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 6px)', md: '1 1 auto' },
                  minWidth: { xs: '100%', sm: 'calc(50% - 6px)', md: '255.31px' },
                }}
              >
                <Select
                  value={serviceFilter}
                  onChange={handleServiceChange}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    height: '40px',
                    borderRadius: '8.90263px',
                    backgroundColor: '#F3F3F5',
                    border: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      color: '#0A0A0A',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '16px',
                      padding: '12px',
                      paddingRight: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      boxSizing: 'border-box',
                    },
                    '& .MuiSelect-icon': {
                      color: '#717182',
                      right: '12px',
                      width: '16px',
                      height: '16px',
                      '& svg': {
                        fontSize: '16px',
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All services</MenuItem>
                  <MenuItem value="haircut">Haircut</MenuItem>
                  <MenuItem value="spa">Spa</MenuItem>
                  <MenuItem value="massage">Massage</MenuItem>
                  <MenuItem value="facial">Facial</MenuItem>
                </Select>
              </FormControl>

              {/* Search Filter */}
              <TextField
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: { xs: '100%', sm: 'calc(50% - 6px)', md: '255.31px' },
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 6px)', md: '1 1 auto' },
                  minWidth: { xs: '100%', sm: 'calc(50% - 6px)', md: '255.31px' },
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    borderRadius: '8.90263px',
                    backgroundColor: '#FAFAFA',
                    padding: '12px',
                    '& fieldset': {
                      border: '0.890263px solid #E5E7EB',
                    },
                    '&:hover fieldset': {
                      border: '0.890263px solid #E5E7EB',
                    },
                    '&.Mui-focused fieldset': {
                      border: '0.890263px solid #E5E7EB',
                    },
                    '& .MuiInputBase-input': {
                      color: '#717182',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '16px',
                      padding: 0,
                      '&::placeholder': {
                        color: '#717182',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
              </Box>
          </CardContent>
        </Card>

        {/* Filters Modal - Mobile Only */}
        <Modal
          open={filtersModalOpen}
          onClose={() => setFiltersModalOpen(false)}
          closeAfterTransition
          sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <Fade in={filtersModalOpen}>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                maxHeight: '90vh',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.15)',
                p: 3,
                overflow: 'auto',
              }}
            >
              {/* Modal Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: theme.palette.custom.heading.dashboard,
                  }}
                >
                  Filters
                </Typography>
                <IconButton
                  onClick={() => setFiltersModalOpen(false)}
                  sx={{
                    color: '#6A7282',
                    '&:hover': {
                      backgroundColor: '#F3F3F5',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Filters Content */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  width: '100%',
                }}
              >
                {/* Date Filter */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box
                    ref={dateInputRefForModal}
                    sx={{
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    <Box
                      onClick={() => setDatePickerOpenModal(true)}
                      sx={{
                        height: '40px',
                        borderRadius: '8.90263px',
                        backgroundColor: '#F3F3F5',
                        border: 'none',
                        padding: '0px 13.354px 0px 13.3539px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#0A0A0A',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '16px',
                          flex: 1,
                        }}
                      >
                        {dateFilter ? format(dateFilter, 'MMM dd, yyyy') : 'Date'}
                      </Typography>
                      <CalendarIcon
                        sx={{
                          color: '#717182',
                          width: '16px',
                          height: '16px',
                          fontSize: '16px',
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '40px',
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    >
                      <DesktopDatePicker
                        enableAccessibleFieldDOMStructure={false}
                        open={datePickerOpenModal}
                        onClose={() => setDatePickerOpenModal(false)}
                        value={dateFilter}
                        onChange={(newValue) => {
                          setDateFilter(newValue);
                          setDatePickerOpenModal(false);
                        }}
                        slotProps={{
                          textField: {
                            sx: { 
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '40px',
                              opacity: 0,
                              pointerEvents: 'none',
                              '& .MuiInputBase-root': {
                                height: '40px',
                              },
                              '& .MuiInputBase-input': {
                                height: '40px',
                                padding: '0px 13.354px 0px 13.3539px',
                              },
                            },
                          },
                          popper: {
                            anchorEl: dateInputRefForModal.current,
                            placement: 'bottom-start',
                            sx: {
                              zIndex: 1400,
                              '& .MuiPaper-root': {
                                borderRadius: '8px',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                              },
                            },
                          },
                          actionBar: {
                            actions: ['clear', 'accept'],
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </LocalizationProvider>

                {/* All Categories Filter */}
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    value={categoryFilter}
                    onChange={handleCategoryChange}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      height: '40px',
                      borderRadius: '8.90263px',
                      backgroundColor: '#F3F3F5',
                      border: 'none',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiSelect-select': {
                        color: '#0A0A0A',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '16px',
                        padding: '12px',
                        paddingRight: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        boxSizing: 'border-box',
                      },
                      '& .MuiSelect-icon': {
                        color: '#717182',
                        right: '12px',
                        width: '16px',
                        height: '16px',
                        '& svg': {
                          fontSize: '16px',
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="haircut">Haircut</MenuItem>
                    <MenuItem value="spa">Spa</MenuItem>
                    <MenuItem value="massage">Massage</MenuItem>
                    <MenuItem value="facial">Facial</MenuItem>
                  </Select>
                </FormControl>

                {/* All services Filter */}
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    value={serviceFilter}
                    onChange={handleServiceChange}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      height: '40px',
                      borderRadius: '8.90263px',
                      backgroundColor: '#F3F3F5',
                      border: 'none',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiSelect-select': {
                        color: '#0A0A0A',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '16px',
                        padding: '12px',
                        paddingRight: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        boxSizing: 'border-box',
                      },
                      '& .MuiSelect-icon': {
                        color: '#717182',
                        right: '12px',
                        width: '16px',
                        height: '16px',
                        '& svg': {
                          fontSize: '16px',
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">All services</MenuItem>
                    <MenuItem value="haircut">Haircut</MenuItem>
                    <MenuItem value="spa">Spa</MenuItem>
                    <MenuItem value="massage">Massage</MenuItem>
                    <MenuItem value="facial">Facial</MenuItem>
                  </Select>
                </FormControl>

                {/* Search Filter */}
                <TextField
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      borderRadius: '8.90263px',
                      backgroundColor: '#FAFAFA',
                      padding: '12px',
                      '& fieldset': {
                        border: '0.890263px solid #E5E7EB',
                      },
                      '&:hover fieldset': {
                        border: '0.890263px solid #E5E7EB',
                      },
                      '&.Mui-focused fieldset': {
                        border: '0.890263px solid #E5E7EB',
                      },
                      '& .MuiInputBase-input': {
                        color: '#717182',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '16px',
                        padding: 0,
                        '&::placeholder': {
                          color: '#717182',
                          opacity: 1,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </MainLayout>
  );
}
