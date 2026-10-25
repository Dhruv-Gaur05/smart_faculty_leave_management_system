import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs py-6 border-t-2 border-blue-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white uppercase tracking-wider font-serif">
            YOUR UNIVERSITY NAME
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Faculty Leave Management & Approval System &copy; 2026. All Rights Reserved.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-slate-400 text-[11px]">
          <span>Institutional Policy</span>
          <span>|</span>
          <span>Leave Guidelines</span>
          <span>|</span>
          <span>IT Helpdesk</span>
          <span>|</span>
          <span>Contact Administration</span>
        </div>
      </div>
    </footer>
  );
};
