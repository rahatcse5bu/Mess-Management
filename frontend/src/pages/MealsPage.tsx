import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import toast from 'react-hot-toast';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { mealsApi, membersApi } from '../api';
import { Member, MealDay } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { formatDate } from '../utils/helpers';

export default function MealsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [members, setMembers] = useState<Member[]>([]);
  const [mealDays, setMealDays] = useState<MealDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealEntries, setMealEntries] = useState<Record<string, { breakfast: number; lunch: number; dinner: number }>>({});
  const [mealElements, setMealElements] = useState<string[]>([]);
  const [newElement, setNewElement] = useState('');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const from = formatDate(monthStart);
      const to = formatDate(monthEnd);

      const [membersData, mealsData] = await Promise.all([
        membersApi.getAll(),
        mealsApi.getMealDaysInRange(from, to),
      ]);

      setMembers(membersData);
      setMealDays(mealsData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const getMealDataForDay = (date: Date): MealDay | undefined => {
    return mealDays.find((md) => isSameDay(new Date(md.date), date));
  };

  const getTotalMealsForDay = (date: Date): number => {
    const mealDay = getMealDataForDay(date);
    if (!mealDay) return 0;
    return mealDay.entries.reduce((sum, e) => sum + e.totalMeals, 0);
  };

  const openDayModal = (date: Date) => {
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);

    const existingMealDay = getMealDataForDay(date);
    const entries: Record<string, { breakfast: number; lunch: number; dinner: number }> = {};

    members.forEach((member) => {
      const entry = existingMealDay?.entries.find(
        (e) => (typeof e.memberId === 'string' ? e.memberId : (e.memberId as Member)._id) === member._id
      );
      entries[member._id] = {
        breakfast: entry?.breakfast ?? 1,
        lunch: entry?.lunch ?? 1,
        dinner: entry?.dinner ?? 1,
      };
    });

    setMealEntries(entries);
    setMealElements(existingMealDay?.elements || []);
    setIsModalOpen(true);
  };

  const handleMealChange = (memberId: string, meal: 'breakfast' | 'lunch' | 'dinner', value: number) => {
    setMealEntries((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [meal]: Math.max(0, value),
      },
    }));
  };

  const addElement = () => {
    if (newElement.trim() && !mealElements.includes(newElement.trim())) {
      setMealElements([...mealElements, newElement.trim()]);
      setNewElement('');
    }
  };

  const removeElement = (element: string) => {
    setMealElements(mealElements.filter((e) => e !== element));
  };

  const saveMealDay = async () => {
    if (!selectedDate) return;

    try {
      const entries = Object.entries(mealEntries).map(([memberId, meals]) => ({
        memberId,
        breakfast: meals.breakfast,
        lunch: meals.lunch,
        dinner: meals.dinner,
        totalMeals: meals.breakfast + meals.lunch + meals.dinner,
      }));

      await mealsApi.upsertMealDay({
        date: selectedDate,
        entries,
        elements: mealElements,
      });

      toast.success('Meal data saved');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Failed to save meal data');
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meals</h1>
          <p className="text-gray-500 mt-1">Daily meal tracking for each member</p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold min-w-[180px] text-center">
          {format(currentDate, 'MMMM yyyy')}
        </span>
        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="card">
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {/* Day cells */}
          {daysInMonth.map((day) => {
            const totalMeals = getTotalMealsForDay(day);
            const isToday = isSameDay(day, new Date());
            const hasMeals = totalMeals > 0;

            return (
              <button
                key={day.toISOString()}
                onClick={() => openDayModal(day)}
                className={`p-2 min-h-[80px] rounded-lg border text-left transition-colors ${
                  isToday
                    ? 'border-primary-500 bg-primary-50'
                    : hasMeals
                    ? 'border-green-200 bg-green-50 hover:bg-green-100'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`text-sm font-medium ${isToday ? 'text-primary-600' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </div>
                {hasMeals && (
                  <div className="mt-1 text-xs text-green-700 font-medium">{totalMeals} meals</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Meals for ${selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy') : ''}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Meal Elements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Items (What's for meal today?)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addElement())}
                placeholder="Add food item..."
                className="input flex-1"
              />
              <button onClick={addElement} className="btn btn-secondary">
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mealElements.map((element) => (
                <span
                  key={element}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {element}
                  <button onClick={() => removeElement(element)} className="text-gray-400 hover:text-red-500">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Member Meals Table */}
          <div className="table-container max-h-[400px] overflow-y-auto">
            <table className="table">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th>Member</th>
                  <th className="text-center">Breakfast</th>
                  <th className="text-center">Lunch</th>
                  <th className="text-center">Dinner</th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {members.filter(m => m.isActive).map((member) => (
                  <tr key={member._id}>
                    <td className="font-medium">{member.name}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={mealEntries[member._id]?.breakfast ?? 0}
                        onChange={(e) => handleMealChange(member._id, 'breakfast', parseInt(e.target.value) || 0)}
                        className="input w-16 text-center mx-auto"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={mealEntries[member._id]?.lunch ?? 0}
                        onChange={(e) => handleMealChange(member._id, 'lunch', parseInt(e.target.value) || 0)}
                        className="input w-16 text-center mx-auto"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={mealEntries[member._id]?.dinner ?? 0}
                        onChange={(e) => handleMealChange(member._id, 'dinner', parseInt(e.target.value) || 0)}
                        className="input w-16 text-center mx-auto"
                      />
                    </td>
                    <td className="text-center font-semibold">
                      {(mealEntries[member._id]?.breakfast ?? 0) +
                        (mealEntries[member._id]?.lunch ?? 0) +
                        (mealEntries[member._id]?.dinner ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={saveMealDay} className="btn btn-primary">
              Save Meals
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
