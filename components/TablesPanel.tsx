
import React, { useState } from 'react';
import { Table, TableStatus } from '../types';
import { Users, Clock, Plus, Edit2, Trash2, X } from 'lucide-react';

interface TablesPanelProps {
  tables: Table[];
  onAddTable: (table: Table) => void;
  onUpdateTable: (table: Table) => void;
  onDeleteTable: (id: string) => void;
  onUpdateTableStatus: (id: string, status: TableStatus) => void;
  t: (key: string) => string;
}

const TablesPanel: React.FC<TablesPanelProps> = ({ tables, onAddTable, onUpdateTable, onDeleteTable, onUpdateTableStatus, t }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Partial<Table>>({
      name: '', seats: 4
  });

  const getStatusColor = (status: TableStatus) => {
    switch(status) {
      case 'available': return 'bg-white border-gray-200 hover:border-green-400';
      case 'occupied': return 'bg-red-50 border-red-200';
      case 'reserved': return 'bg-yellow-50 border-yellow-200';
      case 'dirty': return 'bg-gray-100 border-gray-300';
      default: return 'bg-white';
    }
  };

  const getStatusBadge = (status: TableStatus) => {
    switch(status) {
      case 'available': return <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-[10px] font-bold uppercase">{t('available')}</span>;
      case 'occupied': return <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-[10px] font-bold uppercase">{t('occupied')}</span>;
      case 'reserved': return <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-[10px] font-bold uppercase">{t('reserved')}</span>;
      case 'dirty': return <span className="text-gray-600 bg-gray-200 px-2 py-1 rounded text-[10px] font-bold uppercase">{t('dirty')}</span>;
    }
  };

  const openAddModal = () => {
      setEditingTable({ name: '', seats: 4 });
      setIsModalOpen(true);
  };

  const openEditModal = (table: Table, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingTable({ ...table });
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingTable.id) {
          onUpdateTable(editingTable as Table);
      } else {
          onAddTable({
              id: Date.now().toString(),
              locationId: '', // Parent sets this
              name: editingTable.name || 'New Table',
              seats: Number(editingTable.seats) || 4,
              status: 'available'
          });
      }
      setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100 flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('tables')}</h1>
            <p className="text-gray-400 text-sm">{t('manage_tables')}</p>
         </div>
         <button 
            onClick={openAddModal}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
            <Plus size={18} />
            {t('add_table')}
        </button>
      </header>

      <div className="p-8 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tables.map(table => (
            <div 
              key={table.id}
              className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer shadow-sm group ${getStatusColor(table.status)}`}
              onClick={() => {
                  const nextStatus: Record<TableStatus, TableStatus> = {
                      'available': 'occupied',
                      'occupied': 'dirty',
                      'dirty': 'available',
                      'reserved': 'occupied'
                  };
                  onUpdateTableStatus(table.id, nextStatus[table.status]);
              }}
            >
              <div className="flex justify-between items-start mb-4">
                 <h3 className="font-bold text-xl text-gray-800">{table.name}</h3>
                 <div className="flex items-center gap-2">
                    {getStatusBadge(table.status)}
                 </div>
              </div>
              
              <div className="flex items-center justify-between text-gray-400 mb-6">
                 <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span className="text-sm font-medium">{table.seats}</span>
                 </div>
                 {/* Edit/Delete Actions */}
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={(e) => openEditModal(table, e)} className="p-1 hover:text-blue-500 bg-white rounded shadow-sm border border-gray-100"><Edit2 size={12} /></button>
                    <button onClick={() => { if(confirm(t('delete') + '?')) onDeleteTable(table.id); }} className="p-1 hover:text-red-500 bg-white rounded shadow-sm border border-gray-100"><Trash2 size={12} /></button>
                 </div>
              </div>

              {/* Hover Status Actions */}
              <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateTableStatus(table.id, 'available'); }}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-bold"
                    >
                        Free
                    </button>
                    <button 
                         onClick={(e) => { e.stopPropagation(); onUpdateTableStatus(table.id, 'occupied'); }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-xs font-bold"
                    >
                        Occupy
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Table Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl relative">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingTable.id ? t('edit_table') : t('add_table')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('table_name')}</label>
                        <input 
                            required
                            type="text" 
                            value={editingTable.name}
                            onChange={e => setEditingTable({...editingTable, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            placeholder="e.g. Table 5"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('seat_count')}</label>
                        <input 
                            required
                            type="number" 
                            min="1"
                            value={editingTable.seats}
                            onChange={e => setEditingTable({...editingTable, seats: Number(e.target.value)})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                        />
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

export default TablesPanel;
