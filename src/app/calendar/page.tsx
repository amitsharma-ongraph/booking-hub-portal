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
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, addMonths, subMonths } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useCompanies, type BookingSession } from '@/hooks/companies/useCompanies';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';

interface DateEvent {
  date: string; // YYYY-MM-DD format
  sessions: BookingSession[];
  totalBookings: number;
  categories: string[];
}

export default function CalendarPage() {
  const theme = useTheme();
  const { company, isLoading } = useCompanyContext();
  const { getBookingsData } = useCompanies();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd')
  );

  // Extract all dates with events from company data
  const datesWithEvents = useMemo<Map<string, DateEvent>>(() => {
    const eventsMap = new Map<string, DateEvent>();

    if (!company?.categories) {
      return eventsMap;
    }

    company.categories.forEach((category) => {
      category.options.forEach((option) => {
        option.schedules.forEach((schedule) => {
          const datePart = schedule.startDate.split('T')[0]; // Extract YYYY-MM-DD
          
          if (!eventsMap.has(datePart)) {
            eventsMap.set(datePart, {
              date: datePart,
              sessions: [],
              totalBookings: 0,
              categories: [],
            });
          }

          const dateEvent = eventsMap.get(datePart)!;
          
          // Add sessions from this schedule
          schedule.sessions.forEach((session) => {
            dateEvent.sessions.push({
              id: session.id,
              totalNumberOfSeats: session.totalNumberOfSeats,
              availableNumberOfSeats: session.availableNumberOfSeats,
              startTime: session.startTime,
              endTime: session.endTime,
              bookings: session.bookings,
            });
            dateEvent.totalBookings += session.bookings.length;
          });

          // Add category name if not already present
          if (!dateEvent.categories.includes(category.name)) {
            dateEvent.categories.push(category.name);
          }
        });
      });
    });

    return eventsMap;
  }, [company]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return null;
    return datesWithEvents.get(selectedDate) || null;
  }, [selectedDate, datesWithEvents]);

  // Calendar grid setup - always show exactly 5 rows (35 days)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = getDay(monthStart);
    
    // Create array with empty cells for days before month starts
    const emptyCells = Array(firstDayOfWeek).fill(null);
    
    // Calculate how many days we need to fill to make exactly 5 rows (35 days total)
    const totalCells = 35; // 5 rows × 7 days
    const currentTotal = emptyCells.length + daysInMonth.length;
    const daysNeeded = totalCells - currentTotal;
    
    // Add days from next month if needed
    const nextMonthDays: (Date | null)[] = [];
    if (daysNeeded > 0) {
      for (let i = 1; i <= daysNeeded; i++) {
        const nextDate = new Date(monthEnd);
        nextDate.setDate(monthEnd.getDate() + i);
        nextMonthDays.push(nextDate);
      }
    }
    
    return [...emptyCells, ...daysInMonth, ...nextMonthDays];
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    // Toggle selection - if clicking the same date, deselect it
    if (selectedDate === dateString) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateString);
    }
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
          <LoadingSpinner text="Loading calendar..." />
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
            marginBottom: { xs: 3, sm: 4 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: theme.palette.custom?.heading?.dashboard || '#0A0A0A',
              fontSize: { xs: '24px', sm: '28px', md: '32px' },
            }}
          >
            Calendar
          </Typography>
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

                  {/* Calendar Grid - Always 5 rows */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gridTemplateRows: 'repeat(5, 1fr)',
                      flex: 1,
                      minHeight: 0,
                      gap: 0,
                      width: '100%',
                      height: '100%',
                      // On small screens, use flexbox wrap
                      '@media (max-width: 900px)': {
                        display: 'flex',
                        flexWrap: 'wrap',
                        flex: 'none',
                        minHeight: 'auto',
                        height: 'auto',
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
                          // On small screens, use flex
                          '@media (max-width: 900px)': {
                            flex: '0 0 calc(100% / 7)',
                            aspectRatio: '1',
                            minHeight: '40px',
                            height: 'auto',
                          },
                        }}
                      />
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
                          // On small screens, use flex
                          '@media (max-width: 900px)': {
                            flex: '0 0 calc(100% / 7)',
                            height: 'auto',
                          },
                        }}
                      >
                        <Box
                          onClick={() => handleDateClick(day)}
                          sx={{
                            width: '100%',
                            height: '100%',
                            border: `1px solid ${theme.palette.custom?.border?.default || '#EDEDED'}`,
                            // On small screens, add min height and aspect ratio
                            '@media (max-width: 900px)': {
                              aspectRatio: '1',
                              minHeight: '40px',
                            },
                            backgroundColor: isSelected
                              ? theme.palette.primary.main + '20'
                              : isToday
                              ? theme.palette.primary.light + '10'
                              : 'transparent',
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            padding: { xs: '4px', sm: '8px' },
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: hasEvents
                                ? theme.palette.primary.light + '15'
                                : theme.palette.action.hover,
                              transform: 'scale(1.02)',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: '12px', sm: '14px', md: '16px' },
                              fontWeight: isToday ? 700 : isSelected ? 600 : 400,
                              color: isCurrentMonth
                                ? isToday
                                  ? theme.palette.primary.main
                                  : theme.palette.text.primary
                                : theme.palette.text.disabled,
                              marginBottom: hasEvents ? '4px' : 0,
                            }}
                          >
                            {format(day, 'd')}
                          </Typography>

                          {/* Event Indicators */}
                          {hasEvents && dateEvent && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '2px',
                                justifyContent: 'center',
                                width: '100%',
                                marginTop: 'auto',
                              }}
                            >
                              {dateEvent.sessions.slice(0, 3).map((session, idx) => (
                                <Box
                                  key={`${dateString}-${session.id}-${idx}`}
                                  sx={{
                                    width: { xs: '4px', sm: '6px' },
                                    height: { xs: '4px', sm: '6px' },
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.primary.main,
                                  }}
                                />
                              ))}
                              {dateEvent.sessions.length > 3 && (
                                <Typography
                                  sx={{
                                    fontSize: { xs: '8px', sm: '10px' },
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                  }}
                                >
                                  +{dateEvent.sessions.length - 3}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                  </Box>
                </Box>
              </Box>

            {/* Details Section */}
              {selectedDate && (
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
                    // On small screens, allow scrolling
                    '@media (max-width: 900px)': {
                      height: 'auto',
                      overflow: 'visible',
                      width: '100%',
                      boxShadow: 'none',
                      borderRadius: 0,
                    },
                  }}
                >
                  {selectedDateEvents ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'hidden',
                      }}
                    >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        marginBottom: 3,
                      }}
                    >
                      <EventIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: { xs: '20px', sm: '24px' },
                        }}
                      >
                        {format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                      </Typography>
                    </Box>

                    <Divider sx={{ marginBottom: 3 }} />

                    {/* Summary Stats */}
                    <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      marginBottom: 3,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        padding: 2,
                        backgroundColor: theme.palette.primary.main + '10',
                        borderRadius: '8px',
                        flex: 1,
                        minWidth: '120px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.text.secondary,
                          marginBottom: 0.5,
                        }}
                      >
                        Total Sessions
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {selectedDateEvents.sessions.length}
                      </Typography>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        padding: 2,
                        backgroundColor: theme.palette.secondary.main + '10',
                        borderRadius: '8px',
                        flex: 1,
                        minWidth: '120px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.text.secondary,
                          marginBottom: 0.5,
                        }}
                      >
                        Total Bookings
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: theme.palette.secondary.main,
                        }}
                      >
                        {selectedDateEvents.totalBookings}
                      </Typography>
                    </Paper>
                    </Box>

                    {/* Categories */}
                    {selectedDateEvents.categories.length > 0 && (
                      <Box sx={{ marginBottom: 3 }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                          marginBottom: 1,
                        }}
                      >
                        Categories
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedDateEvents.categories.map((category) => (
                          <Chip
                            key={category}
                            label={category}
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.primary.main + '20',
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                      </Box>
                    )}

                    <Divider sx={{ marginBottom: 3 }} />

                    {/* Sessions List */}
                    <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      marginBottom: 2,
                    }}
                  >
                    Sessions
                    </Typography>

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
                      {selectedDateEvents.sessions.map((session) => (
                      <Paper
                        key={session.id}
                        elevation={0}
                        sx={{
                          padding: 2,
                          marginBottom: 2,
                          border: `1px solid ${theme.palette.custom?.border?.default || '#EDEDED'}`,
                          borderRadius: '8px',
                          backgroundColor: theme.palette.background.paper,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '16px',
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </Typography>
                          <Chip
                            label={`${session.totalNumberOfSeats - session.availableNumberOfSeats}/${session.totalNumberOfSeats} booked`}
                            size="small"
                            sx={{
                              backgroundColor:
                                session.availableNumberOfSeats === 0
                                  ? theme.palette.error.main + '20'
                                  : theme.palette.success.main + '20',
                              color:
                                session.availableNumberOfSeats === 0
                                  ? theme.palette.error.main
                                  : theme.palette.success.main,
                            }}
                          />
                        </Box>

                        {session.bookings.length > 0 && (
                          <Box sx={{ marginTop: 2 }}>
                            <Typography
                              sx={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                                marginBottom: 1,
                              }}
                            >
                              Bookings ({session.bookings.length})
                            </Typography>
                            {session.bookings.map((booking) => (
                              <Box
                                key={booking.id}
                                sx={{
                                  padding: 1,
                                  backgroundColor: theme.palette.background.default,
                                  borderRadius: '4px',
                                  marginBottom: 0.5,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: theme.palette.text.primary,
                                  }}
                                >
                                  {booking.customerName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? 's' : ''} • {formatCurrency(booking.price)}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Paper>
                      ))}
                    </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                        height: '100%',
                        flex: 1,
                      }}
                    >
                      <EventIcon
                        sx={{
                          fontSize: 64,
                          color: theme.palette.text.disabled,
                          marginBottom: 2,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '18px',
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          textAlign: 'center',
                        }}
                      >
                        No events on this date
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: theme.palette.text.disabled,
                          textAlign: 'center',
                          marginTop: 1,
                        }}
                      >
                        {format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </MainLayout>
  );
}
