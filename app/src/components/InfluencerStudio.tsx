import React, { useState } from 'react';
import { Workspace, AIInfluencer, Platform } from '../types';
import { ThreeDAssetViewer } from './ThreeDAssetViewer';
import { 
  UserCheck, 
  Sparkles, 
  Lock, 
  Unlock, 
  Volume2, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Video, 
  Play, 
  Square,
  Zap, 
  Dices,
  Layers,
  ArrowRight,
  Send,
  Upload,
  Mic,
  FileAudio,
  Radio,
  RadioTower,
  TrendingUp,
  Globe,
  ExternalLink,
  Share2,
  Check,
  Disc,
  Headphones,
  Maximize2
} from 'lucide-react';

interface InfluencerStudioProps {
  currentWorkspace: Workspace;
  influencers: AIInfluencer[];
  onSaveInfluencer: (influencer: AIInfluencer) => void;
  onToggleLock: (id: string) => void;
  onGenerateContentForInfluencer: (influencer: AIInfluencer, prompt: string, platform: Platform) => void;
}

export const InfluencerStudio: React.FC<InfluencerStudioProps> = ({
  currentWorkspace,
  influencers,
  onSaveInfluencer,
  onToggleLock,
  onGenerateContentForInfluencer,
}) => {
  const workspaceInfluencers = influencers.filter((inf) => inf.workspaceId === currentWorkspace.id);

  // Sub-tabs: 'constructor' | 'voice' | 'campaigns3d' | 'roster'
  const [activeSubTab, setActiveSubTab] = useState<'constructor' | 'voice' | 'campaigns3d' | 'roster'>('constructor');

  // Active Draft Constructor State
  const [name, setName] = useState('Sophia Chen');
  const [handle, setHandle] = useState('@sophia.tech.ai');
  const [archetype, setArchetype] = useState('SaaS Product & AI Researcher');
  const [niche, setNiche] = useState('Developer Tools & Enterprise AI');
  const [bio, setBio] = useState('Virtual AI product researcher showcasing developer productivity tools, code generation benchmarks, and modern stack architecture.');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80');
  
  // ComfyUI / IP-Adapter Technical Seed & LoRA Parameters
  const [seed, setSeed] = useState<number>(482019382);
  const [faceConsistency, setFaceConsistency] = useState<number>(0.95);
  const [styleStrength, setStyleStrength] = useState<number>(0.85);
  const [lightingModel, setLightingModel] = useState<string>('Studio Softbox High Key');
  const [appearancePrompt, setAppearancePrompt] = useState(
    'Hyper-realistic 28-year-old female tech presenter, sharp bone structure, deep brown almond eyes, sleek shoulder-length dark hair, wearing a minimalist slate turtleneck sweater, modern glass office background, soft natural studio lighting, 8k raw photography, crisp skin texture.'
  );
  const [negativePrompt, setNegativePrompt] = useState(
    'deformed eyes, extra limbs, cartoonish, low resolution, glossy plastic skin, blurry faces, oversaturated'
  );

  // Voice Profile Dedicated State
  const [selectedVoiceModel, setSelectedVoiceModel] = useState('elevenlabs-rachel');
  const [voiceTone, setVoiceTone] = useState('Engaging, articulate, warm tech innovator');
  const [pitch, setPitch] = useState<number>(1.0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [accent, setAccent] = useState('US West Coast Tech Standard');
  const [samplePhrase, setSamplePhrase] = useState('Hey everyone! Today we are testing real-time agent orchestration with 99% zero-drift accuracy.');
  const [uploadedVoiceFile, setUploadedVoiceFile] = useState<{ name: string; size: string; duration: string } | null>(null);
  const [isCloningVoice, setIsCloningVoice] = useState(false);
  const [voiceCloneSuccess, setVoiceCloneSuccess] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Lock State for the constructor draft
  const [isLocked, setIsLocked] = useState(true);
  const [faceEmbeddingHash, setFaceEmbeddingHash] = useState('ip_adapter_v2_f89012a9_sophia');

  // Quick Post Generator Modal State
  const [quickPostPrompt, setQuickPostPrompt] = useState('Announcing our new multi-modal workflow editor for engineering leads');
  const [quickPlatform, setQuickPlatform] = useState<Platform>('linkedin');
  const [showQuickPublishModal, setShowQuickPublishModal] = useState(false);
  const [selectedInfluencerForPublish, setSelectedInfluencerForPublish] = useState<AIInfluencer | null>(null);

  // Pre-configured Voice Models List
  const voiceModelOptions = [
    {
      id: 'elevenlabs-rachel',
      name: 'ElevenLabs - Rachel',
      category: 'Neural High-Clarity',
      tone: 'Warm, confident, tech-savvy',
      badge: 'Most Popular',
      sampleUrl: '#',
    },
    {
      id: 'elevenlabs-adam',
      name: 'ElevenLabs - Adam',
      category: 'Deep Executive Resonance',
      tone: 'Authoritative, calm, cinematic',
      badge: 'B2B Enterprise',
      sampleUrl: '#',
    },
    {
      id: 'gemini-speech-v3',
      name: 'Gemini Multimodal Speech v3',
      category: 'Expressive Conversational',
      tone: 'Dynamic, natural cadence, emotive',
      badge: 'Low Latency',
      sampleUrl: '#',
    },
    {
      id: 'azure-neural-jenny',
      name: 'Azure Neural Studio - Jenny',
      category: 'Broadcast Broadcast',
      tone: 'Crisp editorial newsreader',
      badge: 'Standard',
      sampleUrl: '#',
    },
    {
      id: 'custom-voice-clone',
      name: 'Custom LoRA Voice Clone (Uploaded)',
      category: 'Zero-Shot Reference Match',
      tone: '100% Personal Reference Match',
      badge: 'Custom Clone',
      sampleUrl: '#',
    },
  ];

  // Moving 3D Marketing Campaign Showpiece Data
  const running3DCampaigns = [
    {
      id: 'camp-3d-1',
      title: 'Autonomous Enterprise Agents 2026',
      influencerName: 'Sophia Chen',
      influencerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      platform: 'LinkedIn Enterprise',
      impressions: '142,800',
      clicks: '12,490',
      roi: '18.4x',
      badge: 'BROADCASTING NOW',
      statusColor: 'emerald',
      tagline: 'Zero-drift agent orchestration benchmarks live across 12 countries.',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'camp-3d-2',
      title: 'Cyber-Fashion Wearable Tech Release',
      influencerName: 'Marcus Thorne',
      influencerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      platform: 'Instagram Reels & Carousels',
      impressions: '98,400',
      clicks: '8,210',
      roi: '12.1x',
      badge: 'VIRAL TRENDING',
      statusColor: 'purple',
      tagline: 'Spatial computing fashion editorial generating 7.8% engagement.',
      mediaUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'camp-3d-3',
      title: 'Developer Productivity Stack Keynote',
      influencerName: 'Elena Vance',
      influencerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      platform: 'YouTube & X Threads',
      impressions: '215,600',
      clicks: '24,100',
      roi: '22.6x',
      badge: 'TOP CONVERTING',
      statusColor: 'amber',
      tagline: 'Generated 420 qualified SaaS leads in under 48 hours.',
      mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const avatarPresets = [
    {
      name: 'Sophia Chen (Tech Leader)',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      archetype: 'SaaS Product & AI Researcher',
      seed: 482019382,
    },
    {
      name: 'Aria Sterling (Luxury Creative)',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      archetype: 'Brand Designer & Visual Strategist',
      seed: 849204192,
    },
    {
      name: 'Liam Vance (Cyber Hardware)',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      archetype: 'Hardware Engineer & Industrial Designer',
      seed: 192840192,
    },
    {
      name: 'Maya Lin (Growth Director)',
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      archetype: 'Performance Marketer & Analytics Lead',
      seed: 920481029,
    },
  ];

  const handleRandomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 900000000) + 100000000;
    setSeed(newSeed);
    setFaceEmbeddingHash(`ip_adapter_v2_${Math.random().toString(36).substring(2, 10)}_${name.toLowerCase().replace(/\s+/g, '')}`);
  };

  const handlePlayVoicePreview = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 3000);
  };

  const handleSimulateVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedVoiceFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        duration: '0:42 sec',
      });
      setIsCloningVoice(true);
      setTimeout(() => {
        setIsCloningVoice(false);
        setVoiceCloneSuccess(true);
        setSelectedVoiceModel('custom-voice-clone');
      }, 2500);
    }
  };

  const handleSaveConstructorDraft = () => {
    const newInf: AIInfluencer = {
      id: `inf-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      name,
      handle,
      archetype,
      niche,
      bio,
      avatarUrl,
      locked: isLocked,
      faceEmbeddingHash,
      seed,
      loraWeights: {
        faceConsistency,
        styleStrength,
        lightingModel,
      },
      appearancePrompt,
      negativePrompt,
      voiceProfile: {
        tone: voiceTone,
        pitch,
        speed,
        accent,
        samplePhrase,
      },
      postsGeneratedCount: 0,
      avgEngagementRate: '5.8%',
      createdAt: new Date().toISOString(),
    };

    onSaveInfluencer(newInf);
    setActiveSubTab('roster');
  };

  const handleOpenQuickPost = (inf: AIInfluencer) => {
    setSelectedInfluencerForPublish(inf);
    setShowQuickPublishModal(true);
  };

  const handleExecuteQuickGenerate = () => {
    if (!selectedInfluencerForPublish || !quickPostPrompt.trim()) return;
    onGenerateContentForInfluencer(selectedInfluencerForPublish, quickPostPrompt, quickPlatform);
    setShowQuickPublishModal(false);
    setQuickPostPrompt('');
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header Bar - Clean & Spacious Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white shadow-xl shadow-purple-600/20">
              <UserCheck className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Influencer & Voice Studio</h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  ComfyUI Zero-Drift Lock
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Design custom brand avatars, synthesize voice models from reference files, and broadcast moving 3D marketing campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* Spacious, Clear Sub-Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs shrink-0">
          <button
            onClick={() => setActiveSubTab('constructor')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'constructor'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Identity & Face</span>
          </button>

          <button
            onClick={() => setActiveSubTab('voice')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'voice'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Voice Profile</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveSubTab('campaigns3d')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'campaigns3d'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RadioTower className="w-4 h-4 text-purple-300" />
            <span>3D Live Campaigns</span>
          </button>

          <button
            onClick={() => setActiveSubTab('roster')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'roster'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Saved Roster ({workspaceInfluencers.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: IDENTITY & FACE CONSTRUCTOR (Uncrowded, spacious layout) */}
      {activeSubTab === 'constructor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT 7 COLS: Controls, Prompts, LoRA Weights */}
          <div className="lg:col-span-7 space-y-6">
            {/* Presets Quick-Select */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Preset Archetypes</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {avatarPresets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setName(p.name.split(' ')[0] + ' ' + p.name.split(' ')[1]);
                      setAvatarUrl(p.url);
                      setArchetype(p.archetype);
                      setSeed(p.seed);
                      setFaceEmbeddingHash(`ip_adapter_v2_${p.seed}_${p.name.split(' ')[0].toLowerCase()}`);
                    }}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800/80 rounded-xl flex items-center space-x-2 text-left transition-colors"
                  >
                    <img src={p.url} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{p.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-slate-400 truncate">{p.archetype.split('&')[0]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Info Card */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>1. Core Personalization & Social Bio</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Influencer Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Social Handle</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-indigo-400 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Archetype Title</label>
                  <input
                    type="text"
                    value={archetype}
                    onChange={(e) => setArchetype(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Target Content Niche</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Personal Bio & Brand Mission</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            {/* ComfyUI LoRA Weights & Seed Matrix */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>2. ComfyUI Generation Seed & LoRA Parameters</span>
                </h3>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/60">
                  IP-Adapter SDXL v2
                </span>
              </div>

              <div className="space-y-4">
                {/* Seed Anchor */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block">Deterministic Seed Anchor</label>
                    <p className="text-[11px] text-slate-400">Locking the seed ensures zero-drift facial structure consistency.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      #{seed}
                    </span>
                    <button
                      onClick={handleRandomizeSeed}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                      title="Randomize Seed"
                    >
                      <Dices className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* LoRA Weights Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-300">Face Consistency Weight</span>
                      <span className="font-mono text-emerald-400 font-bold">{(faceConsistency * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.70"
                      max="1.00"
                      step="0.01"
                      value={faceConsistency}
                      onChange={(e) => setFaceConsistency(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-900"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-300">Style & Lighting Strength</span>
                      <span className="font-mono text-amber-400 font-bold">{(styleStrength * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.50"
                      max="1.00"
                      step="0.01"
                      value={styleStrength}
                      onChange={(e) => setStyleStrength(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-900"
                    />
                  </div>
                </div>

                {/* Studio Lighting Environment */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Studio Lighting Environment</label>
                  <select
                    value={lightingModel}
                    onChange={(e) => setLightingModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="Studio Softbox High Key">Studio Softbox High Key (Clean B2B / Executive)</option>
                    <option value="Cinematic Golden Hour">Cinematic Golden Hour (Warm Lifestyle / Natural)</option>
                    <option value="Cyberpunk Neon Accent">Cyberpunk Neon Accent (Tech / Gaming / Modern)</option>
                    <option value="Editorial Natural Light">Editorial Natural Light (Minimalist / Fashion)</option>
                  </select>
                </div>

                {/* Appearance Prompt Matrix */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Appearance Prompt Matrix</label>
                  <textarea
                    rows={3}
                    value={appearancePrompt}
                    onChange={(e) => setAppearancePrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 font-mono resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Visual Stage & Identity Lock */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-5 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Visual Stage & Lock Preview</span>
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isLocked ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}>
                  {isLocked ? 'Identity Locked' : 'Draft Editing'}
                </span>
              </div>

              {/* Portrait Preview Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-white">{name}</h2>
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      {handle}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300">{archetype}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{bio}</p>
                </div>
              </div>

              {/* Embed & Lock Specs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Embedding Hash</span>
                  <span className="font-mono text-slate-200 font-bold text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {faceEmbeddingHash}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Fixed Seed</span>
                  <span className="font-mono text-indigo-400 font-bold">#{seed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Identity Lock</span>
                  <span className="text-emerald-400 font-bold">{(faceConsistency * 100).toFixed(0)}% Zero-Drift</span>
                </div>
              </div>

              {/* Lock Toggle */}
              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  isLocked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                }`}
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{isLocked ? 'IDENTITY LOCKED & ANCHORED' : 'CLICK TO LOCK IDENTITY'}</span>
              </button>

              <button
                onClick={handleSaveConstructorDraft}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-xl shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>SAVE TO INFLUENCER ROSTER</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VOICE PROFILE STUDIO (NEW DEDICATED VOICE TAB) */}
      {activeSubTab === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT 7 COLS: Voice Model Selection & Audio Upload Reference */}
          <div className="lg:col-span-7 space-y-6">
            {/* Audio Upload Reference File Card */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>1. Reference Voice Audio Upload & Cloning</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                  Zero-Shot Neural Clone
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Upload a 30-second clean audio reference file (.mp3 or .wav) of your desired speaker voice to generate a zero-shot custom voice clone model.
              </p>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 rounded-2xl p-8 text-center bg-slate-950/60 transition-colors relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleSimulateVoiceUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 rounded-2xl">
                    <FileAudio className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">
                      Drag & Drop Audio Sample or <span className="text-emerald-400 underline">Browse Files</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Supports MP3, WAV, M4A up to 25MB (Recommended: 30–60s clear speech)</p>
                  </div>
                </div>
              </div>

              {/* Upload Status */}
              {isCloningVoice && (
                <div className="p-4 bg-slate-950 rounded-xl border border-emerald-800/60 flex items-center space-x-3 text-xs">
                  <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                  <div>
                    <p className="font-bold text-emerald-400">Cloning Speech Characteristics & Pitch Envelope...</p>
                    <p className="text-[10px] text-slate-400">Extracting formant frequency matrix & zero-shot LoRA weights.</p>
                  </div>
                </div>
              )}

              {uploadedVoiceFile && voiceCloneSuccess && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">{uploadedVoiceFile.name}</p>
                      <p className="text-[10px] text-emerald-300">Size: {uploadedVoiceFile.size} • Duration: {uploadedVoiceFile.duration} • <strong className="text-white">LoRA Clone Ready</strong></p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 border border-emerald-700">
                    Cloned
                  </span>
                </div>
              )}
            </div>

            {/* AI Voice Model Selector */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Radio className="w-4 h-4 text-indigo-400" />
                <span>2. Pre-Trained AI Voice Models & Engines</span>
              </h3>

              <div className="space-y-3">
                {voiceModelOptions.map((vm) => {
                  const isSelected = selectedVoiceModel === vm.id;
                  return (
                    <div
                      key={vm.id}
                      onClick={() => setSelectedVoiceModel(vm.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-950/50 border-indigo-500/80 ring-1 ring-indigo-500/50'
                          : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-indigo-900 border-indigo-700 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-white">{vm.name}</h4>
                            <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-slate-900 text-indigo-300 border border-slate-800">
                              {vm.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{vm.category} • Tone: <strong className="text-slate-300">{vm.tone}</strong></p>
                        </div>
                      </div>

                      <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center">
                        {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Voice Customization & Test Synthesis */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-5 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>3. Voice Modulation & Synthesis</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                  Live Preview
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Voice Tone & Persona Style</label>
                  <input
                    type="text"
                    value={voiceTone}
                    onChange={(e) => setVoiceTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Regional Accent</label>
                  <select
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-emerald-500"
                  >
                    <option value="US West Coast Tech Standard">US West Coast Tech Standard</option>
                    <option value="British Editorial Professional">British Editorial Professional</option>
                    <option value="Global Neutral English">Global Neutral English</option>
                    <option value="Australian Executive">Australian Executive</option>
                  </select>
                </div>

                {/* Pitch & Speed Modulators */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Speech Pitch Modifier</span>
                      <span className="font-mono text-emerald-400 font-bold">{pitch.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="1.2"
                      step="0.02"
                      value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Pacing / Cadence Speed</span>
                      <span className="font-mono text-indigo-400 font-bold">{speed.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="1.3"
                      step="0.02"
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-900"
                    />
                  </div>
                </div>

                {/* Test Speech Player */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <label className="text-slate-300 font-bold block">Synthesize Sample Audio Test</label>
                  <textarea
                    rows={2}
                    value={samplePhrase}
                    onChange={(e) => setSamplePhrase(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-xs resize-none"
                  />

                  <button
                    onClick={handlePlayVoicePreview}
                    disabled={isPlayingAudio}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Play className={`w-4 h-4 ${isPlayingAudio ? 'animate-spin' : ''}`} />
                    <span>{isPlayingAudio ? 'Synthesizing Neural Speech...' : 'TEST VOICE AUDIO PREVIEW'}</span>
                  </button>

                  {isPlayingAudio && (
                    <div className="flex items-center space-x-1 pt-2 justify-center">
                      <span className="w-1.5 h-4 bg-emerald-400 animate-pulse rounded-full"></span>
                      <span className="w-1.5 h-6 bg-emerald-500 animate-pulse delay-75 rounded-full"></span>
                      <span className="w-1.5 h-3 bg-emerald-400 animate-pulse delay-150 rounded-full"></span>
                      <span className="w-1.5 h-7 bg-emerald-300 animate-pulse delay-100 rounded-full"></span>
                      <span className="w-1.5 h-5 bg-emerald-500 animate-pulse rounded-full"></span>
                      <span className="text-[11px] text-emerald-400 font-mono ml-2">Streaming real-time speech...</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/60 text-[11px] text-indigo-300">
                  <p><strong>Voice Profile Linked:</strong> Voice settings will automatically be attached to <strong className="text-white">{name}</strong> on save.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 3D LIVE CAMPAIGNS (MOVING 3D MARKETING SHOWPIECE) */}
      {activeSubTab === 'campaigns3d' && (
        <div className="space-y-8">
          {/* Real-time WebGL 3D Canvas Asset Studio */}
          <ThreeDAssetViewer />

          {/* Ticker Banner */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between overflow-hidden">
            <div className="flex items-center space-x-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">3D Marketing Broadcast Engine</span>
            </div>
            <div className="hidden sm:flex items-center space-x-6 text-xs text-slate-400 font-mono">
              <span>Active Broadcasts: <strong className="text-emerald-400 font-bold">3 Campaigns</strong></span>
              <span>Global Reach: <strong className="text-indigo-400 font-bold">456,800 Impressions</strong></span>
              <span>Avg ROI: <strong className="text-amber-400 font-bold">17.7x</strong></span>
            </div>
          </div>

          {/* 3D Perspective Floating Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
            {running3DCampaigns.map((camp, idx) => (
              <div
                key={camp.id}
                className="group relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/60 flex flex-col justify-between"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Visual Media Background Cover with 3D Depth */}
                <div className="relative rounded-xl overflow-hidden h-48 border border-slate-800">
                  <img
                    src={camp.mediaUrl}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 border border-emerald-800/60 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{camp.badge}</span>
                  </span>

                  <span className="absolute bottom-3 left-3 right-3 text-xs font-bold text-white truncate">
                    {camp.platform}
                  </span>
                </div>

                {/* Info Block */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={camp.influencerAvatar}
                      alt={camp.influencerName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                        {camp.title}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        AI Influencer: <strong className="text-slate-200">{camp.influencerName}</strong>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">{camp.tagline}</p>
                </div>

                {/* 3D Performance Stats Box */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Reach</span>
                    <span className="font-mono font-bold text-slate-200">{camp.impressions}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Clicks</span>
                    <span className="font-mono font-bold text-indigo-400">{camp.clicks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">ROI</span>
                    <span className="font-mono font-bold text-emerald-400">{camp.roi}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Live Campaign Dispatch</span>
                  <button className="text-indigo-400 font-bold hover:text-indigo-300 flex items-center space-x-1">
                    <span>Inspect 3D Data</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SAVED INFLUENCER ROSTER */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Workspace AI Influencers ({workspaceInfluencers.length})</h2>
              <p className="text-xs text-slate-400">Locked digital personalities ready for instant campaign generation.</p>
            </div>

            <button
              onClick={() => setActiveSubTab('constructor')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create New AI Influencer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaceInfluencers.map((inf) => (
              <div
                key={inf.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <img
                      src={inf.avatarUrl}
                      alt={inf.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white truncate">{inf.name}</h3>
                        <button
                          onClick={() => onToggleLock(inf.id)}
                          className={`p-1 rounded-lg border text-[10px] font-bold flex items-center space-x-1 ${
                            inf.locked
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border-amber-800'
                          }`}
                          title={inf.locked ? 'Click to Unlock' : 'Click to Lock'}
                        >
                          {inf.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          <span>{inf.locked ? 'Locked' : 'Draft'}</span>
                        </button>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-400 block">{inf.handle}</span>
                      <span className="text-[11px] text-slate-400 font-medium block truncate">{inf.archetype}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{inf.bio}</p>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Embedding Token:</span>
                      <span className="font-mono text-slate-200 font-bold truncate max-w-[140px]">{inf.faceEmbeddingHash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fixed Seed:</span>
                      <span className="font-mono text-indigo-400 font-bold">#{inf.seed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Voice Tone:</span>
                      <span className="text-slate-300 font-medium truncate max-w-[140px]">{inf.voiceProfile.tone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <button
                    onClick={() => handleOpenQuickPost(inf)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate Content with {inf.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK GENERATE MODAL */}
      {showQuickPublishModal && selectedInfluencerForPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <img src={selectedInfluencerForPublish.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-white">Generate Post with {selectedInfluencerForPublish.name}</h3>
                  <p className="text-[11px] text-indigo-400 font-mono">{selectedInfluencerForPublish.handle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickPublishModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Social Platform</label>
                <select
                  value={quickPlatform}
                  onChange={(e) => setQuickPlatform(e.target.value as Platform)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="linkedin">LinkedIn Enterprise</option>
                  <option value="instagram">Instagram Reel & Carousel</option>
                  <option value="tiktok">TikTok Video Script</option>
                  <option value="twitter">X (Twitter) Thread</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Campaign Topic or Product Feature Prompt</label>
                <textarea
                  rows={3}
                  value={quickPostPrompt}
                  onChange={(e) => setQuickPostPrompt(e.target.value)}
                  placeholder="e.g. Discussing our new zero-trust API security release..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>IP-Adapter Identity Guard Active</span>
                </div>
                <p>Gemini 3.7 Flash will automatically enforce facial seed <strong className="text-slate-200">#{selectedInfluencerForPublish.seed}</strong> and voice persona tone.</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowQuickPublishModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteQuickGenerate}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Generate Campaign Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
