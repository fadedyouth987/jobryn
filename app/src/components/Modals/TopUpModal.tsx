import React, { useState } from 'react';
import { Workspace } from '../../types';
import { Zap, CheckCircle2, CreditCard, X, ShieldCheck } from 'lucide-react';

interface TopUpModalProps {
  currentWorkspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
  onConfirmTopUp: (amountCredits: number, priceUsd: number) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  currentWorkspace,
  isOpen,
  onClose,
  onConfirmTopUp,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<{ credits: number; priceUsd: number }>({ credits: 1500, priceUsd: 49 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const packages = [
    { credits: 500, priceUsd: 19, tag: 'Starter Pack' },
    { credits: 1500, priceUsd: 49, tag: 'Most Popular', highlight: true },
    { credits: 5000, priceUsd: 149, tag: 'Enterprise Scale' },
  ];

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmTopUp(selectedPackage.credits, selectedPackage.priceUsd);
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60">
              <Zap className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Instant Credit Top-Up</h3>
          </div>
          <p className="text-xs text-slate-400">
            Add credits to <strong className="text-slate-200">{currentWorkspace.name}</strong>. Transactions are processed with atomic idempotent outbox settlement.
          </p>
        </div>

        {/* Package Selector Grid */}
        <div className="grid grid-cols-3 gap-3">
          {packages.map((pkg) => {
            const isSelected = selectedPackage.credits === pkg.credits;
            return (
              <div
                key={pkg.credits}
                onClick={() => setSelectedPackage({ credits: pkg.credits, priceUsd: pkg.priceUsd })}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 text-center relative ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                {pkg.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full">
                    {pkg.tag}
                  </span>
                )}
                <div className="font-mono text-xl font-extrabold text-white">+{pkg.credits.toLocaleString()}</div>
                <div className="text-xs text-slate-400 font-semibold">${pkg.priceUsd} USD</div>
              </div>
            );
          })}
        </div>

        {/* Stripe Info Box */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Simulated Stripe Checkout • Idempotent Outbox Active</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 flex items-center space-x-2 transition-all"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Confirm Purchase (${selectedPackage.priceUsd})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
