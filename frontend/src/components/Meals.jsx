import { useCallback, useEffect, useState } from 'react';
import { Card, Header } from './Common';
import { SkeletonCard } from './Skeleton';

export function MealsView({ members, client, onSubmitMeals, isLoading }) {
    const [form, setForm] = useState({
        date: new Date().toISOString().slice(0, 10),
        elements: '',
        entries: {},
        guests: {},
    });

    // Guest-for-all shortcut
    const [guestForAll, setGuestForAll] = useState('');

    // History state
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [historyFrom, setHistoryFrom] = useState(thirtyDaysAgo.toISOString().slice(0, 10));
    const [historyTo, setHistoryTo] = useState(today.toISOString().slice(0, 10));
    const [mealHistory, setMealHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const loadHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const res = await client.get('/meals/days', {
                params: { from: historyFrom, to: historyTo },
            });
            setMealHistory(res.data);
        } catch (err) {
            console.error('Failed to load meal history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, [client, historyFrom, historyTo]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmitMeals({
            ...form,
            guests: form.guests,
        });
        setForm({
            date: new Date().toISOString().slice(0, 10),
            elements: '',
            entries: {},
            guests: {},
        });
        setGuestForAll('');
        loadHistory();
    };

    const applyGuestForAll = () => {
        const count = Number(guestForAll);
        if (!count || count <= 0) return;
        const newGuests = { ...form.guests };
        members.forEach((m) => {
            newGuests[m._id] = (Number(newGuests[m._id]) || 0) + count;
        });
        setForm({ ...form, guests: newGuests });
        setGuestForAll('');
    };

    const handleEditDay = (day) => {
        const entriesMap = {};
        const guestsMap = {};
        (day.entries || []).forEach((e) => {
            const id = e.memberId?._id || e.memberId;
            entriesMap[id] = e.mealCount;
            if (e.guestCount) guestsMap[id] = e.guestCount;
        });
        setForm({
            date: new Date(day.date).toISOString().slice(0, 10),
            elements: (day.elements || []).join(', '),
            entries: entriesMap,
            guests: guestsMap,
        });
    };

    return (
        <div>
            <Header
                title="Meal Management"
                subtitle="Record daily meals, guest portions, and view history"
                icon="🍽️"
            />

            {/* Add / Edit Meal Form */}
            <Card className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Record Meal Day</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date & Elements */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Meal Elements</label>
                            <input
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Rice, Fish, Dal, Salad"
                                value={form.elements}
                                onChange={(e) => setForm({ ...form, elements: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Guest for All shortcut */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <label className="block text-sm font-semibold text-amber-900 mb-2">Add Guest Portions for All Members</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                className="w-32 px-3 py-2 border border-amber-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Count"
                                value={guestForAll}
                                onChange={(e) => setGuestForAll(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={applyGuestForAll}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-semibold text-sm"
                            >
                                + Add to All
                            </button>
                            <span className="text-xs text-amber-700">Adds guest count to every member below</span>
                        </div>
                    </div>

                    {/* Member Meal + Guest Entries */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-4">Member Meal Portions</label>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {members.map((member) => (
                                <div key={member._id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <p className="font-medium text-slate-900 mb-2">{member.name}</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="block text-xs text-slate-500 mb-1">Meals</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                className="w-full px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                                value={form.entries[member._id] ?? ''}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        entries: { ...form.entries, [member._id]: e.target.value },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs text-amber-600 mb-1">Guests</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                className="w-full px-2 py-1 border border-amber-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                placeholder="0"
                                                value={form.guests[member._id] ?? ''}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        guests: { ...form.guests, [member._id]: e.target.value },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        >
                            Save Meal Record
                        </button>
                    </div>
                </form>
            </Card>

            {/* Meal History */}
            <Card>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Meal History</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-600">From</label>
                            <input
                                type="date"
                                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={historyFrom}
                                onChange={(e) => setHistoryFrom(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-600">To</label>
                            <input
                                type="date"
                                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={historyTo}
                                onChange={(e) => setHistoryTo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {loadingHistory ? (
                    <p className="text-center text-slate-500 py-8">Loading...</p>
                ) : mealHistory.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No meal records found for this period.</p>
                ) : (
                    <div className="space-y-4">
                        {mealHistory.slice().reverse().map((day) => {
                            const totalMeals = (day.entries || []).reduce((sum, e) => sum + (e.mealCount || 0), 0);
                            const totalGuests = (day.entries || []).reduce((sum, e) => sum + (e.guestCount || 0), 0);
                            const dateStr = new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                            return (
                                <div
                                    key={day._id}
                                    className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                                >
                                    {/* Day header */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
                                        <div>
                                            <p className="font-semibold text-slate-900">{dateStr}</p>
                                            {day.elements && day.elements.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {day.elements.map((el, i) => (
                                                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{el}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-slate-700">Meals: {totalMeals}</span>
                                                {totalGuests > 0 && (
                                                    <span className="text-sm font-bold text-amber-600 ml-2">Guests: {totalGuests}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleEditDay(day)}
                                                className="px-3 py-1 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>

                                    {/* Member entries */}
                                    <div className="p-4">
                                        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                            {(day.entries || []).filter((e) => e.mealCount > 0 || e.guestCount > 0).map((entry) => {
                                                const name = entry.memberId?.name || 'Unknown';
                                                return (
                                                    <div key={entry.memberId?._id || entry.memberId} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                                                        <span className="text-sm text-slate-700">{name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-slate-900">{entry.mealCount}</span>
                                                            {entry.guestCount > 0 && (
                                                                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">+{entry.guestCount}g</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
