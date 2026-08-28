import React from 'react';
import { Landmark } from 'lucide-react';

interface FooterProps {
  onOpenDocModal?: () => void;
  onOpenRiskModal?: () => void;
  onOpenApiStatusModal?: () => void;
  onOpenCommunity?: () => void;
  onOpenLegalModal?: (title: string, type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDocModal,
  onOpenRiskModal,
  onOpenApiStatusModal,
  onOpenCommunity,
  onOpenLegalModal,
}) => {
  return (
    <footer className="bg-[#150c06] border-t border-[#414754] w-full mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl font-bold text-[#ffb77d] flex items-center gap-2 mb-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-6 h-6 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
              <Landmark className="w-4 h-4" />
            </div>
            <span>WealthBuilder</span>
          </a>
          <p className="font-mono text-xs text-[#ddc1ae]/80">
            © 2024 WealthBuilder Financial Intelligence. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs">
          <button
            onClick={onOpenDocModal}
            className="text-[#ffb77d] underline opacity-90 hover:opacity-100 transition-colors cursor-pointer"
          >
            Documentation
          </button>
          <button
            onClick={onOpenCommunity}
            className="text-[#ddc1ae]/80 hover:text-[#ffb77d] transition-colors opacity-90 hover:opacity-100 cursor-pointer"
          >
            Community Forum
          </button>
          <button
            onClick={onOpenRiskModal}
            className="text-[#ddc1ae]/80 hover:text-[#ffb77d] transition-colors opacity-90 hover:opacity-100 cursor-pointer"
          >
            Risk Disclosure
          </button>
          <button
            onClick={() => onOpenLegalModal?.('Privacy Policy', 'privacy')}
            className="text-[#ddc1ae]/80 hover:text-[#ffb77d] transition-colors opacity-90 hover:opacity-100 cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onOpenLegalModal?.('Terms of Service', 'terms')}
            className="text-[#ddc1ae]/80 hover:text-[#ffb77d] transition-colors opacity-90 hover:opacity-100 cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={onOpenApiStatusModal}
            className="text-[#ddc1ae]/80 hover:text-[#ffb77d] transition-colors opacity-90 hover:opacity-100 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse"></span>
            <span>API Status</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
