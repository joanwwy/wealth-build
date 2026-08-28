import React from 'react';
import { Landmark } from 'lucide-react';
import { UserSettings } from '../types';

interface FooterProps {
  userSettings?: UserSettings;
  onOpenDocModal?: () => void;
  onOpenRiskModal?: () => void;
  onOpenApiStatusModal?: () => void;
  onOpenCommunity?: () => void;
  onOpenLegalModal?: (title: string, type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  userSettings,
  onOpenDocModal,
  onOpenRiskModal,
  onOpenApiStatusModal,
  onOpenCommunity,
  onOpenLegalModal,
}) => {
  const isLight = userSettings?.theme === 'light';

  return (
    <footer
      className={`w-full mt-auto border-t transition-colors duration-200 ${
        isLight
          ? 'bg-slate-100 border-slate-200 text-slate-700'
          : 'bg-[#150c06] border-[#414754] text-[#ddc1ae]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg font-bold text-[#ff8c00] flex items-center gap-2 mb-1.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-5 h-5 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <span>WealthBuilder</span>
          </a>
          <p className="font-mono text-xs text-slate-500 dark:text-[#ddc1ae]/70">
            © {new Date().getFullYear()} WealthBuilder Financial Intelligence. Deterministic Rust Simulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
          <button
            onClick={onOpenDocModal}
            className="hover:text-[#ff8c00] transition-colors cursor-pointer"
          >
            Quantitative Math
          </button>
          <button
            onClick={onOpenCommunity}
            className="hover:text-[#ff8c00] transition-colors cursor-pointer"
          >
            Community Forum
          </button>
          <button
            onClick={onOpenCommunity}
            className="text-[#ddc1ae]/80 hover:text-[#ffb77d] transition-colors opacity-90 hover:opacity-100 cursor-pointer"
          >
            Community Forum
          </button>
          <button
            onClick={onOpenRiskModal}
            className="hover:text-[#ff8c00] transition-colors cursor-pointer"
          >
            Risk Disclosure
          </button>
          <button
            onClick={() => onOpenLegalModal?.('Privacy Policy', 'privacy')}
            className="hover:text-[#ff8c00] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onOpenLegalModal?.('Terms of Service', 'terms')}
            className="hover:text-[#ff8c00] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={onOpenApiStatusModal}
            className="hover:text-[#ff8c00] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API Online</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
