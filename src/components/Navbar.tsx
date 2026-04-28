import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BarChart2, Home, PlusCircle, Users, FileCheck, Trophy, Layout as LayoutIcon, ClipboardList, LogOut, ShieldCheck, Gavel, Truck, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const adminNavItems = [
    { to: '/welcome', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: BarChart2, label: 'Dashboard' },
    { to: '/directory', icon: Users, label: 'Directory' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/map', icon: LayoutIcon, label: 'Society Map' },
    { to: '/action-plan', icon: ClipboardList, label: 'Action Plan' },
    { to: '/log', icon: PlusCircle, label: 'Log' },
    { to: '/community', icon: Users, label: 'Districts' },
    { to: '/bmc-report', icon: FileCheck, label: 'BMC Report' },
    { to: '/municipal-benchmarks', icon: BarChart2, label: 'Benchmarks' },
];

const bmcNavItems = [
    { to: '/bmc-dashboard', icon: BarChart2, label: 'Ward Oversight' },
    { to: '/bmc/enforcement', icon: Gavel, label: 'Enforcement Center' },
    { to: '/bmc/routes', icon: Truck, label: 'Route Optimization' },
    { to: '/disposal-guide', icon: MapPin, label: 'Disposal Guide' },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAdmin, userRole, logout } = useAuthStore();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAdmin) return null;

    const navItems = userRole === 'BMC' ? bmcNavItems : adminNavItems;

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex fixed left-0 top-0 h-screen w-56 bg-[#0f1f14] flex-col py-8 px-4 z-50">
                <div className="mb-10 px-2">
                    <span className="text-2xl font-bold tracking-tight text-white">
                        ci<span className="text-[#4ade80]">clo</span>
                    </span>
                    <p className="text-[10px] text-gray-500 mt-0.5 tracking-widest uppercase">
                        {userRole === 'BMC' ? 'BMC Authority' : 'Waste Intelligence'}
                    </p>
                </div>
                <div className="flex flex-col gap-1 flex-1 overflow-y-auto custom-scrollbar">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${isActive
                                    ? 'bg-[#4ade80]/15 text-[#4ade80] font-medium'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all w-full mb-4"
                    >
                        <LogOut size={18} />
                        Logout Session
                    </button>
                    <p className="text-[10px] text-gray-600 leading-relaxed px-2">
                        SDG 12 · Responsible Consumption<br />
                        VESIT · Dept. of IT · 2025-26
                    </p>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f1f14]/95 backdrop-blur border-t border-white/10 z-50 flex justify-around px-2 py-2 overflow-x-auto">
                {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-all ${isActive ? 'text-[#4ade80]' : 'text-gray-500'
                            }`
                        }
                    >
                        <Icon size={20} />
                        <span className="text-[9px]">{label}</span>
                    </NavLink>
                ))}
            </nav>
        </>
    );
}
