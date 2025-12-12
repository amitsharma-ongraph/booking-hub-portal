'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Popover,
  IconButton,
} from '@mui/material';
import { CalendarToday as CalendarIcon, Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import type { CategoryDto } from '@/lib/api/categories/types';
import { format, addDays, startOfToday } from 'date-fns';

export interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (scheduleData: {
    scheduleName: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    categoryId: string;
    categoryOptionId: string;
    numberOfSeats: number;
    description: string;
  }) => Promise<void> | void;
  isLoading?: boolean;
}

export default function AddScheduleModal({
  open,
  onClose,
  onSave,
  isLoading = false,
}: AddScheduleModalProps) {
  const { categories } = useCategoriesContext();
  const datePickerAnchorRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categoryOptionId, setCategoryOptionId] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
  const [sessions, setSessions] = useState<Array<{ id: string; startTime: string; endTime: string }>>([]);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [timePickerAnchor, setTimePickerAnchor] = useState<HTMLDivElement | null>(null);
  const [timePickerSessionId, setTimePickerSessionId] = useState<string | null>(null);
  const [timePickerField, setTimePickerField] = useState<'startTime' | 'endTime' | null>(null);
  const [timePickerValue, setTimePickerValue] = useState<{ hour: string; minute: string; ampm: string }>({
    hour: '12',
    minute: '00',
    ampm: 'AM',
  });

  // Get available options for selected category
  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  const availableOptions = selectedCategory?.options || [];

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setStartDate(null);
      setEndDate(null);
      setCategoryId('');
      setCategoryOptionId('');
      setNumberOfSeats(1);
      setSessions([]);
      setDatePickerOpen(false);
      setTimePickerOpen(false);
    }
  }, [open]);

  // Reset category option when category changes
  useEffect(() => {
    if (categoryId) {
      setCategoryOptionId('');
    }
  }, [categoryId]);

  const handleAddSession = () => {
    const newSession = {
      id: Date.now().toString(),
      startTime: '',
      endTime: '',
    };
    setSessions([...sessions, newSession]);
  };

  const handleRemoveSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  // Helper functions to convert between 24-hour format (HH:mm) and 12-hour format
  const parseTimeTo12Hour = (time24: string) => {
    if (!time24) return { hour: '12', minute: '00', ampm: 'AM' };
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return { hour: hour12.toString().padStart(2, '0'), minute: minutes || '00', ampm };
  };

  const convert12HourTo24Hour = (hour: string, minute: string, ampm: string) => {
    let hour24 = parseInt(hour, 10);
    if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
    if (ampm === 'AM' && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  const formatTimeForDisplay = (time24: string) => {
    if (!time24) return '';
    const time12 = parseTimeTo12Hour(time24);
    return `${time12.hour}:${time12.minute} ${time12.ampm}`;
  };

  const handleOpenTimePicker = (
    event: React.MouseEvent<HTMLDivElement>,
    sessionId: string,
    field: 'startTime' | 'endTime'
  ) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      const time12 = parseTimeTo12Hour(session[field]);
      setTimePickerValue(time12);
      setTimePickerSessionId(sessionId);
      setTimePickerField(field);
      setTimePickerAnchor(event.currentTarget);
      setTimePickerOpen(true);
    }
  };

  const handleTimePickerChange = (part: 'hour' | 'minute' | 'ampm', value: string) => {
    setTimePickerValue((prev) => ({ ...prev, [part]: value }));
  };

  const handleTimePickerConfirm = () => {
    if (timePickerSessionId && timePickerField) {
      const time24 = convert12HourTo24Hour(
        timePickerValue.hour,
        timePickerValue.minute,
        timePickerValue.ampm
      );
      setSessions(
        sessions.map((session) =>
          session.id === timePickerSessionId
            ? { ...session, [timePickerField]: time24 }
            : session
        )
      );
    }
    setTimePickerOpen(false);
    setTimePickerAnchor(null);
    setTimePickerSessionId(null);
    setTimePickerField(null);
  };

  const handleTimePickerClose = () => {
    setTimePickerOpen(false);
    setTimePickerAnchor(null);
    setTimePickerSessionId(null);
    setTimePickerField(null);
  };

  const handleSave = async () => {
    if (
      startDate &&
      endDate &&
      categoryId &&
      categoryOptionId &&
      sessions.length > 0 &&
      sessions.every((s) => s.startTime && s.endTime) &&
      !isLoading
    ) {
      try {
        // Format dates as YYYY-MM-DD
        const startDateFormatted = format(startDate, 'yyyy-MM-dd');
        const endDateFormatted = format(endDate, 'yyyy-MM-dd');
        
        await onSave({
          scheduleName: '',
          startDate: startDateFormatted,
          endDate: endDateFormatted,
          startTime: '',
          endTime: '',
          categoryId,
          categoryOptionId,
          numberOfSeats,
          description: '',
        });
      } catch (error) {
        console.error('Error saving schedule:', error);
      }
    }
  };

  const handleClose = () => {
    setStartDate(null);
    setEndDate(null);
    setCategoryId('');
    setCategoryOptionId('');
    setNumberOfSeats(1);
    setSessions([]);
    setDatePickerOpen(false);
    onClose();
  };

  const isFormValid =
    startDate &&
    endDate &&
    categoryId &&
    categoryOptionId &&
    sessions.length > 0 &&
    sessions.every((s) => s.startTime && s.endTime);

  // Format date range display
  const getDateRangeDisplay = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`;
    }
    return '';
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
          width: { xs: 'calc(100% - 32px)', sm: '500px' },
          maxWidth: '500px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0px 24px 48px rgba(78, 78, 78, 0.12)',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: { xs: '16px', sm: '0' },
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
            borderBottom: '1px solid #EDEDED',
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
              Add Schedule
            </Typography>
          </Box>
        </Box>

        {/* Content Section - Scrollable */}
        <Box
          sx={{
            width: '100%',
            flex: 1,
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#F9FAFB',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#D1D5DB',
              borderRadius: '4px',
            },
          }}
        >
          {/* Date Range Picker */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
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
              Date
            </Typography>
            <Box
              ref={datePickerAnchorRef}
              onClick={() => setDatePickerOpen(true)}
              sx={{
                width: '100%',
                height: '44px',
                borderRadius: '7.5px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EDEDED',
                padding: '12px 16px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                '&:hover': {
                  border: '1px solid #CFA09F',
                },
              }}
            >
              <Typography
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '150%',
                  color: startDate && endDate ? '#313339' : '#B0B0B0',
                  flex: 1,
                }}
              >
                {startDate && endDate ? getDateRangeDisplay() : 'Choose range date'}
              </Typography>
              <CalendarIcon
                sx={{
                  color: '#CFA09F',
                  width: '20px',
                  height: '20px',
                }}
              />
            </Box>
            <Popover
              open={datePickerOpen}
              anchorEl={datePickerAnchorRef.current}
              onClose={() => setDatePickerOpen(false)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  sx={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    minWidth: '300px',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#313339',
                        marginBottom: '8px',
                      }}
                    >
                      Start Date
                    </Typography>
                    <DatePicker
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                        // If end date is before new start date, clear end date
                        if (newValue && endDate && newValue > endDate) {
                          setEndDate(null);
                        }
                      }}
                      minDate={addDays(startOfToday(), 1)}
                      maxDate={endDate || undefined}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#313339',
                        marginBottom: '8px',
                      }}
                    >
                      End Date
                    </Typography>
                    <DatePicker
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      minDate={startDate || addDays(startOfToday(), 1)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                        },
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => setDatePickerOpen(false)}
                    sx={{
                      backgroundColor: '#CFA09F',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#B8908F',
                      },
                    }}
                  >
                    Done
                  </Button>
                </Box>
              </LocalizationProvider>
            </Popover>
          </Box>

          {/* Category Dropdown */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
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
              Category
            </Typography>
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '7.5px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EDEDED',
                  height: '44px',
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
                '& .MuiSelect-select': {
                  padding: '12px 16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '150%',
                  color: categoryId ? '#313339' : '#B0B0B0',
                },
              }}
            >
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                displayEmpty
                sx={{
                  height: '44px',
                }}
              >
                <MenuItem value="" disabled>
                  Select category
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Option and Number of Seats Row */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              gap: '12px',
            }}
          >
            {/* Option Dropdown - Left Column */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
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
                Option
              </Typography>
              <FormControl
                fullWidth
                disabled={!categoryId || availableOptions.length === 0}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '7.5px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    height: '44px',
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
                  '& .MuiSelect-select': {
                    padding: '12px 16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: categoryOptionId ? '#313339' : '#B0B0B0',
                  },
                }}
              >
                <Select
                  value={categoryOptionId}
                  onChange={(e) => setCategoryOptionId(e.target.value)}
                  displayEmpty
                  sx={{
                    height: '44px',
                  }}
                >
                  <MenuItem value="" disabled>
                    {!categoryId
                      ? 'Select category first'
                      : availableOptions.length === 0
                      ? 'No options available'
                      : 'Select option'}
                  </MenuItem>
                  {availableOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Number of Seats - Right Column */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
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
                Number of Seats
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: '44px',
                  borderRadius: '7.5px',
                  backgroundColor: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0px 12px',
                  boxSizing: 'border-box',
                }}
              >
                <IconButton
                  onClick={() => setNumberOfSeats((prev) => Math.max(1, prev - 1))}
                  disabled={numberOfSeats <= 1}
                  sx={{
                    width: '32px',
                    height: '32px',
                    padding: '0px',
                    borderRadius: '4px',
                    backgroundColor: '#F3F4F5',
                    color: numberOfSeats <= 1 ? '#E2E4E7' : '#333333',
                    '&:hover': {
                      backgroundColor: '#F3F4F5',
                    },
                    '&:disabled': {
                      color: '#E2E4E7',
                      backgroundColor: '#F3F4F5',
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: '20px' }} />
                </IconButton>
                <Typography
                  sx={{
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#333333',
                    minWidth: '40px',
                    textAlign: 'center',
                  }}
                >
                  {numberOfSeats}
                </Typography>
                <IconButton
                  onClick={() => setNumberOfSeats((prev) => prev + 1)}
                  sx={{
                    width: '32px',
                    height: '32px',
                    padding: '0px',
                    borderRadius: '4px',
                    backgroundColor: '#F3F4F5',
                    color: '#333333',
                    '&:hover': {
                      backgroundColor: '#F3F4F5',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: '20px' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Add Time Button */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={handleAddSession}
              sx={{
                padding: '0px',
                minWidth: 'auto',
                textTransform: 'none',
                color: '#CFA09F',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '150%',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Add Time
            </Button>
          </Box>

          {/* Sessions List */}
          {sessions.map((session, index) => (
            <Box
              key={session.id}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {/* Session Header with Label and Delete Button */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
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
                  Session {index + 1}
                </Typography>
                <Button
                  onClick={() => handleRemoveSession(session.id)}
                  sx={{
                    padding: '0px',
                    minWidth: 'auto',
                    textTransform: 'none',
                    color: '#FF0000',
                    fontSize: '10px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Delete Session
                </Button>
              </Box>

              {/* Start Time and End Time Row */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  gap: '12px',
                }}
              >
                {/* Start Time */}
                <Box
                  onClick={(e) => handleOpenTimePicker(e, session.id, 'startTime')}
                  sx={{
                    flex: 1,
                    height: '44px',
                    borderRadius: '7.5px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    padding: '12px 16px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      border: '1px solid #CFA09F',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: session.startTime ? '#313339' : '#B0B0B0',
                      flex: 1,
                    }}
                  >
                    {session.startTime ? formatTimeForDisplay(session.startTime) : 'Start Time'}
                  </Typography>
                  <CalendarIcon
                    sx={{
                      color: '#CFA09F',
                      width: '20px',
                      height: '20px',
                    }}
                  />
                </Box>

                {/* End Time */}
                <Box
                  onClick={(e) => handleOpenTimePicker(e, session.id, 'endTime')}
                  sx={{
                    flex: 1,
                    height: '44px',
                    borderRadius: '7.5px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    padding: '12px 16px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      border: '1px solid #CFA09F',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: session.endTime ? '#313339' : '#B0B0B0',
                      flex: 1,
                    }}
                  >
                    {session.endTime ? formatTimeForDisplay(session.endTime) : 'End Time'}
                  </Typography>
                  <CalendarIcon
                    sx={{
                      color: '#CFA09F',
                      width: '20px',
                      height: '20px',
                    }}
                  />
                </Box>
              </Box>

              {/* Time Picker Popover */}
              <Popover
                open={timePickerOpen && timePickerSessionId === session.id}
                anchorEl={timePickerAnchor}
                onClose={handleTimePickerClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <Box
                  sx={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    minWidth: '254px',
                    maxHeight: '196px',
                  }}
                >
                  {/* Time Selectors Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    {/* Hours */}
                    <FormControl
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '7.5px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #EDEDED',
                          height: '44px',
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
                        '& .MuiSelect-select': {
                          padding: '12px 16px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '150%',
                          color: '#313339',
                        },
                      }}
                    >
                      <Select
                        value={timePickerValue.hour}
                        onChange={(e) => handleTimePickerChange('hour', e.target.value)}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: '150px',
                            },
                          },
                        }}
                        sx={{ height: '44px' }}
                      >
                        {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((hour) => (
                          <MenuItem key={hour} value={hour}>
                            {hour}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Minutes */}
                    <FormControl
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '7.5px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #EDEDED',
                          height: '44px',
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
                        '& .MuiSelect-select': {
                          padding: '12px 16px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '150%',
                          color: '#313339',
                        },
                      }}
                    >
                      <Select
                        value={timePickerValue.minute}
                        onChange={(e) => handleTimePickerChange('minute', e.target.value)}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: '150px',
                            },
                          },
                        }}
                        sx={{ height: '44px' }}
                      >
                        {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((min) => (
                          <MenuItem key={min} value={min}>
                            {min}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* AM/PM */}
                    <FormControl
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '7.5px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #EDEDED',
                          height: '44px',
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
                        '& .MuiSelect-select': {
                          padding: '12px 16px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '150%',
                          color: '#313339',
                        },
                      }}
                    >
                      <Select
                        value={timePickerValue.ampm}
                        onChange={(e) => handleTimePickerChange('ampm', e.target.value)}
                        sx={{ height: '44px' }}
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Confirm Button */}
                  <Button
                    variant="contained"
                    onClick={handleTimePickerConfirm}
                    sx={{
                      backgroundColor: '#CFA09F',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#B8908F',
                      },
                    }}
                  >
                    Done
                  </Button>
                </Box>
              </Popover>
            </Box>
          ))}
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
            borderTop: '1px solid #EDEDED',
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

            {/* Add Schedule Button */}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isFormValid || isLoading}
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
              {isLoading ? 'Adding...' : 'Add Schedule'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

