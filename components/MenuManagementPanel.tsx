
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface MenuManagementPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  formatPrice: (amount: number) => string;
  t: (key: string) => string;
}

const MenuManagementPanel: React.FC<MenuManagementPanelProps> = ({ 
  products, onAddProduct, onUpdateProduct, onDeleteProduct, formatPrice, t 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    wholesalePrice: 0,
    weight: '',
    category: Category.BURGERS
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct({
        name: '',
        price: 0,
        wholesalePrice: 0,
        weight: '',
        category: Category.BURGERS
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
      setEditingProduct({ ...product });
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct.id) {
        // Update existing
        onUpdateProduct(editingProduct as Product);
    } else {
        // Create new
        const newProd: Product = {
            id: Date.now().toString(),
            organizationId: '', // Placeholder, will be set by parent
            name: editingProduct.name || 'New Item',
            price: Number(editingProduct.price),
            wholesalePrice: Number(editingProduct.wholesalePrice),
            weight: editingProduct.weight || 'N/A',
            category: editingProduct.category as Category,
            image: editingProduct.image || `https://picsum.photos/seed/${Date.now()}/300/300` 
        };
        onAddProduct(newProd);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">{t('menu')}</h1>
           <p className="text-gray-400 text-sm">{t('manage_menu')}</p>
        </div>
        <button 
            onClick={handleOpenAdd}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
            <Plus size={18} />
            {t('add_item')}
        </button>
      </header>

      <div className="p-8 overflow-y-auto">
         {/* Search */}
         <div className="mb-6 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('search') + " products..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-sm outline-none shadow-sm focus:ring-2 focus:ring-brand-yellow/50 transition-all placeholder-gray-300 border border-transparent"
            />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-4">{t('item_name')}</th>
                        <th className="px-6 py-4">{t('category')}</th>
                        <th className="px-6 py-4 text-right">{t('retail_price')}</th>
                        <th className="px-6 py-4 text-right">{t('wholesale_price')}</th>
                        <th className="px-6 py-4 text-center">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-800">{product.name}</p>
                                        <p className="text-xs text-gray-400">{product.weight}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium uppercase">{product.category}</span>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-gray-800">
                                {formatPrice(product.price)}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-gray-500">
                                {formatPrice(product.wholesalePrice)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button 
                                        onClick={() => handleOpenEdit(product)}
                                        className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(window.confirm('Are you sure you want to delete this item?')) {
                                                onDeleteProduct(product.id);
                                            }
                                        }}
                                        className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

       {/* Add/Edit Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
             <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingProduct.id ? t('edit_product') : t('add_new_item')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('item_name')}</label>
                        <input 
                            required
                            type="text" 
                            value={editingProduct.name}
                            onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('retail_price')}</label>
                            <input 
                                required
                                type="number" 
                                step="0.01"
                                value={editingProduct.price}
                                onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('wholesale_price')}</label>
                            <input 
                                required
                                type="number" 
                                step="0.01"
                                value={editingProduct.wholesalePrice}
                                onChange={e => setEditingProduct({...editingProduct, wholesalePrice: parseFloat(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('weight_size')}</label>
                            <input 
                                type="text" 
                                value={editingProduct.weight}
                                onChange={e => setEditingProduct({...editingProduct, weight: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('category')}</label>
                            <select 
                                value={editingProduct.category}
                                onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            >
                                {Object.values(Category).map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
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

export default MenuManagementPanel;
