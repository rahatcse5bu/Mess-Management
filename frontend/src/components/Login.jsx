import { useState } from 'react';

export function LoginView({ onLogin, error }) {
    const [form, setForm] = useState({
        email: 'rahat.cse5.bu@gmail.com',
        password: '01783307672@Rahat',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onLogin(form);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse delay-[2000ms]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4">
                        <span className="text-4xl">🏠</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Mess Pro
                    </h1>
                    <p className="text-slate-300 mt-2">Professional Mess Management System</p>
                </div>

                {/* Login Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl space-y-6"
                >
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <p className="text-red-200 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        Sign In
                    </button>

                    {/* Demo Credentials */}
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-slate-400 text-center">Demo credentials are pre-filled</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
