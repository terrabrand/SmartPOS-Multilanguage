
import React, { useState } from 'react';
import { TemplateProduct } from '../types';
import { Plus, Search, Edit2, Trash2, X, Download, Database, Layers } from 'lucide-react';

interface DemoContentPanelProps {
  templates: TemplateProduct[];
  isSuperAdmin: boolean;
  onAddTemplate: (template: TemplateProduct) => void;
  onUpdateTemplate: (template: TemplateProduct) => void;
  onDeleteTemplate: (id: string) => void;
  onImportTemplate: (template: TemplateProduct) => void;
  onImportGroup: (category: string) => void;
  formatPrice: (amount: number) => string;
  t: (key: string) => string;
}

const DemoContentPanel: React.FC<DemoContentPanelProps> = ({ 
  templates, isSuperAdmin, 
  onAddTemplate, onUpdateTemplate, onDeleteTemplate, 
  onImportTemplate, onImportGroup,
  formatPrice, t 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<TemplateProduct>>({
    name: '', price: 0, wholesalePrice: 0, weight: '', category: 'General'
  });
  
  // Feedback state
  const [importedId, setImportedId] = useState<string | null>(null);

  const filteredTemplates = templates.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group templates by Category
  const groupedTemplates = filteredTemplates.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
  }, {} as Record<string, TemplateProduct[]>);

  const handleOpenAdd = () => {
    setEditingTemplate({
        name: '', price: 0, wholesalePrice: 0, weight: '', category: 'General'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (template: TemplateProduct) => {
      setEditingTemplate({ ...template });
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate.id) {
        onUpdateTemplate(editingTemplate as TemplateProduct);
    } else {
        const newTemp: TemplateProduct = {
            id: `tp_${Date.now()}`,
            name: editingTemplate.name || 'New Template',
            price: Number(editingTemplate.price),
            wholesalePrice: Number(editingTemplate.wholesalePrice),
            weight: editingTemplate.weight || 'N/A',
            category: editingTemplate.category || 'General',
            image: editingTemplate.image || `https://picsum.photos/seed/${Date.now()}/300/300`
        };
        onAddTemplate(newTemp);
    }
    setIsModalOpen(false);
  };

  const handleImportClick = (template: TemplateProduct) => {
      onImportTemplate(template);
      setImportedId(template.id);
      setTimeout(() => setImportedId(null), 2000);
  };

  const handleGroupImportClick = (category: string) => {
      if (window.confirm(`Import all items from "${category}"?`)) {
          onImportGroup(category);
          alert('Batch import successful!');
      }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">{t('demo_content')}</h1>
           <p className="text-gray-400 text-sm">{isSuperAdmin ? 'Manage system-wide template products' : t('demo_content_desc')}</p>
        </div>
        {isSuperAdmin && (
            <button 
                onClick={handleOpenAdd}
                className="bg-brand-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
            >
                <Plus size={18} />
                {t('add_template')}
            </button>
        )}
      </header>

      <div className="p-8 overflow-y-auto">
         {/* Search */}
         <div className="mb-6 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('search') + " templates..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-sm outline-none shadow-sm focus:ring-2 focus:ring-brand-yellow/50 transition-all placeholder-gray-300 border border-transparent"
            />
        </div>

        <div className="space-y-8">
            {Object.keys(groupedTemplates).length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <Database size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No template content found.</p>
                </div>
            )}

            {Object.entries(groupedTemplates).map(([category, items]: [string, TemplateProduct[]]) => (
                <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Layers size={18} className="text-brand-dark" />
                            <h3 className="font-bold text-gray-800 text-lg">{category}</h3>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{items.length} items</span>
                        </div>
                        {!isSuperAdmin && (
                            <button 
                                onClick={() => handleGroupImportClick(category)}
                                className="flex items-center gap-2 text-xs font-bold bg-brand-yellow text-gray-900 px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-colors"
                            >
                                <Download size={14} />
                                {t('import_group')}
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                        {items.map(template => (
                            <div key={template.id} className="border border-gray-100 rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow relative group">
                                <div className="aspect-square rounded-lg bg-gray-100 mb-4 overflow-hidden">
                                    <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">{template.name}</h4>
                                <p className="text-xs text-gray-400 mb-3">{template.weight}</p>
                                <div className="flex justify-between items-end mt-auto">
                                    <div>
                                        <p className="font-bold text-brand-dark">{formatPrice(template.price)}</p>
                                        <p className="text-[10px] text-gray-400">WS: {formatPrice(template.wholesalePrice)}</p>
                                    </div>
                                    
                                    {isSuperAdmin ? (
                                        <div className="flex gap-1">
                                            <button onClick={() => handleOpenEdit(template)} className="p-2 bg-gray-100 rounded hover:bg-blue-50 hover:text-blue-600"><Edit2 size={14} /></button>
                                            <button onClick={() => onDeleteTemplate(template.id)} className="p-2 bg-gray-100 rounded hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleImportClick(template)}
                                            disabled={importedId === template.id}
                                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                                importedId === template.id 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-900 text-white hover:bg-gray-700'
                                            }`}
                                        >
                                            {importedId === template.id ? 'Imported' : t('import')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

       {/* Add/Edit Modal (Super Admin Only) */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
             <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingTemplate.id ? t('edit_template') : t('add_template')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('item_name')}</label>
                        <input 
                            required
                            type="text" 
                            value={editingTemplate.name}
                            onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                        />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('group_category')}</label>
                         <input 
                            required
                            type="text"
                            value={editingTemplate.category}
                            onChange={e => setEditingTemplate({...editingTemplate, category: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            placeholder="e.g. Starter Kit: Burgers"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('retail_price')}</label>
                            <input 
                                required
                                type="number" 
                                step="0.01"
                                value={editingTemplate.price}
                                onChange={e => setEditingTemplate({...editingTemplate, price: parseFloat(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('wholesale_price')}</label>
                            <input 
                                required
                                type="number" 
                                step="0.01"
                                value={editingTemplate.wholesalePrice}
                                onChange={e => setEditingTemplate({...editingTemplate, wholesalePrice: parseFloat(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-brand-yellow"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('weight_size')}</label>
                        <input 
                            type="text" 
                            value={editingTemplate.weight}
                            onChange={e => setEditingTemplate({...editingTemplate, weight: e.target.value})}
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

export default DemoContentPanel;
