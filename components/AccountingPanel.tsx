
import React, { useState } from 'react';
import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import { ArrowUpRight, ArrowDownLeft, DollarSign, Plus } from 'lucide-react';

interface AccountingPanelProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  formatPrice: (amount: number) => string;
  t: (key: string) => string;
}

const AccountingPanel: React.FC<AccountingPanelProps> = ({ transactions, onAddTransaction, formatPrice, t }) => {
  const [activeType, setActiveType] = useState<TransactionType>('income');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>({ 
      type: 'income', 
      category: INCOME_CATEGORIES[0], 
      amount: 0, 
      description: '' 
  });

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = income - expenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: newTrans.type as TransactionType,
      category: newTrans.category || 'Other',
      amount: Number(newTrans.amount),
      description: newTrans.description || ''
    });
    setIsModalOpen(false);
    setNewTrans({ type: 'income', category: INCOME_CATEGORIES[0], amount: 0, description: '' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">{t('accounting')}</h1>
           <p className="text-gray-400 text-sm">{t('track_financials')}</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
            <Plus size={18} />
            {t('add_transaction')}
        </button>
      </header>

      <div className="p-8 overflow-y-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <ArrowDownLeft size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-400 font-medium">{t('total_income')}</p>
                    <p className="text-2xl font-bold text-gray-800">{formatPrice(income)}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                    <ArrowUpRight size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-400 font-medium">{t('total_expenses')}</p>
                    <p className="text-2xl font-bold text-gray-800">{formatPrice(expenses)}</p>
                </div>
            </div>
            <div className="bg-brand-dark p-6 rounded-2xl shadow-lg shadow-gray-200 flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <DollarSign size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-300 font-medium">{t('net_profit')}</p>
                    <p className="text-2xl font-bold">{formatPrice(profit)}</p>
                </div>
            </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">{t('recent_transactions')}</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveType('income')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeType === 'income' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        {t('income')}
                    </button>
                    <button 
                        onClick={() => setActiveType('expense')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeType === 'expense' ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        {t('expenses')}
                    </button>
                </div>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4">{t('description')}</th>
                        <th className="px-6 py-4">{t('category')}</th>
                        <th className="px-6 py-4">{t('date')}</th>
                        <th className="px-6 py-4 text-right">{t('amount')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {transactions
                        .filter(t => t.type === activeType)
                        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(t => (
                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                        {t.type === 'income' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                    </div>
                                    <span className="font-medium text-gray-800">{t.description || 'No description'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">{t.category}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(t.date).toLocaleDateString()}
                            </td>
                            <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                {t.type === 'income' ? '+' : '-'}{formatPrice(t.amount)}
                            </td>
                        </tr>
                    ))}
                    {transactions.filter(t => t.type === activeType).length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                {t('no_transactions')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

       {/* Add Transaction Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('add_transaction')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4 mb-4">
                        <button 
                            type="button"
                            onClick={() => setNewTrans({...newTrans, type: 'income', category: INCOME_CATEGORIES[0]})}
                            className={`flex-1 py-2 rounded-lg font-medium border-2 transition-all ${newTrans.type === 'income' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-400'}`}
                        >
                            {t('income')}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setNewTrans({...newTrans, type: 'expense', category: EXPENSE_CATEGORIES[0]})}
                            className={`flex-1 py-2 rounded-lg font-medium border-2 transition-all ${newTrans.type === 'expense' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-400'}`}
                        >
                            {t('expenses')}
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('amount')}</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input 
                                required
                                type="number" 
                                step="0.01"
                                value={newTrans.amount}
                                onChange={e => setNewTrans({...newTrans, amount: parseFloat(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-8 pr-4 outline-none focus:border-brand-yellow"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('category')}</label>
                        <select 
                            value={newTrans.category}
                            onChange={e => setNewTrans({...newTrans, category: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                        >
                            {(newTrans.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{t('description')}</label>
                        <input 
                            required
                            type="text" 
                            value={newTrans.description}
                            onChange={e => setNewTrans({...newTrans, description: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            placeholder="e.g., Weekly vegetable supply"
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

export default AccountingPanel;
