import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { reportsApi, cookingApi, membersApi } from '../api';
import { getCurrentMonthRange, formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardStats {
  totalMembers: number;
  totalMeals: number;
  totalPurchases: number;
  mealRate: number;
  currentCooker: string;
  daysRemaining: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { from, to } = getCurrentMonthRange();

      const [reportStats, currentCooker, members] = await Promise.all([
        reportsApi.getStats(from, to),
        cookingApi.getCurrentCooker(),
        membersApi.getAll(),
      ]);

      setStats({
        totalMembers: members.filter(m => m.isActive).length,
        totalMeals: reportStats.totalMeals,
        totalPurchases: reportStats.totalPurchases,
        mealRate: reportStats.mealRate,
        currentCooker: currentCooker.memberName,
        daysRemaining: currentCooker.daysRemaining,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      name: 'Active Members',
      value: stats?.totalMembers || 0,
      icon: UsersIcon,
      href: '/members',
      color: 'bg-blue-500',
    },
    {
      name: 'Total Meals (This Month)',
      value: stats?.totalMeals || 0,
      icon: CalendarDaysIcon,
      href: '/meals',
      color: 'bg-green-500',
    },
    {
      name: 'Total Purchases',
      value: formatCurrency(stats?.totalPurchases || 0),
      icon: ShoppingCartIcon,
      href: '/purchases',
      color: 'bg-orange-500',
    },
    {
      name: 'Meal Rate',
      value: formatCurrency(stats?.mealRate || 0),
      icon: CurrencyDollarIcon,
      href: '/reports',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Mess Management System</p>
      </div>

      {/* Current Cooker Card */}
      <div className="card bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <FireIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-white/80 text-sm">Today's Cooker</p>
            <p className="text-2xl font-bold">{stats?.currentCooker || 'Not Assigned'}</p>
            {stats?.daysRemaining !== undefined && stats.daysRemaining > 0 && (
              <p className="text-white/80 text-sm">{stats.daysRemaining} day(s) remaining</p>
            )}
          </div>
          <div className="ml-auto">
            <Link to="/cooking" className="btn bg-white/20 hover:bg-white/30 text-white">
              View Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/meals"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CalendarDaysIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Meals</span>
          </Link>
          <Link
            to="/purchases"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ShoppingCartIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Purchase</span>
          </Link>
          <Link
            to="/adjustments"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CurrencyDollarIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Payment</span>
          </Link>
          <Link
            to="/reports"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <UsersIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Dues</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
