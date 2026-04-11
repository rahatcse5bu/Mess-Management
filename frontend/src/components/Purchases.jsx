import { useState } from 'react';
import { Card, Header } from './Common';

export function PurchasesView({ purchases, members, onAddPurchase }) {
    const [form, setForm] = useState({
        date: new Date().toISOString().slice(0, 10),
        description: '',
        amount: '',
        paidByMemberId: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAddPurchase(form);
        setForm({
            date: new Date().toISOString().slice(0, 10),
            description: '',
            amount: '',
            paidByMemberId: '',
        });
    };

    const totalPurchases = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return (
        <div>
            <Header
                title="Purchases Management"
                subtitle="Track all mess expenses"
                icon="🛒"
            />

            {/* Add Purchase Form */}
            <Card className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Record New Purchase</h2>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-5">
                    <input
                        type="date"
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <input
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                    />
                    <select
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.paidByMemberId}
                        onChange={(e) => setForm({ ...form, paidByMemberId: e.target.value })}
                    >
                        <option value="">Paid By (optional)</option>
                        {members.map((m) => (
                            <option key={m._id} value={m._id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
                    >
                        Add
                    </button>
                </form>
            </Card>

            {/* Summary Card */}
            <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">Total Purchases</p>
                        <p className="text-4xl font-bold text-slate-900 mt-2">₹ {totalPurchases.toFixed(2)}</p>
                    </div>
                    <div className="text-5xl opacity-20">🛒</div>
                </div>
            </Card>

            {/* Purchases List */}
            <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Purchase History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Date</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Description</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Paid By</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-900">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                                        No purchases recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                purchases.slice().reverse().map((p) => (
                                    <tr key={p._id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-600">{new Date(p.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{p.description}</td>
                                        <td className="px-4 py-3 text-slate-600">{p.paidByMemberId?.name || '—'}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-900">₹ {p.amount}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
