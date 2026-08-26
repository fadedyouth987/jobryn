import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Video, 
  Mic, 
  Sliders, 
  Send, 
  ShieldCheck, 
  Zap, 
  Layers, 
  RefreshCw, 
  Share2, 
  Check, 
  ArrowRight,
  Eye,
  Film,
  MessageSquare,
  Lock,
  Smartphone,
  Globe,
  Flame,
  Award,
  Maximize2
} from 'lucide-react';

interface LiveWorkflowSimulatorProps {
  onNavigateToTab?: (tab: string) => void;
  themeMode?: 'light' | 'dark';
}

const SAMPLE_PRODUCTS = [
  {
    id: 'headphones',
    name: 'AeroLuxe Noise-Cancelling Headphones',
    category: 'Consumer Tech',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    targetAudience: 'Tech enthusiasts & remote professionals',
    hooks: [
      "🔥 'Stop buying $400 ANC headphones before you see this...'",
      "🎧 'I tested 5 noise-cancelling headphones in a noisy coffee shop. Winner?'",
      "⚡ 'Why remote workers are switching to AeroLuxe in 2026.'"
    ]
  },
  {
    id: 'skincare',
    name: 'GlowSkin Vitamin C Radiance Serum',
    category: 'Beauty & Skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    targetAudience: 'Skincare lovers seeking glowing complexion',
    hooks: [
      "✨ 'Dermatologist reveals the 1 skincare step you are skipping...'",
      "💧 'My skin transformed in 7 days with this 15% Vitamin C serum!'",
      "🌿 'Clean ingredient breakdown: Why this serum actually works.'"
    ]
  },
  {
    id: 'saas',
    name: 'Jobryn AI Campaign Studio',
    category: 'SaaS & Marketing',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    targetAudience: 'CMOs, Marketing Directors & Growth Agencies',
    hooks: [
      "🚀 'How 1 marketing team scaled video ad output by 10x without extra staff.'",
      "🛡️ 'Stop leaking API keys and credit budgets on unvetted AI tools.'",
      "📊 'Automate social publishing with SSRF egress security and RBAC approvals.'"
    ]
  }
];

const SAMPLE_AVATARS = [
  {
    id: 'emma',
    name: 'Emma Vance',
    role: 'Tech & SaaS Spokesperson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    accent: 'American Accent • Professional',
    voiceSample: 'Friendly, authoritative, crisp voice'
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    role: 'Fitness & E-Commerce UGC Host',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    accent: 'Energetic UGC • High Converting',
    voiceSample: 'High energy, casual, engaging'
  },
  {
    id: 'aria',
    name: 'Aria Taylor',
    role: 'Lifestyle & Skincare Creator',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    accent: 'British Accent • Warm & Soft',
    voiceSample: 'Calm, persuasive, authentic'
  }
];

