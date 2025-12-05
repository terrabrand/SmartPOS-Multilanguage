
import React, { useState } from 'react';
import { CartItem, Customer, Table, OrderType } from '../types';
import { CreditCard, Minus, Plus, User, FileText, ChevronDown, Utensils, ShoppingBag, Truck } from 'lucide-react';

interface OrderPanelProps {
  cart: CartItem[];
  customers: Customer[];
  tables: Table[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: (customerId: string | null, type: 'cash' | 'credit', orderType: OrderType, tableId?: string) => void;
  formatPrice: (amount: number) => string;
  t: (key: string) => string;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ 
    cart, customers, tables, updateQuantity, removeFromCart, onCheckout, formatPrice, t 
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  
  // New States
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedTable = tables.find(tbl => tbl.id === selectedTableId);
  
  // Filter available tables for selection
  const availableTables = tables.filter(tbl => tbl.status === 'available' || tbl.id === selectedTableId);

  const handleCheckout = (paymentType: 'cash' | 'credit') => {
    if (cart.length === 0) return;
    if (orderType === 'dine-in' && !selectedTableId) {
        alert(t('select_table')); // Basic validation
        return;
    }
    onCheckout(selectedCustomerId, paymentType, orderType, selectedTableId || undefined);
    
    // Reset local state after checkout
    setSelectedCustomerId(null);
    setSelectedTableId(null);
    setOrderType('dine-in');
  };

  return (
    <div className="w-96 bg-white h-full border-l border-gray-100 flex flex-col shadow-xl z-20">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{t('order_number')} #3024</h2>
        </div>

        {/* Order Type Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
            <button 
                onClick={() => setOrderType('dine-in')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${orderType === 'dine-in' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}
            >
                <Utensils size={14} />
                {t('dine_in')}
            </button>
            <button 
                 onClick={() => setOrderType('take-out')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${orderType === 'take-out' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}
            >
                <ShoppingBag size={14} />
                {t('take_out')}
            </button>
            <button 
                 onClick={() => setOrderType('delivery')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${orderType === 'delivery' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}
            >
                <Truck size={14} />
                {t('delivery')}
            </button>
        </div>

        {/* Table Selector (Only for Dine-in) */}
        {orderType === 'dine-in' && (
            <div className="mb-4">
                <select 
                    value={selectedTableId || ''}
                    onChange={(e) => setSelectedTableId(e.target.value)}
                    className={`w-full p-3 rounded-xl border appearance-none outline-none font-medium transition-colors cursor-pointer ${!selectedTableId ? 'border-brand-red/50 bg-red-50 text-brand-red' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                >
                    <option value="" disabled>{t('select_table')}</option>
                    {availableTables.map(tbl => (
                        <option key={tbl.id} value={tbl.id}>{tbl.name} ({tbl.seats} {t('seats')})</option>
                    ))}
                </select>
            </div>
        )}

        {/* Customer Selection */}
        <div className="relative">
            <button 
                onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-xl transition-colors border border-transparent focus:border-brand-yellow"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm overflow-hidden">
                        {selectedCustomer ? (
                            <img src={selectedCustomer.image} alt={selectedCustomer.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={16} />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">{selectedCustomer ? selectedCustomer.name : t('walk_in_customer')}</p>
                        {selectedCustomer && <p className="text-[10px] text-red-500 font-medium">{t('due')}: {formatPrice(selectedCustomer.balance)}</p>}
                    </div>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
            </button>

            {isCustomerDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50 max-h-60 overflow-y-auto">
                    <button 
                        onClick={() => { setSelectedCustomerId(null); setIsCustomerDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <User size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{t('walk_in_customer')}</span>
                    </button>
                    {customers.map(customer => (
                        <button 
                            key={customer.id}
                            onClick={() => { setSelectedCustomerId(customer.id); setIsCustomerDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                             <img src={customer.image} alt={customer.name} className="w-8 h-8 rounded-full object-cover" />
                             <div>
                                <p className="text-sm font-bold text-gray-800">{customer.name}</p>
                             </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <Plus className="opacity-20" size={32} />
            </div>
            <p>{t('no_items')}</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 group">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                <p className="text-gray-400 text-xs">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-bold text-gray-800 w-3 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-gray-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>{t('subtotal')}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>{t('tax')} (8%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-gray-800 font-bold text-xl pt-3 border-t border-gray-200">
            <span>{t('total')}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="space-y-3">
            <button 
                onClick={() => handleCheckout('cash')}
                disabled={cart.length === 0 || (orderType === 'dine-in' && !selectedTableId)}
                className="w-full bg-brand-yellow hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl shadow-lg shadow-yellow-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                <CreditCard size={20} />
                {t('pay_now')}
            </button>
            
            {selectedCustomer && (
                 <button 
                    onClick={() => handleCheckout('credit')}
                    disabled={cart.length === 0 || (orderType === 'dine-in' && !selectedTableId)}
                    className="w-full bg-white border-2 border-brand-yellow text-brand-dark font-bold py-3 rounded-xl hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    <FileText size={20} />
                    {t('charge_account')}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
