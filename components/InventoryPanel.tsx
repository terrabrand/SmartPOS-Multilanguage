
import React, { useState } from 'react';
import { Ingredient, Transaction } from '../types';
import { AlertTriangle, Plus, Trash2, Package, Edit2, X } from 'lucide-react';

interface InventoryPanelProps {
  inventory: Ingredient[];
  onUpdateStock: (id: string, newQuantity: number) => void;
  onAddTransaction: (t: Transaction) => void;
  onAddIngredient: (ingredient: Ingredient) => void;
  onUpdateIngredient: (ingredient: Ingredient) => void;
  onDeleteIngredient: (id: string) => void;
  t: (key: string) => string;
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ 
  inventory, onUpdateStock, onAddTransaction, onAddIngredient, onUpdateIngredient, onDeleteIngredient, t 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);
  const [actionType, setActionType] = useState<'restock' | 'waste' | null>(null);
  const [amount, setAmount] = useState(0);

  // Edit/Create Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Partial<Ingredient>>({
    name: '', unit: 'pcs', quantity: 0, costPerUnit: 0, lowStockThreshold: 10
  });

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !actionType) return;

    let newQty = selectedItem.quantity;
    if (actionType === 'restock') {
      newQty += amount;
      // Log expense for restocking
      onAddTransaction({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'expense',
        category: 'Inventory',
        amount: amount * selectedItem.costPerUnit,
        description: `Restock: ${selectedItem.name} x${amount}`
      });
    } else {
      newQty = Math.max(0, newQty - amount);
      // Log waste as expense (loss)
      onAddTransaction({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'expense',
        category: 'Waste',
        amount: amount * selectedItem.costPerUnit,
        description: `Waste: ${selectedItem.name} x${amount}`
      });
    }

    onUpdateStock(selectedItem.id, newQty);
    setSelectedItem(null);
    setActionType(null);
    setAmount(0);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingIngredient.id) {
          onUpdateIngredient(editingIngredient as Ingredient);
      } else {
          onAddIngredient({
              id: Date.now().toString(),
              locationId: '', // Set by parent
              name: editingIngredient.name || 'New Item',
              unit: editingIngredient.unit || 'pcs',
              quantity: Number(editingIngredient.quantity),
              costPerUnit: Number(editingIngredient.costPerUnit),
              lowStockThreshold: Number(editingIngredient.lowStockThreshold)
          });
      }
      setIsEditModalOpen(false);
  };

  const openAddModal = () => {
      setEditingIngredient({ name: '', unit: 'pcs', quantity: 0, costPerUnit: 0, lowStockThreshold: 10 });
      setIsEditModalOpen(true);
  };

  const openEditModal = (item: Ingredient) => {
      setEditingIngredient({ ...item });
      setIsEditModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100 flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('inventory')}</h1>
            <p className="text-gray-400 text-sm">{t('manage_inventory')}</p>
         </div>
         <button 
            onClick={openAddModal}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
            <Plus size={18} />
            {t('add_ingredient')}
        </button>
      </header>

      <div className="p-8 overflow-y-auto">
        <div className="mb-6 flex gap-4">
           <input 
              type="text" 
              placeholder={t('search') + " ingredients..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-white border-0 rounded-xl px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-brand-yellow/50"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map(item => {
            const isLowStock = item.quantity <= item.lowStockThreshold;
            return (
              <div key={item.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${isLowStock ? 'border-red-200 shadow-red-50' : 'border-gray-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLowStock ? 'bg-red-100 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    <Package size={20} />
                  </div>
                  <div className="flex gap-1">
                      <button onClick={() => openEditModal(item)} className="p-1 text-gray-400 hover:text-blue-500 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => { if(confirm(t('delete') + '?')) onDeleteIngredient(item.id); }} className="p-1 text-gray-400 hover:text-red-500 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
                
                {isLowStock && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase tracking-wider w-fit mb-2">
                      <AlertTriangle size={10} />
                      {t('low_stock')}
                    </span>
                  )}

                <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{t('unit')}: {item.unit}</p>
                
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-xs text-gray-500 font-medium uppercase">{t('current_qty')}</span>
                    <p className={`text-2xl font-bold ${isLowStock ? 'text-red-500' : 'text-gray-800'}`}>
                      {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { setSelectedItem(item); setActionType('restock'); }}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-600 transition-colors"
                  >
                    <Plus size={14} />
                    {t('restock')}
                  </button>
                  <button 
                    onClick={() => { setSelectedItem(item); setActionType('waste'); }}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 hover:bg-red-50 text-xs font-bold text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                    {t('waste')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restock/Waste Modal */}
      {selectedItem && actionType && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-2">
              {actionType === 'restock' ? t('restock') : t('waste')} : {selectedItem.name}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {actionType === 'restock' 
                ? 'Add new inventory. This will be logged as an expense.' 
                : 'Record spoiled or wasted inventory.'}
            </p>
            
            <form onSubmit={handleAction}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('amount')} ({selectedItem.unit})</label>
                <input 
                  type="number" 
                  autoFocus
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-brand-yellow"
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setSelectedItem(null); setActionType(null); }}
                  className="flex-1 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50"
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg ${
                    actionType === 'restock' 
                    ? 'bg-brand-dark hover:bg-gray-800' 
                    : 'bg-red-500 hover:bg-red-600 shadow-red-200'
                  }`}
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Ingredient Modal */}
      {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingIngredient.id ? t('edit_ingredient') : t('add_ingredient')}</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('item_name')}</label>
                        <input 
                            required
                            type="text" 
                            value={editingIngredient.name}
                            onChange={e => setEditingIngredient({...editingIngredient, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('unit')}</label>
                            <input 
                                required
                                type="text" 
                                value={editingIngredient.unit}
                                onChange={e => setEditingIngredient({...editingIngredient, unit: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                                placeholder="e.g., kg, pcs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('current_qty')}</label>
                            <input 
                                required
                                type="number" 
                                value={editingIngredient.quantity}
                                onChange={e => setEditingIngredient({...editingIngredient, quantity: Number(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('cost_per_unit')}</label>
                            <input 
                                required
                                type="number"
                                step="0.01"
                                value={editingIngredient.costPerUnit}
                                onChange={e => setEditingIngredient({...editingIngredient, costPerUnit: Number(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('low_stock_threshold')}</label>
                            <input 
                                required
                                type="number" 
                                value={editingIngredient.lowStockThreshold}
                                onChange={e => setEditingIngredient({...editingIngredient, lowStockThreshold: Number(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                        </div>
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

export default InventoryPanel;
