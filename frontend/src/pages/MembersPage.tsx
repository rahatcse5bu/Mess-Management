import { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { membersApi } from '../api';
import { Member } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    canCook: true,
  });

  useEffect(() => {
    loadMembers();
  }, [showInactive]);

  const loadMembers = async () => {
    try {
      const data = await membersApi.getAll(showInactive);
      setMembers(data);
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({ name: '', email: '', phone: '', canCook: true });
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email || '',
      phone: member.phone || '',
      canCook: member.canCook,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await membersApi.update(editingMember._id, formData);
        toast.success('Member updated successfully');
      } else {
        await membersApi.create(formData);
        toast.success('Member added successfully');
      }
      setIsModalOpen(false);
      loadMembers();
    } catch (error) {
      toast.error('Failed to save member');
    }
  };

  const handleDelete = async (member: Member) => {
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) return;
    try {
      await membersApi.delete(member._id);
      toast.success('Member deleted successfully');
      loadMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const handleToggleActive = async (member: Member) => {
    try {
      if (member.isActive) {
        await membersApi.deactivate(member._id);
        toast.success('Member deactivated');
      } else {
        await membersApi.reactivate(member._id);
        toast.success('Member reactivated');
      }
      loadMembers();
    } catch (error) {
      toast.error('Failed to update member status');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500 mt-1">Manage mess members</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Member
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Show inactive members
        </label>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Can Cook</th>
                <th>Status</th>
                <th>Order</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id}>
                  <td className="font-medium">{member.name}</td>
                  <td>{member.email || '-'}</td>
                  <td>{member.phone || '-'}</td>
                  <td>
                    <span className={`badge ${member.canCook ? 'badge-success' : 'badge-warning'}`}>
                      {member.canCook ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${member.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{member.cookerOrder + 1}</td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(member)}
                        className="p-1 text-gray-400 hover:text-primary-600"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(member)}
                        className="p-1 text-gray-400 hover:text-yellow-600"
                        title={member.isActive ? 'Deactivate' : 'Reactivate'}
                      >
                        {member.isActive ? (
                          <UserMinusIcon className="h-5 w-5" />
                        ) : (
                          <UserPlusIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(member)}
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

        {members.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No members found. Click "Add Member" to get started.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Member' : 'Add Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="canCook"
              checked={formData.canCook}
              onChange={(e) => setFormData({ ...formData, canCook: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="canCook" className="text-sm text-gray-700">
              Can cook (include in cooking rotation)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingMember ? 'Update' : 'Add'} Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
