import { useState } from 'react';
import { Card, Button, Header } from './Common';
import { SkeletonTable } from './Skeleton';

export function MembersView({ members, onAddMember, onDeleteMember, onEditMember, isLoading }) {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAddMember(form);
        setForm({ name: '', email: '', phone: '' });
    };

    const startEdit = (member) => {
        setEditingId(member._id);
        setEditForm({
            name: member.name,
            email: member.email || '',
            phone: member.phone || '',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', email: '', phone: '' });
    };

    const saveEdit = async (id) => {
        await onEditMember(id, editForm);
        setEditingId(null);
    };

    const toggleCooker = async (member) => {
        await onEditMember(member._id, { isCooker: !member.isCooker });
    };

    const toggleActive = async (member) => {
        await onEditMember(member._id, { isActive: !member.isActive });
    };

    return (
        <div>
            <Header
                title="Members Management"
                subtitle="Add, edit, and manage mess members"
                icon="👥"
            />

            {/* Add Member Form */}
            <Card className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Add New Member</h2>
                <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <input
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <Button type="submit">+ Add Member</Button>
                </form>
            </Card>

            {/* Members List */}
            <Card>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Members List</h2>
                {isLoading ? (
                    <SkeletonTable rows={5} cols={6} />
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                        <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-2 sm:px-4 py-3 font-semibold text-slate-900">Name</th>
                                <th className="hidden sm:table-cell text-left px-2 sm:px-4 py-3 font-semibold text-slate-900">Email</th>
                                <th className="hidden md:table-cell text-left px-2 sm:px-4 py-3 font-semibold text-slate-900">Phone</th>
                                <th className="text-center px-2 sm:px-4 py-3 font-semibold text-slate-900">Cooker</th>
                                <th className="text-center px-2 sm:px-4 py-3 font-semibold text-slate-900">Status</th>
                                <th className="text-center px-2 sm:px-4 py-3 font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                                        No members yet. Add your first member above.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member._id} className="border-b border-slate-200 hover:bg-slate-50">
                                        {editingId === member._id ? (
                                            <>
                                                <td className="px-4 py-2">
                                                    <input
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={editForm.phone}
                                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${member.isCooker !== false ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                                                        {member.isCooker !== false ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${member.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                                                        {member.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => saveEdit(member._id)}
                                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all text-xs font-medium"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-xs font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3 font-medium text-slate-900">{member.name}</td>
                                                <td className="px-4 py-3 text-slate-600">{member.email || '—'}</td>
                                                <td className="px-4 py-3 text-slate-600">{member.phone || '—'}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => toggleCooker(member)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${member.isCooker !== false
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                            }`}
                                                    >
                                                        {member.isCooker !== false ? 'Cooker' : 'Non-Cooker'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => toggleActive(member)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${member.isActive !== false
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            }`}
                                                    >
                                                        {member.isActive !== false ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => startEdit(member)}
                                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-xs font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => onDeleteMember(member._id)}
                                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-xs font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                )}
            </Card>
        </div>
    );
}
