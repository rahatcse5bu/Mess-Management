import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { reportsApi } from '../api';
import { DueSummaryReport } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import MonthSelector from '../components/MonthSelector';
import { formatCurrency, getMonthRange, classNames } from '../utils/helpers';

export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [report, setReport] = useState<DueSummaryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [year, month]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const { from, to } = getMonthRange(year, month);
      const data = await reportsApi.getDueSummary(from, to);
      setReport(data);
    } catch (error) {
      toast.error('Failed to load report');
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

  if (!report) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load report data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Due Summary Report</h1>
          <p className="text-gray-500 mt-1">Monthly expense and due calculations</p>
        </div>
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(report.totalPurchases)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Meals</p>
          <p className="text-2xl font-bold text-gray-900">{report.totalMeals}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Meal Rate</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(report.mealRate)}</p>
          <p className="text-xs text-gray-400">per meal</p>
        </div>
        <div className="card bg-orange-50">
          <p className="text-sm text-orange-600">Net Balance</p>
          <p className="text-2xl font-bold text-orange-700">{formatCurrency(report.balance)}</p>
          <p className="text-xs text-orange-500">to be collected</p>
        </div>
      </div>

      {/* Member Due Table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Member-wise Summary</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th className="text-center">Meals</th>
                <th className="text-right">Meal Cost</th>
                <th className="text-right">Purchases Paid</th>
                <th className="text-right">Payments</th>
                <th className="text-right">Credits</th>
                <th className="text-right">Debits</th>
                <th className="text-right">Total Adjusted</th>
                <th className="text-right">Net Due</th>
              </tr>
            </thead>
            <tbody>
              {report.members.map((member) => (
                <tr key={member.memberId}>
                  <td className="font-medium">{member.memberName}</td>
                  <td className="text-center">{member.totalMeals}</td>
                  <td className="text-right">{formatCurrency(member.mealCost)}</td>
                  <td className="text-right text-green-600">{formatCurrency(member.purchasesPaid)}</td>
                  <td className="text-right text-green-600">{formatCurrency(member.payments)}</td>
                  <td className="text-right text-blue-600">{formatCurrency(member.credits)}</td>
                  <td className="text-right text-red-600">{formatCurrency(member.debits)}</td>
                  <td className="text-right font-medium">{formatCurrency(member.totalAdjusted)}</td>
                  <td className="text-right">
                    <span
                      className={classNames(
                        'font-bold',
                        member.netDue > 0 ? 'text-red-600' : member.netDue < 0 ? 'text-green-600' : 'text-gray-600'
                      )}
                    >
                      {formatCurrency(member.netDue)}
                      {member.netDue > 0 ? (
                        <ArrowTrendingUpIcon className="inline h-4 w-4 ml-1" />
                      ) : member.netDue < 0 ? (
                        <ArrowTrendingDownIcon className="inline h-4 w-4 ml-1" />
                      ) : null}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td>Total</td>
                <td className="text-center">{report.totalMeals}</td>
                <td className="text-right">{formatCurrency(report.totalDue)}</td>
                <td className="text-right text-green-600">
                  {formatCurrency(report.members.reduce((sum, m) => sum + m.purchasesPaid, 0))}
                </td>
                <td className="text-right text-green-600">
                  {formatCurrency(report.members.reduce((sum, m) => sum + m.payments, 0))}
                </td>
                <td className="text-right text-blue-600">
                  {formatCurrency(report.members.reduce((sum, m) => sum + m.credits, 0))}
                </td>
                <td className="text-right text-red-600">
                  {formatCurrency(report.members.reduce((sum, m) => sum + m.debits, 0))}
                </td>
                <td className="text-right">{formatCurrency(report.totalPaid)}</td>
                <td className="text-right text-orange-600">{formatCurrency(report.balance)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Explanation */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-2">Understanding the Report</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>Meal Cost:</strong> Total meals x Meal Rate</li>
          <li><strong>Purchases Paid:</strong> Market expenses paid by the member (reduces their due)</li>
          <li><strong>Payments:</strong> Cash payments made to the mess</li>
          <li><strong>Credits:</strong> Additional reductions to due</li>
          <li><strong>Debits:</strong> Additional charges to due</li>
          <li><strong>Total Adjusted:</strong> Payments + Credits - Debits</li>
          <li><strong>Net Due:</strong> Meal Cost - Purchases Paid - Total Adjusted</li>
          <li className="pt-2"><span className="text-red-600">Positive Net Due</span> = Member owes money</li>
          <li><span className="text-green-600">Negative Net Due</span> = Mess owes money to member</li>
        </ul>
      </div>
    </div>
  );
}
