import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, User, Building2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loginRole, setLoginRole] = useState<'ADMIN' | 'BMC'>('ADMIN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [societyName, setSocietyName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate a small delay for a premium feel
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (isLogin) {
            const success = login(email, password);
            if (success) {
                if (email === 'bmc@gmail.com') {
                    navigate('/bmc-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(`Invalid ${loginRole === 'BMC' ? 'BMC' : 'Admin'} credentials.`);
                setIsLoading(false);
            }
        } else {
            // Simulate Signup
            if (email && password && societyName) {
                login('admin@gmail.com', 'admin123');
                navigate('/dashboard');
            } else {
                setError('Please fill in all fields');
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a120d] text-white flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4ade80]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4ade80]/10 border border-[#4ade80]/20 mb-6"
                    >
                        <ShieldCheck className="text-[#4ade80]" size={32} />
                    </motion.div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">
                        ci<span className="text-[#4ade80]">clo</span>
                    </h1>
                    <p className="text-gray-400 font-medium">
                        {isLogin ? (loginRole === 'BMC' ? 'BMC Official Portal' : 'Society Management') : 'Start your sustainability journey'}
                    </p>
                </div>

                <div className="bg-[#141f18] border border-white/5 p-8 rounded-[32px] shadow-2xl">
                    {/* Primary Toggle (Login / Signup) */}
                    <div className="flex bg-black/40 p-1.5 rounded-2xl mb-6">
                        <button 
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-[#4ade80] text-[#0a120d]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-[#4ade80] text-[#0a120d]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Secondary Toggle (Role Segregation) - Only on Login */}
                    <AnimatePresence mode="wait">
                        {isLogin && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-2 gap-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/5"
                            >
                                <button 
                                    onClick={() => {
                                        setLoginRole('ADMIN');
                                        setEmail('admin@gmail.com');
                                    }}
                                    className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${loginRole === 'ADMIN' ? 'bg-white/10 text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Society Admin
                                </button>
                                <button 
                                    onClick={() => {
                                        setLoginRole('BMC');
                                        setEmail('bmc@gmail.com');
                                    }}
                                    className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${loginRole === 'BMC' ? 'bg-white/10 text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    BMC Official
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Society Name</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4ade80] transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={societyName}
                                            onChange={(e) => setSocietyName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#4ade80]/50 focus:bg-white/8 transition-all"
                                            placeholder="Mayuresh Park"
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4ade80] transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#4ade80]/50 focus:bg-white/8 transition-all"
                                    placeholder="admin@gmail.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4ade80] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#4ade80]/50 focus:bg-white/8 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-3 rounded-xl"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-[#4ade80] text-[#0a120d] py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg shadow-[#4ade80]/10"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-[#0a120d]/30 border-t-[#0a120d] rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Access Dashboard' : 'Create Society Account'} <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-gray-600 text-xs text-center leading-relaxed">
                        By continuing, you agree to Ciclo's <br />
                        <span className="text-gray-400 underline cursor-pointer">Terms of Service</span> and <span className="text-gray-400 underline cursor-pointer">Privacy Policy</span>.
                    </p>
                    <div className="h-px w-12 bg-white/5" />
                    <p className="text-[#4ade80]/60 text-[10px] font-bold uppercase tracking-widest">
                        Society Waste Intelligence · SDG 12
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
