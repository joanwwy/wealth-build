import React, { useEffect, useState } from 'react';
import { MessageSquare, Sparkles, ExternalLink, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config: () => void;
      }) => void;
    };
    disqus_config?: () => void;
    disqus_shortname?: string;
  }
}

interface DisqusCommentsProps {
  identifier?: string;
  url?: string;
  title?: string;
  categoryName?: string;
  shortname?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  identifier = 'wealth-builder-general',
  url,
  title = 'WealthBuilder Financial Intelligence',
  categoryName = 'Model Feedback & Strategy Discussion',
  shortname = 'wealth-builder',
}) => {
  const [loadStatus, setLoadStatus] = useState<'loading' | 'loaded' | 'blocked' | 'error'>('loading');
  const [activeShortname, setActiveShortname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('disqus_custom_shortname') || shortname;
    }
    return shortname;
  });
  const [showConfig, setShowConfig] = useState(false);
  const [customInput, setCustomInput] = useState(activeShortname);

  // Normalize URL to avoid localhost / container dynamic host conflicts in Disqus
  const canonicalUrl =
    url ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/#topic-${identifier}`
      : `https://wealthbuilder.app/#topic-${identifier}`);

  const loadDisqus = () => {
    setLoadStatus('loading');

    try {
      window.disqus_config = function () {
        // @ts-ignore
        this.page.url = canonicalUrl;
        // @ts-ignore
        this.page.identifier = identifier;
        // @ts-ignore
        this.page.title = title;
      };

      if (window.DISQUS) {
        // If Disqus is already initialized, reset it with the new page configuration
        try {
          window.DISQUS.reset({
            reload: true,
            config: function () {
              // @ts-ignore
              this.page.url = canonicalUrl;
              // @ts-ignore
              this.page.identifier = identifier;
              // @ts-ignore
              this.page.title = title;
            },
          });
          setLoadStatus('loaded');
        } catch (err) {
          console.warn('Disqus reset error:', err);
          setLoadStatus('error');
        }
      } else {
        // Clean up any stale script tags
        const existingScript = document.getElementById('disqus-embed-script');
        if (existingScript) {
          existingScript.remove();
        }

        const d = document;
        const s = d.createElement('script');
        s.id = 'disqus-embed-script';
        s.src = `https://${activeShortname}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;

        s.onload = () => {
          setLoadStatus('loaded');
        };

        s.onerror = () => {
          // If the network request fails (e.g. adblocker, privacy badger, or non-existent shortname)
          setLoadStatus('blocked');
        };

        (d.head || d.body).appendChild(s);

        // Fallback timer: if not loaded within 4 seconds, mark as blocked or provide direct access
        const timer = setTimeout(() => {
          if (!window.DISQUS) {
            setLoadStatus((prev) => (prev === 'loading' ? 'blocked' : prev));
          }
        }, 4000);

        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Disqus configuration exception:', e);
      setLoadStatus('error');
    }
  };

  useEffect(() => {
    const cleanup = loadDisqus();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [identifier, canonicalUrl, title, activeShortname]);

  const handleSaveCustomShortname = () => {
    const clean = customInput.trim();
    if (clean) {
      localStorage.setItem('disqus_custom_shortname', clean);
      setActiveShortname(clean);
      setShowConfig(false);
      // Remove previous script to force reload
      const script = document.getElementById('disqus-embed-script');
      if (script) script.remove();
      if (window.DISQUS) {
        delete window.DISQUS;
      }
      setTimeout(loadDisqus, 100);
    }
  };

  return (
    <section
      id="community-discussions"
      className="bg-[#1e2023] border border-[#414754] rounded-lg p-6 md:p-8 shadow-2xl relative overflow-hidden text-[#f3dfd1]"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-6 border-b border-[#414754]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#f3dfd1]">
                Community &amp; Model Discussion
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#ff8c00]/10 text-[#ffb77d] border border-[#ff8c00]/30 rounded">
                <Sparkles className="w-3 h-3 text-[#ff8c00]" /> Disqus Powered
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#ddc1ae]/80 font-mono mt-0.5">
              {categoryName} • Thread ID: <span className="text-[#ffb77d]">{identifier}</span> • Site:{' '}
              <span className="text-[#ffb77d]">{activeShortname}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-xs font-mono text-[#ddc1ae]/80 hover:text-white px-2.5 py-1.5 rounded border border-[#414754] hover:bg-[#2a2d32] transition-colors cursor-pointer"
          >
            {showConfig ? 'Close Settings' : 'Disqus Settings'}
          </button>
          <a
            href={`https://disqus.com/home/forums/${activeShortname}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#ddc1ae]/70 hover:text-[#ffb77d] px-2.5 py-1.5 rounded border border-[#414754] hover:bg-[#2a2d32] flex items-center gap-1.5 transition-colors"
          >
            <span>Open on Disqus</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Optional Shortname Configuration Drawer */}
      {showConfig && (
        <div className="mb-6 p-4 rounded-lg bg-[#111316] border border-[#ff8c00]/40 text-xs font-mono">
          <h4 className="font-bold text-[#ff8c00] mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Connect Your Custom Disqus Forum Shortname
          </h4>
          <p className="text-[#ddc1ae]/70 mb-3 text-[11px] leading-relaxed">
            By default, this connects to <code>{activeShortname}</code>. If you registered your own Disqus forum at{' '}
            <a href="https://disqus.com/admin/create/" target="_blank" rel="noreferrer" className="text-[#ff8c00] underline">
              disqus.com/admin/create
            </a>
            , enter your website shortname below to load your exact live forum.
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. your-forum-shortname"
              className="px-3 py-1.5 rounded bg-[#1e2023] border border-[#414754] text-white focus:outline-none focus:border-[#ff8c00] text-xs font-mono min-w-[220px]"
            />
            <button
              onClick={handleSaveCustomShortname}
              className="px-3 py-1.5 rounded bg-[#ff8c00] hover:bg-[#ff9d24] text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Update Shortname
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('disqus_custom_shortname');
                setActiveShortname('wealth-builder');
                setCustomInput('wealth-builder');
              }}
              className="px-3 py-1.5 rounded bg-[#2a2d32] text-[#ddc1ae] text-xs hover:text-white transition-colors cursor-pointer"
            >
              Reset Default
            </button>
          </div>
        </div>
      )}

      {/* Status Warning Banner for Blocked or Adblocked Environments */}
      {loadStatus === 'blocked' && (
        <div className="mb-4 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div className="leading-relaxed">
            <strong>Notice:</strong> If Disqus does not appear below, your browser adblocker (e.g., uBlock Origin, Brave Shield) or iframe privacy sandbox may be blocking <code>embed.js</code> or 3rd-party cookies.
            <div className="mt-1 flex gap-3">
              <button
                onClick={loadDisqus}
                className="underline text-[#ff8c00] hover:text-[#ffb77d] cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Retry Loading
              </button>
              <a
                href={`https://disqus.com/home/forums/${activeShortname}/`}
                target="_blank"
                rel="noreferrer"
                className="underline text-[#ff8c00] hover:text-[#ffb77d]"
              >
                Open in new tab ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Disqus Thread Mount Container */}
      <div className="bg-[#150c06]/40 p-4 md:p-6 rounded-lg border border-[#414754]/50 min-h-[320px]">
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
