import React, { useState } from 'react';
import { GeneratedAd, AdAspectRatio } from '../types';
import { Download, ExternalLink, RefreshCw, Copy } from 'lucide-react';

interface AdResultCardProps {
  ad: GeneratedAd;
}

const AdResultCard: React.FC<AdResultCardProps> = ({ ad }) => {
  const [showOverlay, setShowOverlay] = useState(true);

  const getAspectRatioClass = (ratio: AdAspectRatio) => {
    switch (ratio) {
      case AdAspectRatio.SQUARE: return 'aspect-square';
      case AdAspectRatio.LANDSCAPE: return 'aspect-video';
      case AdAspectRatio.PORTRAIT: return 'aspect-[9/16]';
      case AdAspectRatio.STANDARD: return 'aspect-[4/3]';
      case AdAspectRatio.TALL: return 'aspect-[3/4]';
      default: return 'aspect-square';
    }
  };

  const getLabel = (ratio: AdAspectRatio) => {
    switch (ratio) {
      case AdAspectRatio.SQUARE: return 'Instagram / Feed';
      case AdAspectRatio.LANDSCAPE: return 'YouTube / Header';
      case AdAspectRatio.PORTRAIT: return 'Story / TikTok';
      default: return 'Display Ad';
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = ad.imageUrl;
    link.download = `ad-genius-${ad.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulated CTA domain
  const domain = ad.targetUrl ? new URL(ad.targetUrl).hostname : 'shop.now';

  return (
    <div className="group bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-indigo-500/10 hover:border-indigo-500/50">
      
      {/* Header / Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900/50">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-1 rounded">
          {getLabel(ad.aspectRatio)}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowOverlay(!showOverlay)}
            className={`p-1.5 rounded hover:bg-slate-700 transition-colors ${showOverlay ? 'text-indigo-400' : 'text-slate-500'}`}
            title="Toggle Ad Overlay"
          >
            <Type className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Download Image"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative bg-slate-900 w-full overflow-hidden">
        <div className={`relative w-full ${getAspectRatioClass(ad.aspectRatio)}`}>
          <img 
            src={ad.imageUrl} 
            alt={ad.productName} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Simulated Ad Overlay - Purely CSS based on common ad patterns */}
          {showOverlay && (
            <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none">
              <div className="self-start">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  SPONSORED
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg font-sans">
                  {ad.productName}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 text-sm font-medium drop-shadow-md">
                    {domain}
                  </span>
                  <div className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">
                    Shop Now
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Icon Helper
function Type(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" x2="15" y1="20" y2="20" />
      <line x1="12" x2="12" y1="4" y2="20" />
    </svg>
  )
}

export default AdResultCard;