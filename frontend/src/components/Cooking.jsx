import { useState } from 'react';
import { Card, Header } from './Common';

export function CookingView({ members, history, cookForm, upcoming, currentCooker, onSaveConfig, onMoveOrder, onManualAssign, onDeleteHistory }) {
    const [termDays, setTermDays] = useState(cookForm.termDays);

    // Manual assign form
    const [assignForm, setAssignForm] = useState({
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        memberId: '',
        note: '',
    });

    const handleSave = async () => {
        await onSaveConfig(termDays);
    };

    const handleManualAssign = async (e) => {
        e.preventDefault();
        await onManualAssign(assignForm);
        setAssignForm({
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            memberId: '',
            note: '',
        });
    };

    const todayCookerName = currentCooker?.memberId?.name || currentCooker?.memberId || null;

    return (
        <div>
            <Header
                title="Cooking Schedule"
                subtitle="Manage cooker rotation, force assignments, and view history"
                icon="👨‍🍳"
            />

            {/* Today's Cooker */}
            {todayCookerName && (
                <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Today's Cook</p>
                            <p className="text-3xl font-bold mt-1">{todayCookerName}</p>
                            {currentCooker?.source && (
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${currentCooker.source === 'manual'
                                    ? 'bg-white/30 text-white'
                                    : 'bg-white/20 text-white/90'
                                    }`}>
                                    {currentCooker.source === 'manual' ? 'Manually Assigned' : 'Auto Rotation'}
                                </span>
                            )}
                        </div>
                        <span className="text-6xl opacity-30">👨‍🍳</span>
                    </div>
                </div>
            )}

            {/* Force / Manual Assign */}
            <Card className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Force Assign Cooker</h2>
                <p className="text-sm text-slate-500 mb-4">Override the rotation for a specific date or range. This won't affect auto-rotation config.</p>
                <form onSubmit={handleManualAssign} className="grid gap-4 md:grid-cols-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={assignForm.startDate}
                            onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={assignForm.endDate}
                            onChange={(e) => setAssignForm({ ...assignForm, endDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Assign To</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={assignForm.memberId}
                            onChange={(e) => setAssignForm({ ...assignForm, memberId: e.target.value })}
                            required
                        >
                            <option value="">Select Member</option>
                            {members.map((m) => (
                                <option key={m._id} value={m._id}>{m.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Note (optional)</label>
                        <input
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Swap with Ali"
                            value={assignForm.note}
                            onChange={(e) => setAssignForm({ ...assignForm, note: e.target.value })}
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold"
                        >
                            Force Assign
                        </button>
                    </div>
                </form>
            </Card>

            {/* Configuration — future only */}
            <Card className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Rotation Config</h2>
                        <p className="text-sm text-slate-500 mt-1">Changes only apply to future auto-assignments. Past and forced entries stay as-is.</p>
                    </div>
                </div>
                <div className="flex items-end gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Term Days</label>
                        <input
                            type="number"
                            min="1"
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={termDays}
                            onChange={(e) => setTermDays(Number(e.target.value))}
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                    >
                        Save Config (Future Only)
                    </button>
                </div>
            </Card>

            {/* Cooker Rotation Order */}
            <Card className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Cooker Rotation Order</h2>
                <p className="text-sm text-slate-600 mb-4">Reorder members for future rotation. Use up/down buttons to change order.</p>
                <div className="space-y-2">
                    {cookForm.memberOrder && cookForm.memberOrder.map((id, i) => {
                        const member = members.find((m) => m._id === id);
                        if (!member) return null;
                        return (
                            <div
                                key={id}
                                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-slate-400 w-8">#{i + 1}</span>
                                    <span className="font-semibold text-slate-900">{member.name}</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {termDays} days
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onMoveOrder(i, -1)}
                                        disabled={i === 0}
                                        className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        ↑ Up
                                    </button>
                                    <button
                                        onClick={() => onMoveOrder(i, 1)}
                                        disabled={i === cookForm.memberOrder.length - 1}
                                        className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Down ↓
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Upcoming Preview */}
            {upcoming && upcoming.length > 0 && (
                <Card className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Upcoming Schedule (Next 14 Days)</h2>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {upcoming.slice(0, 14).map((entry) => {
                            const isManual = entry.source === 'manual';
                            const dateStr = new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                            const isToday = new Date(entry.date).toDateString() === new Date().toDateString();
                            return (
                                <div
                                    key={entry._id || entry.date}
                                    className={`flex items-center justify-between p-3 rounded-lg border ${isToday
                                        ? 'border-orange-300 bg-orange-50'
                                        : 'border-slate-200 bg-slate-50'
                                        }`}
                                >
                                    <div>
                                        <p className={`text-sm font-semibold ${isToday ? 'text-orange-700' : 'text-slate-900'}`}>
                                            {dateStr} {isToday && '(Today)'}
                                        </p>
                                        <p className="text-xs text-slate-500">{entry.memberId?.name || 'TBD'}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded font-semibold ${isManual
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {isManual ? 'forced' : 'auto'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {/* Full Cooking History */}
            <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Cooking History</h2>
                <p className="text-sm text-slate-500 mb-4">Full record — includes auto-rotation and forced/manual entries.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Date</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Member</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Source</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-900">Note</th>
                                <th className="text-center px-4 py-3 font-semibold text-slate-900">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                                        No cooking history yet.
                                    </td>
                                </tr>
                            ) : (
                                history.slice(0, 30).map((h) => (
                                    <tr key={h._id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-600">{new Date(h.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{h.memberId?.name || 'Unknown'}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${h.source === 'manual'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {h.source === 'manual' ? 'forced' : 'auto'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{h.note || '—'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => onDeleteHistory(h._id)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-xs font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
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
