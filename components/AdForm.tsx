import React, { useState } from 'react';
import { AdRequest, AdAspectRatio, STYLE_OPTIONS } from '../types';
import { Activity, Image, Layout, Link as LinkIcon, Package, Type } from 'lucide-react';

interface AdFormProps {
  onSubmit: (request: AdRequest) => void;
  isGenerating: boolean;
}

const AdForm: React.FC<AdFormProps> = ({ onSubmit, isGenerating }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [style, setStyle] = useState(STYLE_OPTIONS[0].id);
  const [selectedRatios, setSelectedRatios] = useState<AdAspectRatio[]>([AdAspectRatio.SQUARE]);

  const handleRatioToggle = (ratio: AdAspectRatio) => {
    setSelectedRatios(prev => {
      if (prev.includes(ratio)) {
        if (prev.length === 1) return prev; // Prevent deselecting all
        return prev.filter(r => r !== ratio);
      }
      return [...prev, ratio];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      productName,
      description,
      targetUrl,
      style,
      aspectRatios: selectedRatios
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6 text-indigo-400">
        <Activity className="w-5 h-5" />
        <h2 className="text-lg font-semibold uppercase tracking-wider">Campaign Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Package className="w-4 h-4" />
            Product / Brand Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., NeoSneaker X1"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Type className="w-4 h-4" />
            Product Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product and the key selling point..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 h-24 resize-none"
            required
          />
        </div>

        {/* Target URL */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <LinkIcon className="w-4 h-4" />
            Target URL (for Ad Overlay)
          </label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://yourstore.com/product"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Style Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Image className="w-4 h-4" />
              Visual Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {STYLE_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratios */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Layout className="w-4 h-4" />
              Format & Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: AdAspectRatio.SQUARE, label: 'Square (1:1)' },
                { id: AdAspectRatio.LANDSCAPE, label: 'Landscape (16:9)' },
                { id: AdAspectRatio.PORTRAIT, label: 'Portrait (9:16)' },
                { id: AdAspectRatio.STANDARD, label: 'Classic (4:3)' },
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => handleRatioToggle(ratio.id)}
                  className={`text-xs py-2 px-3 rounded-md border transition-all duration-200 flex items-center justify-center ${
                    selectedRatios.includes(ratio.id)
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            isGenerating
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:scale-[1.02] hover:shadow-indigo-500/25'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Assets...
            </>
          ) : (
            <>
              Generate Campaign
              <span className="bg-white/20 text-white text-xs py-0.5 px-2 rounded-full">AI</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdForm;