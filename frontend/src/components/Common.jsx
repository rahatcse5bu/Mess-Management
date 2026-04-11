export function Header({ title, subtitle, icon }) {
    return (
        <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
                <span className="text-4xl">{icon}</span>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                    {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}

export function Card({ children, className = '' }) {
    return (
        <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            {children}
        </div>
    );
}

export function StatCard({ label, value, icon, color = 'blue' }) {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        orange: 'from-orange-500 to-orange-600',
        purple: 'from-purple-500 to-purple-600',
        red: 'from-red-500 to-red-600',
    };

    return (
        <div className={`rounded-xl bg-gradient-to-br ${colors[color]} p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <span className="text-4xl opacity-20">{icon}</span>
            </div>
        </div>
    );
}

export function Button({ children, onClick, variant = 'primary', size = 'md', className = '' }) {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            onClick={onClick}
            className={`rounded-lg font-semibold transition-all ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}

export function Badge({ children, color = 'blue' }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
            {children}
        </span>
    );
}
