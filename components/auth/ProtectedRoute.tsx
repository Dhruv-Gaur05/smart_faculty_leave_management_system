'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/types/database';
import { ShieldAlert, Loader2, ArrowRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, profile, role, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent animate-spin rounded-full" />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Authenticating Session...
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifying institutional credentials and permissions
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
        <p className="text-xs text-slate-600 font-medium">Redirecting to login portal...</p>
      </div>
    );
  }

  // Resolving role permissions if allowedRoles specified but role not yet resolved
  if (allowedRoles && allowedRoles.length > 0 && !role) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent animate-spin rounded-full" />
        <p className="text-xs text-slate-600 font-medium">Verifying role permissions...</p>
      </div>
    );
  }

  // Role authorization check
  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    const getDashboardPath = (userRole: UserRole) => {
      switch (userRole) {
        case 'hod':
          return '/hod/dashboard';
        case 'admin':
          return '/admin/dashboard';
        case 'faculty':
        default:
          return '/faculty/dashboard';
      }
    };

    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-white border-2 border-rose-600 shadow-sm p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-700 bg-rose-100 px-2 py-0.5 border border-rose-300">
              Access Restricted
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2 font-serif uppercase">
              Unauthorized Portal Area
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your account is registered as <strong className="uppercase text-slate-900 font-bold">{role}</strong>, which does not have authorization to view this section.
            </p>
          </div>

          <div className="bg-slate-50 p-3 border border-slate-200 text-left text-xs space-y-1">
            <p><span className="font-semibold text-slate-700">Logged in as:</span> {profile?.name || user.email}</p>
            <p><span className="font-semibold text-slate-700">Designation:</span> {profile?.designation || 'Academic Staff'}</p>
            <p><span className="font-semibold text-slate-700">Required Role:</span> <span className="uppercase font-mono text-rose-700 font-semibold">{allowedRoles.join(' or ')}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push(getDashboardPath(role))}
            >
              Go to My {role.toUpperCase()} Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                router.push('/login');
              }}
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
