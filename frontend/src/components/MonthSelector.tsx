import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getMonthName, getPreviousMonth, getNextMonth } from '../utils/helpers';

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export default function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const handlePrevious = () => {
    const prev = getPreviousMonth(year, month);
    onChange(prev.year, prev.month);
  };

  const handleNext = () => {
    const next = getNextMonth(year, month);
    onChange(next.year, next.month);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePrevious}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
      </button>
      <span className="text-lg font-semibold text-gray-900 min-w-[150px] text-center">
        {getMonthName(month)} {year}
      </span>
      <button
        onClick={handleNext}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}
