'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DepartmentSummary } from '@/types';
import {
  Building2,
  Users,
  FileCheck,
  Plus,
  Settings,
  Database,
  Search
} from 'lucide-react';

const mockAdminUser = {
  name: 'Dr. Vikramaditya Rao',
  designation: 'Dean of Academic Affairs / System Admin',
  department: 'Central Administration',
  employeeId: 'ADM-2026-001',
  email: 'admin.leave@university.edu',
};

const mockDepartments: DepartmentSummary[] = [
  {
    id: 'D-CSE',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hodName: 'Prof. Ananya Sen',
    totalFaculty: 24,
    activeLeavesToday: 2,
  },
  {
    id: 'D-ECE',
    name: 'Electronics & Communication Engg',
    code: 'ECE',
    hodName: 'Dr. K. V. Raman',
    totalFaculty: 20,
    activeLeavesToday: 1,
  },
  {
    id: 'D-MECH',
    name: 'Mechanical Engineering',
    code: 'MECH',
    hodName: 'Dr. Suresh Nair',
    totalFaculty: 18,
    activeLeavesToday: 3,
  },
  {
    id: 'D-BASIC',
    name: 'Basic Sciences & Humanities',
    code: 'BSH',
    hodName: 'Prof. Meenakshi Sundaram',
    totalFaculty: 30,
    activeLeavesToday: 0,
  },
];

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AdminPortalPage() {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const adminDisplayName = profile?.name || mockAdminUser.name;
  const adminDisplayDesig = profile?.designation || mockAdminUser.designation;
  const adminDisplayEmpId = profile?.employee_id || mockAdminUser.employeeId;

  const filteredDepts = mockDepartments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hodName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar
          role="admin"
          userName={adminDisplayName}
          department={mockAdminUser.department}
        />

        <div className="flex-1 space-y-6">
          {/* Admin Header Banner */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 border border-blue-200">
                  Central System Administration
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {adminDisplayName}
                </h2>
                <p className="text-xs text-slate-600">
                  {adminDisplayDesig}
                </p>
              </div>
              <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
                <p><span className="font-semibold">Admin ID:</span> {adminDisplayEmpId}</p>
                <p><span className="font-semibold">Email:</span> {user?.email || mockAdminUser.email}</p>
              </div>
            </div>
          </Card>

        {/* System Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 border border-slate-300 border-l-4 border-l-blue-900">
            <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-900" /> Total Departments
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">4</div>
            <div className="text-[11px] text-slate-500 mt-1">All Academic Wings</div>
          </div>

          <div className="bg-white p-4 border border-slate-300 border-l-4 border-l-slate-800">
            <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-800" /> Total Faculty Staff
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">92</div>
            <div className="text-[11px] text-slate-500 mt-1">Registered Personnel</div>
          </div>

          <div className="bg-white p-4 border border-slate-300 border-l-4 border-l-emerald-800">
            <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-800" /> Leaves Today
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">6</div>
            <div className="text-[11px] text-slate-500 mt-1">Across All Departments</div>
          </div>

          <div className="bg-white p-4 border border-slate-300 border-l-4 border-l-indigo-900">
            <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-900" /> Database Status
            </div>
            <div className="text-base font-bold text-emerald-700 mt-2">
              Ready (Supabase Ready)
            </div>
            <div className="text-[11px] text-slate-500">Phase 2 Enabled</div>
          </div>
        </div>

        {/* University Departments Directory */}
        <div id="departments">
          <Card
            title="University Departments & HOD Allocation"
            subtitle="Central directory of academic departments and active leave balances"
            action={
              <Button size="sm" variant="primary">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Department
              </Button>
            }
          >
            {/* Search Filter Bar */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Filter department, HOD name, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-blue-900 rounded-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Showing {filteredDepts.length} of {mockDepartments.length} Departments
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Dept Code</th>
                    <th className="py-2.5 px-3">Department Name</th>
                    <th className="py-2.5 px-3">Head of Department (HOD)</th>
                    <th className="py-2.5 px-3">Total Faculty</th>
                    <th className="py-2.5 px-3">Active Leaves Today</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredDepts.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-blue-900">
                        {dept.code}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {dept.name}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {dept.hodName}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {dept.totalFaculty}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold ${
                          dept.activeLeavesToday > 0 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {dept.activeLeavesToday} Faculty
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-blue-900 font-semibold hover:underline mr-3">
                          Manage
                        </button>
                        <button className="text-slate-600 hover:underline">
                          View Roster
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Institutional Audit & Policy Notes */}
        <div id="audit">
          <Card title="Institutional Audit Log & System Configuration">
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">Academic Year 2026 Leave Rules Active</p>
                  <p className="text-slate-600 mt-0.5">
                    Casual Leave: 12 Days/Year | Earned Leave: 15 Days/Year | Medical Leave: 10 Days/Year | Duty Leave: 8 Days/Year
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Settings className="w-3.5 h-3.5 mr-1" /> Configure Rules
                </Button>
              </div>

              <div className="border border-slate-200 divide-y divide-slate-100 font-mono text-[11px]">
                <div className="p-2 bg-slate-100 font-sans font-semibold text-slate-700">
                  Recent Audit Events (Central Registry)
                </div>
                <div className="p-2 text-slate-600">
                  [2026-08-19 11:30:12] HOD-CSE-001 approved LV-2026-074 (Duty Leave - 3 Days).
                </div>
                <div className="p-2 text-slate-600">
                  [2026-08-18 16:45:00] FAC-CSE-2024-042 submitted LV-2026-089 (Casual Leave - 2 Days).
                </div>
                <div className="p-2 text-slate-600">
                  [2026-08-01 09:00:00] System synchronized leave balances for 2026 Fall Session.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
