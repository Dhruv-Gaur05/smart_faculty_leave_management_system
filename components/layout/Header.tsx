'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  GraduationCap,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    switch (role) {
      case 'hod':
        return '/hod/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'faculty':
      default:
        return '/faculty/dashboard';
    }
  };

  const navLinks = [
    { name: 'Portal Home', href: '/', icon: GraduationCap },
    { name: 'Faculty Portal', href: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'HOD Portal', href: '/hod/dashboard', icon: UserCheck },
    { name: 'Admin Portal', href: '/admin/dashboard', icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="bg-slate-900 text-white border-b-4 border-blue-800 shadow-md">
      {/* Top Academic Strip */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-mono tracking-wider">OFFICIAL UNIVERSITY MANAGEMENT SYSTEM PORTAL</div>
          <div className="hidden sm:flex items-center space-x-3 text-slate-400">
            <span>Academic Session 2026 - 2027</span>
            {user && (
              <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                ● Live Session: {profile?.name || user.email} ({role?.toUpperCase() || 'USER'})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          {/* University Crest */}
          <div className="w-11 h-11 bg-blue-900 border-2 border-slate-300 flex items-center justify-center text-white shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-serif">
              UNIVERSITY LEAVE MANAGEMENT
            </h1>
            <p className="text-[11px] sm:text-xs text-blue-200 font-medium tracking-wide">
              Centralized Academic Staff Portal
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-2">
          <nav className="flex items-center space-x-1 mr-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                    isActive
                      ? 'bg-blue-900 text-white border-blue-700'
                      : 'text-slate-200 border-transparent hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Auth Action in Header */}
          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
              <Link
                href={getDashboardPath()}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-medium text-white"
              >
                <User className="w-3.5 h-3.5 text-blue-300" />
                <span className="max-w-[120px] truncate">{profile?.name || user.email}</span>
                <span className="text-[10px] uppercase font-bold bg-blue-900 px-1.5 py-0.2 border border-blue-700 text-blue-100 ml-1">
                  {role || 'Staff'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-rose-900 hover:bg-rose-950 text-white text-xs font-medium border border-rose-800 transition-colors"
                title="Sign out of portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider border border-blue-600 shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-200 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 py-3 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                  isActive
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-rose-900 text-white text-xs font-bold uppercase"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({profile?.name || user.email})</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-800 text-white text-xs font-bold uppercase"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
