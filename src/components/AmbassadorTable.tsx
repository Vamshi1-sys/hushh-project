import React, { useState } from 'react';
import { Search, Download, Edit, ChevronRight, ChevronLeft, Trash2, UserPlus, Users as UsersIcon, X } from 'lucide-react';
import { Ambassador, User, Referral } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import AddAmbassadorModal from './AddAmbassadorModal';

interface AmbassadorTableProps {
  ambassadors: Ambassador[];
  users: User[];
  referrals: Referral[];
  onAddAmbassador: (newAmbassador: any) => void;
  onDeleteAmbassador: (id: string) => void;
  onEditAmbassador: (id: string, updatedData: any) => void;
}

export default function AmbassadorTable({ ambassadors, users, referrals, onAddAmbassador, onDeleteAmbassador, onEditAmbassador }: AmbassadorTableProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Ambassador>('signupsCount');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAmbassador, setEditingAmbassador] = useState<Ambassador | null>(null);
  const [viewingStudents, setViewingStudents] = useState<Ambassador | null>(null);

  const filtered = ambassadors
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.referralCode.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === 'number' && typeof valB === 'number') return valB - valA;
      return 0;
    });

  const getStudentsForAmbassador = (ambassadorId: string) => {
    const ambassadorReferrals = referrals.filter(r => r.ambassadorId === ambassadorId);
    return ambassadorReferrals.map(r => {
      const student = users.find(u => u.id === r.referredUserId);
      return {
        ...student,
        signupDate: r.createdAt
      };
    }).filter(s => s.id); // Filter out any undefined students
  };

  const handleDelete = (id: string, name: string) => {
    onDeleteAmbassador(id);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Referral Code', 'Signups', 'Active Users', 'Score'];
    const rows = filtered.map(a => [a.name, a.email, a.referralCode, a.signupsCount, a.activeUsersCount, a.score]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ambassadors_performance.csv");
    document.body.appendChild(link);
    link.click();
    toast.success('Exporting data to CSV...');
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ambassadors</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your ambassador network and track performance</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ambassadors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              <UserPlus size={16} />
              <span>Add Ambassador</span>
            </button>
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
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Ambassador</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Code</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide cursor-pointer hover:text-indigo-600" onClick={() => setSortBy('signupsCount')}>Signups</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide cursor-pointer hover:text-indigo-600" onClick={() => setSortBy('activeUsersCount')}>Active</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide cursor-pointer hover:text-indigo-600" onClick={() => setSortBy('score')}>Score</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Growth</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((ambassador) => (
              <tr key={ambassador.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {ambassador.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{ambassador.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{ambassador.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {ambassador.referralCode}
                  </code>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{ambassador.signupsCount}</td>
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{ambassador.activeUsersCount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" 
                        style={{ width: `${Math.min(100, (ambassador.score / 100) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{ambassador.score}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs font-bold flex items-center gap-1",
                    ambassador.growthPercentage >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {ambassador.growthPercentage >= 0 ? '📈 +' : '📉 '}{ambassador.growthPercentage}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "badge text-xs",
                    ambassador.status === 'active' ? "badge-success" : "badge-warning"
                  )}>
                    {ambassador.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setViewingStudents(ambassador)}
                      className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all"
                      title="View Students"
                    >
                      <UsersIcon size={16} />
                    </button>
                    <button 
                      onClick={() => setEditingAmbassador(ambassador)}
                      className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all"
                      title="Edit Ambassador"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(ambassador.id, ambassador.name)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all"
                      title="Delete Ambassador"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-500 italic">
            No ambassadors found matching your search.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <p className="font-medium">{filtered.length} ambassador{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      <AddAmbassadorModal 
        isOpen={isAddModalOpen || !!editingAmbassador} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAmbassador(null);
        }} 
        onAddAmbassador={editingAmbassador ? (data) => onEditAmbassador(editingAmbassador.id, data) : onAddAmbassador}
        ambassador={editingAmbassador || undefined}
      />

      {/* View Students Modal */}
      {viewingStudents && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <UsersIcon className="text-indigo-600 dark:text-indigo-400" size={24} />
                  {viewingStudents.name}'s Referrals
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{getStudentsForAmbassador(viewingStudents.id).length}</span> students referred
                </p>
              </div>
              <button onClick={() => setViewingStudents(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Student</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Email</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Signup Date</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {getStudentsForAmbassador(viewingStudents.id).length > 0 ? (
                    getStudentsForAmbassador(viewingStudents.id).map((student: any) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{student.name}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.email}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {new Date(student.signupDate).toLocaleDateString()}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                        No students have signed up with this ambassador's code yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

