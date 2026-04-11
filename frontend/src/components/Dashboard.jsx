import { useState } from 'react';
import { Card, Button, Header } from './Common';

export function DashboardView({
    members,
    purchases,
    history,
    report,
    adjustments
}) {
    const totalMembers = members.length;
    const totalPurchases = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalMeals = report?.totalMeals || 0;
    const mealRate = report?.mealRate || 0;

    return (
        <div>
            <Header
                title="Dashboard"
                subtitle="Key metrics and overview"
                icon="📊"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Members" value={totalMembers} icon="👥" color="blue" />
                <StatCard label="Total Purchases" value={`₹ ${totalPurchases.toFixed(0)}`} icon="🛒" color="green" />
                <StatCard label="Total Meals" value={totalMeals.toFixed(1)} icon="🍽️" color="orange" />
                <StatCard label="Meal Rate" value={`₹ ${mealRate.toFixed(2)}`} icon="📈" color="purple" />
            </div>

            {/* Quick Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Purchases */}
                <Card>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Purchases</h2>
                    <div className="space-y-3">
                        {purchases.slice(0, 5).map((p) => (
                            <div key={p._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">{p.description}</p>
                                    <p className="text-xs text-slate-500">{new Date(p.date).toLocaleDateString()}</p>
                                </div>
                                <p className="font-bold text-slate-900">₹ {p.amount}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Cooking */}
                <Card>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Cooking Schedule</h2>
                    <div className="space-y-3">
                        {history.slice(0, 5).map((h) => (
                            <div key={h._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">{h.memberId?.name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString()}</p>
                                </div>
                                <Badge color="blue">{h.source}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Full Report Summary */}
            {report && (
                <Card className="mt-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Finance Summary</h2>
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="text-sm text-slate-600">Total Cost</p>
                            <p className="text-2xl font-bold text-slate-900">₹ {report.totalCost?.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Meals</p>
                            <p className="text-2xl font-bold text-slate-900">{report.totalMeals?.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Meal Rate</p>
                            <p className="text-2xl font-bold text-slate-900">₹ {report.mealRate?.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-900">Member</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-900">Meals</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-900">Gross</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-900">Adjusted</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-900">Due</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.members?.map((row) => (
                                    <tr key={row.memberId} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-900 font-medium">{row.memberName}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">{row.meals.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">₹ {row.gross.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">₹ {row.adjusted.toFixed(2)}</td>
                                        <td className={`px-4 py-3 text-right font-semibold ${row.due >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            ₹ {row.due.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}

function StatCard({ label, value, icon, color = 'blue' }) {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        orange: 'from-orange-500 to-orange-600',
        purple: 'from-purple-500 to-purple-600',
    };

    return (
        <div className={`rounded-xl bg-gradient-to-br ${colors[color]} p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <span className="text-4xl opacity-20">{icon}</span>
            </div>
        </div>
    );
}

function Badge({ children, color = 'blue' }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
            {children}
        </span>
    );
}
