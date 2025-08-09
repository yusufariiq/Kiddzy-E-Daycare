'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Baby, Calendar, Building2, AlertCircle, RefreshCcw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useAuth } from '@/context/auth.context';
import Booking from '@/lib/types/booking';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalBookings: number;
  activeChildren: number;
  totalUsers: number;
  totalProviders: number;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  bookings?: T;
  children?: T;
  count?: number;
  error?: string;
  message?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeChildren: 0,
    totalUsers: 0,
    totalProviders: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const { token } = useAuth()
  

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const [bookingsRes, childrenRes, usersRes, providersRes] = await Promise.all([
        fetch('/api/admin/booking', { headers }),
        fetch('/api/admin/children?limit=1000', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/providers?limit=1000', { headers }),
      ]);

      if (!bookingsRes.ok || !childrenRes.ok || !usersRes.ok || !providersRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [bookingsData, childrenData, usersData, providersData] = await Promise.all([
        bookingsRes.json() as Promise<ApiResponse<Booking[]>>,
        childrenRes.json() as Promise<ApiResponse<any[]>>,
        usersRes.json() as Promise<ApiResponse<any[]>>,
        providersRes.json() as Promise<ApiResponse<any[]>>,
      ]);

      // Handle potential API errors
      if (bookingsData.error || childrenData.error || usersData.error || providersData.error) {
        throw new Error('API returned error response');
      }

      // Extract data with fallbacks
      const bookings = bookingsData.bookings || [];
      const children = childrenData.children || [];
      const users = usersData.data || [];
      const providers = providersData.data || [];

      // Update stats
      setStats({
        totalBookings: bookings.length,
        activeChildren: children.length,
        totalUsers: usersData.count || users.length,
        totalProviders: providers.length,
      });

      // Set recent bookings (last 5)
      const sortedBookings = bookings
        .sort((a: Booking, b: Booking) => 
          new Date(b.startDate).getTime() - new Date(a.endDate).getTime()
        )
        .slice(0, 5);
      
      setRecentBookings(sortedBookings);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: Date) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };
  
  const formatHour = (dateString: Date) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'cancelled':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-2">
          <LoadingSpinner className='text-[#FE7743]' size='lg'/>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-center'>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your childcare platform</p>
        </div>
        <Button variant="default" onClick={() => fetchDashboardData()} className="rounded-lg h-auto p-3">
            <RefreshCcw className="size-6"/>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className='bg-white border-1 border-gray-200'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
          </CardContent>
        </Card>

        <Card className='bg-white border-1 border-gray-200'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Registered Children
            </CardTitle>
            <Baby className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeChildren}</div>
          </CardContent>
        </Card>

        <Card className='bg-white border-1 border-gray-200'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Parents
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className='bg-white border-1 border-gray-200'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Care Providers
            </CardTitle>
            <Building2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalProviders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className='bg-white border-1 border-gray-200'>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600">Recent Update</th>
                    <th className="text-left py-3 px-4 text-gray-600">Parent</th>
                    <th className="text-left py-3 px-4 text-gray-600">Provider</th>
                    <th className="text-left py-3 px-4 text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-gray-600">Children Count</th>
                    <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr 
                      key={booking._id}
                      className="font-medium border-b text-[#273F4F] border-gray-100 transition-colors"
                    >
                      <td className="py-6 px-4">
                        {formatHour(booking.createdAt)}
                      </td>
                      <td className="py-6 px-4">
                        {`${booking.userId.firstName} ${booking.userId.lastName}`}
                      </td>
                      <td className="py-6 px-4">
                        {booking.providerId.name || 'Unknown Provider'}
                      </td>
                      <td className="py-6 px-4">
                        {formatDate(booking.startDate)}
                      </td>
                      <td className="py-6 px-4">
                        {booking.childrenCount || 'Unknown'}
                      </td>
                      <td className="py-6 px-4">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1) || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}