import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  CheckSquare,
  ShieldCheck,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Official Announcement Banner */}
      <div className="bg-blue-900 text-white p-6 border-l-8 border-slate-950 shadow-sm">
        <div className="flex items-start space-x-3">
          <BookOpen className="w-6 h-6 shrink-0 text-blue-200 mt-1" />
          <div>
            <h2 className="text-xl font-bold tracking-tight uppercase font-serif">
              Welcome to the Faculty Leave Management & Approval Portal
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
              This system digitizes and streamlines leave applications, HOD recommendations, and administrative tracking for university academic staff. Please select your role portal below to proceed.
            </p>
          </div>
        </div>
      </div>

      {/* Role Selection Portals Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 pb-1 border-b border-slate-300">
          Access University Portals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Faculty Card */}
          <Card className="hover:border-blue-900 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-slate-100 border border-slate-300 flex items-center justify-center text-blue-900">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Faculty Portal</h4>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Apply for leave (Casual, Earned, Medical, Duty), track real-time application status, and view leave balances.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <Link href="/faculty/dashboard">
                  <Button variant="primary" className="w-full text-xs">
                    Enter Faculty Portal <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* HOD Card */}
          <Card className="hover:border-blue-900 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-slate-100 border border-slate-300 flex items-center justify-center text-blue-900">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">HOD Approval Portal</h4>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Review pending department faculty applications, approve, reject, or request clarification with comments.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <Link href="/hod/dashboard">
                  <Button variant="primary" className="w-full text-xs">
                    Enter HOD Portal <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Admin Card */}
          <Card className="hover:border-blue-900 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-slate-100 border border-slate-300 flex items-center justify-center text-blue-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Admin Management</h4>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Manage university departments, faculty directory, leave policy parameters, and institutional audit logs.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <Link href="/admin/dashboard">
                  <Button variant="secondary" className="w-full text-xs">
                    Enter Admin Portal <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Official Leave Workflow Steps */}
      <Card title="Official Academic Leave Workflow" subtitle="Standardized 4-step approval process">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
              <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
              <span>Submit Request</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Faculty logs in and submits leave details with dates, type, and justification.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
              <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              <span>HOD Review</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Head of Department reviews request against class schedules and department workload.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
              <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
              <span>Action / Decision</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              HOD Approves, Rejects, or requests Clarification with institutional feedback.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
              <span className="w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center text-[10px]">4</span>
              <span>Status & Audit</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Faculty receives status update; official record updated in central registry.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
