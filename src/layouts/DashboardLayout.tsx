import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Landmark, 
  ChevronRight,
  Bell
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Active Sessions', path: '/sessions', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const current = navigationItems.find(item => item.path === location.pathname);
    return current ? current.name : 'Financial Portal';
  };

  return (
    <div className="min-h-screen bg-banking-slate-950 text-banking-slate-100 flex font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.03),transparent_40%)] pointer-events-none" />
      
      {/* Sidebar: Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-banking-slate-900/40 backdrop-blur-xl border-r border-banking-slate-800/60 p-6 justify-between shrink-0 relative z-25">
        <div>
          {/* Logo Branding */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-banking-indigo-500 to-banking-cyan-500 flex items-center justify-center shadow-lg shadow-banking-indigo-500/25">
              <Landmark className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white to-banking-slate-400 bg-clip-text text-transparent">
              FinVerse
            </span>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-banking-indigo-600/10 border border-banking-indigo-500/20 text-banking-indigo-400'
                      : 'text-banking-slate-400 hover:text-banking-slate-200 hover:bg-banking-slate-900/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile / Logout section */}
        <div className="border-t border-banking-slate-800/80 pt-6">
          {user && (
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-full bg-banking-indigo-900/50 border border-banking-indigo-500/20 flex items-center justify-center overflow-hidden shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-banking-indigo-300 text-sm">{user.name[0]}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-banking-slate-200 truncate">{user.name}</p>
                <span className="text-[10px] uppercase font-extrabold text-banking-cyan-400 tracking-wider">
                  {user.tier} Tier
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <aside 
            className="w-64 h-full bg-banking-slate-900 border-r border-banking-slate-800 p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-banking-indigo-500 to-banking-cyan-500 flex items-center justify-center">
                    <Landmark className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-lg text-white">FinVerse</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-banking-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-banking-indigo-600/10 text-banking-indigo-400'
                          : 'text-banking-slate-400 hover:text-banking-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-banking-slate-800 pt-6">
              {user && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-banking-indigo-900/50 flex items-center justify-center overflow-hidden shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-banking-indigo-300 text-sm">{user.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <span className="text-[10px] font-semibold text-banking-cyan-400">{user.tier} Tier</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 bg-banking-slate-950/80 backdrop-blur-md border-b border-banking-slate-900/80 px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden text-banking-slate-400 hover:text-white p-1 rounded-lg bg-banking-slate-900 border border-banking-slate-850"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification trigger mockup */}
            <button className="relative w-9 h-9 rounded-xl bg-banking-slate-900 border border-banking-slate-800 flex items-center justify-center text-banking-slate-400 hover:text-white hover:border-banking-slate-700 transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-banking-indigo-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-banking-indigo-500" />
            </button>
          </div>
        </header>

        {/* Outer body view */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-5xl mx-auto animate-[fadeIn_0.3s_ease-out]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
