import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { AdminSystemSettings } from "../../../types";
import {
  Settings,
  ShieldCheck,
  Check,
  Building2,
  DollarSign,
  Smartphone,
  Server,
  AlertTriangle,
  Lock,
  Globe,
  Sliders,
} from "lucide-react";

export const AdminManagementSettingsModule: React.FC = () => {
  const { systemSettings, updateSystemSettings, showToast, playSfx } = useApp();

  const [siteName, setSiteName] = useState(systemSettings.siteName);
  const [contactEmail, setContactEmail] = useState(systemSettings.contactEmail);
  const [supportPhone, setSupportPhone] = useState(systemSettings.supportPhone);
  const [officeAddress, setOfficeAddress] = useState(systemSettings.officeAddress);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(systemSettings.taxRatePercent);
  const [maintenanceMode, setMaintenanceMode] = useState(systemSettings.maintenanceMode);

  // Currency Rates
  const [currencyUSDToZWL, setCurrencyUSDToZWL] = useState<number>(systemSettings.currencyUSDToZWL);
  const [currencyUSDToZAR, setCurrencyUSDToZAR] = useState<number>(systemSettings.currencyUSDToZAR);

  // Gateway Keys
  const [ecoCashMerchantNumber, setEcoCashMerchantNumber] = useState(systemSettings.ecoCashMerchantNumber);
  const [innBucksAccountCode, setInnBucksAccountCode] = useState(systemSettings.innBucksAccountCode);
  const [bankAccountDetails, setBankAccountDetails] = useState(systemSettings.bankAccountDetails);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSfx("sparkle");
    updateSystemSettings({
      siteName,
      contactEmail,
      supportPhone,
      officeAddress,
      taxRatePercent: Number(taxRatePercent),
      maintenanceMode,
      currencyUSDToZWL: Number(currencyUSDToZWL),
      currencyUSDToZAR: Number(currencyUSDToZAR),
      ecoCashMerchantNumber,
      innBucksAccountCode,
      bankAccountDetails,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Cinzel'] font-bold px-2 py-0.5 rounded bg-amber-400 text-black">
              CEO Restricted Module
            </span>
            <span className="text-xs text-gray-400 font-mono">
              System Core Config
            </span>
          </div>
          <h2 className="text-xl font-['Cinzel'] font-bold text-white mt-1">
            System & Enterprise Configuration
          </h2>
          <p className="text-xs text-gray-400 font-light">
            Configure multi-currency forex exchange rates, ZIMRA VAT %, payment gateway merchant credentials, and global maintenance switches.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity & Contact */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
          <h3 className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Corporate Identity & Harare Office</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Support Email
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Direct Hotline / WhatsApp
              </label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Physical Office Address
              </label>
              <input
                type="text"
                required
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Forex Rates & Tax Configurations */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
          <h3 className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Forex Multi-Currency Exchange Rates & ZIMRA Tax</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                1 USD to ZWL Rate
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={currencyUSDToZWL}
                onChange={(e) => setCurrencyUSDToZWL(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                1 USD to ZAR Rate
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={currencyUSDToZAR}
                onChange={(e) => setCurrencyUSDToZAR(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                ZIMRA Fiscal VAT Rate (%)
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Merchant Gateways Credentials */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg space-y-4">
          <h3 className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Merchant Payment Gateway Accounts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                EcoCash Merchant Code
              </label>
              <input
                type="text"
                value={ecoCashMerchantNumber}
                onChange={(e) => setEcoCashMerchantNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                InnBucks Account Code
              </label>
              <input
                type="text"
                value={innBucksAccountCode}
                onChange={(e) => setInnBucksAccountCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['Cinzel'] text-amber-300 uppercase font-bold mb-1">
                Bank Account Details
              </label>
              <input
                type="text"
                value={bankAccountDetails}
                onChange={(e) => setBankAccountDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Global Maintenance Mode Toggle */}
        <div className="p-6 rounded-3xl bg-[#0b0c10] border border-amber-500/20 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-['Cinzel'] font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Public Maintenance Mode</span>
            </div>
            <p className="text-xs text-gray-400 font-light">
              When enabled, non-admin visitors see a maintenance banner during major database updates.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
          </label>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-['Cinzel'] font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
          >
            <Check className="w-4 h-4" />
            <span>SAVE SYSTEM CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
};
