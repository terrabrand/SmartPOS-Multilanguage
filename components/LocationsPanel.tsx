
import React, { useState } from 'react';
import { Location, Transaction, Employee, Organization } from '../types';
import { MapPin, Plus, Store, Users, Edit2, Trash2, X, AlertTriangle, Building2, Globe } from 'lucide-react';

interface LocationsPanelProps {
  locations: Location[];
  transactions: Transaction[];
  employees: Employee[];
  organizations?: Organization[]; // Added for Super Admin View
  isSuperAdmin?: boolean;
  onAddLocation: (location: Location) => void;
  onUpdateLocation: (location: Location) => void;
  onDeleteLocation: (id: string) => void;
  formatPrice: (amount: number) => string;
  t: (key: string) => string;
}

const LocationsPanel: React.FC<LocationsPanelProps> = ({ 
  locations, transactions, employees, organizations, isSuperAdmin, onAddLocation, onUpdateLocation, onDeleteLocation, formatPrice, t 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Partial<Location>>({ name: '', address: '', type: 'Branch' });
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  const openAddModal = () => {
      setEditingLocation({ name: '', address: '', type: 'Branch' });
      setIsModalOpen(true);
  };

  const openEditModal = (loc: Location) => {
      setEditingLocation({ ...loc });
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLocation.id) {
        onUpdateLocation(editingLocation as Location);
    } else {
        onAddLocation({
            id: `loc_${Date.now()}`,
            organizationId: '', // Filled by App.tsx
            name: editingLocation.name || 'New Branch',
            address: editingLocation.address || '',
            phone: '',
            type: editingLocation.type as any,
            status: 'active'
        });
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
      if (locationToDelete) {
          onDeleteLocation(locationToDelete);
          setLocationToDelete(null);
      }
  };

  if (isSuperAdmin) {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
             <header className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
                    <p className="text-gray-400 text-sm">Manage SaaS Tenants</p>
                </div>
            </header>
            <div className="p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations?.map(org => (
                        <div key={org.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Building2 size={24} />
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${org.plan === 'pro' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>{org.plan}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                                <p className="text-sm text-gray-400">ID: {org.id}</p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs text-gray-400">Created: {new Date(org.createdAt).toLocaleDateString()}</span>
                                <button className="text-sm font-bold text-brand-dark hover:underline">Manage</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">{t('locations')}</h1>
           <p className="text-gray-400 text-sm">{t('manage_locations')}</p>
        </div>
        <button 
            onClick={openAddModal}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
            <Plus size={18} />
            {t('add_location')}
        </button>
      </header>

      <div className="p-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map(loc => {
                const locSales = transactions
                    .filter(t => t.locationId === loc.id && t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                
                const staffCount = employees.filter(e => e.locationId === loc.id).length;
                const activeStaff = employees.filter(e => e.locationId === loc.id && e.status === 'clocked-in').length;

                return (
                    <div key={loc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all relative">
                        {/* Actions */}
                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => openEditModal(loc)}
                                className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => setLocationToDelete(loc.id)}
                                className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-brand-yellow/20 group-hover:text-brand-dark transition-colors">
                                <Store size={24} />
                            </div>
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-bold uppercase">{loc.type}</span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-1 pr-12">{loc.name}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mb-6">
                            <MapPin size={14} />
                            {loc.address}
                        </p>

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t('total_sales')}</p>
                                <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
                                    {formatPrice(locSales)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t('active_staff')}</p>
                                <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
                                    <Users size={16} className="text-gray-400" />
                                    {activeStaff} <span className="text-sm text-gray-400 font-medium">/ {staffCount}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

       {/* Add/Edit Location Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingLocation.id ? t('edit_location') : t('add_location')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('item_name')}</label>
                        <input 
                            required
                            type="text" 
                            value={editingLocation.name}
                            onChange={e => setEditingLocation({...editingLocation, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            placeholder="Downtown Branch"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('address')}</label>
                        <input 
                            required
                            type="text" 
                            value={editingLocation.address}
                            onChange={e => setEditingLocation({...editingLocation, address: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            placeholder="123 Main St"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('type')}</label>
                        <select 
                            value={editingLocation.type}
                            onChange={e => setEditingLocation({...editingLocation, type: e.target.value as any})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                        >
                            <option value="Branch">Branch</option>
                            <option value="HQ">HQ</option>
                            <option value="Pop-up">Pop-up</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
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

      {/* Delete Confirmation Modal */}
      {locationToDelete && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
                      <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{t('delete')}?</h3>
                  <p className="text-gray-500 text-sm mb-6">
                      {t('delete_location_confirm')}
                  </p>
                  <div className="flex w-full gap-3">
                      <button 
                          onClick={() => setLocationToDelete(null)}
                          className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                          {t('cancel')}
                      </button>
                      <button 
                          onClick={confirmDelete}
                          className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                      >
                          {t('confirm')}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LocationsPanel;
