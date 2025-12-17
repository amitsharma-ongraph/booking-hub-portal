'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Paper,
  Button,
  Drawer,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, addMonths, subMonths } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { useSchedulesContext } from '@/contexts/SchedulesContext';
import { useSchedules, type BookingSession, type DateEvent } from '@/hooks/schedules/useSchedules';
import type { Booking } from '@/lib/api/schedules/types';
import { schedulesService } from '@/lib/api/schedules/schedulesService';
import { useAuthContext } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import AddScheduleModal from '@/components/schedules/AddScheduleModal';

export default function CalendarPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Below 900px
  const { schedules, isLoading, addSchedule } = useSchedulesContext();
  const { user } = useAuthContext();
  const { getDateEvents } = useSchedules();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);

  console.log("schedules",schedules)

  // Extract all dates with events from schedules data
  const datesWithEvents = useMemo<Map<string, DateEvent>>(() => {
    return getDateEvents();
  }, [getDateEvents, schedules]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return null;
    return datesWithEvents.get(selectedDate) || null;
  }, [selectedDate, datesWithEvents]);

  // Get booking count for selected date
  const selectedDateBookingCount = useMemo(() => {
    if (!selectedDate) return 0;
    const dateEvent = datesWithEvents.get(selectedDate);
    if (!dateEvent) return 0;
    // Count bookings from sessions that have bookings
    return dateEvent.sessions.reduce((total, session) => {
      return total + session.bookings.length;
    }, 0);
  }, [selectedDate, datesWithEvents]);

  // Flatten all bookings for selected date with their related data
  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    
    const bookings: Array<{
      booking: BookingSession['bookings'][0];
      startTime: string;
      categoryOptionName: string;
    }> = [];

    // Iterate through all schedules
    schedules.forEach((schedule) => {
      const datePart = schedule.startDate.split('T')[0];
      if (datePart === selectedDate) {
        // Iterate through all sessions in this schedule
        schedule.sessions.forEach((session) => {
          // Add each booking with its related data
          session.bookings.forEach((booking) => {
            bookings.push({
              booking,
              startTime: session.startTime,
              categoryOptionName: schedule.categoryOptionName,
            });
          });
        });
      }
    });

    return bookings;
  }, [selectedDate, schedules]);

  // Calendar grid setup - dynamically calculate rows based on the month
  const { calendarDays, numberOfRows } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = getDay(monthStart);
    
    // Create array with empty cells for days before month starts
    const emptyCells = Array(firstDayOfWeek).fill(null);
    
    // Calculate total cells needed (empty + days in month)
    const totalCells = emptyCells.length + daysInMonth.length;
    
    // Calculate number of rows needed (always round up to ensure all days fit)
    const rows = Math.ceil(totalCells / 7);
    
    // Calculate how many cells we need to fill to complete the last row
    const cellsInLastRow = totalCells % 7;
    const cellsNeededToComplete = cellsInLastRow === 0 ? 0 : 7 - cellsInLastRow;
    
    // Add days from next month if needed to complete the last row
    const nextMonthDays: (Date | null)[] = [];
    if (cellsNeededToComplete > 0) {
      for (let i = 1; i <= cellsNeededToComplete; i++) {
        const nextDate = new Date(monthEnd);
        nextDate.setDate(monthEnd.getDate() + i);
        nextMonthDays.push(nextDate);
      }
    }
    
    const allDays = [...emptyCells, ...daysInMonth, ...nextMonthDays];
    
    return {
      calendarDays: allDays,
      numberOfRows: rows,
    };
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    // Always set the selected date - clicking the same date won't deselect it
    setSelectedDate(dateString);
    // On small screens, open the drawer
    if (isSmallScreen) {
      setDrawerOpen(true);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(format(today, 'yyyy-MM-dd'));
  };

  // Format time helper
  const formatTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return format(date, 'HH:mm');
    } catch {
      return isoString;
    }
  };

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    return `ر.س ${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <LoadingSpinner text="Loading" />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          maxHeight: {
            md: 'calc(100vh - 80px - 64px)', // 100vh - TopBar (80px) - padding (32px top + 32px bottom)
            lg: 'calc(100vh - 80px - 64px)',
          },
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default,
          overflow: 'hidden',
          minHeight: 0,
          // On small screens, allow scrolling
          '@media (max-width: 900px)': {
            maxHeight: 'none',
            overflow: 'visible',
            height: 'auto',
            minHeight: 'auto',
          },
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            flexShrink: 0,
            height: '66px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: { xs: 3, sm: 4 },
            // On smaller devices, stack vertically
            '@media (max-width: 900px)': {
              flexDirection: 'column',
              alignItems: 'flex-start',
              height: 'auto',
              gap: 2,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.custom?.heading?.dashboard || '#0A0A0A',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                lineHeight: 1.2,
                marginBottom: 0.5,
              }}
            >
              Calendar
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: theme.palette.text.secondary || '#6A7282',
                lineHeight: 1.2,
              }}
            >
              Manage your availability and working hours
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              // On smaller devices, buttons stay in row but below headings
              '@media (max-width: 900px)': {
                width: '100%',
              },
            }}
          >
            <Button
              variant="outlined"
              onClick={handleTodayClick}
              sx={{
                width: '78px',
                height: '41px',
                borderRadius: '4px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                color: '#AA7474',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 400,
                boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A',
                '&:hover': {
                  backgroundColor: '#F9F9F9',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              Today
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddScheduleModalOpen(true)}
              sx={{
                width: '152px',
                height: '41px',
                borderRadius: '4px',
                backgroundColor: '#CFA09F',
                color: '#FFFFFF',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: '#BE8A7C',
                },
              }}
            >
               Add Schedule
            </Button>
          </Box>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            // On small screens, allow scrolling
            '@media (max-width: 900px)': {
              flex: 'none',
              minHeight: 'auto',
              overflow: 'visible',
            },
          }}
        >
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '15px',
              padding: '24px',
              boxShadow: 'none',
              height: '100%',
              maxHeight: '800px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              // On small screens, allow scrolling
              '@media (max-width: 900px)': {
                height: 'auto',
                maxHeight: 'none',
                overflow: 'visible',
              },
            }}
          >
            <CardContent
              sx={{
                p: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                // On small screens, allow scrolling
                '@media (max-width: 900px)': {
                  height: 'auto',
                  overflow: 'visible',
                },
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  gap: 3,
                  // On small screens, allow scrolling
                  '@media (max-width: 900px)': {
                    height: 'auto',
                    flexDirection: 'column',
                  },
                }}
              >
              {/* Calendar Section */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  flex: 1,
                  minWidth: 0,
                  // On small screens, allow scrolling
                  '@media (max-width: 900px)': {
                    height: 'auto',
                    overflow: 'visible',
                    flex: 'none',
                    minWidth: 'auto',
                    width: '100%',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    // On small screens, allow scrolling
                    '@media (max-width: 900px)': {
                      height: 'auto',
                      overflow: 'visible',
                    },
                  }}
                >
                  {/* Calendar Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 3,
                      flexShrink: 0,
                    }}
                  >
                  <Typography
                    sx={{
                      fontSize: '32px',
                      fontWeight: 400,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {format(currentMonth, 'MMMM yyyy')}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={handlePreviousMonth}
                      sx={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(163, 184, 153, 0.2)', // #A3B899 with 20% opacity
                        color: '#A3B899',
                        padding: 0,
                        '&:hover': {
                          backgroundColor: 'rgba(163, 184, 153, 0.3)', // Slightly more opacity on hover
                        },
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>

                    <IconButton
                      onClick={handleNextMonth}
                      sx={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(163, 184, 153, 0.2)', // #A3B899 with 20% opacity
                        color: '#A3B899',
                        padding: 0,
                        '&:hover': {
                          backgroundColor: 'rgba(163, 184, 153, 0.3)', // Slightly more opacity on hover
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                </Box>

                  {/* Day Headers */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      marginBottom: 1,
                      flexShrink: 0,
                      width: '100%',
                      // On small screens, use flex
                      '@media (max-width: 900px)': {
                        display: 'flex',
                      },
                    }}
                  >
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Box
                      key={day}
                      sx={{
                        width: '100%',
                        textAlign: 'center',
                        // On small screens, use flex
                        '@media (max-width: 900px)': {
                          flex: 1,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                          fontSize: { xs: '12px', sm: '14px' },
                          padding: { xs: '8px 4px', sm: '12px' },
                        }}
                      >
                        {day}
                      </Typography>
                    </Box>
                  ))}
                  </Box>

                  {/* Calendar Grid - Dynamic rows */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gridTemplateRows: `repeat(${numberOfRows}, 1fr)`,
                      flex: 1,
                      minHeight: 0,
                      gap: 0,
                      width: '100%',
                      height: '100%',
                      // On small screens, keep grid but adjust for equal distribution
                      '@media (max-width: 900px)': {
                        flex: 'none',
                        height: 'auto',
                        // Calculate height based on viewport or container
                        minHeight: `calc(${numberOfRows} * min(calc((100vw - 48px) / 7), 60px))`,
                      },
                    }}
                  >
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return (
                      <Box
                        key={`empty-${index}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: theme.palette.background.default || '#F9FAFB',
                            border: `1px solid ${theme.palette.custom?.border?.default || '#EDEDED'}`,
                          }}
                        />
                      </Box>
                      );
                    }

                    const dateString = format(day, 'yyyy-MM-dd');
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate === dateString;
                    const hasEvents = datesWithEvents.has(dateString);
                    const dateEvent = datesWithEvents.get(dateString);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <Box
                        key={dateString}
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                        }}
                      >
                        <Box
                          onClick={() => handleDateClick(day)}
                          sx={{
                            width: '100%',
                            height: '100%',
                            border: `1px solid ${theme.palette.custom?.border?.default || '#EDEDED'}`,
                            // On small screens, ensure proper sizing
                            '@media (max-width: 900px)': {
                              minHeight: 'min(calc((100vw - 48px) / 7), 60px)',
                            },
                            backgroundColor: isSelected
                              ? theme.palette.primary.main + '20'
                              : isToday
                              ? theme.palette.primary.light + '10'
                              : 'transparent',
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: hasEvents
                                ? theme.palette.primary.light + '15'
                                : theme.palette.action.hover,
                              transform: 'scale(1.02)',
                            },
                          }}
                        >
                          {/* Common Container for Date, Time Cards, and More */}
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                              width: '100%',
                              height: 'auto',
                              alignItems: 'flex-start',
                            }}
                          >
                            {/* Date Number */}
                            <Typography
                              sx={{
                                fontSize: { xs: '10px', sm: '14px', md: '16px' },
                                fontWeight: isToday ? 700 : isSelected ? 600 : 400,
                                color: isCurrentMonth
                                  ? isToday
                                    ? theme.palette.primary.main
                                    : '#364153'
                                  : theme.palette.text.disabled,
                              }}
                            >
                              {format(day, 'd')}
                            </Typography>

                            {/* Booking Time Cards */}
                            {hasEvents && dateEvent && (() => {
                              // Filter sessions that have bookings
                              const sessionsWithBookings = dateEvent.sessions.filter(
                                (session) => session.bookings.length > 0
                              );
                              
                              if (sessionsWithBookings.length === 0) return null;
                              
                              // Show up to 2 session times
                              const visibleSessions = sessionsWithBookings.slice(0, 2);
                              const remainingCount = sessionsWithBookings.length - 2;
                              
                              return (
                                <>
                                  {visibleSessions.map((session) => {
                                    // Determine background color based on booking statuses
                                    // Priority: confirmed > finished > others
                                    const hasConfirmed = session.bookings.some(b => b.status === 'confirmed');
                                    const hasFinished = session.bookings.some(b => b.status === 'finished');
                                    
                                    let backgroundColor = '#D1D5DC'; // default for others
                                    if (hasConfirmed) {
                                      backgroundColor = '#A3B899';
                                    } else if (hasFinished) {
                                      backgroundColor = '#CFA09F';
                                    }
                                    
                                    return (
                                      <Box
                                        key={`${dateString}-${session.id}`}
                                        sx={{
                                          width: '100%',
                                          height: { xs: '20px', sm: '24px' },
                                          backgroundColor: backgroundColor,
                                          borderRadius: '4px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'flex-start',
                                          padding: { xs: '0 4px', sm: '0 8px' },
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: { xs: '10px', sm: '12px' },
                                            fontWeight: 400,
                                            color: '#FFFFFF',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {formatTime(session.startTime)}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                                  {/* Show "+X more" if there are more than 2 sessions with bookings */}
                                  {remainingCount > 0 && (
                                    <Box
                                      sx={{
                                        width: '100%',
                                        height: { xs: '20px', sm: '24px' },
                                        backgroundColor: 'transparent',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: { xs: '0 4px', sm: '0 8px' },
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: { xs: '10px', sm: '12px' },
                                          fontWeight: 400,
                                          color: '#000000',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        +{remainingCount} more
                                      </Typography>
                                    </Box>
                                  )}
                                </>
                              );
                            })()}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                  </Box>
                </Box>
              </Box>

            {/* Details Section - Hidden on small screens, shown in drawer */}
              {selectedDate && !isSmallScreen && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    width: '250px',
                    flexShrink: 0,
                    boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A',
                    padding: '10px',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '8px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Header Section */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: 0,
                        gap: '4px',
                        width: '230px',
                        height: 'auto',
                        marginBottom: 3,
                      }}
                    >
                      {/* Date */}
                      <Typography
                        sx={{
                          width: '230px',
                          height: '27px',
                          fontWeight: 700,
                          fontSize: '18px',
                          lineHeight: '27px',
                          color: '#0A0A0A',
                        }}
                      >
                        {format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}
                      </Typography>
                      {/* Booking Count */}
                      <Typography
                        sx={{
                          width: '230px',
                          height: '21px',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '21px',
                          color: '#6A7282',
                        }}
                      >
                        {selectedDateBookingCount} {selectedDateBookingCount === 1 ? 'booking' : 'bookings'}
                      </Typography>
                    </Box>

                    {selectedDateBookings.length > 0 ? (
                      <Box
                        sx={{
                          flex: 1,
                          minHeight: 0,
                          overflowY: 'auto',
                          '&::-webkit-scrollbar': {
                            width: '8px',
                          },
                          '&::-webkit-scrollbar-track': {
                            backgroundColor: theme.palette.background.default,
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.text.disabled,
                            borderRadius: '4px',
                          },
                          // On small screens, use max height
                          '@media (max-width: 900px)': {
                            flex: 'none',
                            minHeight: 'auto',
                            maxHeight: '400px',
                          },
                        }}
                      >
                        {selectedDateBookings.map((bookingData, index) => {
                          // Determine background color based on booking status
                          let badgeColor = '#D1D5DC'; // default for others
                          if (bookingData.booking.status === 'confirmed') {
                            badgeColor = '#A3B899';
                          } else if (bookingData.booking.status === 'finished') {
                            badgeColor = '#CFA09F';
                          }

                          return (
                            <Paper
                              key={`${bookingData.booking.id}-${index}`}
                              elevation={0}
                              sx={{
                                padding: 0,
                                marginBottom: 2,
                                border: `1px solid ${theme.palette.custom?.border?.default || '#EDEDED'}`,
                                borderRadius: '8px',
                                backgroundColor: theme.palette.background.paper,
                                width: '230px',
                                height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              {/* First Row: Badge and Time */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '12px 12px 0 12px',
                                  marginBottom: '8px',
                                }}
                              >
                                {/* Status Badge */}
                                <Box
                                  sx={{
                                    height: '22px',
                                    padding: '0 8px',
                                    width: 'auto',
                                    backgroundColor: badgeColor,
                                    borderRadius: '11px', // Half of height for capsule shape
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      fontWeight: 400,
                                      color: '#FFFFFF',
                                      textTransform: 'capitalize',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {bookingData.booking.status}
                                  </Typography>
                                </Box>
                                {/* Time */}
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    fontWeight: 400,
                                    color: '#6A7282',
                                  }}
                                >
                                  {formatTime(bookingData.startTime)}
                                </Typography>
                              </Box>

                              {/* Second Row: Customer Name */}
                              <Box
                                sx={{
                                  padding: '0 12px',
                                  marginBottom: '4px',
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#000000',
                                  }}
                                >
                                  {bookingData.booking.customerName}
                                </Typography>
                              </Box>

                              {/* Third Row: Category Option Name */}
                              <Box
                                sx={{
                                  padding: '0 12px 12px 12px',
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    fontWeight: 400,
                                    color: '#6A7282',
                                  }}
                                >
                                  {bookingData.categoryOptionName}
                                </Typography>
                              </Box>
                            </Paper>
                          );
                        })}
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              )}
            </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Drawer for small screens */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '280px',
            padding: '16px',
            marginRight: '16px',
            marginTop: '16px',
            marginBottom: '16px',
            borderRadius: '8px',
            height: 'calc(100vh - 32px)',
            boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A',
          },
        }}
      >
        {selectedDate && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Close Button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 2,
              }}
            >
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{
                  padding: '4px',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Header Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '4px',
                width: '100%',
                height: 'auto',
                marginBottom: 3,
              }}
            >
              {/* Date */}
              <Typography
                sx={{
                  width: '100%',
                  height: '27px',
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '27px',
                  color: '#0A0A0A',
                }}
              >
                {format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}
              </Typography>
              {/* Booking Count */}
              <Typography
                sx={{
                  width: '100%',
                  height: '21px',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#6A7282',
                }}
              >
                {selectedDateBookingCount} {selectedDateBookingCount === 1 ? 'booking' : 'bookings'}
              </Typography>
            </Box>

            {selectedDateBookings.length > 0 ? (
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: theme.palette.background.default,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.text.disabled,
                    borderRadius: '4px',
                  },
                }}
              >
                {selectedDateBookings.map((bookingData, index) => {
                  // Determine background color based on booking status
                  let badgeColor = '#D1D5DC'; // default for others
                  if (bookingData.booking.status === 'confirmed') {
                    badgeColor = '#A3B899';
                  } else if (bookingData.booking.status === 'finished') {
                    badgeColor = '#CFA09F';
                  }

                  return (
                    <Paper
                      key={`${bookingData.booking.id}-${index}`}
                      elevation={0}
                      sx={{
                        padding: 0,
                        marginBottom: 2,
                        border: `1px solid ${theme.palette.custom?.border?.default || '#EDEDED'}`,
                        borderRadius: '8px',
                        backgroundColor: theme.palette.background.paper,
                        width: '100%',
                        height: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* First Row: Badge and Time */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 12px 0 12px',
                          marginBottom: '8px',
                        }}
                      >
                        {/* Status Badge */}
                        <Box
                          sx={{
                            height: '22px',
                            padding: '0 8px',
                            width: 'auto',
                            backgroundColor: badgeColor,
                            borderRadius: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '12px',
                              fontWeight: 400,
                              color: '#FFFFFF',
                              textTransform: 'capitalize',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {bookingData.booking.status}
                          </Typography>
                        </Box>
                        {/* Time */}
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 400,
                            color: '#6A7282',
                          }}
                        >
                          {formatTime(bookingData.startTime)}
                        </Typography>
                      </Box>

                      {/* Second Row: Customer Name */}
                      <Box
                        sx={{
                          padding: '0 12px',
                          marginBottom: '4px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#000000',
                          }}
                        >
                          {bookingData.booking.customerName}
                        </Typography>
                      </Box>

                      {/* Third Row: Category Option Name */}
                      <Box
                        sx={{
                          padding: '0 12px 12px 12px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 400,
                            color: '#6A7282',
                          }}
                        >
                          {bookingData.categoryOptionName}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            ) : null}
          </Box>
        )}
      </Drawer>

      {/* Add Schedule Modal */}
      <AddScheduleModal
        open={addScheduleModalOpen}
        onClose={() => setAddScheduleModalOpen(false)}
        onSave={async (scheduleData) => {
          if (!user?.id) {
            console.error('Cannot create schedule: missing company ID');
            return;
          }

          setSavingSchedule(true);
          try {
            const createdSchedule = await schedulesService.createSchedule({
              companyId: user.id,
              categoryOptionId: scheduleData.categoryOptionId,
              startDate: scheduleData.startDate,
              endDate: scheduleData.endDate,
              sessions: scheduleData.sessions,
            });

            addSchedule(createdSchedule);
            setAddScheduleModalOpen(false);
          } catch (error) {
            console.error('Failed to create schedule:', error);
          } finally {
            setSavingSchedule(false);
          }
        }}
        isLoading={savingSchedule}
      />
    </MainLayout>
  );
}
