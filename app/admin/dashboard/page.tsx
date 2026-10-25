'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  LogOut,
  Building2,
  Users,
  CheckCircle2,
  Mail,
  BadgeCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Official Banner */}
        <div className="bg-blue-900 text-white p-5 border-l-8 border-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2 py-0.5 border border-blue-400/30 inline-block mb-1">
              Central Administration Session
            </span>
            <h1 className="text-xl font-bold uppercase font-serif tracking-wide">
              University System Administrator Portal
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Welcome, {profile?.name || user?.email} (Full System Rights)
            </p>
          </div>
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignOut}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card title="Administrator Credentials" subtitle="Central University Academic Registry & Portal Governance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3 border border-slate-200">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase">Administrator</span>
              <span className="text-slate-900 font-bold text-sm mt-0.5 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
                {profile?.name || 'Central Admin'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-200">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase">Employee ID</span>
              <span className="text-slate-900 font-mono font-bold text-sm mt-0.5 block flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-900" />
                {profile?.employee_id || 'ADM-001'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-200">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase">Designation</span>
              <span className="text-slate-900 font-semibold mt-0.5 block">
                {profile?.designation || 'Dean of Academic Affairs'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-200">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase">Access Level</span>
              <span className="text-rose-700 font-bold uppercase mt-0.5 block">
                ADMIN (Full System Privileges)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Institutional Email: <strong className="text-slate-800">{user?.email}</strong></span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Database Foundation: Connected & Protected with RLS</span>
            </div>
          </div>
        </Card>

        {/* Quick Administration Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Manage Departments" subtitle="University Academic Units">
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Configure department structures, assign Heads of Department, and oversee active faculty leaves.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => router.push('/admin')}
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" /> Open Department Registry
            </Button>
          </Card>

          <Card title="Faculty Directory" subtitle="All University Staff">
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Audit staff profiles, modify roles, and oversee academic leave policy compliance.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => router.push('/admin#directory')}
            >
              <Users className="w-3.5 h-3.5 mr-1.5" /> View Faculty Directory
            </Button>
          </Card>

          <Card title="System Security" subtitle="Admin Guard">
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              This dashboard is strictly protected for verified <strong className="text-slate-900">System Administrators</strong>.
            </p>
            <div className="bg-slate-100 p-2 border border-slate-300 text-[11px] text-slate-700 font-mono">
              Role: &apos;admin&apos; | RLS Enforced
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
