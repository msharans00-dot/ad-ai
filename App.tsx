import React, { useState } from 'react';
import AdForm from './components/AdForm';
import AdResultCard from './components/AdResultCard';
import { AdRequest, GeneratedAd, STYLE_OPTIONS } from './types';
import { constructAdPrompt, generateAdImage } from './services/geminiService';
import { Sparkles, Zap, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdRequest = async (request: AdRequest) => {
    setIsGenerating(true);
    setError(null);

    // We don't clear previous ads immediately so the user can compare or see accumulation
    // But maybe for a new campaign we should clear? Let's prepend new ones.
    
    try {
      const styleOption = STYLE_OPTIONS.find(s => s.id === request.style) || STYLE_OPTIONS[0];
      const prompt = constructAdPrompt(request.productName, request.description, styleOption.promptModifier);

      // Generate images for each selected aspect ratio sequentially to handle rate limits gracefully
      // and provide incremental updates.
      const newAds: GeneratedAd[] = [];

      for (const ratio of request.aspectRatios) {
        try {
          const imageUrl = await generateAdImage(prompt, ratio);
          
          const newAd: GeneratedAd = {
            id: Math.random().toString(36).substring(7),
            imageUrl: imageUrl,
            aspectRatio: ratio,
            productName: request.productName,
            targetUrl: request.targetUrl,
            createdAt: Date.now(),
          };

          // Update state immediately as each image arrives
          setGeneratedAds(prev => [newAd, ...prev]);
        } catch (err) {
          console.error(`Failed to generate for ratio ${ratio}`, err);
          // We continue to the next ratio even if one fails
        }
      }

    } catch (err) {
      setError("Failed to initiate generation process. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AdGenius AI
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Templates</a>
              <a href="#" className="hover:text-white transition-colors">History</a>
              <a href="#" className="hover:text-white transition-colors">Settings</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">High-Converting</span> Ads
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Generate professional banner ads in standard IAB formats instantly. 
            Powered by Google's Imagen 3 for photorealistic results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <AdForm onSubmit={handleAdRequest} isGenerating={isGenerating} />
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: "Fast Gen", desc: "< 5s" },
                { icon: Layers, label: "Formats", desc: "All Sizes" },
                { icon: Sparkles, label: "Quality", desc: "HD Ready" },
              ].map((feat, idx) => (
                <div key={idx} className="bg-slate-800/30 border border-slate-800 rounded-xl p-3 text-center">
                  <feat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                  <div className="font-semibold text-xs text-slate-300">{feat.label}</div>
                  <div className="text-[10px] text-slate-500">{feat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {generatedAds.length === 0 && !isGenerating ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-500">No ads generated yet</h3>
                <p className="text-slate-600 mt-2">Fill out the form to start your campaign</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loading Skeleton if still generating but some results might be in */}
                {isGenerating && (
                  <div className="aspect-square bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-indigo-400 font-medium">Designing...</span>
                    </div>
                  </div>
                )}
                
                {generatedAds.map((ad) => (
                  <AdResultCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;