import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon, XCircleIcon, BanknotesIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { adjustmentsApi, membersApi } from '../api';
import { Adjustment, AdjustmentType, Member } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import MonthSelector from '../components/MonthSelector';
import { formatDate, formatCurrency, getMonthRange, classNames } from '../utils/helpers';

export default function AdjustmentsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMember, setFilterMember] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [showVoided, setShowVoided] = useState(false);
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    memberId: '',
    amount: '',
    type: 'payment' as AdjustmentType,
    note: '',
  });

  useEffect(() => {
    loadData();
  }, [year, month, filterMember, filterType, showVoided]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { from, to } = getMonthRange(year, month);

      const [adjustmentsData, membersData] = await Promise.all([
        adjustmentsApi.getAll(from, to, filterMember || undefined, filterType || undefined, showVoided),
        membersApi.getAll(),
      ]);

      setAdjustments(adjustmentsData);
      setMembers(membersData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      date: formatDate(new Date()),
      memberId: '',
      amount: '',
      type: 'payment',
      note: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adjustmentsApi.create({
        date: formData.date,
        memberId: formData.memberId,
        amount: parseFloat(formData.amount),
        type: formData.type,
        note: formData.note,
      });
      toast.success('Adjustment added');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Failed to add adjustment');
    }
  };

  const handleVoid = async (adjustment: Adjustment) => {
    const reason = prompt('Enter reason for voiding this adjustment:');
    if (!reason) return;

    try {
      await adjustmentsApi.void(adjustment._id, reason);
      toast.success('Adjustment voided');
      loadData();
    } catch (error) {
      toast.error('Failed to void adjustment');
    }
  };

  const handleDelete = async (adjustment: Adjustment) => {
    if (!confirm('Are you sure you want to delete this adjustment?')) return;
    try {
      await adjustmentsApi.delete(adjustment._id);
      toast.success('Adjustment deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete adjustment');
    }
  };

  const getMemberName = (memberId: string | Member): string => {
    if (typeof memberId === 'string') {
      return members.find((m) => m._id === memberId)?.name || '-';
    }
    return memberId.name;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <BanknotesIcon className="h-5 w-5 text-green-500" />;
      case 'credit':
        return <ArrowDownIcon className="h-5 w-5 text-blue-500" />;
      case 'debit':
        return <ArrowUpIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'payment':
        return 'badge-success';
      case 'credit':
        return 'badge-info';
      case 'debit':
        return 'badge-danger';
      case 'settlement':
        return 'badge-warning';
      default:
        return '';
    }
  };

  // Calculate totals
  const totals = {
    payments: adjustments.filter((a) => a.type === 'payment' && !a.isVoided).reduce((sum, a) => sum + a.amount, 0),
    credits: adjustments.filter((a) => a.type === 'credit' && !a.isVoided).reduce((sum, a) => sum + a.amount, 0),
    debits: adjustments.filter((a) => a.type === 'debit' && !a.isVoided).reduce((sum, a) => sum + a.amount, 0),
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
          <h1 className="text-2xl font-bold text-gray-900">Adjustments</h1>
          <p className="text-gray-500 mt-1">Payments, credits, and due adjustments</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Adjustment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Payments</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(totals.payments)}</p>
            </div>
            <BanknotesIcon className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Credits</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(totals.credits)}</p>
            </div>
            <ArrowDownIcon className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Total Debits</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(totals.debits)}</p>
            </div>
            <ArrowUpIcon className="h-10 w-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />

        <div className="flex items-center gap-4">
          <select
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="input w-40"
          >
            <option value="">All Members</option>
            {members.filter(m => m.isActive).map((member) => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input w-36"
          >
            <option value="">All Types</option>
            <option value="payment">Payment</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="settlement">Settlement</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showVoided}
              onChange={(e) => setShowVoided(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show voided
          </label>
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Member</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th>Note</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((adjustment) => (
                <tr
                  key={adjustment._id}
                  className={classNames(adjustment.isVoided && 'opacity-50 line-through')}
                >
                  <td>{format(new Date(adjustment.date), 'MMM d, yyyy')}</td>
                  <td className="font-medium">{getMemberName(adjustment.memberId)}</td>
                  <td>
                    <span className={`badge ${getTypeBadgeClass(adjustment.type)}`}>
                      {adjustment.type}
                    </span>
                  </td>
                  <td className="text-right font-medium">{formatCurrency(adjustment.amount)}</td>
                  <td className="text-gray-500 text-sm max-w-xs truncate">
                    {adjustment.note}
                    {adjustment.isVoided && (
                      <span className="text-red-500 ml-2">(Voided: {adjustment.voidReason})</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      {!adjustment.isVoided && (
                        <button
                          onClick={() => handleVoid(adjustment)}
                          className="p-1 text-gray-400 hover:text-yellow-600"
                          title="Void"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(adjustment)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {adjustments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No adjustments found for this period.
          </div>
        )}
      </div>

      {/* Add Adjustment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Adjustment"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AdjustmentType })}
                className="input"
                required
              >
                <option value="payment">Payment (Member paid cash)</option>
                <option value="credit">Credit (Reduces due)</option>
                <option value="debit">Debit (Increases due)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member *</label>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className="input"
              required
            >
              <option value="">-- Select Member --</option>
              {members.filter(m => m.isActive).map((member) => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="input"
              rows={2}
              placeholder="e.g., Cash payment, Market expense adjustment"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
