
import React from 'react';
import { AppSettings, CurrencyCode, LanguageCode } from '../types';
import { CURRENCIES } from '../constants';
import { Globe, DollarSign, Check } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  t: (key: string) => string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings, t }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9F9FB] overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-gray-100">
         <h1 className="text-2xl font-bold text-gray-800">{t('app_settings')}</h1>
         <p className="text-gray-400 text-sm">{t('customize_experience')}</p>
      </header>

      <div className="p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
            
            {/* General Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Globe size={18} className="text-gray-400" />
                        {t('general')}
                    </h2>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Language Setting */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('language')}</label>
                        <p className="text-xs text-gray-400 mb-4">{t('select_language')}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => onUpdateSettings({ language: 'en' })}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                    settings.language === 'en' 
                                    ? 'border-brand-yellow bg-yellow-50/30 text-gray-900' 
                                    : 'border-gray-100 hover:border-gray-200 text-gray-500'
                                }`}
                            >
                                <span className="font-medium">{t('english')}</span>
                                {settings.language === 'en' && <Check size={18} className="text-brand-yellow" />}
                            </button>
                            <button
                                onClick={() => onUpdateSettings({ language: 'sw' })}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                    settings.language === 'sw' 
                                    ? 'border-brand-yellow bg-yellow-50/30 text-gray-900' 
                                    : 'border-gray-100 hover:border-gray-200 text-gray-500'
                                }`}
                            >
                                <span className="font-medium">{t('swahili')}</span>
                                {settings.language === 'sw' && <Check size={18} className="text-brand-yellow" />}
                            </button>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Currency Setting */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('currency')}</label>
                        <p className="text-xs text-gray-400 mb-4">{t('select_currency')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.values(CURRENCIES).map((curr) => (
                                <button
                                    key={curr.code}
                                    onClick={() => onUpdateSettings({ currency: curr.code })}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                                        settings.currency === curr.code
                                        ? 'border-brand-dark bg-gray-50 text-brand-dark' 
                                        : 'border-gray-100 hover:border-gray-200 text-gray-500'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                        settings.currency === curr.code ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {curr.symbol}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{curr.code}</div>
                                        <div className="text-[10px] opacity-70">{curr.name}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
