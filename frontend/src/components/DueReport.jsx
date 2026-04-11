import { Card, Header } from './Common';
import { SkeletonCard, SkeletonTable } from './Skeleton';

export function DueReportView({ report, isLoading }) {
    if (!report) {
        return (
            <div>
                <Header
                    title="Financial Report"
                    subtitle="Dues and accounting summary"
                    icon="📈"
                />
                <Card className="text-center py-12">
                    <p className="text-slate-500">Loading report...</p>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <Header
                title="Financial Report"
                subtitle="Complete dues and accounting summary"
                icon="📈"
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
                    <p className="text-white/80 text-sm font-medium">Total Cost</p>
                    <p className="text-3xl font-bold mt-2">₹ {report.totalCost?.toFixed(2)}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
                    <p className="text-white/80 text-sm font-medium">Total Meals</p>
                    <p className="text-3xl font-bold mt-2">{report.totalMeals?.toFixed(2)}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
                    <p className="text-white/80 text-sm font-medium">Meal Rate</p>
                    <p className="text-3xl font-bold mt-2">₹ {report.mealRate?.toFixed(2)}</p>
                </div>
            </div>

            {/* Detailed Report Table */}
            <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Member-wise Breakdown</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 border-b-2 border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-4 font-semibold text-slate-900">Member Name</th>
                                <th className="text-right px-4 py-4 font-semibold text-slate-900">Meals</th>
                                <th className="text-right px-4 py-4 font-semibold text-slate-900">Gross Amount</th>
                                <th className="text-right px-4 py-4 font-semibold text-slate-900">Adjustments</th>
                                <th className="text-right px-4 py-4 font-semibold text-slate-900">Final Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.members?.map((row) => (
                                <tr key={row.memberId} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-4 font-semibold text-slate-900">{row.memberName}</td>
                                    <td className="px-4 py-4 text-right text-slate-600">{row.meals.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-right text-slate-600">₹ {row.gross.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-right text-slate-600">
                                        <span className={row.adjusted < 0 ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                                            ₹ {row.adjusted.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-4 text-right font-bold ${row.due >= 0
                                        ? 'text-red-600 bg-red-50'
                                        : 'text-green-600 bg-green-50'
                                        }`}>
                                        ₹ {row.due.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Footer */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs font-medium text-slate-600">Total Members</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{report.members?.length || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-600">Total Meals</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{report.totalMeals?.toFixed(1) || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-600">Total Cost</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">₹ {report.totalCost?.toFixed(0) || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-600">Per Meal Rate</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">₹ {report.mealRate?.toFixed(2) || 0}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
