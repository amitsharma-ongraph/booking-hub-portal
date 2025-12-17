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
import { useCompanies } from '@/hooks/companies/useCompanies';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';

export default function BookingsPage() {
  const theme = useTheme();
  const { company, isLoading, refreshCompany } = useCompanyContext();
  const { getBookingsData } = useCompanies();

  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateInputRef = useRef<HTMLDivElement>(null);

  // Always refetch company/bookings data when landing on bookings page
  useEffect(() => {
    console.log('🔄 Bookings page mounted - calling refreshCompany');
    refreshCompany().catch((error) => {
      console.error('❌ Error refreshing company:', error);
    });
  }, [refreshCompany]);

  // Set initial date filter from bookings data when company loads (only if dateFilter is null)
  useEffect(() => {
    if (company && !dateFilter) {
      // Get bookings data without date filter to get the most recent date
      const bookingsData = getBookingsData(company, null);
      
      // Set the date filter from bookings data if date exists
      // Use the date string directly to avoid timezone conversion issues
      if (bookingsData.date) {
        // Parse the date string (YYYY-MM-DD) directly without timezone conversion
        const [year, month, day] = bookingsData.date.split('-').map(Number);
        const dateFromBookings = new Date(year, month - 1, day); // month is 0-indexed
        setDateFilter(dateFromBookings);
        console.log('📅 Set initial date filter from bookings data:', bookingsData.date);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]); // Only depend on company, not dateFilter to avoid loop

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [optionFilter, setOptionFilter] = useState('all');
  const [bookingsData, setBookingsData] = useState<ReturnType<typeof getBookingsData> | null>(null);

  // Transform bookings data when company, date, category, or option filter changes
  useEffect(() => {
    if (company) {
      console.log('🏢 Company data in CompanyContext (bookings page):', company);
      
      // Convert date filter to date string format if provided
      // Use local time formatting to avoid timezone conversion issues
      let filterDateString: string | null = null;
      if (dateFilter) {
        // Format date as YYYY-MM-DD using local time (not UTC)
        const year = dateFilter.getFullYear();
        const month = String(dateFilter.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
        const day = String(dateFilter.getDate()).padStart(2, '0');
        filterDateString = `${year}-${month}-${day}`;
      }
      
      // Transform and log bookings data with all filters
      const data = getBookingsData(
        company,
        filterDateString,
        categoryFilter === 'all' ? null : categoryFilter,
        optionFilter === 'all' ? null : optionFilter
      );
      console.log('📋 Bookings data:', data);
      setBookingsData(data);
    }
  }, [company, dateFilter, categoryFilter, optionFilter, getBookingsData]);

  // Reset option filter when category filter changes
  useEffect(() => {
    if (categoryFilter === 'all') {
      setOptionFilter('all');
    }
  }, [categoryFilter]);

  // Get filtered options based on selected category
  const getFilteredOptions = () => {
    if (!bookingsData || categoryFilter === 'all') {
      return [];
    }
    return bookingsData.availableOptions.filter((option) => option.categoryId === categoryFilter);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [bookingDetailsModalOpen, setBookingDetailsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    sessionId: string;
    startTime: string;
    endTime: string;
    totalSeats: number;
    availableSeats: number;
    bookings: Array<{
      id: string;
      customerName: string;
      email?: string;
      phone?: string;
      numberOfSeats: number;
      price: number;
      status: string;
    }>;
  } | null>(null);

  // Helper function to format time from ISO string
  const formatTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return format(date, 'HH:mm');
    } catch {
      return isoString;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return format(date, 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return `ر.س ${amount.toLocaleString()}`;
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    // Reset option filter when category changes
    setOptionFilter('all');
  };

  const handleOptionChange = (event: SelectChangeEvent) => {
    setOptionFilter(event.target.value);
  };

  const handleViewBooking = (sessionData: {
    sessionId: string;
    startTime: string;
    endTime: string;
    totalSeats: number;
    availableSeats: number;
    bookings: Array<{
      id: string;
      customerName: string;
      email?: string;
      phone?: string;
      numberOfSeats: number;
      price: number;
      status: string;
    }>;
  }) => {
    setSelectedSession(sessionData);
    setBookingDetailsModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setBookingDetailsModalOpen(false);
    setSelectedSession(null);
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
                flexWrap: { xs: 'nowrap', sm: 'nowrap' },
                alignItems: { xs: 'stretch', sm: 'stretch' },
                width: '100%',
              }}
            >
              {/* Date Filter */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  ref={dateInputRef}
                  sx={{
                    width: '100%',
                    flex: { xs: '1 1 100%', sm: '1 1 0' },
                    minWidth: 0,
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
                  width: '100%',
                  flex: { xs: '1 1 100%', sm: '1 1 0' },
                  minWidth: 0,
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
                  {bookingsData?.availableCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Options Filter */}
              <FormControl
                sx={{
                  width: '100%',
                  flex: { xs: '1 1 100%', sm: '1 1 0' },
                  minWidth: 0,
                }}
              >
                <Select
                  value={optionFilter}
                  onChange={handleOptionChange}
                  disabled={categoryFilter === 'all'}
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
                  <MenuItem value="all">All Options</MenuItem>
                  {getFilteredOptions().map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Search Filter */}
              <TextField
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: '100%',
                  flex: { xs: '1 1 100%', sm: '1 1 0' },
                  minWidth: 0,
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
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 8,
                width: '100%',
              }}
            >
              <LoadingSpinner text="Loading" />
            </Box>
          ) : !bookingsData || bookingsData.categories.length === 0 ? null : (
            bookingsData.categories.map((category) => (
            <CollapsibleCard
              key={category.categoryId}
              title={category.name}
              labelValuePairs={[
                `Total ${formatCurrency(category.totalPrice)} 💰`,
                `${category.totalSessions} sessions`,
                `${category.bookedSeats}/${category.totalSeats} seats filled`
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
              {category.options.map((option) => (
                <CollapsibleCard
                  key={option.id}
                  title={option.name}
                  labelValuePairs={[
                    `Total ${formatCurrency(option.totalPrice)} 💰`,
                    `${option.totalSessions} sessions`,
                    `${option.bookedSeats}/${option.totalSeats} seats filled`
                  ]}
                  isPrimary={false}
                >
                  {option.sessions.length > 0 ? (
                    <BookingsTable
                      columns={[
                        { key: 'session', label: 'Session' },
                        { key: 'time', label: 'Time' },
                        { key: 'seats', label: 'Seats' },
                        { key: 'booked', label: 'Booked' },
                        { key: 'action', label: 'Action' },
                      ]}
                      rows={option.sessions.map((session, index) => {
                        const bookedSeats = session.totalNumberOfSeats - session.availableNumberOfSeats;
                        const timeRange = `${formatTime(session.startTime)}–${formatTime(session.endTime)}`;
                        
                        return {
                          session: String(index + 1),
                          time: timeRange,
                          seats: String(session.totalNumberOfSeats),
                          booked: `${bookedSeats}/${session.totalNumberOfSeats}`,
                          action: (
                            <Box
                              onClick={() => handleViewBooking({
                                sessionId: session.id,
                                startTime: session.startTime,
                                endTime: session.endTime,
                                totalSeats: session.totalNumberOfSeats,
                                availableSeats: session.availableNumberOfSeats,
                                bookings: session.bookings.map((booking) => ({
                                  id: booking.id,
                                  customerName: booking.customerName || 'N/A',
                                  email: 'N/A', // Email not available in booking data from API
                                  phone: 'N/A', // Phone not available in booking data from API
                                  numberOfSeats: booking.numberOfSeats || 1,
                                  price: booking.price || 0,
                                  status: booking.status || 'unknown',
                                })),
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
                        };
                      })}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: 'Roboto',
                        fontSize: '14px',
                        color: '#808080',
                        lineHeight: 1.6,
                      }}
                    >
                      No sessions available for this option on the selected date.
                    </Typography>
                  )}
                </CollapsibleCard>
              ))}
            </Box>
          </CollapsibleCard>
            ))
          )}
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
                    {bookingsData?.availableCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Options Filter */}
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    value={optionFilter}
                    onChange={handleOptionChange}
                    disabled={categoryFilter === 'all'}
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
                    <MenuItem value="all">All Options</MenuItem>
                    {getFilteredOptions().map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
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
              {selectedSession && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  {/* Session Info */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: theme.palette.custom.heading.dashboard,
                        mb: 1,
                      }}
                    >
                      Session Details
                    </Typography>

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
                    {selectedSession.bookings.length > 0 ? (
                      selectedSession.bookings.map((booking, index) => {
                        // Calculate seat number based on previous bookings' numberOfSeats
                        let seatCounter = 0;
                        for (let i = 0; i < index; i++) {
                          seatCounter += selectedSession.bookings[i].numberOfSeats;
                        }
                        
                        // Create seat cards for each seat in this booking
                        const seatCards = [];
                        for (let seatIndex = 0; seatIndex < booking.numberOfSeats; seatIndex++) {
                          seatCards.push(
                            <BookedSeatCard
                              key={`${booking.id}-${seatIndex}`}
                              seat={{
                                seatNumber: `Seat ${seatCounter + seatIndex + 1}`,
                                customerName: booking.customerName || 'N/A',
                                email: booking.email || 'N/A',
                                phone: booking.phone || 'N/A',
                              }}
                            />
                          );
                        }
                        return seatCards;
                      }).flat()
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: 'Roboto',
                          fontSize: '14px',
                          color: '#808080',
                          textAlign: 'center',
                          py: 4,
                        }}
                      >
                        No bookings for this session
                      </Typography>
                    )}
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
