import React from 'react';
import { LeaveStatus } from '@/types';
import { LeaveApplicationStatus } from '@/types/database';

interface BadgeProps {
  status: LeaveStatus | LeaveApplicationStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const normalized = (status || '').toString().toLowerCase().trim();

  let badgeStyles = 'bg-slate-100 text-slate-800 border-slate-300';
  let displayLabel = status;

  if (normalized === 'approved') {
    badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    displayLabel = 'Approved';
  } else if (normalized === 'pending' || normalized === 'pending hod') {
    badgeStyles = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
    displayLabel = 'Pending HOD';
  } else if (normalized === 'rejected') {
    badgeStyles = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
    displayLabel = 'Rejected';
  } else if (normalized === 'clarification' || normalized === 'clarification requested') {
    badgeStyles = 'bg-sky-50 text-sky-800 border-sky-300 font-bold';
    displayLabel = 'Clarification Requested';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border tracking-wider uppercase ${badgeStyles} ${className}`}
    >
      {displayLabel}
    </span>
  );
};
