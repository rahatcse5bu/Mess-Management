import { formatAmount } from '../utils/format';

export default function DueReportTab({ report }) {
  if (!report) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="font-semibold">
        Total Cost: Tk {formatAmount(report.totalCost)} | Total Meals:{' '}
        {formatAmount(report.totalMeals)} | Meal Rate: Tk{' '}
        {formatAmount(report.mealRate)}
      </p>

      {report.members?.map((row) => (
        <div
          key={row.memberId}
          className="grid grid-cols-5 rounded border p-2 text-sm"
        >
          <span>{row.memberName}</span>
          <span>Meals: {formatAmount(row.meals)}</span>
          <span>Gross: {formatAmount(row.gross)}</span>
          <span>Adjusted: {formatAmount(row.adjusted)}</span>
          <span>Due: {formatAmount(row.due)}</span>
        </div>
      ))}
    </div>
  );
}
