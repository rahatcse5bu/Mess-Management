import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/Login';
import { DashboardView } from './components/Dashboard';
import { MembersView } from './components/Members';
import { MealsView } from './components/Meals';
import { PurchasesView } from './components/Purchases';
import { CookingView } from './components/Cooking';
import { AdjustmentsView } from './components/Adjustments';
import { DueReportView } from './components/DueReport';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [members, setMembers] = useState([]);
  const [history, setHistory] = useState([]);
  const [report, setReport] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [error, setError] = useState('');
  const [cookForm, setCookForm] = useState({ termDays: 2, memberOrder: [] });
  const [upcoming, setUpcoming] = useState([]);
  const [currentCooker, setCurrentCooker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const client = useMemo(() => api(token), [token]);

  // Load all dashboard data
  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const [membersRes, cookingRes, configRes, currentRes, purchasesRes, adjustmentsRes, reportRes] = await Promise.all([
        client.get('/members'),
        client.get('/cooking/history'),
        client.get('/cooking/config'),
        client.get('/cooking/current'),
        client.get('/purchases'),
        client.get('/adjustments'),
        client.get('/reports/due-summary'),
      ]);
      setMembers(membersRes.data);
      setHistory(cookingRes.data);
      setPurchases(purchasesRes.data);
      setAdjustments(adjustmentsRes.data);
      setReport(reportRes.data);
      setCurrentCooker(currentRes.data);

      // Use config from backend (includes termDays, memberOrder, upcoming)
      const config = configRes.data?.config;
      if (config) {
        setCookForm({
          termDays: config.termDays || 2,
          memberOrder: config.memberOrder || membersRes.data.map((m) => m._id),
        });
      } else {
        setCookForm((prev) => ({
          ...prev,
          memberOrder: membersRes.data.map((m) => m._id),
        }));
      }
      setUpcoming(configRes.data?.upcoming || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  // Load data when token changes
  useEffect(() => {
    if (!token) return;
    loadDashboard();
  }, [token, loadDashboard]);

  // Login handler
  const handleLogin = async (form) => {
    setError('');
    try {
      const res = await api().post('/auth/login', form);
      localStorage.setItem('token', res.data.accessToken);
      setToken(res.data.accessToken);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Member handlers
  const handleAddMember = async (form) => {
    try {
      await client.post('/members', form);
      await loadDashboard();
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await client.delete(`/members/${id}`);
      await loadDashboard();
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  const handleEditMember = async (id, data) => {
    try {
      await client.patch(`/members/${id}`, data);
      await loadDashboard();
    } catch (err) {
      console.error('Failed to edit member:', err);
    }
  };

  // Meal handler
  const handleSubmitMeals = async (form) => {
    try {
      const entries = members.map((member) => ({
        memberId: member._id,
        mealCount: Number(form.entries[member._id] || 0),
        guestCount: Number(form.guests?.[member._id] || 0),
        note: '',
      }));
      await client.post('/meals/day', {
        date: form.date,
        elements: form.elements.split(',').map((v) => v.trim()).filter(Boolean),
        entries,
      });
      await loadDashboard();
    } catch (err) {
      console.error('Failed to save meals:', err);
    }
  };

  // Purchase handler
  const handleAddPurchase = async (form) => {
    try {
      await client.post('/purchases', {
        ...form,
        amount: Number(form.amount),
        paidByMemberId: form.paidByMemberId || undefined,
      });
      await loadDashboard();
    } catch (err) {
      console.error('Failed to add purchase:', err);
    }
  };

  // Cooking handler
  const handleSaveCookingConfig = async (termDays) => {
    try {
      await client.patch('/cooking/config', { ...cookForm, termDays });
      await loadDashboard();
    } catch (err) {
      console.error('Failed to save cooking config:', err);
    }
  };

  // Delete cooking history handler
  const handleDeleteCookingHistory = async (id) => {
    try {
      await client.delete(`/cooking/history/${id}`);
      await loadDashboard();
    } catch (err) {
      console.error('Failed to delete cooking history:', err);
    }
  };

  // Manual assign handler
  const handleManualAssign = async (form) => {
    try {
      await client.post('/cooking/manual-assign', form);
      await loadDashboard();
    } catch (err) {
      console.error('Failed to manual assign:', err);
    }
  };

  const handleMoveOrder = (index, dir) => {
    const next = [...cookForm.memberOrder];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setCookForm((prev) => ({ ...prev, memberOrder: next }));
  };

  // Adjustment handler
  const handleAddAdjustment = async (form) => {
    try {
      await client.post('/adjustments', {
        ...form,
        amount: Number(form.amount),
      });
      await loadDashboard();
    } catch (err) {
      console.error('Failed to add adjustment:', err);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setActiveTab('Dashboard');
  };

  // Login screen
  if (!token) {
    return <LoginView onLogin={handleLogin} error={error} />;
  }

  // Main dashboard with sidebar
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-16">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'Dashboard' && (
            <DashboardView
              members={members}
              purchases={purchases}
              history={history}
              report={report}
              adjustments={adjustments}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'Members' && (
            <MembersView
              members={members}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
              onEditMember={handleEditMember}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'Meals' && (
            <MealsView
              members={members}
              client={client}
              onSubmitMeals={handleSubmitMeals}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'Purchases' && (
            <PurchasesView
              purchases={purchases}
              members={members}
              onAddPurchase={handleAddPurchase}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'Cooking' && (
            <CookingView
              members={members}
              history={history}
              cookForm={cookForm}
              upcoming={upcoming}
              currentCooker={currentCooker}
              onSaveConfig={handleSaveCookingConfig}
              onMoveOrder={handleMoveOrder}
              onManualAssign={handleManualAssign}
              onDeleteHistory={handleDeleteCookingHistory}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'Adjustments' && (
            <AdjustmentsView
              members={members}
              adjustments={adjustments}
              onAddAdjustment={handleAddAdjustment}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'Due Report' && (
            <DueReportView report={report} isLoading={isLoading} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
