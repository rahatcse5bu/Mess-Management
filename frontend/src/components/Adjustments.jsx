import { useState } from 'react';
import { Card, Header } from './Common';
import { SkeletonCard, SkeletonTable } from './Skeleton';

export function AdjustmentsView({ members, adjustments, onAddAdjustment, isLoading }) {
    const [form, setForm] = useState({
        date: new Date().toISOString().slice(0, 10),
        memberId: '',
        amount: '',
        type: 'payment',
        note: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAddAdjustment(form);
        setForm({
            date: new Date().toISOString().slice(0, 10),
            memberId: '',
            amount: '',
            type: 'payment',
            note: '',
        });
    };

    const typeColors = {
        payment: 'bg-green-100 text-green-800',
        credit: 'bg-blue-100 text-blue-800',
        debit: 'bg-red-100 text-red-800',
    };

    return (
        <div>
            <Header
                title="Account Adjustments"
                subtitle="Manual account corrections and adjustments"
                icon="⚙️"
            />

            {/* Add Adjustment Form */}
            <Card className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Adjustment</h2>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-5">
                    <input
                        type="date"
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <select
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.memberId}
                        onChange={(e) => setForm({ ...form, memberId: e.target.value })}
                        required
                    >
                        <option value="">Select Member</option>
                        {members.map((m) => (
                            <option key={m._id} value={m._id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
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
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        <option value="payment">Payment</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold"
                    >
                        Add
                    </button>
                </form>
            </Card>

            {/* Adjustments List */}
            <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Adjustment History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Date</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Member</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Type</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-900">Amount</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                                        No adjustments recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                adjustments.slice().reverse().map((a) => (
                                    <tr key={a._id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-600">{new Date(a.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{a.memberId?.name || 'Unknown'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${typeColors[a.type]}`}>
                                                {a.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-900">₹ {a.amount}</td>
                                        <td className="px-4 py-3 text-slate-600 text-xs">{a.note || '—'}</td>
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
