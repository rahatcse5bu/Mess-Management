import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import { ArrowsUpDownIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import { cookingApi, membersApi } from '../api';
import { Member, CookerConfig, CookingPreview } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { formatDate } from '../utils/helpers';

export default function CookingPage() {
  const [config, setConfig] = useState<CookerConfig | null>(null);
  const [preview, setPreview] = useState<CookingPreview[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [termDays, setTermDays] = useState(2);
  const [memberOrder, setMemberOrder] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [configData, membersData] = await Promise.all([
        cookingApi.getConfig(60),
        membersApi.getActiveCookers(),
      ]);

      setConfig(configData.config);
      setPreview(configData.preview);
      setMembers(membersData);
      setTermDays(configData.config.termDays);
      setMemberOrder(configData.config.memberOrder.map((m: any) => (typeof m === 'string' ? m : m._id)));
    } catch (error) {
      toast.error('Failed to load cooking data');
    } finally {
      setIsLoading(false);
    }
  };

  const openConfigModal = () => {
    setIsConfigModalOpen(true);
  };

  const saveConfig = async () => {
    try {
      await cookingApi.updateConfig({ termDays });
      await cookingApi.reorderMembers(memberOrder);
      toast.success('Configuration saved');
      setIsConfigModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  const openAssignModal = (date: string) => {
    setSelectedDate(date);
    const currentAssignment = preview.find((p) => p.date === date);
    setSelectedMemberId(currentAssignment?.memberId || '');
    setIsAssignModalOpen(true);
  };

  const saveManualAssign = async () => {
    if (!selectedDate || !selectedMemberId) return;

    try {
      await cookingApi.manualAssign({
        date: selectedDate,
        memberId: selectedMemberId,
        note: 'Manual assignment',
      });
      toast.success('Cooker assigned');
      setIsAssignModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Failed to assign cooker');
    }
  };

  const moveMember = (index: number, direction: number) => {
    const newOrder = [...memberOrder];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    setMemberOrder(newOrder);
  };

  const getMemberName = (memberId: string): string => {
    return members.find((m) => m._id === memberId)?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Group preview by cooker (consecutive days)
  const groupedSchedule: { memberId: string; memberName: string; dates: string[]; source: string }[] = [];
  let currentGroup: typeof groupedSchedule[0] | null = null;

  preview.forEach((item) => {
    if (currentGroup && currentGroup.memberId === item.memberId) {
      currentGroup.dates.push(item.date);
    } else {
      if (currentGroup) groupedSchedule.push(currentGroup);
      currentGroup = {
        memberId: item.memberId,
        memberName: item.memberName,
        dates: [item.date],
        source: item.source,
      };
    }
  });
  if (currentGroup) groupedSchedule.push(currentGroup);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cooking Schedule</h1>
          <p className="text-gray-500 mt-1">
            Rotation: {config?.termDays} day(s) per cooker
          </p>
        </div>
        <button onClick={openConfigModal} className="btn btn-secondary flex items-center gap-2">
          <Cog6ToothIcon className="h-5 w-5" />
          Configure
        </button>
      </div>

      {/* Current Cooker */}
      {preview.length > 0 && (
        <div className="card bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <UserIcon className="h-10 w-10" />
            </div>
            <div>
              <p className="text-white/80">Today's Cooker</p>
              <p className="text-3xl font-bold">{preview[0].memberName}</p>
              <p className="text-white/80 text-sm">
                {preview[0].source === 'manual' ? '(Manually Assigned)' : '(Auto Rotation)'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Upcoming Schedule (Next 60 Days)</h2>
        <div className="space-y-2">
          {groupedSchedule.map((group, index) => (
            <div
              key={`${group.memberId}-${index}`}
              className={`flex items-center justify-between p-4 rounded-lg ${
                index === 0 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    index === 0 ? 'bg-orange-500' : 'bg-gray-400'
                  }`}
                >
                  {group.memberName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{group.memberName}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(group.dates[0]), 'MMM d')}
                    {group.dates.length > 1 &&
                      ` - ${format(new Date(group.dates[group.dates.length - 1]), 'MMM d')}`}
                    {' '}({group.dates.length} day{group.dates.length > 1 ? 's' : ''})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {group.source === 'manual' && (
                  <span className="badge badge-warning">Manual</span>
                )}
                <button
                  onClick={() => openAssignModal(group.dates[0])}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Change
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Configure Cooking Rotation"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cooking Term (Days per person)
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={termDays}
              onChange={(e) => setTermDays(parseInt(e.target.value) || 1)}
              className="input w-32"
            />
            <p className="text-sm text-gray-500 mt-1">
              Each person will cook for {termDays} consecutive day(s)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotation Order (drag to reorder)
            </label>
            <div className="space-y-2">
              {memberOrder.map((memberId, index) => {
                const member = members.find((m) => m._id === memberId);
                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium">{member?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveMember(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowsUpDownIcon className="h-5 w-5 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveMember(index, 1)}
                        disabled={index === memberOrder.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowsUpDownIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setIsConfigModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={saveConfig} className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </div>
      </Modal>

      {/* Manual Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Cooker for ${selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy') : ''}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="input"
            >
              <option value="">-- Select Member --</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setIsAssignModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={saveManualAssign} className="btn btn-primary" disabled={!selectedMemberId}>
              Assign
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
