import React, { useState } from 'react';
import { Search, User, Calendar, Link as LinkIcon, UserCheck, Download } from 'lucide-react';
import { User as UserType, Referral, Ambassador } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface StudentTableProps {
  users: UserType[];
  referrals: Referral[];
  ambassadors: Ambassador[];
}

export default function StudentTable({ users, referrals, ambassadors }: StudentTableProps) {
  const [search, setSearch] = useState('');

  // Filter for regular students (role: 'user')
  const students = users.filter(u => u.role === 'user');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getReferralInfo = (studentId: string) => {
    const referral = referrals.find(r => r.referredUserId === studentId);
    if (!referral) return null;
    
    const ambassador = ambassadors.find(a => a.id === referral.ambassadorId);
    return ambassador ? { name: ambassador.name, code: ambassador.referralCode } : null;
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Signup Date', 'Last Login', 'Referral Code', 'Ambassador', 'Status'];
    const rows = filteredStudents.map(s => {
      const ref = getReferralInfo(s.id);
      return [
        s.name, 
        s.email, 
        new Date(s.createdAt).toLocaleDateString(),
        s.lastLogin ? new Date(s.lastLogin).toLocaleString() : 'Never',
        ref?.code || 'Direct',
        ref?.name || 'N/A',
        s.status
      ];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_list.csv");
    document.body.appendChild(link);
    link.click();
    toast.success('Exporting student data to CSV...');
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Students</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track student registrations</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <UserCheck size={16} className="text-emerald-500" />
              <span>{students.length} Total</span>
            </div>
            <button 
              onClick={exportToCSV}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Student</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Referred Via</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Signup Date</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Last Active</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const referral = getReferralInfo(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {referral ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 mb-1">
                            <LinkIcon size={12} className="flex-shrink-0" />
                            {referral.code}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">via {referral.name}</span>
                        </div>
                      ) : (
                        <span className="badge badge-info text-xs">Direct</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {student.lastLogin ? new Date(student.lastLogin).toLocaleString() : 'Never logged in'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "badge text-xs",
                        student.status === 'active' ? "badge-success" : "badge-warning"
                      )}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                  No students found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
