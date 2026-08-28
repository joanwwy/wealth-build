import React, { useEffect } from 'react';
import { MessageSquare, Sparkles, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config: () => void;
      }) => void;
    };
    disqus_config?: () => void;
  }
}

interface DisqusCommentsProps {
  identifier?: string;
  url?: string;
  title?: string;
  categoryName?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  identifier = 'wealth-builder-general',
  url,
  title = 'WealthBuilder Financial Intelligence',
  categoryName = 'Model Feedback & Strategy Discussion',
}) => {
  const currentUrl =
    url || (typeof window !== 'undefined' ? window.location.href : 'https://wealth-builder.app');

  useEffect(() => {
    // Configure window.disqus_config
    window.disqus_config = function () {
      // @ts-ignore
      this.page.url = currentUrl;
      // @ts-ignore
      this.page.identifier = identifier;
      // @ts-ignore
      this.page.title = title;
    };

    if (window.DISQUS) {
      // If Disqus is already loaded, reset and reload the thread
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            // @ts-ignore
            this.page.url = currentUrl;
            // @ts-ignore
            this.page.identifier = identifier;
            // @ts-ignore
            this.page.title = title;
          },
        });
      } catch (err) {
        console.warn('Disqus reset error:', err);
      }
    } else {
      // Check if script already exists to avoid duplication
      const existingScript = document.querySelector('script[src*="wealth-builder.disqus.com/embed.js"]');
      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.src = 'https://wealth-builder.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        (d.head || d.body).appendChild(s);
      }
    }
  }, [identifier, currentUrl, title]);

  return (
    <section
      id="community-discussions"
      className="bg-[#1e2023] border border-[#414754] rounded-lg p-6 md:p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-6 border-b border-[#414754]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl md:text-2xl font-bold text-[#f3dfd1] tracking-tight">
                Community &amp; Model Discussion
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#ff8c00]/10 text-[#ffb77d] border border-[#ff8c00]/30 rounded">
                <Sparkles className="w-3 h-3 text-[#ff8c00]" /> Disqus Powered
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#ddc1ae]/80 font-mono mt-0.5">
              {categoryName} • Thread ID: <span className="text-[#ffb77d]">{identifier}</span>
            </p>
          </div>
        </div>

        <a
          href="https://disqus.com/home/forums/wealth-builder/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-[#ddc1ae]/70 hover:text-[#ffb77d] flex items-center gap-1.5 transition-colors"
        >
          <span>Open on Disqus</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Disqus Thread Mount Container */}
      <div className="bg-[#150c06]/40 p-4 md:p-6 rounded-lg border border-[#414754]/50 min-h-[300px]">
        <div id="disqus_thread" className="w-full"></div>
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-[#ff8c00] underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};
