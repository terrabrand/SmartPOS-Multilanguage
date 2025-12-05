
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import OrderPanel from './components/OrderPanel';
import CustomerPanel from './components/CustomerPanel';
import AccountingPanel from './components/AccountingPanel';
import SettingsPanel from './components/SettingsPanel';
import InventoryPanel from './components/InventoryPanel';
import TablesPanel from './components/TablesPanel';
import StaffPanel from './components/StaffPanel';
import LocationsPanel from './components/LocationsPanel';
import MenuManagementPanel from './components/MenuManagementPanel';
import DemoContentPanel from './components/DemoContentPanel';
import AuthPage from './components/AuthPage';
import { Product, CartItem, Category, Customer, Transaction, UserRole, AppSettings, Ingredient, Table, OrderType, TableStatus, Employee, Shift, Location, User, Organization, TemplateProduct } from './types';
import { CURRENCIES, TRANSLATIONS, MOCK_INVENTORY, MOCK_TABLES, MOCK_EMPLOYEES, MOCK_SHIFTS, MOCK_LOCATIONS, MOCK_PRODUCTS, MOCK_USERS, MOCK_ORGS, MOCK_CUSTOMERS, MOCK_TRANSACTIONS, MOCK_TEMPLATE_PRODUCTS } from './constants';
import { loadFromStorage, saveToStorage, STORAGE_KEYS, clearStorage } from './services/storageService';
import { Search, ChevronLeft, Wifi, WifiOff, RefreshCw, MapPin, ChevronDown, Maximize2, Minimize2, Globe } from 'lucide-react';

