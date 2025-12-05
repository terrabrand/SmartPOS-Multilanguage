
import React, { useState } from 'react';
import { Customer } from '../types';
import { Plus, Search, Mail, Phone, MoreHorizontal } from 'lucide-react';

interface CustomerPanelProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  formatPrice: (amount: number) => string;
  t: (key: string) => string;
}

const CustomerPanel: React.FC<CustomerPanelProps> = ({ customers, onAddCustomer, formatPrice, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomer({
      id: Date.now().toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      balance: 0,
      image: `https://ui-avatars.com/api/?name=${newCustomer.name}&background=random`
    });
    setNewCustomer({ name: '', email: '', phone: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">{t('customers')}</h1>
           <p className="text-gray-400 text-sm">{t('manage_customers')}</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
            <Plus size={18} />
            {t('add_customer')}
        </button>
      </header>

      <div className="p-8 overflow-y-auto">
        {/* Search */}
        <div className="mb-8 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('search_customers')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-sm outline-none shadow-sm focus:ring-2 focus:ring-brand-yellow/50 transition-all placeholder-gray-300 border border-transparent"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCustomers.map(customer => (
                <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <img src={customer.image} alt={customer.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{customer.name}</h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-2">
                            <Mail size={14} />
                            <span className="truncate">{customer.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{customer.phone || 'No phone'}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('balance')}</span>
                        <span className={`font-bold ${customer.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {formatPrice(customer.balance)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('add_customer')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('full_name')}</label>
                        <input 
                            required
                            type="text" 
                            value={newCustomer.name}
                            onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('email')}</label>
                        <input 
                            required
                            type="email" 
                            value={newCustomer.email}
                            onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('phone')}</label>
                        <input 
                            type="tel" 
                            value={newCustomer.phone}
                            onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            placeholder="+1 234 567 8900"
                        />
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
    </div>
  );
};

export default CustomerPanel;
