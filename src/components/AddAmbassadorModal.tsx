import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield, User, Edit } from 'lucide-react';
import { cn } from '../lib/utils';
import { Ambassador } from '../types';

interface AddAmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAmbassador: (newAmbassador: any) => void;
  ambassador?: Ambassador;
}

export default function AddAmbassadorModal({ isOpen, onClose, onAddAmbassador, ambassador }: AddAmbassadorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: '',
    college: '',
    role: 'ambassador' as 'admin' | 'ambassador',
    status: 'active' as 'active' | 'blocked'
  });

  useEffect(() => {
    if (ambassador) {
      setFormData({
        name: ambassador.name,
        email: ambassador.email,
        password: '', // Don't pre-fill password for editing
        referralCode: ambassador.referralCode,
        college: ambassador.college || '',
        role: ambassador.role as 'admin' | 'ambassador',
        status: (ambassador as any).status || 'active'
      });
    } else {
      setFormData({ name: '', email: '', password: '', referralCode: '', college: '', role: 'ambassador', status: 'active' });
    }
  }, [ambassador, isOpen]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.referralCode || (!ambassador && !formData.password)) {
        throw new Error('Please fill in all fields');
      }

      onAddAmbassador(formData);
      onClose();
      setFormData({ name: '', email: '', password: '', referralCode: '', college: '', role: 'ambassador', status: 'active' });
    } catch (error: any) {
      // toast is handled in parent or here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            {ambassador ? (
              <Edit className="text-indigo-600 dark:text-indigo-400" size={24} />
            ) : (
              <UserPlus className="text-indigo-600 dark:text-indigo-400" size={24} />
            )}
            {ambassador ? 'Edit Ambassador' : 'Add Ambassador'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Password</label>
            <input
              type="password"
              required={!ambassador}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="••••••••"
            />
            {ambassador && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Leave empty to keep current password</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">College / Institution</label>
            <input
              type="text"
              required
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="input-field"
              placeholder="University of Technology"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Referral Code</label>
            <input
              type="text"
              required
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
              className="input-field"
              placeholder="CAMPUS2024"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'ambassador' })}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-medium transition-all",
                  formData.role === 'ambassador' 
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                <User size={16} />
                Ambassador
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-medium transition-all",
                  formData.role === 'admin' 
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                <Shield size={16} />
                Admin
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'active' })}
                className={cn(
                  "py-2.5 rounded-lg border-2 font-medium transition-all",
                  formData.status === 'active' 
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" 
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'blocked' })}
                className={cn(
                  "py-2.5 rounded-lg border-2 font-medium transition-all",
                  formData.status === 'blocked' 
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" 
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                Blocked
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 shadow-lg shadow-indigo-500/30"
            >
              {isLoading ? (ambassador ? 'Updating...' : 'Adding...') : (ambassador ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
