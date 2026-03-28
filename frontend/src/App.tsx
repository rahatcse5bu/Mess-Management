import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import MealsPage from './pages/MealsPage';
import CookingPage from './pages/CookingPage';
import PurchasesPage from './pages/PurchasesPage';
import AdjustmentsPage from './pages/AdjustmentsPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  const { token, fetchProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (token && !isAuthenticated) {
      fetchProfile();
    }
  }, [token, isAuthenticated, fetchProfile]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/meals" element={<MealsPage />} />
                <Route path="/cooking" element={<CookingPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/adjustments" element={<AdjustmentsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
