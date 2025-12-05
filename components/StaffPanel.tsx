
import React, { useState } from 'react';
import { Employee, Shift, UserRole, Permission, Transaction } from '../types';
import { Plus, Clock, Shield, DollarSign, User, Check, X, Search, Trash2, Edit2 } from 'lucide-react';

interface StaffPanelProps {
  employees: Employee[];
  shifts: Shift[];
  transactions: Transaction[];
  onAddEmployee: (employee: Employee) => void;
  onUpdateEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onClockIn: (employeeId: string) => void;
  onClockOut: (employeeId: string) => void;
  onAddShift: (shift: Shift) => void;
  onUpdateShift: (shift: Shift) => void;
  onDeleteShift: (id: string) => void;
  formatPrice: (amount: number) => string;
  t: (key: string) => string;
}

const StaffPanel: React.FC<StaffPanelProps> = ({ 
  employees, shifts, transactions, 
  onAddEmployee, onUpdateEmployee, onDeleteEmployee, 
  onClockIn, onClockOut, 
  onAddShift, onUpdateShift, onDeleteShift,
  formatPrice, t 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'team' | 'shifts' | 'performance'>('team');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Employee Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee>>({
    name: '', role: 'cashier', hourlyRate: 15, pin: '', permissions: []
  });

  // Shift Modal State
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Partial<Shift>>({});

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Handlers ---

  const openAddEmployee = () => {
      setEditingEmployee({ name: '', role: 'cashier', hourlyRate: 15, pin: '', permissions: [] });
      setIsEmployeeModalOpen(true);
  };

  const openEditEmployee = (emp: Employee) => {
      setEditingEmployee({ ...emp });
      setIsEmployeeModalOpen(true);
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee.id) {
        onUpdateEmployee(editingEmployee as Employee);
    } else {
        const employee: Employee = {
            id: Date.now().toString(),
            organizationId: '', // Placeholder, will be set by parent
            name: editingEmployee.name || 'Staff',
            role: editingEmployee.role || 'cashier',
            pin: editingEmployee.pin || '0000',
            hourlyRate: editingEmployee.hourlyRate || 0,
            status: 'clocked-out',
            permissions: editingEmployee.permissions || [],
            image: `https://ui-avatars.com/api/?name=${editingEmployee.name}&background=random`,
            locationId: '' // Placeholder
        };
        onAddEmployee(employee);
    }
    setIsEmployeeModalOpen(false);
  };

  const togglePermission = (perm: Permission) => {
    setEditingEmployee(prev => {
      const perms = prev.permissions || [];
      if (perms.includes(perm)) {
        return { ...prev, permissions: perms.filter(p => p !== perm) };
      } else {
        return { ...prev, permissions: [...perms, perm] };
      }
    });
  };

  const openAddShift = () => {
      setEditingShift({
          employeeId: employees[0]?.id || '',
          startTime: new Date().toISOString().slice(0, 16)
      });
      setIsShiftModalOpen(true);
  };

  const openEditShift = (shift: Shift) => {
      setEditingShift({
          ...shift,
          startTime: new Date(shift.startTime).toISOString().slice(0, 16),
          endTime: shift.endTime ? new Date(shift.endTime).toISOString().slice(0, 16) : undefined
      });
      setIsShiftModalOpen(true);
  };

  const handleShiftSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const start = new Date(editingShift.startTime || Date.now());
      const end = editingShift.endTime ? new Date(editingShift.endTime) : undefined;
      const hours = end ? (end.getTime() - start.getTime()) / (1000 * 60 * 60) : undefined;

      const shiftData = {
          ...editingShift,
          id: editingShift.id || Date.now().toString(),
          startTime: start.toISOString(),
          endTime: end?.toISOString(),
          hoursWorked: hours
      } as Shift;

      if (editingShift.id) {
          onUpdateShift(shiftData);
      } else {
          onAddShift(shiftData);
      }
      setIsShiftModalOpen(false);
  };

  // --- Sub-Components ---

  const TeamTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredEmployees.map(emp => (
        <div key={emp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <img src={emp.image} alt={emp.name} className="w-12 h-12 rounded-full object-cover" />
                 <div>
                    <h3 className="font-bold text-gray-800">{emp.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{emp.role}</p>
                 </div>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${emp.status === 'clocked-in' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {emp.status === 'clocked-in' ? t('clocked_in') : t('clocked_out')}
              </span>
           </div>
           
           <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">{t('hourly_rate')}</span>
                 <span className="font-bold text-gray-800">{formatPrice(emp.hourlyRate)}/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">PIN</span>
                 <span className="font-mono text-gray-800">****</span>
              </div>
           </div>

           <div className="flex gap-2">
              <button 
                onClick={() => emp.status === 'clocked-in' ? onClockOut(emp.id) : onClockIn(emp.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                  emp.status === 'clocked-in' 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                 {emp.status === 'clocked-in' ? t('clock_out') : t('clock_in')}
              </button>
              <button 
                onClick={() => openEditEmployee(emp)}
                className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              >
                 <Edit2 size={16} />
              </button>
              <button 
                onClick={() => { if(confirm(t('delete') + '?')) onDeleteEmployee(emp.id); }}
                className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                 <Trash2 size={16} />
              </button>
           </div>
        </div>
      ))}
    </div>
  );

  const ShiftsTab = () => {
    const sortedShifts = [...shifts].sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
            <button 
                onClick={openAddShift}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
            >
                <Plus size={16} />
                {t('add_shift')}
            </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-4">{t('full_name')}</th>
                        <th className="px-6 py-4">{t('clock_in')}</th>
                        <th className="px-6 py-4">{t('clock_out')}</th>
                        <th className="px-6 py-4 text-right">{t('total_hours')}</th>
                        <th className="px-6 py-4 text-center">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {sortedShifts.map(shift => {
                        const emp = employees.find(e => e.id === shift.employeeId);
                        return (
                            <tr key={shift.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                                            {emp?.image && <img src={emp.image} className="w-full h-full object-cover" />}
                                        </div>
                                        <span className="font-medium text-gray-800">{emp?.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(shift.startTime).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {shift.endTime ? new Date(shift.endTime).toLocaleString() : <span className="text-green-500 font-bold">{t('active_shift')}</span>}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-sm">
                                    {shift.hoursWorked ? shift.hoursWorked.toFixed(2) + 'h' : '-'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => openEditShift(shift)} className="text-gray-400 hover:text-blue-500"><Edit2 size={16} /></button>
                                        <button onClick={() => onDeleteShift(shift.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    );
  };

  const PerformanceTab = () => {
    // ... (No changes needed for display logic)
    const stats = employees.map(emp => {
       const empSales = transactions
          .filter(t => t.employeeId === emp.id && t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
       
       const empShifts = shifts.filter(s => s.employeeId === emp.id && s.hoursWorked);
       const totalHours = empShifts.reduce((sum, s) => sum + (s.hoursWorked || 0), 0);
       const laborCost = totalHours * emp.hourlyRate;

       return { ...emp, totalSales: empSales, totalHours, laborCost };
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
                {stats.map(stat => (
                    <div key={stat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                             <img src={stat.image} className="w-10 h-10 rounded-full" />
                             <div>
                                <h3 className="font-bold text-gray-800">{stat.name}</h3>
                                <p className="text-xs text-gray-400 capitalize">{stat.role}</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-3 rounded-xl">
                                <p className="text-xs text-green-600 font-bold uppercase mb-1">{t('total_sales')}</p>
                                <p className="text-lg font-bold text-gray-800">{formatPrice(stat.totalSales)}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-xl">
                                <p className="text-xs text-blue-600 font-bold uppercase mb-1">{t('total_hours')}</p>
                                <p className="text-lg font-bold text-gray-800">{stat.totalHours.toFixed(1)}h</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">{t('staff')}</h1>
           <p className="text-gray-400 text-sm">{t('manage_staff')}</p>
        </div>
        <button 
            onClick={openAddEmployee}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
            <Plus size={18} />
            {t('add_employee')}
        </button>
      </header>

      {/* Tabs */}
      <div className="px-8 pt-6">
         <div className="flex gap-1 bg-gray-100 p-1 rounded-xl inline-flex">
            {(['team', 'shifts', 'performance'] as const).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeSubTab === tab 
                        ? 'bg-white text-gray-800 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {tab === 'team' && t('team_members')}
                    {tab === 'shifts' && t('shifts')}
                    {tab === 'performance' && t('performance')}
                </button>
            ))}
         </div>
      </div>

      <div className="p-8 overflow-y-auto">
         {activeSubTab === 'team' && <TeamTab />}
         {activeSubTab === 'shifts' && <ShiftsTab />}
         {activeSubTab === 'performance' && <PerformanceTab />}
      </div>

      {/* Add/Edit Employee Modal */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] relative">
                <button onClick={() => setIsEmployeeModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingEmployee.id ? t('edit_employee') : t('add_employee')}</h2>
                <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('full_name')}</label>
                            <input 
                                required
                                type="text" 
                                value={editingEmployee.name}
                                onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('role')}</label>
                            <select 
                                value={editingEmployee.role}
                                onChange={e => setEditingEmployee({...editingEmployee, role: e.target.value as UserRole})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow capitalize"
                            >
                                <option value="admin">Admin</option>
                                <option value="cashier">Cashier</option>
                                <option value="waiter">Waiter</option>
                            </select>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{t('hourly_rate')}</label>
                            <input 
                                type="number" 
                                value={editingEmployee.hourlyRate}
                                onChange={e => setEditingEmployee({...editingEmployee, hourlyRate: parseFloat(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">PIN</label>
                            <input 
                                type="text" 
                                maxLength={4}
                                value={editingEmployee.pin}
                                onChange={e => setEditingEmployee({...editingEmployee, pin: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                         </div>
                    </div>

                    <div className="pt-4">
                        <label className="block text-sm font-bold text-gray-800 mb-3">{t('permissions')}</label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['process_refund', 'void_order', 'apply_discount', 'manage_inventory', 'view_reports'] as Permission[]).map(perm => (
                                <button
                                    key={perm}
                                    type="button"
                                    onClick={() => togglePermission(perm)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                        editingEmployee.permissions?.includes(perm)
                                        ? 'border-brand-yellow bg-yellow-50 text-gray-900'
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${editingEmployee.permissions?.includes(perm) ? 'bg-brand-yellow border-brand-yellow' : 'border-gray-300'}`}>
                                        {editingEmployee.permissions?.includes(perm) && <Check size={10} className="text-white" />}
                                    </div>
                                    <span className="capitalize">{perm.replace('_', ' ')}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button 
                            type="button" 
                            onClick={() => setIsEmployeeModalOpen(false)}
                            className="flex-1 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-2 rounded-lg font-bold bg-brand-yellow text-gray-900 hover:bg-yellow-400"
                        >
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Add/Edit Shift Modal */}
      {isShiftModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setIsShiftModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingShift.id ? t('edit_shift') : t('add_shift')}</h2>
                <form onSubmit={handleShiftSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('select_employee')}</label>
                        <select 
                            value={editingShift.employeeId}
                            onChange={e => setEditingShift({...editingShift, employeeId: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            disabled={!!editingShift.id}
                        >
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('start_time')}</label>
                        <input 
                            required
                            type="datetime-local" 
                            value={editingShift.startTime}
                            onChange={e => setEditingShift({...editingShift, startTime: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('end_time')}</label>
                        <input 
                            type="datetime-local" 
                            value={editingShift.endTime || ''}
                            onChange={e => setEditingShift({...editingShift, endTime: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                        />
                        <p className="text-xs text-gray-400 mt-1">Leave blank if currently active</p>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full mt-4 py-3 rounded-xl font-bold bg-brand-yellow text-gray-900 hover:bg-yellow-400 shadow-lg shadow-yellow-200 transition-all"
                    >
                        {t('save')}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default StaffPanel;
