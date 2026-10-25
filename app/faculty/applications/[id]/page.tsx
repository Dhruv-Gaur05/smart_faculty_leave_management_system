'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getFacultyApplicationById,
  getFacultyProfile,
  DetailedLeaveApplication,
} from '@/lib/supabase/faculty';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  BadgeCheck,
  Building,
  User,
  Phone,
  Printer,
  ShieldCheck,
  HelpCircle,
  Loader2
} from 'lucide-react';

export default function FacultyApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();

  const applicationId = (params?.id as string) || '';

  const [application, setApplication] = useState<DetailedLeaveApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState('Computer Science & Engineering');

  const loadApplication = useCallback(async () => {
    if (!user || !applicationId) return;
    setLoading(true);
    setErrorState(null);

    try {
      const prof = await getFacultyProfile(user.id);
      if (prof?.department_name) {
        setDepartmentName(prof.department_name);
      }

      // Fetch only if it belongs to this faculty
      const app = await getFacultyApplicationById(applicationId, user.id);

      if (!app) {
        setErrorState('Application record not found, or you do not have permission to view it.');
      } else {
        setApplication(app);
      }
    } catch (err) {
      console.error('Error loading application details:', err);
      setErrorState('Failed to retrieve application details from the server.');
    } finally {
      setLoading(false);
    }
  }, [user, applicationId]);

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  const facultyDisplayName = profile?.name || user?.email?.split('@')[0] || 'Academic Faculty';
  const facultyDesignation = profile?.designation || 'Assistant Professor';
  const facultyEmpId = profile?.employee_id || `FAC-${user?.id?.substring(0, 6) || '2026'}`;

  // Print function for physical record keeping
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <ProtectedRoute allowedRoles={['faculty']}>
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar
          role="faculty"
          userName={facultyDisplayName}
          department={departmentName}
          designation={facultyDesignation}
        />

        <div className="flex-1 space-y-6">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/faculty/applications"
              className="text-xs font-semibold uppercase tracking-wider text-blue-900 hover:text-blue-950 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Applications List
            </Link>

            {application && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs print:hidden"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / Save PDF
              </Button>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-300">
              <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
              <p className="text-xs text-slate-600 font-medium">Verifying and retrieving application record...</p>
            </div>
          ) : errorState || !application ? (
            <div className="bg-white border-2 border-rose-300 p-8 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold uppercase font-serif text-slate-900">
                  Application Not Accessible
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  {errorState || 'The requested leave application could not be located in your academic profile.'}
                </p>
              </div>
              <div className="pt-2">
                <Link href="/faculty/applications">
                  <Button variant="primary" size="sm">
                    Return to My Applications
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-blue-900 text-white p-5 border-l-8 border-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 bg-white/10 px-2 py-0.5 border border-blue-400/30">
                      Application ID: {application.id}
                    </span>
                    <Badge status={application.status} />
                  </div>
                  <h1 className="text-xl font-bold uppercase font-serif tracking-wide">
                    {application.leave_type?.name || 'Leave Application'}
                  </h1>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Submitted on {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : '—'} by {facultyDisplayName}
                  </p>
                </div>
              </div>

              {/* Status Alert Callout */}
              {application.status === 'pending' && (
                <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start space-x-3 shadow-xs">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Status: Pending Department Recommendation</p>
                    <p className="mt-0.5 leading-relaxed">
                      Your application has been logged and is awaiting review by the Head of Department. You will be notified when a recommendation or decision is recorded.
                    </p>
                  </div>
                </div>
              )}

              {application.status === 'approved' && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start space-x-3 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Status: Leave Approved & Sanctioned</p>
                    <p className="mt-0.5 leading-relaxed">
                      This leave request has been officially approved. The leave balance will be updated in the central faculty registry.
                    </p>
                  </div>
                </div>
              )}

              {application.status === 'rejected' && (
                <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start space-x-3 shadow-xs">
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Status: Leave Application Rejected</p>
                    <p className="mt-0.5 leading-relaxed">
                      This application was not approved by the department. Please review the reviewer comments below.
                    </p>
                  </div>
                </div>
              )}

              {application.status === 'clarification' && (
                <div className="p-4 bg-sky-50 border border-sky-300 text-sky-900 text-xs flex items-start space-x-3 shadow-xs">
                  <HelpCircle className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Status: Clarification Requested</p>
                    <p className="mt-0.5 leading-relaxed">
                      The Head of Department has requested clarification or supporting documents regarding this leave. Please check the remarks section below.
                    </p>
                  </div>
                </div>
              )}

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Application Particulars (2 cols on large screen) */}
                <div className="lg:col-span-2 space-y-6">
                  <Card title="Application Parameters" subtitle="Submitted details from central university records">
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-slate-50 border border-slate-200">
                        <div>
                          <span className="text-slate-500 font-bold uppercase text-[10px] block">
                            Leave Category
                          </span>
                          <span className="font-bold text-slate-900 mt-0.5 block">
                            {application.leave_type?.name || 'Casual Leave'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold uppercase text-[10px] block">
                            Period of Absence
                          </span>
                          <span className="font-semibold text-slate-900 mt-0.5 block font-mono text-[11px]">
                            {application.from_date} to {application.to_date}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold uppercase text-[10px] block">
                            Total Duration
                          </span>
                          <span className="font-bold text-blue-900 text-sm mt-0.5 block">
                            {application.days} {application.days === 1 ? 'Day' : 'Days'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
                          Academic Justification / Reason
                        </span>
                        <div className="p-3 bg-white border border-slate-300 text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                          {application.reason}
                        </div>
                      </div>

                      {application.contact_during_leave && (
                        <div>
                          <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
                            Contact During Leave
                          </span>
                          <div className="p-3 bg-slate-50 border border-slate-200 text-slate-800 flex items-center space-x-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{application.contact_during_leave}</span>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 grid grid-cols-2 text-[11px] text-slate-500">
                        <div>
                          Submitted: <span className="font-mono text-slate-700">{new Date(application.submitted_at).toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          Last Updated: <span className="font-mono text-slate-700">{new Date(application.updated_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Column 2: Applicant & Department Audit */}
                <div className="space-y-6">
                  {/* Applicant Summary */}
                  <Card title="Applicant Profile" subtitle="Academic credentials">
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Faculty Member</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                          <User className="w-3.5 h-3.5 text-blue-900" />
                          {facultyDisplayName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Employee ID</span>
                        <span className="font-mono text-slate-800 flex items-center gap-1 mt-0.5">
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-900" />
                          {facultyEmpId}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Designation</span>
                        <span className="text-slate-800 mt-0.5 block">{facultyDesignation}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Department</span>
                        <span className="text-slate-800 flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {departmentName}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Approver Audit Trail */}
                  <Card title="Departmental Review Audit" subtitle="Recorded HOD actions">
                    <div className="text-xs">
                      {application.approvals && application.approvals.length > 0 ? (
                        <div className="space-y-3">
                          {application.approvals.map((approval) => (
                            <div key={approval.id} className="p-3 bg-slate-50 border border-slate-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <Badge status={approval.action} />
                                <span className="text-[10px] font-mono text-slate-500">
                                  {approval.action_time ? new Date(approval.action_time).toLocaleDateString() : ''}
                                </span>
                              </div>
                              {approval.remarks && (
                                <p className="text-slate-700 italic text-[11px] bg-white p-2 border border-slate-200 mt-1">
                                  &quot;{approval.remarks}&quot;
                                </p>
                              )}
                              <p className="text-[10px] text-slate-500 pt-1">
                                Reviewed by Department Head
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 text-center space-y-2">
                          <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                          <p className="text-slate-600 font-medium text-[11px]">
                            Awaiting Department Action
                          </p>
                          <p className="text-slate-500 text-[10px] leading-relaxed">
                            No review actions or remarks have been submitted yet. Your HOD will evaluate this request.
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
