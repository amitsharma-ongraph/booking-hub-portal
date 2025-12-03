'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainLayout from '@/components/layout/MainLayout';
import { mockSchedules } from '@/data/mockData';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const schedulesForDay = mockSchedules.filter(
    (schedule) => schedule.date === selectedDateString
  );

  return (
    <MainLayout>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your schedules and appointments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
          >
            Add Schedule
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Calendar */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate || new Date())}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Grid>

          {/* Schedule List */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Schedules for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>

                {schedulesForDay.length > 0 ? (
                  <List>
                    {schedulesForDay.map((schedule) => (
                      <ListItem
                        key={schedule.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 2,
                          '&:last-child': { mb: 0 },
                        }}
                        secondaryAction={
                          <Box>
                            <IconButton edge="end" size="small" sx={{ mr: 0.5 }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton edge="end" size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {schedule.title}
                              </Typography>
                              {schedule.category && (
                                <Chip label={schedule.category} size="small" color="primary" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <TimeIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2">
                                  {schedule.startTime} - {schedule.endTime}
                                </Typography>
                              </Box>
                              {schedule.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {schedule.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No schedules for this date
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      sx={{ mt: 2 }}
                    >
                      Add Schedule
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* All Schedules */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Upcoming Schedules
                </Typography>
                <List>
                  {mockSchedules.slice(0, 3).map((schedule) => (
                    <ListItem
                      key={schedule.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: 1.5,
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <ListItemText
                        primary={schedule.title}
                        secondary={`${schedule.date} • ${schedule.startTime} - ${schedule.endTime}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
