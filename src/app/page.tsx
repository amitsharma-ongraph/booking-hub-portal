'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import {
  BookOnline,
  AttachMoney,
  People,
  CheckCircle,
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/cards/StatCard';
import { mockDashboardStats, mockBookings } from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', bookings: 45, revenue: 3200 },
  { month: 'Feb', bookings: 52, revenue: 3800 },
  { month: 'Mar', bookings: 48, revenue: 3500 },
  { month: 'Apr', bookings: 61, revenue: 4200 },
  { month: 'May', bookings: 55, revenue: 3900 },
  { month: 'Jun', bookings: 68, revenue: 4800 },
];

const categoryData = [
  { name: 'Beauty & Spa', value: 35, color: '#EC4899' },
  { name: 'Fitness', value: 25, color: '#10B981' },
  { name: 'Medical', value: 20, color: '#3B82F6' },
  { name: 'Consulting', value: 12, color: '#F59E0B' },
  { name: 'Other', value: 8, color: '#8B5CF6' },
];

const statusColors: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
  confirmed: 'success',
  pending: 'warning',
  completed: 'info',
  cancelled: 'error',
};

export default function DashboardPage() {
  const recentBookings = mockBookings.slice(0, 5);

  return (
    <MainLayout>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of your booking hub performance
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Bookings"
              value={mockDashboardStats.totalBookings}
              icon={<BookOnline sx={{ fontSize: 28 }} />}
              change={12.5}
              color="#6366F1"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Revenue"
              value={`$${mockDashboardStats.totalRevenue.toLocaleString()}`}
              icon={<AttachMoney sx={{ fontSize: 28 }} />}
              change={8.2}
              color="#10B981"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Active Customers"
              value={mockDashboardStats.activeCustomers}
              icon={<People sx={{ fontSize: 28 }} />}
              change={5.7}
              color="#EC4899"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Completion Rate"
              value={`${mockDashboardStats.completionRate}%`}
              icon={<CheckCircle sx={{ fontSize: 28 }} />}
              change={2.1}
              color="#F59E0B"
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Revenue Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardHeader
                title="Revenue Overview"
                subheader="Monthly revenue and bookings trend"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366F1"
                      strokeWidth={3}
                      name="Revenue ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#EC4899"
                      strokeWidth={3}
                      name="Bookings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Distribution */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Bookings by Category"
                subheader="Distribution overview"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Bookings */}
        <Card>
          <CardHeader
            title="Recent Bookings"
            subheader="Latest booking activities"
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {booking.customerName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {booking.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{booking.date}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.time}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={statusColors[booking.status]}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          ${booking.price}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
