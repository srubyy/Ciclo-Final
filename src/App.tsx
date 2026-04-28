import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LogWaste from './pages/LogWaste';
import Community from './pages/Community';
import BMCReport from './pages/BMCReport';
import DisposalGuide from './pages/DisposalGuide';
import Directory from './pages/Directory';
import Leaderboard from './pages/Leaderboard';
import SocietyMap from './pages/SocietyMap';
import ActionPlan from './pages/ActionPlan';
import FlatReport from './pages/FlatReport';
import WarningNotice from './pages/WarningNotice';
import MunicipalInsights from './pages/MunicipalInsights';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import BMCDashboard from './pages/BMCDashboard';
import EnforcementCenter from './pages/EnforcementCenter';
import RouteOptimization from './pages/RouteOptimization';


export default function App() {
    const isAdmin = useAuthStore((state) => state.isAdmin);
    const userRole = useAuthStore((state) => state.userRole);

    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Gate */}
                <Route path="/" element={
                    isAdmin 
                        ? (userRole === 'BMC' ? <Navigate to="/bmc-dashboard" replace /> : <Navigate to="/dashboard" replace />)
                        : <Auth />
                } />
                
                {/* Protected Routes */}
                <Route path="/welcome" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/bmc-dashboard" element={<ProtectedRoute><BMCDashboard /></ProtectedRoute>} />
                <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
                <Route path="/flat-report/:flatId" element={<ProtectedRoute><FlatReport /></ProtectedRoute>} />
                <Route path="/warning-notice/:flatId" element={<ProtectedRoute><WarningNotice /></ProtectedRoute>} />
                <Route path="/action-plan" element={<ProtectedRoute><ActionPlan /></ProtectedRoute>} />
                <Route path="/log" element={<ProtectedRoute><LogWaste /></ProtectedRoute>} />
                <Route path="/bmc-report" element={<ProtectedRoute><BMCReport /></ProtectedRoute>} />
                <Route path="/municipal-benchmarks" element={<ProtectedRoute><MunicipalInsights /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="/map" element={<ProtectedRoute><SocietyMap /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/disposal-guide" element={<ProtectedRoute><DisposalGuide /></ProtectedRoute>} />
                <Route path="/bmc/enforcement" element={<ProtectedRoute><EnforcementCenter /></ProtectedRoute>} />
                <Route path="/bmc/routes" element={<ProtectedRoute><RouteOptimization /></ProtectedRoute>} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
