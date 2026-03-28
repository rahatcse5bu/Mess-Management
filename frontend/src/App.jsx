import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api';

const tabs = ['Members', 'Cooking', 'Meals', 'Purchases', 'Adjustments', 'Due Report'];

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('Members');
  const [members, setMembers] = useState([]);
  const [history, setHistory] = useState([]);
  const [report, setReport] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [error, setError] = useState('');

  const client = useMemo(() => api(token), [token]);

  const [login, setLogin] = useState({
    email: 'rahat.cse5.bu@gmail.com',
    password: '01783307672@Rahat',
  });
  const [memberForm, setMemberForm] = useState({ name: '', email: '', phone: '' });
  const [mealForm, setMealForm] = useState({ date: new Date().toISOString().slice(0, 10), elements: '', entries: {} });
  const [purchaseForm, setPurchaseForm] = useState({ date: new Date().toISOString().slice(0, 10), description: '', amount: '', paidByMemberId: '' });
  const [adjustForm, setAdjustForm] = useState({ date: new Date().toISOString().slice(0, 10), memberId: '', amount: '', type: 'payment', note: '' });
  const [cookForm, setCookForm] = useState({ termDays: 2, memberOrder: [] });

  const loadDashboard = useCallback(async () => {
    const [membersRes, cookingRes, purchasesRes, adjustmentsRes, reportRes] = await Promise.all([
      client.get('/members'),
      client.get('/cooking/history'),
      client.get('/purchases'),
      client.get('/adjustments'),
      client.get('/reports/due-summary'),
    ]);
    setMembers(membersRes.data);
    setHistory(cookingRes.data);
    setPurchases(purchasesRes.data);
    setAdjustments(adjustmentsRes.data);
    setReport(reportRes.data);
    setCookForm((prev) => ({
      ...prev,
      memberOrder: membersRes.data.map((m) => m._id),
    }));
  }, [client]);

  useEffect(() => {
    if (!token) return;
    const run = async () => {
      try {
        await loadDashboard();
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [token, loadDashboard]);

  const loginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api().post('/auth/login', login);
      localStorage.setItem('token', res.data.accessToken);
      setToken(res.data.accessToken);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    await client.post('/members', memberForm);
    setMemberForm({ name: '', email: '', phone: '' });
    await loadDashboard();
  };

  const deleteMember = async (id) => {
    await client.delete(`/members/${id}`);
    await loadDashboard();
  };

  const saveCookingConfig = async () => {
    await client.patch('/cooking/config', cookForm);
    await loadDashboard();
  };

  const submitMeals = async (e) => {
    e.preventDefault();
    const entries = members.map((member) => ({
      memberId: member._id,
      mealCount: Number(mealForm.entries[member._id] || 0),
      note: '',
    }));
    await client.post('/meals/day', {
      date: mealForm.date,
      elements: mealForm.elements.split(',').map((v) => v.trim()).filter(Boolean),
      entries,
    });
    await loadDashboard();
  };

  const submitPurchase = async (e) => {
    e.preventDefault();
    await client.post('/purchases', {
      ...purchaseForm,
      amount: Number(purchaseForm.amount),
      paidByMemberId: purchaseForm.paidByMemberId || undefined,
    });
    setPurchaseForm({ date: new Date().toISOString().slice(0, 10), description: '', amount: '', paidByMemberId: '' });
    await loadDashboard();
  };

  const submitAdjustment = async (e) => {
    e.preventDefault();
    await client.post('/adjustments', {
      ...adjustForm,
      amount: Number(adjustForm.amount),
    });
    setAdjustForm({ date: new Date().toISOString().slice(0, 10), memberId: '', amount: '', type: 'payment', note: '' });
    await loadDashboard();
  };

  const moveOrder = (index, dir) => {
    const next = [...cookForm.memberOrder];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setCookForm((prev) => ({ ...prev, memberOrder: next }));
  };

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
        <form onSubmit={loginSubmit} className="w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-[var(--ink)]">Mess Management Login</h1>
          <p className="mt-2 text-sm text-slate-600">Use the seeded credentials or your own account.</p>
          <div className="mt-6 space-y-4">
            <input className="w-full rounded-lg border border-slate-300 p-3" placeholder="Email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
            <input className="w-full rounded-lg border border-slate-300 p-3" type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full rounded-lg bg-[var(--accent)] p-3 font-semibold text-white">Sign In</button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-md">
        <h1 className="text-3xl font-black tracking-tight">Mess Management</h1>
        <p className="text-sm text-slate-600">Members, cooker rotation, meals, purchases, due, and adjustments.</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full border px-4 py-2 text-sm ${activeTab === tab ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-md">
        {activeTab === 'Members' && (
          <div className="space-y-5">
            <form onSubmit={addMember} className="grid gap-3 md:grid-cols-4">
              <input className="rounded border p-2" placeholder="Name" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} required />
              <input className="rounded border p-2" placeholder="Email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
              <input className="rounded border p-2" placeholder="Phone" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} />
              <button className="rounded bg-[var(--accent)] p-2 font-semibold text-white">Add Member</button>
            </form>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member._id} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.email || 'No email'}</p>
                  </div>
                  <button onClick={() => deleteMember(member._id)} className="rounded bg-red-600 px-3 py-1 text-sm text-white">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Cooking' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label>Term days</label>
              <input type="number" min="1" className="w-24 rounded border p-2" value={cookForm.termDays} onChange={(e) => setCookForm({ ...cookForm, termDays: Number(e.target.value) })} />
              <button className="rounded bg-[var(--accent)] px-4 py-2 text-white" onClick={saveCookingConfig}>Save</button>
            </div>
            <div className="grid gap-2">
              {cookForm.memberOrder.map((id, i) => {
                const member = members.find((m) => m._id === id);
                if (!member) return null;
                return (
                  <div key={id} className="flex items-center justify-between rounded border p-2">
                    <span>{i + 1}. {member.name}</span>
                    <div className="space-x-2">
                      <button className="rounded border px-2" onClick={() => moveOrder(i, -1)}>Up</button>
                      <button className="rounded border px-2" onClick={() => moveOrder(i, 1)}>Down</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              <h3 className="font-bold">Cooking history</h3>
              {history.slice(0, 20).map((h) => (
                <p key={h._id} className="rounded border p-2 text-sm">{new Date(h.date).toISOString().slice(0, 10)} - {h.memberId?.name || 'Unknown'} ({h.source})</p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Meals' && (
          <form onSubmit={submitMeals} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input type="date" className="rounded border p-2" value={mealForm.date} onChange={(e) => setMealForm({ ...mealForm, date: e.target.value })} />
              <input className="rounded border p-2" placeholder="Meal elements (rice,fish,dal)" value={mealForm.elements} onChange={(e) => setMealForm({ ...mealForm, elements: e.target.value })} />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {members.map((member) => (
                <label key={member._id} className="flex items-center justify-between rounded border p-2">
                  <span>{member.name}</span>
                  <input type="number" step="0.5" min="0" className="w-24 rounded border p-1" value={mealForm.entries[member._id] || ''} onChange={(e) => setMealForm({ ...mealForm, entries: { ...mealForm.entries, [member._id]: e.target.value } })} />
                </label>
              ))}
            </div>
            <button className="rounded bg-[var(--accent)] px-4 py-2 text-white">Save Meal Day</button>
          </form>
        )}

        {activeTab === 'Purchases' && (
          <div className="space-y-4">
            <form onSubmit={submitPurchase} className="grid gap-3 md:grid-cols-4">
              <input type="date" className="rounded border p-2" value={purchaseForm.date} onChange={(e) => setPurchaseForm({ ...purchaseForm, date: e.target.value })} />
              <input className="rounded border p-2" placeholder="Description" value={purchaseForm.description} onChange={(e) => setPurchaseForm({ ...purchaseForm, description: e.target.value })} required />
              <input type="number" min="0" className="rounded border p-2" placeholder="Amount" value={purchaseForm.amount} onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })} required />
              <button className="rounded bg-[var(--accent)] p-2 text-white">Add Purchase</button>
            </form>
            {purchases.map((p) => (
              <p key={p._id} className="rounded border p-2 text-sm">{new Date(p.date).toISOString().slice(0, 10)} - {p.description} - Tk {p.amount}</p>
            ))}
          </div>
        )}

        {activeTab === 'Adjustments' && (
          <div className="space-y-4">
            <form onSubmit={submitAdjustment} className="grid gap-3 md:grid-cols-5">
              <input type="date" className="rounded border p-2" value={adjustForm.date} onChange={(e) => setAdjustForm({ ...adjustForm, date: e.target.value })} />
              <select className="rounded border p-2" value={adjustForm.memberId} onChange={(e) => setAdjustForm({ ...adjustForm, memberId: e.target.value })} required>
                <option value="">Select member</option>
                {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
              <input type="number" min="0" className="rounded border p-2" value={adjustForm.amount} onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })} required />
              <select className="rounded border p-2" value={adjustForm.type} onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}>
                <option value="payment">payment</option>
                <option value="credit">credit</option>
                <option value="debit">debit</option>
              </select>
              <button className="rounded bg-[var(--accent)] p-2 text-white">Adjust</button>
            </form>
            {adjustments.map((a) => (
              <p key={a._id} className="rounded border p-2 text-sm">{new Date(a.date).toISOString().slice(0, 10)} - {a.memberId?.name} - {a.type} - Tk {a.amount}</p>
            ))}
          </div>
        )}

        {activeTab === 'Due Report' && report && (
          <div className="space-y-3">
            <p className="font-semibold">Total Cost: Tk {report.totalCost?.toFixed(2)} | Total Meals: {report.totalMeals?.toFixed(2)} | Meal Rate: Tk {report.mealRate?.toFixed(2)}</p>
            {report.members?.map((row) => (
              <div key={row.memberId} className="grid grid-cols-5 rounded border p-2 text-sm">
                <span>{row.memberName}</span>
                <span>Meals: {row.meals.toFixed(2)}</span>
                <span>Gross: {row.gross.toFixed(2)}</span>
                <span>Adjusted: {row.adjusted.toFixed(2)}</span>
                <span>Due: {row.due.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
