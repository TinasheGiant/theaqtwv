import React from "react";
import { useApp } from "../context/AppContext";
import { ProfileSettingsView } from "./ProfileSettingsView";
import { ShieldCheck, X } from "lucide-react";

export const ProfileSettingsModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, playSfx } = useApp();

  if (!isProfileModalOpen) return null;

  const handleClose = () => {
    playSfx("toggle");
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090a0f] border border-amber-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.2)] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Cinzel_Decorative'] font-bold text-lg text-white">
                Account & Profile Settings
              </h2>
              <p className="text-xs text-gray-400">
                Manage credentials, update passwords, and customize your user avatar icon.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ProfileSettingsView onClose={handleClose} variant="modal" />
      </div>
    </div>
  );
};
