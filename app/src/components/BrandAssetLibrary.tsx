import React, { useState } from 'react';
import { Workspace } from '../types';
import { 
  Palette, 
  Sparkles, 
  BookOpen, 
  Tag, 
  ShieldCheck, 
  Plus, 
  Sliders, 
  SlidersHorizontal, 
  CheckCircle2, 
  Trash2,
  FileText,
  UserCheck
} from 'lucide-react';

interface BrandAssetLibraryProps {
  currentWorkspace: Workspace;
}

export const BrandAssetLibrary: React.FC<BrandAssetLibraryProps> = ({ currentWorkspace }) => {
  const [toneKeywords, setToneKeywords] = useState<string[]>([
    'Authoritative', 'Visionary', 'Enterprise Tech', 'High Contrast Minimalist', 'Data-Driven'
  ]);
  const [disallowedWords, setDisallowedWords] = useState<string[]>([
    'Synergy', 'Revolutionary', 'Disruptive', 'Paradigm Shift', 'Game-Changer'
  ]);
  const [newToneInput, setNewToneInput] = useState<string>('');
  const [newDisallowedInput, setNewDisallowedInput] = useState<string>('');

  const [brandColors, setBrandColors] = useState([
    { name: 'Obsidian Canvas', hex: '#020617', type: 'Primary Dark' },
    { name: 'Electric Indigo', hex: '#4f46e5', type: 'Accent Accent' },
    { name: 'Emerald Ledger', hex: '#10b981', type: 'Success Token' },
    { name: 'Amber Reserve', hex: '#f59e0b', type: 'Credit Highlight' },
  ]);

  const personas = [
    {
      title: 'Enterprise Growth Lead',
      description: 'Focuses on campaign velocity, ROI attribution, team governance, and multi-channel scale.',
      tag: 'Primary B2B'
    },
    {
      title: 'Content Decider / Approver',
      description: 'Cares about brand voice compliance, legal hold safeguards, and rapid review approvals.',
      tag: 'Governance'
    },
    {
      title: 'Social Media Producer',
      description: 'Requires rapid AI generation, platform native previews, and auto-scheduling queues.',
      tag: 'Operations'
    }
  ];

  const handleAddTone = () => {
    if (!newToneInput.trim()) return;
    setToneKeywords([...toneKeywords, newToneInput.trim()]);
    setNewToneInput('');
  };

  const handleAddDisallowed = () => {
    if (!newDisallowedInput.trim()) return;
    setDisallowedWords([...disallowedWords, newDisallowedInput.trim()]);
    setNewDisallowedInput('');
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/60">
              <Palette className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white">Brand Kit & AI Identity Tokens</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              AI Generation Rules
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Configure tone of voice, target customer personas, color hex tokens, and disallowed buzzwords enforced by Gemini 3.7 Flash.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Brand Enforcement Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tone & Copy Rules (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tone Keywords */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Approved Brand Tone Directives</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {toneKeywords.map((tk, idx) => (
                <span key={idx} className="bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 text-xs font-semibold px-3 py-1 rounded-xl flex items-center space-x-1.5">
                  <span>{tk}</span>
                  <button
                    onClick={() => setToneKeywords(toneKeywords.filter((_, i) => i !== idx))}
                    className="hover:text-rose-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={newToneInput}
                onChange={(e) => setNewToneInput(e.target.value)}
                placeholder="Add tone directive (e.g. Crisp, Professional)..."
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2 outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddTone}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Directive</span>
              </button>
            </div>
          </div>

          {/* Disallowed Words Filter */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Tag className="w-4 h-4 text-rose-400" />
              <span>Disallowed Words & Banned Buzzwords</span>
            </h3>

            <p className="text-xs text-slate-400">
              Gemini 3.7 Flash will automatically filter out and reject these terms during generation.
            </p>

            <div className="flex flex-wrap gap-2">
              {disallowedWords.map((dw, idx) => (
                <span key={idx} className="bg-rose-950/60 text-rose-300 border border-rose-800/60 text-xs font-semibold px-3 py-1 rounded-xl flex items-center space-x-1.5 font-mono">
                  <span>{dw}</span>
                  <button
                    onClick={() => setDisallowedWords(disallowedWords.filter((_, i) => i !== idx))}
                    className="hover:text-rose-200 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={newDisallowedInput}
                onChange={(e) => setNewDisallowedInput(e.target.value)}
                placeholder="Banned word or cliché..."
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2 outline-none focus:border-rose-500"
              />
              <button
                onClick={handleAddDisallowed}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ban Term</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Colors & Target Personas (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand Palette */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>Brand Color Hex Tokens</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {brandColors.map((col, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
                  <div
                    className="w-8 h-8 rounded-lg border border-slate-700 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div>
                    <span className="font-bold text-white block truncate">{col.name}</span>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">{col.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience Personas */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Target Audience Personas ({personas.length})</span>
            </h3>

            <div className="space-y-3">
              {personas.map((p, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{p.title}</span>
                    <span className="text-[10px] font-bold bg-slate-900 text-indigo-300 border border-slate-800 px-2 py-0.5 rounded-full">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