export const LiveWorkflowSimulator: React.FC<LiveWorkflowSimulatorProps> = ({ onNavigateToTab, themeMode = 'light' }) => {
  const isLight = themeMode === 'light';
  const [selectedProduct, setSelectedProduct] = useState(SAMPLE_PRODUCTS[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(SAMPLE_AVATARS[0]);
  const [selectedFormat, setSelectedFormat] = useState<'tiktok' | 'instagram' | 'linkedin'>('tiktok');
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);

  // Simulation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const startSimulation = () => {
    setIsGenerating(true);
    setIsCompleted(false);
    setCurrentStep(1);
    setGenerationProgress(15);

    // Step 1: Script & Copy Generation
    setTimeout(() => {
      setCurrentStep(2);
      setGenerationProgress(45);
    }, 1200);

    // Step 2: Avatar & Voice Synthesis
    setTimeout(() => {
      setCurrentStep(3);
      setGenerationProgress(75);
    }, 2500);

    // Step 3: Multi-Format Visual Rendering
    setTimeout(() => {
      setCurrentStep(4);
      setGenerationProgress(100);
      setIsGenerating(false);
      setIsCompleted(true);
    }, 3800);
  };

  return (
    <div className={`space-y-8 w-full border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-slate-200/50 text-slate-900' : 'bg-slate-900/90 border-slate-800 shadow-2xl text-white'
    }`}>
      {/* Background Subtle Gradient Flares */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className={`relative z-10 space-y-3 border-b pb-6 ${
        isLight ? 'border-slate-100' : 'border-slate-800/80'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${
            isLight
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700/60 text-indigo-300'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>INTERACTIVE WORKFLOW ENGINE SHOWCASE</span>
          </div>
          <span className={`text-xs flex items-center space-x-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-mono">SSRF Protection • Atomic Ledger Reserved (-15 Cr)</span>
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              See How Jobryn Builds Controlled Campaign Workflows
            </h2>
            <p className={`text-sm mt-1 max-w-3xl leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              Experience the end-to-end automation pipeline in real time. Jobryn converts campaign briefs and product concepts into high-converting video scripts, photorealistic AI presenters, and multi-channel scheduled posts.
            </p>
          </div>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('studio')}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Controls & Workflow Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Configurator Controls (5 Cols) */}
        <div className={`lg:col-span-5 space-y-6 p-5 rounded-2xl border transition-colors ${
          isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center space-x-2 ${
            isLight ? 'text-slate-800' : 'text-slate-200'
          }`}>
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>1. Select Campaign Inputs</span>
          </h3>

          {/* Product Selection */}
          <div className="space-y-2">
            <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Select Target Product or Campaign:</label>
            <div className="space-y-2">
              {SAMPLE_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setSelectedHookIndex(0);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 ${
                    selectedProduct.id === prod.id
                      ? isLight ? 'bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600/30' : 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                      : isLight ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{prod.name}</div>
                    <div className="text-[11px] text-indigo-600 font-medium">{prod.category}</div>
                  </div>
                  {selectedProduct.id === prod.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Presenter Selection */}
          <div className="space-y-2">
            <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Select AI Brand Presenter / Actor:</label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_AVATARS.map((av) => (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatar(av)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center space-y-1.5 ${
                    selectedAvatar.id === av.id
                      ? isLight ? 'bg-white border-purple-600 shadow-md ring-1 ring-purple-600/30' : 'bg-purple-950/80 border-purple-500 text-white shadow-md'
                      : isLight ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <img 
                    src={av.avatar} 
                    alt={av.name} 
                    className="w-10 h-10 rounded-full object-cover border border-purple-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`text-[11px] font-bold truncate w-full ${isLight ? 'text-slate-900' : 'text-white'}`}>{av.name}</div>
                  <div className="text-[9px] text-purple-600 font-medium truncate w-full">{av.role.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Channel Format */}
          <div className="space-y-2">
            <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Output Format & Aspect Ratio:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedFormat('tiktok')}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                  selectedFormat === 'tiktok'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : isLight ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>TikTok 9:16</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('instagram')}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                  selectedFormat === 'instagram'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : isLight ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>IG Reel 9:16</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('linkedin')}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                  selectedFormat === 'linkedin'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : isLight ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>LinkedIn 1:1</span>
              </button>
            </div>
          </div>

          {/* Trigger Workflow Simulation Button */}
          <button
            onClick={startSimulation}
            disabled={isGenerating}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all ${
              isGenerating
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-[1.01]'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                <span>Executing AI Pipeline ({generationProgress}%)...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Run Live Generation Pipeline Demo</span>
                <Play className="w-3.5 h-3.5 fill-current ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: Real-Time Live Pipeline Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          {/* Top Stage Tracker */}
          <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
            isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-950/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-2 ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                <Layers className="w-4 h-4 text-purple-600" />
                <span>2. Live Automation Workflow Steps</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600">
                {currentStep === 0 && 'Ready to Run'}
                {currentStep === 1 && 'Step 1/4: Hook Scripting'}
                {currentStep === 2 && 'Step 2/4: Avatar Lip Sync'}
                {currentStep === 3 && 'Step 3/4: Render Video'}
                {currentStep === 4 && 'Step 4/4: Ready for Approval'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className={`w-full rounded-full h-2 overflow-hidden border ${
              isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}>
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-500 ease-out"
                style={{ width: `${generationProgress}%` }}
              />
            </div>

            {/* 4 Step Pills */}
            <div className="grid grid-cols-4 gap-2 text-[10px] font-semibold text-center">
              <div className={`p-1.5 rounded-lg border transition-all ${
                currentStep >= 1 
                  ? isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-indigo-950 border-indigo-600 text-indigo-200' 
                  : isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                1. AI Script
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${
                currentStep >= 2 
                  ? isLight ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-purple-950 border-purple-600 text-purple-200' 
                  : isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                2. AI Avatar
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${
                currentStep >= 3 
                  ? isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950 border-amber-600 text-amber-200' 
                  : isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                3. Video Render
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${
                currentStep >= 4 
                  ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950 border-emerald-600 text-emerald-200' 
                  : isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                4. Webhook Post
              </div>
            </div>
          </div>

          {/* Interactive Output Preview Canvas */}
          <div className={`rounded-2xl border p-5 min-h-[360px] flex flex-col justify-between relative overflow-hidden transition-colors ${
            isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            {/* Real Result Display */}
            {currentStep === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-xl ${
                  isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-950/80 border-indigo-800/60 text-indigo-400'
                }`}>
                  <Play className="w-8 h-8 fill-indigo-600/20" />
                </div>
                <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Interactive Generation Canvas Ready</h4>
                <p className={`text-xs max-w-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Click <strong className="text-indigo-600">"Run Live Generation Pipeline Demo"</strong> above to see Gemini generate hooks, assemble voiceovers, and produce ready-to-publish video ads.
                </p>
              </div>
            )}

            {currentStep > 0 && (
              <div className="space-y-4">
                {/* Visual Step Output Header */}
                <div className={`flex items-center justify-between border-b pb-3 ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className={`text-xs font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Generating Creative: {selectedProduct.name}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                    isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
                  }`}>
                    Format: {selectedFormat.toUpperCase()} • 60 FPS
                  </span>
                </div>

                {/* Main Visual Output Split: Script & Photo Render */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                  {/* Script & Voice Card */}
                  <div className={`p-3.5 rounded-xl border space-y-2.5 text-xs ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between text-indigo-600 font-bold">
                      <span className="flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>AI Hook & Script</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isLight ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-indigo-950 text-indigo-300'
                      }`}>
                        Gemini 3.7
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-lg border font-medium italic leading-relaxed ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}>
                      "{selectedProduct.hooks[selectedHookIndex]}"
                    </div>

                    <div className={`space-y-1 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      <div className="flex items-center justify-between">
                        <span>Presenter:</span>
                        <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{selectedAvatar.name}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Voice Profile:</span>
                        <strong className="text-purple-600 font-semibold">{selectedAvatar.accent}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Call To Action:</span>
                        <strong className="text-emerald-600 font-semibold">Shop Now • 20% Off</strong>
                      </div>
                    </div>
                  </div>

                  {/* Photorealistic Output Video Frame Preview */}
                  <div className="relative rounded-xl overflow-hidden border border-indigo-500/40 group bg-black aspect-[4/3] sm:aspect-auto">
                    <img 
                      src={selectedProduct.image} 
                      alt="Generated Video Preview" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* AI Avatar Overlay Badge */}
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 flex items-center space-x-1.5">
                      <img 
                        src={selectedAvatar.avatar} 
                        alt={selectedAvatar.name} 
                        className="w-5 h-5 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] font-bold text-white">{selectedAvatar.name}</span>
                    </div>

                    {/* Captions Overlay on Video Frame */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/10 text-center">
                      <p className="text-[11px] font-black text-amber-300 uppercase tracking-wide leading-tight">
                        {selectedProduct.hooks[selectedHookIndex]}
                      </p>
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                      <div className="w-10 h-10 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Status / Approval Row */}
                {isCompleted && (
                  <div className={`border rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
                    isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/60 border-emerald-800/60'
                  }`}>
                    <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Workflow Generated! Ready in Approval Queue & Multi-Channel Publisher.</span>
                    </div>
                    {onNavigateToTab && (
                      <button
                        onClick={() => onNavigateToTab('publisher')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1"
                      >
                        <span>Schedule Post</span>
                        <Send className="w-3.5 h-3.5 ml-1" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
