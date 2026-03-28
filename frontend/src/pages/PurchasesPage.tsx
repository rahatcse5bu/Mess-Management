import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { purchasesApi, membersApi } from '../api';
import { Purchase, Member } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import MonthSelector from '../components/MonthSelector';
import { formatDate, formatCurrency, getMonthRange } from '../utils/helpers';

export default function PurchasesPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    description: '',
    amount: '',
    category: 'general',
    paidByMemberId: '',
    note: '',
  });

  useEffect(() => {
    loadData();
  }, [year, month, filterCategory]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { from, to } = getMonthRange(year, month);

      const [purchasesData, membersData, categoriesData] = await Promise.all([
        purchasesApi.getAll(from, to, filterCategory || undefined),
        membersApi.getAll(),
        purchasesApi.getCategories(),
      ]);

      setPurchases(purchasesData);
      setMembers(membersData);
      setCategories(['general', ...categoriesData.filter((c) => c !== 'general')]);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPurchase(null);
    setFormData({
      date: formatDate(new Date()),
      description: '',
      amount: '',
      category: 'general',
      paidByMemberId: '',
      note: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setFormData({
      date: formatDate(new Date(purchase.date)),
      description: purchase.description,
      amount: purchase.amount.toString(),
      category: purchase.category,
      paidByMemberId: typeof purchase.paidByMemberId === 'string'
        ? purchase.paidByMemberId
        : (purchase.paidByMemberId as Member)?._id || '',
      note: purchase.note || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        paidByMemberId: formData.paidByMemberId || undefined,
      };

      if (editingPurchase) {
        await purchasesApi.update(editingPurchase._id, data);
        toast.success('Purchase updated');
      } else {
        await purchasesApi.create(data);
        toast.success('Purchase added');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Failed to save purchase');
    }
  };

  const handleDelete = async (purchase: Purchase) => {
    if (!confirm('Are you sure you want to delete this purchase?')) return;
    try {
      await purchasesApi.delete(purchase._id);
      toast.success('Purchase deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete purchase');
    }
  };

  const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);

  const getMemberName = (paidBy: string | Member | undefined): string => {
    if (!paidBy) return '-';
    if (typeof paidBy === 'string') {
      return members.find((m) => m._id === paidBy)?.name || '-';
    }
    return paidBy.name;
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
          <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
          <p className="text-gray-500 mt-1">Market and expense management</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Purchase
        </button>
      </div>

      {/* Month Selector and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />

        <div className="flex items-center gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input w-40"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Paid By</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>{format(new Date(purchase.date), 'MMM d, yyyy')}</td>
                  <td className="font-medium">{purchase.description}</td>
                  <td>
                    <span className="badge badge-info">{purchase.category}</span>
                  </td>
                  <td>{getMemberName(purchase.paidByMemberId)}</td>
                  <td className="text-right font-medium">{formatCurrency(purchase.amount)}</td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(purchase)}
                        className="p-1 text-gray-400 hover:text-primary-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(purchase)}
                        className="p-1 text-gray-400 hover:text-red-600"
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

        {purchases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No purchases found for this period.
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPurchase ? 'Edit Purchase' : 'Add Purchase'}
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              placeholder="e.g., Vegetables, Rice, Fish"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
              <select
                value={formData.paidByMemberId}
                onChange={(e) => setFormData({ ...formData, paidByMemberId: e.target.value })}
                className="input"
              >
                <option value="">-- Select Member --</option>
                {members.filter(m => m.isActive).map((member) => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="input"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPurchase ? 'Update' : 'Add'} Purchase
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
