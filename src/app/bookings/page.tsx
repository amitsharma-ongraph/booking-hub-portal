'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import CollapsibleCard from '@/components/cards/CollapsibleCard';
import BookingsTable, { TableColumn, TableRow } from '@/components/tables/BookingsTable';
import BookedSeatCard, { BookedSeat } from '@/components/cards/BookedSeatCard';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useCompanyContext } from '@/contexts/CompanyContext';

export default function BookingsPage() {
  const theme = useTheme();
  const { company, isLoading } = useCompanyContext();

  // Log company data from context when it changes
  useEffect(() => {
    if (company) {
      console.log('🏢 Company data in CompanyContext (bookings page):', company);
    }
  }, [company]);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateInputRef = useRef<HTMLDivElement>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [bookingDetailsModalOpen, setBookingDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    session: string;
    time: string;
    seats: string;
    booked: string;
  } | null>(null);
  
  // Mock data for booked seats - in real app, this would come from API
  const mockBookedSeats: BookedSeat[] = [
    {
      seatNumber: 'Seat 1',
      customerName: 'Katherine Aurelia',
      email: 'arwakhalifa@gmail.com',
      phone: '+966 566778159',
    },
    {
      seatNumber: 'Seat 2',
      customerName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+966 555123456',
    },
    {
      seatNumber: 'Seat 3',
      customerName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+966 555654321',
    },
  ];

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleServiceChange = (event: SelectChangeEvent) => {
    setServiceFilter(event.target.value);
  };

  const handleViewBooking = (booking: { session: string; time: string; seats: string; booked: string }) => {
    setSelectedBooking(booking);
    setBookingDetailsModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setBookingDetailsModalOpen(false);
    setSelectedBooking(null);
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

        {/* Collapsible Cards Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            mb: { xs: 3, sm: 4 },
          }}
        >
          <CollapsibleCard
            title="Spa"
            labelValuePairs={[
              "Total ر.س 512 💰",
              "12 sessions",
              "20/36 seats filled"
            ]}
            isPrimary={true}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <CollapsibleCard
                title="Topic 1"
                labelValuePairs={[
                  "Total ر.س 256 💰",
                  "6 sessions",
                  "10/18 seats filled"
                ]}
                isPrimary={false}
              >
                <BookingsTable
                  columns={[
                    { key: 'session', label: 'Session' },
                    { key: 'time', label: 'Time' },
                    { key: 'seats', label: 'Seats' },
                    { key: 'booked', label: 'Booked' },
                    { key: 'action', label: 'Action' },
                  ]}
                  rows={[
                    {
                      session: '1',
                      time: '08:00–10:00',
                      seats: '6',
                      booked: '3/6',
                      action: (
                        <Box
                          onClick={() => handleViewBooking({
                            session: '1',
                            time: '08:00–10:00',
                            seats: '6',
                            booked: '3/6',
                          })}
                          sx={{
                            width: '25px',
                            height: '25px',
                            background: '#FFFFFF',
                            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.08)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <VisibilityIcon
                            sx={{
                              width: '17.81px',
                              height: '17.81px',
                              color: theme.palette.secondary.main,
                            }}
                          />
                        </Box>
                      ),
                    },
                    {
                      session: '2',
                      time: '08:00–10:00',
                      seats: '6',
                      booked: '3/6',
                      action: (
                        <Box
                          onClick={() => handleViewBooking({
                            session: '2',
                            time: '08:00–10:00',
                            seats: '6',
                            booked: '3/6',
                          })}
                          sx={{
                            width: '25px',
                            height: '25px',
                            background: '#FFFFFF',
                            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.08)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <VisibilityIcon
                            sx={{
                              width: '17.81px',
                              height: '17.81px',
                              color: theme.palette.secondary.main,
                            }}
                          />
                        </Box>
                      ),
                    },
                    {
                      session: '3',
                      time: '08:00–10:00',
                      seats: '6',
                      booked: '3/6',
                      action: (
                        <Box
                          onClick={() => handleViewBooking({
                            session: '3',
                            time: '08:00–10:00',
                            seats: '6',
                            booked: '3/6',
                          })}
                          sx={{
                            width: '25px',
                            height: '25px',
                            background: '#FFFFFF',
                            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.08)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <VisibilityIcon
                            sx={{
                              width: '17.81px',
                              height: '17.81px',
                              color: theme.palette.secondary.main,
                            }}
                          />
                        </Box>
                      ),
                    },
                  ]}
                />
              </CollapsibleCard>

              <CollapsibleCard
                title="Topic 2"
                labelValuePairs={[
                  "Total ر.س 256 💰",
                  "6 sessions",
                  "10/18 seats filled"
                ]}
                isPrimary={false}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    color: '#808080',
                    lineHeight: 1.6,
                  }}
                >
                  Details for Topic 2 under Spa.
                </Typography>
              </CollapsibleCard>
            </Box>
          </CollapsibleCard>

          <CollapsibleCard
            title="Haircut"
            labelValuePairs={[
              "Total ر.س 250 💰",
              "8 sessions",
              "15/20 seats filled"
            ]}
            isPrimary={true}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <CollapsibleCard
                title="Topic 1"
                labelValuePairs={[
                  "Total ر.س 125 💰",
                  "4 sessions",
                  "8/10 seats filled"
                ]}
                isPrimary={false}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    color: '#808080',
                    lineHeight: 1.6,
                  }}
                >
                  Details for Topic 1 under Haircut.
                </Typography>
              </CollapsibleCard>

              <CollapsibleCard
                title="Topic 2"
                labelValuePairs={[
                  "Total ر.س 125 💰",
                  "4 sessions",
                  "7/10 seats filled"
                ]}
                isPrimary={false}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    color: '#808080',
                    lineHeight: 1.6,
                  }}
                >
                  Details for Topic 2 under Haircut.
                </Typography>
              </CollapsibleCard>
            </Box>
          </CollapsibleCard>

          <CollapsibleCard
            title="Massage"
            labelValuePairs={[
              "Total ر.س 380 💰",
              "6 sessions",
              "10/15 seats filled"
            ]}
            isPrimary={true}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <CollapsibleCard
                title="Topic 1"
                labelValuePairs={[
                  "Total ر.س 190 💰",
                  "3 sessions",
                  "5/8 seats filled"
                ]}
                isPrimary={false}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    color: '#808080',
                    lineHeight: 1.6,
                  }}
                >
                  Details for Topic 1 under Massage.
                </Typography>
              </CollapsibleCard>

              <CollapsibleCard
                title="Topic 2"
                labelValuePairs={[
                  "Total ر.س 190 💰",
                  "3 sessions",
                  "5/7 seats filled"
                ]}
                isPrimary={false}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    color: '#808080',
                    lineHeight: 1.6,
                  }}
                >
                  Details for Topic 2 under Massage.
                </Typography>
              </CollapsibleCard>
            </Box>
          </CollapsibleCard>
        </Box>

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

        {/* Booking Details Modal */}
        <Modal
          open={bookingDetailsModalOpen}
          onClose={handleCloseBookingModal}
          closeAfterTransition
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
          }}
        >
          <Fade in={bookingDetailsModalOpen}>
            <Box
              sx={{
                position: 'relative',
                width: { xs: '90%', sm: '500px', md: '600px' },
                maxWidth: { xs: '90vw', sm: '500px', md: '600px' },
                height: 'calc(100vh - 32px)',
                maxHeight: 'calc(100vh - 32px)',
                marginTop: '16px',
                marginRight: '16px',
                marginBottom: '16px',
                marginLeft: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                p: { xs: 3, sm: 4 },
                overflow: 'hidden',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Modal Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 700,
                    color: theme.palette.custom.heading.dashboard,
                  }}
                >
                  Booking Details
                </Typography>
                <IconButton
                  onClick={handleCloseBookingModal}
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

              {/* Modal Content */}
              {selectedBooking && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  {/* Scrollable List of Booked Seats */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      flex: 1,
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      pr: 1,
                      // Custom scrollbar styling
                      '&::-webkit-scrollbar': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#F3F3F5',
                        borderRadius: '3px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#D0D0D0',
                        borderRadius: '3px',
                        '&:hover': {
                          background: '#B0B0B0',
                        },
                      },
                    }}
                  >
                    {mockBookedSeats.map((seat, index) => (
                      <BookedSeatCard key={index} seat={seat} />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </MainLayout>
  );
}
