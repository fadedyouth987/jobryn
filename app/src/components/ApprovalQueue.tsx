import React, { useState } from 'react';
import { CampaignAsset, Workspace, AssetStatus } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lock, 
  MessageSquare, 
  Send, 
  AlertTriangle, 
  UserCheck, 
  Calendar, 
  Filter, 
  CheckCheck,
  Linkedin,
  Instagram,
  Video,
  Twitter,
  Facebook
} from 'lucide-react';

interface ApprovalQueueProps {
  currentWorkspace: Workspace;
  assets: CampaignAsset[];
  onUpdateAssetStatus: (assetId: string, status: AssetStatus, commentText?: string, rejectionReason?: string) => void;
  onBatchApproveAll: () => void;
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({
  currentWorkspace,
  assets,
  onUpdateAssetStatus,
  onBatchApproveAll,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(assets[0]?.id || null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');
  const [showRejectionModal, setShowRejectionModal] = useState<boolean>(false);

  // Filter assets for current workspace
  const workspaceAssets = assets.filter((a) => a.workspaceId === currentWorkspace.id);

  const filteredAssets = workspaceAssets.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const selectedAsset = workspaceAssets.find((a) => a.id === selectedAssetId) || filteredAssets[0] || null;

  const currentApprover = currentWorkspace.members.find((m) => m.role === 'approver' || m.role === 'owner') || currentWorkspace.members[0];

  const handleApprove = () => {
    if (!selectedAsset) return;
    onUpdateAssetStatus(selectedAsset.id, 'approved', 'Approved after review. Scheduled for automated social dispatch.');
  };

  const handleReject = () => {
    if (!selectedAsset || !rejectionReasonInput.trim()) return;
    onUpdateAssetStatus(selectedAsset.id, 'rejected', `Rejected: ${rejectionReasonInput}`, rejectionReasonInput);
    setRejectionReasonInput('');
    setShowRejectionModal(false);
  };

  const handleAddComment = () => {
    if (!selectedAsset || !commentInput.trim()) return;
    onUpdateAssetStatus(selectedAsset.id, selectedAsset.status, commentInput);
    setCommentInput('');
  };

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'linkedin': return <Linkedin className="w-3.5 h-3.5 text-blue-400" />;
      case 'instagram': return <Instagram className="w-3.5 h-3.5 text-pink-400" />;
      case 'tiktok': return <Video className="w-3.5 h-3.5 text-teal-400" />;
      case 'twitter': return <Twitter className="w-3.5 h-3.5 text-sky-400" />;
      default: return <Facebook className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'approved':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>Approved</span></span>;
      case 'pending_review':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Pending Review</span></span>;
      case 'rejected':
        return <span className="bg-rose-950 text-rose-300 border border-rose-800/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1"><XCircle className="w-3 h-3" /><span>Rejected</span></span>;
      case 'scheduled':
        return <span className="bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>Scheduled</span></span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">{status}</span>;
    }
  };

  const pendingCount = workspaceAssets.filter((a) => a.status === 'pending_review').length;

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60">
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white">Workflow Approval Engine</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
              RBAC Verified
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Review campaign assets, enforce lock states, verify decider permissions, and batch-approve content.
          </p>
        </div>

        {/* Batch Approval Action */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">Pending Review:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">{pendingCount}</span>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={onBatchApproveAll}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Approve All Pending ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Asset List & Filters (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({workspaceAssets.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending_review')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'pending_review' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'approved' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === 'rejected' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Asset List Stack */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredAssets.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-xs">
                No campaign assets found matching current filter.
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(asset.platform)}
                        <span className="text-xs font-bold text-white capitalize">{asset.platform}</span>
                        <span className="text-[10px] text-slate-500">v{asset.currentVersion}</span>
                      </div>
                      {getStatusBadge(asset.status)}
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{asset.title}</h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {asset.caption}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-800/60">
                      <span>Assigned: {currentApprover.name}</span>
                      {asset.lockedBy && (
                        <span className="flex items-center space-x-1 text-amber-400 font-medium">
                          <Lock className="w-3 h-3" />
                          <span>Review Lock</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Asset Inspection & Decider Board (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedAsset ? (
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-6">
              {/* Top Details Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(selectedAsset.platform)}
                    <h2 className="text-lg font-bold text-white">{selectedAsset.title}</h2>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span>Platform: <strong className="text-slate-200 capitalize">{selectedAsset.platform}</strong></span>
                    <span>•</span>
                    <span>Version: <strong className="text-slate-200">v{selectedAsset.currentVersion}</strong></span>
                    <span>•</span>
                    <span>Assigned Approver: <strong className="text-slate-200">{currentApprover.name} ({currentApprover.role})</strong></span>
                  </div>
                </div>

                <div>{getStatusBadge(selectedAsset.status)}</div>
              </div>

              {/* Lock Warning Banner if Asset is locked */}
              {selectedAsset.lockedBy && (
                <div className="p-3 bg-amber-950/60 border border-amber-800/60 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span><strong>Active Workflow Lock:</strong> {currentApprover.name} is currently reviewing this asset.</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-900/80 px-2 py-0.5 rounded">LOCKED</span>
                </div>
              )}

              {/* Caption Preview Box */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Copy Body</span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-line font-normal">
                  {selectedAsset.caption}
                </div>
              </div>

              {/* Hashtags & Art Direction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="font-bold text-slate-400">Hashtags</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedAsset.hashtags.map((h, idx) => (
                      <span key={idx} className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded text-[11px]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="font-bold text-slate-400">Visual Art Direction</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                    {selectedAsset.visualDirection}
                  </p>
                </div>
              </div>

              {/* Reviewer Comment Thread */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Review Comments & Audit Trail ({selectedAsset.comments.length})</span>
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedAsset.comments.map((c) => (
                    <div key={c.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <div className="flex items-center space-x-2">
                          <img src={c.authorAvatar} alt={c.authorName} className="w-4 h-4 rounded-full object-cover" />
                          <span className="font-bold text-slate-200">{c.authorName}</span>
                        </div>
                        <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Input */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add reviewer feedback or approval note..."
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2 focus:border-indigo-500 outline-none"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Comment</span>
                  </button>
                </div>
              </div>

              {/* Decider Decision Bar */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Decider Check: <strong className="text-slate-200">{currentApprover.name}</strong></span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowRejectionModal(true)}
                    className="flex-1 sm:flex-none bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Asset</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              Select an asset from the queue on the left to inspect details and issue approval decisions.
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Reject Campaign Asset</span>
            </h3>
            <p className="text-xs text-slate-400">
              Please specify the rejection reason or required revisions for the creator.
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Visual contrast requires refinement to meet brand guidelines..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:border-rose-500 outline-none resize-none"
            />

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