const App: React.FC = () => {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('smartpos_current_user', null));
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(() => loadFromStorage('smartpos_current_org', null));

  // If super admin, they can view data of a specific org (context)
  // If null, they see global view (or we default to first org)
  const [superAdminContextOrgId, setSuperAdminContextOrgId] = useState<string | null>(null);

  // --- DATA STATE ---
  const [activeTab, setActiveTab] = useState('pos');
  const [settings, setSettings] = useState<AppSettings>(() => 
    loadFromStorage(STORAGE_KEYS.SETTINGS, { currency: 'TZS', language: 'en' })
  );
  
  const [cart, setCart] = useState<CartItem[]>([]);

  // Initialize with ALL data, filtering happens during render/access
  const [organizations, setOrganizations] = useState<Organization[]>(() => loadFromStorage('smartpos_orgs', MOCK_ORGS));
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS));
  const [templateProducts, setTemplateProducts] = useState<TemplateProduct[]>(() => loadFromStorage(STORAGE_KEYS.TEMPLATE_PRODUCTS, MOCK_TEMPLATE_PRODUCTS));
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage(STORAGE_KEYS.TRANSACTIONS, MOCK_TRANSACTIONS));
  const [inventory, setInventory] = useState<Ingredient[]>(() => loadFromStorage(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY));
  const [tables, setTables] = useState<Table[]>(() => loadFromStorage(STORAGE_KEYS.TABLES, MOCK_TABLES));
  const [employees, setEmployees] = useState<Employee[]>(() => loadFromStorage(STORAGE_KEYS.EMPLOYEES, MOCK_EMPLOYEES));
  const [shifts, setShifts] = useState<Shift[]>(() => loadFromStorage(STORAGE_KEYS.SHIFTS, MOCK_SHIFTS));
  const [locations, setLocations] = useState<Location[]>(() => loadFromStorage(STORAGE_KEYS.LOCATIONS, MOCK_LOCATIONS));

  // Locations View State
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Super Admin Context Switcher
  const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);

  // Network State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // UI State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.BURGERS);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // --- Persistence Effects ---
  useEffect(() => { saveToStorage('smartpos_current_user', currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage('smartpos_current_org', currentOrg); }, [currentOrg]);
  useEffect(() => { saveToStorage('smartpos_orgs', organizations); }, [organizations]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  // Note: We don't persist CART to storage in this multi-tenant demo to avoid mixing carts on logout/login easily
  useEffect(() => { saveToStorage(STORAGE_KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TEMPLATE_PRODUCTS, templateProducts); }, [templateProducts]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.CUSTOMERS, customers); }, [customers]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.INVENTORY, inventory); }, [inventory]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TABLES, tables); }, [tables]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.EMPLOYEES, employees); }, [employees]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SHIFTS, shifts); }, [shifts]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.LOCATIONS, locations); }, [locations]);

  // --- Network Listeners ---
  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        setIsSyncing(true);
        setTimeout(() => { setIsSyncing(false); }, 2500);
    };
    const handleOffline = () => { setIsOnline(false); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- Helpers ---
  const t = (key: string): string => TRANSLATIONS[key]?.[settings.language] || key;

  const formatPrice = (amount: number): string => {
    const currency = CURRENCIES[settings.currency];
    const convertedAmount = amount * currency.rate;
    return new Intl.NumberFormat(settings.language === 'en' ? 'en-US' : 'sw-TZ', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals
    }).format(convertedAmount);
  };

  // --- Multi-Tenancy Logic ---
  
  // Determine the effective Organization ID for data filtering
  const getContextOrgId = () => {
      if (!currentUser) return '';
      if (currentUser.role === 'super_admin') {
          return superAdminContextOrgId || organizations[0]?.id || ''; 
      }
      return currentUser.organizationId;
  };

  const contextOrgId = getContextOrgId();
  const contextOrgName = organizations.find(o => o.id === contextOrgId)?.name || 'Unknown';

  // Filter Data based on Context Org
  const orgProducts = products.filter(x => x.organizationId === contextOrgId);
  const orgCustomers = customers.filter(x => x.organizationId === contextOrgId);
  const orgTransactions = transactions.filter(x => x.organizationId === contextOrgId);
  const orgInventory = inventory.filter(x => x.organizationId === contextOrgId);
  const orgTables = tables.filter(x => x.organizationId === contextOrgId);
  const orgEmployees = employees.filter(x => x.organizationId === contextOrgId);
  const orgShifts = shifts.filter(x => x.organizationId === contextOrgId);
  const orgLocations = locations.filter(x => x.organizationId === contextOrgId);

  // Filter Data based on Selected Location (Branch)
  const getActiveLocationName = () => {
      if (selectedLocationId === 'all') return t('all_locations');
      return orgLocations.find(l => l.id === selectedLocationId)?.name || 'Unknown';
  };

  const getCurrentLocationId = () => selectedLocationId === 'all' ? orgLocations[0]?.id : selectedLocationId;

  const filteredTransactions = selectedLocationId === 'all' ? orgTransactions : orgTransactions.filter(t => t.locationId === selectedLocationId);
  const filteredInventory = selectedLocationId === 'all' ? orgInventory : orgInventory.filter(i => i.locationId === selectedLocationId);
  const filteredTables = selectedLocationId === 'all' ? orgTables : orgTables.filter(t => t.locationId === selectedLocationId);
  const filteredEmployees = selectedLocationId === 'all' ? orgEmployees : orgEmployees.filter(e => e.locationId === selectedLocationId);


  // --- Actions ---

  const handleLogin = (user: User, org: Organization | null) => {
    setCurrentUser(user);
    setCurrentOrg(org);
    setActiveTab('pos');
    // If super admin, default context to first org
    if (user.role === 'super_admin' && !superAdminContextOrgId) {
        setSuperAdminContextOrgId(organizations[0]?.id || null);
    }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setCurrentOrg(null);
      setCart([]);
      setActiveTab('pos');
  };

  const handleRegister = (user: User, org: Organization) => {
      setOrganizations(prev => [...prev, org]);
      // Also Add user to MOCK_USERS equivalent in state (not implemented deeply here, we just log them in)
      setCurrentUser(user);
      setCurrentOrg(org);
      setActiveTab('pos');
  };

  // --- CRUD Wrappers (Inject Org ID) ---

  const handleAddProduct = (p: Product) => setProducts(prev => [...prev, { ...p, organizationId: contextOrgId }]);
  const handleUpdateProduct = (p: Product) => setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  const handleDeleteProduct = (id: string) => setProducts(prev => prev.filter(x => x.id !== id));

  // Demo Content / Templates (Global)
  const handleAddTemplate = (tp: TemplateProduct) => setTemplateProducts(prev => [...prev, tp]);
  const handleUpdateTemplate = (tp: TemplateProduct) => setTemplateProducts(prev => prev.map(x => x.id === tp.id ? tp : x));
  const handleDeleteTemplate = (id: string) => setTemplateProducts(prev => prev.filter(x => x.id !== id));
  
  const handleImportTemplate = (tp: TemplateProduct) => {
      const newProduct: Product = {
          id: `imp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          organizationId: contextOrgId,
          name: tp.name,
          weight: tp.weight,
          price: tp.price,
          wholesalePrice: tp.wholesalePrice,
          image: tp.image,
          category: Category.BURGERS // Default category if not mapped, simplistic for demo
      };
      setProducts(prev => [...prev, newProduct]);
  };
  
  const handleImportGroup = (category: string) => {
      const templates = templateProducts.filter(tp => tp.category === category);
      const newProducts = templates.map(tp => ({
          id: `imp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          organizationId: contextOrgId,
          name: tp.name,
          weight: tp.weight,
          price: tp.price,
          wholesalePrice: tp.wholesalePrice,
          image: tp.image,
          category: Category.BURGERS // Defaulting to Burgers for simplicity
      }));
      setProducts(prev => [...prev, ...newProducts]);
  };

  const handleAddCustomer = (c: Customer) => setCustomers(prev => [...prev, { ...c, organizationId: contextOrgId }]);
  const handleAddTransaction = (t: Transaction) => setTransactions(prev => [...prev, { ...t, organizationId: contextOrgId, locationId: getCurrentLocationId() }]);
  
  const handleUpdateStock = (id: string, qty: number) => setInventory(prev => prev.map(x => x.id === id ? { ...x, quantity: qty } : x));
  const handleAddIngredient = (i: Ingredient) => setInventory(prev => [...prev, { ...i, organizationId: contextOrgId, locationId: getCurrentLocationId() }]);
  const handleUpdateIngredient = (i: Ingredient) => setInventory(prev => prev.map(x => x.id === i.id ? i : x));
  const handleDeleteIngredient = (id: string) => setInventory(prev => prev.filter(x => x.id !== id));

  const handleUpdateTableStatus = (id: string, s: TableStatus) => setTables(prev => prev.map(x => x.id === id ? { ...x, status: s } : x));
  const handleAddTable = (t: Table) => setTables(prev => [...prev, { ...t, organizationId: contextOrgId, locationId: getCurrentLocationId() }]);
  const handleUpdateTable = (t: Table) => setTables(prev => prev.map(x => x.id === t.id ? t : x));
  const handleDeleteTable = (id: string) => setTables(prev => prev.filter(x => x.id !== id));

  const handleAddEmployee = (e: Employee) => setEmployees(prev => [...prev, { ...e, organizationId: contextOrgId, locationId: getCurrentLocationId() }]);
  const handleUpdateEmployee = (e: Employee) => setEmployees(prev => prev.map(x => x.id === e.id ? e : x));
  const handleDeleteEmployee = (id: string) => setEmployees(prev => prev.filter(x => x.id !== id));
  
  const handleClockIn = (id: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'clocked-in' } : e));
    setShifts(prev => [...prev, { id: Date.now().toString(), organizationId: contextOrgId, employeeId: id, startTime: new Date().toISOString() }]);
  };
  const handleClockOut = (id: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'clocked-out' } : e));
    setShifts(prev => prev.map(s => (s.employeeId === id && !s.endTime) ? { ...s, endTime: new Date().toISOString(), hoursWorked: (new Date().getTime() - new Date(s.startTime).getTime()) / 36e5 } : s));
  };
  const handleAddShift = (s: Shift) => setShifts(prev => [...prev, { ...s, organizationId: contextOrgId }]);
  const handleUpdateShift = (s: Shift) => setShifts(prev => prev.map(x => x.id === s.id ? s : x));
  const handleDeleteShift = (id: string) => setShifts(prev => prev.filter(x => x.id !== id));

  const handleAddLocation = (l: Location) => setLocations(prev => [...prev, { ...l, organizationId: contextOrgId }]);
  const handleUpdateLocation = (l: Location) => setLocations(prev => prev.map(x => x.id === l.id ? l : x));
  const handleDeleteLocation = (id: string) => {
      setLocations(prev => prev.filter(x => x.id !== id));
      if (selectedLocationId === id) setSelectedLocationId('all');
  };

  // --- Cart & Checkout ---
  const addToCart = (p: Product) => setCart(prev => {
      const ex = prev.find(x => x.id === p.id);
      return ex ? prev.map(x => x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x) : [...prev, { ...p, quantity: 1 }];
  });
  const updateQuantity = (id: string, d: number) => setCart(prev => prev.map(x => x.id === id ? { ...x, quantity: Math.max(0, x.quantity + d) } : x).filter(x => x.quantity > 0));
  const removeFromCart = (id: string) => setCart(prev => prev.filter(x => x.id !== id));

  const handleCheckout = (customerId: string | null, type: 'cash' | 'credit', orderType: OrderType, tableId?: string) => {
      if (selectedLocationId === 'all') { alert(t('select_location_first')); return; }
      
      const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0) * 1.08;
      const cogs = cart.reduce((s, i) => s + (i.wholesalePrice * i.quantity), 0);
      const tid = Date.now().toString();

      const newTx: Transaction = {
          id: tid, organizationId: contextOrgId, locationId: selectedLocationId,
          date: new Date().toISOString(), type: 'income', category: 'Food Sales',
          amount: total, description: `Order #${tid.slice(-4)}`, customerId: customerId || undefined,
          orderType, tableId, employeeId: currentUser?.id
      };
      
      const cogsTx: Transaction = {
          id: tid + '_cogs', organizationId: contextOrgId, locationId: selectedLocationId,
          date: new Date().toISOString(), type: 'expense', category: 'Cost of Goods Sold',
          amount: cogs, description: `COGS #${tid.slice(-4)}`, employeeId: currentUser?.id
      };

      setTransactions(prev => [newTx, cogsTx, ...prev]);
      
      // Update Inventory
      let newInv = [...inventory];
      cart.forEach(c => {
          c.recipe?.forEach(r => {
             const idx = newInv.findIndex(i => i.id.startsWith(r.ingredientId.split('_')[0]) && i.locationId === selectedLocationId);
             if (idx > -1) newInv[idx].quantity = Math.max(0, newInv[idx].quantity - (r.quantity * c.quantity));
          });
      });
      setInventory(newInv);

      if (customerId && type === 'credit') {
          setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, balance: c.balance + total } : c));
      }
      
      if (tableId && orderType === 'dine-in') {
          setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'occupied' } : t));
      }

      setCart([]);
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  // --- Render ---

  if (!currentUser) {
      return <AuthPage onLogin={handleLogin} onRegister={handleRegister} t={t} />;
  }

  // Filter products for POS
  const filteredProducts = orgProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (currentUser.role === 'super_admin' ? true : p.category === activeCategory) // Super admin sees all categories or filtered? Let's stick to category filter
  ).filter(p => currentUser.role === 'super_admin' ? true : p.category === activeCategory);


  const renderContent = () => {
    // Super Admin specific views
    if (activeTab === 'locations' && currentUser.role === 'super_admin') {
        return <LocationsPanel 
            locations={[]} 
            organizations={organizations}
            isSuperAdmin={true}
            transactions={[]} employees={[]} 
            onAddLocation={() => {}} onUpdateLocation={() => {}} onDeleteLocation={() => {}} 
            formatPrice={formatPrice} t={t} 
        />;
    }

    switch (activeTab) {
        case 'pos':
            if (selectedLocationId === 'all') return <div className="h-full flex items-center justify-center text-gray-400 font-bold">{t('select_location_first')}</div>;
            return (
                <div className="flex h-full w-full overflow-hidden">
                    <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                        <header className="px-8 py-6 flex items-center justify-between bg-[#F9F9FB]">
                            <div className="flex items-center gap-4">
                                <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center text-sm font-medium text-gray-400">
                                    <span>{t('pos')}</span>
                                    <span className="mx-2 text-gray-300">/</span>
                                    <span className="text-gray-800">{activeCategory}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input type="text" placeholder={t('search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-sm outline-none shadow-sm focus:ring-2 focus:ring-brand-yellow/50 transition-all placeholder-gray-300" />
                                </div>
                                <button onClick={() => setIsFullScreen(!isFullScreen)} className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${isFullScreen ? 'bg-brand-yellow text-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                                    {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                </button>
                            </div>
                        </header>
                        <div className="flex-1 overflow-y-auto px-8 pb-8 no-scrollbar">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold flex items-center gap-2">{activeCategory} <span className="text-3xl">🍔</span></h2>
                                <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm flex-wrap">
                                    {Object.values(Category).map(cat => (
                                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-brand-yellow text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>{cat}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {filteredProducts.map(p => <div key={p.id} className="h-full"><ProductCard product={p} onAdd={addToCart} formatPrice={formatPrice} /></div>)}
                            </div>
                        </div>
                    </main>
                    <OrderPanel cart={cart} customers={orgCustomers} tables={filteredTables} updateQuantity={updateQuantity} removeFromCart={removeFromCart} onCheckout={handleCheckout} formatPrice={formatPrice} t={t} />
                </div>
            );
        case 'menu': return <MenuManagementPanel products={orgProducts} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} formatPrice={formatPrice} t={t} />;
        case 'demo-content': 
            return <DemoContentPanel 
                templates={templateProducts} 
                isSuperAdmin={currentUser.role === 'super_admin'}
                onAddTemplate={handleAddTemplate}
                onUpdateTemplate={handleUpdateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onImportTemplate={handleImportTemplate}
                onImportGroup={handleImportGroup}
                formatPrice={formatPrice}
                t={t}
            />;
        case 'inventory': return <InventoryPanel inventory={filteredInventory} onUpdateStock={handleUpdateStock} onAddTransaction={handleAddTransaction} onAddIngredient={handleAddIngredient} onUpdateIngredient={handleUpdateIngredient} onDeleteIngredient={handleDeleteIngredient} t={t} />;
        case 'customers': return <CustomerPanel customers={orgCustomers} onAddCustomer={handleAddCustomer} formatPrice={formatPrice} t={t} />;
        case 'accounting': return <AccountingPanel transactions={selectedLocationId === 'all' ? orgTransactions : filteredTransactions} onAddTransaction={handleAddTransaction} formatPrice={formatPrice} t={t} />;
        case 'tables': 
            if (selectedLocationId === 'all') return <div className="p-8 text-center text-gray-400">{t('select_location_first')}</div>;
            return <TablesPanel tables={filteredTables} onUpdateTableStatus={handleUpdateTableStatus} onAddTable={handleAddTable} onUpdateTable={handleUpdateTable} onDeleteTable={handleDeleteTable} t={t} />;
        case 'staff': return <StaffPanel employees={filteredEmployees} shifts={orgShifts} transactions={filteredTransactions} onAddEmployee={handleAddEmployee} onUpdateEmployee={handleUpdateEmployee} onDeleteEmployee={handleDeleteEmployee} onClockIn={handleClockIn} onClockOut={handleClockOut} onAddShift={handleAddShift} onUpdateShift={handleUpdateShift} onDeleteShift={handleDeleteShift} formatPrice={formatPrice} t={t} />;
        case 'locations': return <LocationsPanel locations={orgLocations} transactions={orgTransactions} employees={orgEmployees} onAddLocation={handleAddLocation} onUpdateLocation={handleUpdateLocation} onDeleteLocation={handleDeleteLocation} formatPrice={formatPrice} t={t} />;
        case 'settings': return <SettingsPanel settings={settings} onUpdateSettings={s => setSettings(prev => ({ ...prev, ...s }))} t={t} />;
        default: return <div className="p-8">{t('work_in_progress')}</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F9F9FB] font-sans text-gray-800 overflow-hidden relative">
      {(!isOnline || isSyncing) && (
        <div className={`absolute top-0 left-0 right-0 h-10 z-[60] flex items-center justify-center gap-2 text-xs font-bold text-white transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-brand-red'}`}>
            {isSyncing ? <><RefreshCw size={14} className="animate-spin" /> Syncing...</> : <><WifiOff size={14} /> Offline</>}
        </div>
      )}

      {!isFullScreen && (
          <div className={`${(!isOnline || isSyncing) ? 'pt-10' : ''} h-full flex flex-col`}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentRole={currentUser.role} organization={currentOrg} onLogout={handleLogout} t={t} />
          </div>
      )}

      <div className={`flex-1 flex flex-col h-full overflow-hidden ${(!isOnline || isSyncing) ? 'pt-10' : ''}`}>
        
        {/* Top Navigation Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-8 gap-4">
             {/* Super Admin Organization Switcher */}
             {currentUser.role === 'super_admin' && (
                 <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-gray-400 uppercase">{t('switch_org')}:</span>
                     <div className="relative">
                        <button 
                            onClick={() => setIsContextDropdownOpen(!isContextDropdownOpen)}
                            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200 text-blue-700"
                        >
                            <Globe size={14} />
                            <span className="text-sm font-bold">{contextOrgName}</span>
                            <ChevronDown size={12} />
                        </button>
                        {isContextDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                {organizations.map(org => (
                                    <button
                                        key={org.id}
                                        onClick={() => { setSuperAdminContextOrgId(org.id); setIsContextDropdownOpen(false); setSelectedLocationId('all'); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <span className={`w-2 h-2 rounded-full ${superAdminContextOrgId === org.id ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                        <span className="text-sm font-medium">{org.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                     </div>
                 </div>
             )}

             {/* Location Switcher (Contextual to Org) */}
             <span className="text-xs font-bold text-gray-400 uppercase">{t('switch_location')}:</span>
             <div className="relative">
                <button 
                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                >
                    <MapPin size={14} className={selectedLocationId === 'all' ? 'text-gray-400' : 'text-brand-red'} />
                    <span className="text-sm font-bold text-gray-800">{getActiveLocationName()}</span>
                    <ChevronDown size={12} className="text-gray-400" />
                </button>
                {isLocationDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <button
                            onClick={() => { setSelectedLocationId('all'); setIsLocationDropdownOpen(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            <span className="text-sm font-medium">{t('all_locations')}</span>
                        </button>
                        {orgLocations.map(loc => (
                            <button
                                key={loc.id}
                                onClick={() => { setSelectedLocationId(loc.id); setIsLocationDropdownOpen(false); }}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-sm font-medium">{loc.name}</span>
                            </button>
                        ))}
                    </div>
                )}
             </div>
        </div>

        {renderContent()}
      </div>

      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
             <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" className="animate-tick" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('transaction_successful')}</h2>
                <button onClick={() => setIsSuccessModalOpen(false)} className="w-full py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 mt-6">{t('close')}</button>
             </div>
        </div>
      )}
    </div>
  );
};

export default App;