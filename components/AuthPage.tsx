
import React, { useState } from 'react';
import { ShoppingBag, Lock, Mail, Store, Coffee, Globe } from 'lucide-react';
import { User, Organization } from '../types';
import { MOCK_USERS, MOCK_ORGS } from '../constants';

interface AuthPageProps {
  onLogin: (user: User, org: Organization | null) => void;
  onRegister: (user: User, org: Organization) => void;
  t: (key: string) => string;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, t }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', orgName: '' });

  const handleDemoLogin = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      const org = MOCK_ORGS.find(o => o.id === user.organizationId) || null;
      onLogin(user, org);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      // Mock Login logic
      const user = MOCK_USERS.find(u => u.email === formData.email);
      if (user) {
         const org = MOCK_ORGS.find(o => o.id === user.organizationId) || null;
         onLogin(user, org);
      } else {
        alert('User not found. Try the demo buttons!');
      }
    } else {
      // Register logic
      const newOrgId = `org_${Date.now()}`;
      const newOrg: Organization = {
        id: newOrgId,
        name: formData.orgName,
        slug: formData.orgName.toLowerCase().replace(/\s+/g, '-'),
        ownerId: `u_${Date.now()}`,
        plan: 'free',
        createdAt: new Date().toISOString()
      };
      
      const newUser: User = {
        id: newOrg.ownerId,
        name: formData.name,
        email: formData.email,
        role: 'admin',
        organizationId: newOrgId,
        image: `https://ui-avatars.com/api/?name=${formData.name}&background=random`
      };
      
      onRegister(newUser, newOrg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-brand-red/20">
            <ShoppingBag size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartPOS SaaS</h1>
        <p className="text-gray-500">The Ultimate Multi-Tenant Point of Sale</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header Switcher */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'login' ? 'text-brand-dark bg-gray-50' : 'text-gray-400'}`}
          >
            {t('sign_in')}
          </button>
          <button 
            onClick={() => setMode('register')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'register' ? 'text-brand-dark bg-gray-50' : 'text-gray-400'}`}
          >
            {t('register')}
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('full_name')}</label>
                   <input 
                     type="text" 
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-yellow"
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     required
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('organization_name')}</label>
                   <div className="relative">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-yellow"
                        value={formData.orgName}
                        onChange={e => setFormData({...formData, orgName: e.target.value})}
                        placeholder="My Coffee Shop"
                        required
                      />
                   </div>
                </div>
              </>
            )}

            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('email_address')}</label>
               <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-yellow"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
               </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('password')}</label>
               <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-yellow"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                  />
               </div>
            </div>

            <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              {mode === 'login' ? t('sign_in') : t('create_account')}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-400 uppercase font-bold">{t('demo_accounts')}</span></div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleDemoLogin('u_super')}
                  className="w-full flex items-center p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Globe size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm">{t('super_admin')}</p>
                    <p className="text-xs text-gray-400">Manage all tenants</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleDemoLogin('u_admin_1')}
                  className="w-full flex items-center p-3 rounded-xl border border-gray-100 hover:border-brand-red hover:bg-red-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-red text-white flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Store size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm">Burger Shop Owner</p>
                    <p className="text-xs text-gray-400">Tenant A (Pro Plan)</p>
                  </div>
                </button>

                <button 
                   onClick={() => handleDemoLogin('u_admin_2')}
                   className="w-full flex items-center p-3 rounded-xl border border-gray-100 hover:border-brown-500 hover:bg-orange-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#795548] text-white flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Coffee size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm">Coffee House Owner</p>
                    <p className="text-xs text-gray-400">Tenant B (Free Plan)</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-8 text-gray-400 text-xs">© 2024 SmartPOS SaaS. All rights reserved.</p>
    </div>
  );
};

export default AuthPage;
