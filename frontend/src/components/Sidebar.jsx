import { useState } from 'react';

export function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { id: 'Dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'Members', label: '👥 Members', icon: '👥' },
        { id: 'Cooking', label: '👨‍🍳 Cooking', icon: '👨‍🍳' },
        { id: 'Meals', label: '🍽️ Meals', icon: '🍽️' },
        { id: 'Purchases', label: '🛒 Purchases', icon: '🛒' },
        { id: 'Adjustments', label: '⚙️ Adjustments', icon: '⚙️' },
        { id: 'Due Report', label: '📈 Due Report', icon: '📈' },
    ];

    const handleNavClick = (id) => {
        setActiveTab(id);
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed md:hidden top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>

            {/* Sidebar */}
            <aside className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-xl z-40 transition-transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Logo */}
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Mess Pro
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Management System</p>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-300 hover:bg-slate-700/50'
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={onLogout}
                        className="w-full px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all font-medium text-sm"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed md:hidden inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
