
import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  MessageSquare, 
  Receipt, 
  Settings, 
  Bell, 
  ShoppingBag, 
  Users, 
  PieChart,
  Package,
  Grid,
  Briefcase,
  MapPin,
  LogOut,
  Building2,
  Database
} from 'lucide-react';
import { UserRole, Organization } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole | 'super_admin';
  organization: Organization | null;
  onLogout: () => void;
  t: (key: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentRole, organization, onLogout, t }) => {
  
  const getMenuItems = () => {
    // Super Admin sees specific Global Views
    if (currentRole === 'super_admin') {
        return [
            { id: 'locations', icon: Building2, label: 'Organizations' }, // Reusing locations panel logic for Org view roughly
            { id: 'accounting', icon: PieChart, label: 'Global Reports' },
            { id: 'demo-content', icon: Database, label: t('demo_content') },
            { id: 'settings', icon: Settings, label: t('settings') },
        ];
    }

    const baseItems = [
      { id: 'pos', icon: ShoppingBag, label: t('pos'), roles: ['admin', 'cashier', 'waiter'] },
      { id: 'menu', icon: UtensilsCrossed, label: t('menu'), roles: ['admin'] },
      { id: 'demo-content', icon: Database, label: t('demo_content'), roles: ['admin'] },
      { id: 'inventory', icon: Package, label: t('inventory'), roles: ['admin', 'cashier'] },
      { id: 'tables', icon: Grid, label: t('tables'), roles: ['admin', 'waiter', 'cashier'] },
      { id: 'staff', icon: Briefcase, label: t('staff'), roles: ['admin'] },
      { id: 'locations', icon: MapPin, label: t('locations'), roles: ['admin'] },
      { id: 'customers', icon: Users, label: t('customers'), roles: ['admin', 'cashier'] },
      { id: 'accounting', icon: PieChart, label: t('accounting'), roles: ['admin'] },
      { id: 'messages', icon: MessageSquare, label: t('messages'), roles: ['admin', 'cashier', 'waiter'] },
      { id: 'bills', icon: Receipt, label: t('bills'), roles: ['admin', 'cashier'] },
      { id: 'settings', icon: Settings, label: t('settings'), roles: ['admin', 'cashier'] },
    ];

    return baseItems.filter(item => item.roles.includes(currentRole as string));
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white h-full flex flex-col justify-between py-6 px-4 border-r border-gray-100 shadow-sm z-10">
      <div>
        <div className="flex items-center gap-3 px-4 mb-8">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white font-bold shrink-0">
            <ShoppingBag size={18} />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">SmartPOS</h1>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider truncate">
                {currentRole === 'super_admin' ? 'Super Admin' : (organization?.name || 'SaaS')}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-brand-yellow text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="mb-4 px-4">
             <button 
                onClick={onLogout}
                className="flex items-center gap-4 w-full py-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
             >
                <LogOut size={20} />
                {t('logout')}
             </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-2xl mx-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${currentRole}&background=random`} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-bold text-gray-800 text-xs capitalize truncate">{currentRole.replace('_', ' ')}</h3>
                    <p className="text-[10px] text-gray-500 truncate">{t('logged_in')}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;