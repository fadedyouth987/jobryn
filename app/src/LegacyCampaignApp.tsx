import React, { useState } from 'react';
import { 
  initialWorkspaces, 
  initialCampaignAssets, 
  initialLedgerEntries, 
  initialWebhookEndpoints, 
  initialWebhookLogs, 
  initialAuditLogs,
  initialAIInfluencers
} from './data/initialData';
import { 
  Workspace, 
  CampaignAsset, 
  LedgerEntry, 
  WebhookEndpoint, 
  WebhookDeliveryLog, 
  AuditLog, 
  AssetStatus, 
  WorkspaceRole,
  AIInfluencer,
  Platform
} from './types';

import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { TopHeaderBar } from './components/TopHeaderBar';
import { LandingHero } from './components/LandingHero';
import { AssetStudio } from './components/AssetStudio';
import { InfluencerStudio } from './components/InfluencerStudio';
import { ApprovalQueue } from './components/ApprovalQueue';
import { SocialPublisher } from './components/SocialPublisher';
import { SocialScheduler } from './components/SocialScheduler';
import { SmartEngagement } from './components/SmartEngagement';
import { CampaignAnalytics } from './components/CampaignAnalytics';
import { BrandAssetLibrary } from './components/BrandAssetLibrary';
import { BillingLedger } from './components/BillingLedger';
import { WorkspacePresence } from './components/WorkspacePresence';
import { WebhooksSecurity } from './components/WebhooksSecurity';
import { ReleaseAuditMonitor } from './components/ReleaseAuditMonitor';
import { TopUpModal } from './components/Modals/TopUpModal';
import { PlanModal } from './components/Modals/PlanModal';
import { FloatingMarketingWidget } from './components/FloatingMarketingWidget';
import { CampaignOperatingSystem } from './components/CampaignOperatingSystem';

export default function App() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('ws-acme-enterprise');

  const [campaignAssets, setCampaignAssets] = useState<CampaignAsset[]>(initialCampaignAssets);
  const [influencers, setInfluencers] = useState<AIInfluencer[]>(initialAIInfluencers);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(initialLedgerEntries);
  const [webhookEndpoints, setWebhookEndpoints] = useState<WebhookEndpoint[]>(initialWebhookEndpoints);
  const [webhookLogs, setWebhookLogs] = useState<WebhookDeliveryLog[]>(initialWebhookLogs);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState<boolean>(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0];

  // Helper: Reserve Credits
  const handleReserveCredits = (amount: number, description: string): boolean => {
    if (currentWorkspace.creditsRemaining < amount) {
      return false;
    }

    const newBalance = currentWorkspace.creditsRemaining - amount;

    // Update Workspace State
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === currentWorkspace.id ? { ...w, creditsRemaining: newBalance } : w))
    );

    // Record Ledger Entry
    const newEntry: LedgerEntry = {
      id: `ledg-${Date.now().toString().substring(6)}`,
      workspaceId: currentWorkspace.id,
      timestamp: new Date().toISOString(),
      type: 'reservation',
      description,
      amountCredits: -amount,
      resultingBalance: newBalance,
    };
    setLedgerEntries((prev) => [newEntry, ...prev]);

    return true;
  };

  // Helper: Add Asset
  const handleAddAsset = (newAsset: CampaignAsset) => {
    setCampaignAssets((prev) => [newAsset, ...prev]);

    // Record Audit
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      timestamp: new Date().toISOString(),
      actor: currentWorkspace.members[0].name,
      action: 'ai.asset.create',
      details: `Created new AI Campaign Asset "${newAsset.title}" for ${newAsset.platform.toUpperCase()}`,
      ipAddress: '103.21.244.12',
      securitySeverity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Helper: Update Asset Status
  const handleUpdateAssetStatus = (
    assetId: string,
    status: AssetStatus,
    commentText?: string,
    rejectionReason?: string
  ) => {
    setCampaignAssets((prev) =>
      prev.map((a) => {
        if (a.id !== assetId) return a;

        const updatedComments = commentText
          ? [
              ...a.comments,
              {
                id: `c-${Date.now()}`,
                authorName: currentWorkspace.members[0].name,
                authorAvatar: currentWorkspace.members[0].avatar,
                text: commentText,
                createdAt: new Date().toISOString(),
              },
            ]
          : a.comments;

        return {
          ...a,
          status,
          rejectionReason: rejectionReason || a.rejectionReason,
          decidedAt: status === 'approved' || status === 'rejected' ? new Date().toISOString() : a.decidedAt,
          comments: updatedComments,
        };
      })
    );

    // Audit Log
    const targetAsset = campaignAssets.find((a) => a.id === assetId);
    if (targetAsset) {
      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        workspaceId: currentWorkspace.id,
        timestamp: new Date().toISOString(),
        actor: currentWorkspace.members[0].name,
        action: `asset.status.${status}`,
        details: `Updated status of "${targetAsset.title}" to ${status.toUpperCase()}`,
        ipAddress: '103.21.244.12',
        securitySeverity: 'info',
      };
      setAuditLogs((prev) => [audit, ...prev]);
    }
  };

  // Helper: Batch Approve All
  const handleBatchApproveAll = () => {
    setCampaignAssets((prev) =>
      prev.map((a) => {
        if (a.workspaceId === currentWorkspace.id && a.status === 'pending_review') {
          return {
            ...a,
            status: 'approved',
            decidedAt: new Date().toISOString(),
            comments: [
              ...a.comments,
              {
                id: `c-${Date.now()}`,
                authorName: currentWorkspace.members[0].name,
                authorAvatar: currentWorkspace.members[0].avatar,
                text: 'Batch Approved via Workflow Decider Engine.',
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return a;
      })
    );

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      timestamp: new Date().toISOString(),
      actor: currentWorkspace.members[0].name,
      action: 'asset.batch.approve',
      details: 'Executed Batch Approval for all pending review assets.',
      ipAddress: '103.21.244.12',
      securitySeverity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Helper: Publish Now
  const handlePublishNow = (assetId: string) => {
    setCampaignAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, status: 'published' } : a))
    );

    const targetAsset = campaignAssets.find((a) => a.id === assetId);
    if (targetAsset) {
      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        workspaceId: currentWorkspace.id,
        timestamp: new Date().toISOString(),
        actor: 'Auto Dispatch Engine',
        action: 'asset.publish.dispatch',
        details: `Successfully dispatched "${targetAsset.title}" to ${targetAsset.platform.toUpperCase()}`,
        ipAddress: 'System Egress',
        securitySeverity: 'info',
      };
      setAuditLogs((prev) => [audit, ...prev]);
    }
  };

  // Helper: Top Up Credits
  const handleConfirmTopUp = (amountCredits: number, priceUsd: number) => {
    const newBalance = currentWorkspace.creditsRemaining + amountCredits;

    setWorkspaces((prev) =>
      prev.map((w) => (w.id === currentWorkspace.id ? { ...w, creditsRemaining: newBalance } : w))
    );

    const newEntry: LedgerEntry = {
      id: `ledg-${Date.now().toString().substring(6)}`,
      workspaceId: currentWorkspace.id,
      timestamp: new Date().toISOString(),
      type: 'topup',
      description: `Stripe Credit Purchase (+${amountCredits.toLocaleString()} Credits)`,
      amountCredits: amountCredits,
      resultingBalance: newBalance,
      stripeReference: `ch_stripe_${Math.random().toString(36).substring(2, 9)}`,
    };
    setLedgerEntries((prev) => [newEntry, ...prev]);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      timestamp: new Date().toISOString(),
      actor: currentWorkspace.members[0].name,
      action: 'billing.credit.topup',
      details: `Purchased +${amountCredits} credits via Stripe ($${priceUsd})`,
      ipAddress: '103.21.244.12',
      securitySeverity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Helper: Select Plan
  const handleSelectPlan = (plan: 'starter' | 'professional' | 'enterprise') => {
    const allocated = plan === 'enterprise' ? 10000 : plan === 'professional' ? 3000 : 1000;
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.id === currentWorkspace.id ? { ...w, plan, totalCreditsAllocated: allocated } : w
      )
    );
  };

  // Helper: Update Member Role
  const handleUpdateMemberRole = (memberId: string, role: WorkspaceRole) => {
    setWorkspaces((prev) =>
      prev.map((w) => {
        if (w.id !== currentWorkspace.id) return w;
        return {
          ...w,
          members: w.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
        };
      })
    );
  };

  // Helper: Webhook Add
  const handleAddWebhook = (endpoint: WebhookEndpoint) => {
    setWebhookEndpoints((prev) => [...prev, endpoint]);
  };

  // Helper: Toggle Legal Hold
  const handleToggleLegalHold = (wsId: string) => {
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === wsId ? { ...w, legalHoldActive: !w.legalHoldActive } : w))
    );
  };

  // Helper: Save or Update Influencer
  const handleSaveInfluencer = (newInf: AIInfluencer) => {
    setInfluencers((prev) => [newInf, ...prev]);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      timestamp: new Date().toISOString(),
      actor: currentWorkspace.members[0].name,
      action: 'ai.influencer.create',
      details: `Saved new AI Influencer profile "${newInf.name}" (${newInf.handle}) with ComfyUI seed #${newInf.seed}`,
      ipAddress: '103.21.244.12',
      securitySeverity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Helper: Toggle Lock Influencer
  const handleToggleLockInfluencer = (id: string) => {
    setInfluencers((prev) =>
      prev.map((inf) => (inf.id === id ? { ...inf, locked: !inf.locked } : inf))
    );
  };

  // Helper: Update Asset Schedule Time / Status from Drag & Drop or Modal
  const handleUpdateAssetSchedule = (assetId: string, newScheduledTime: string, newStatus?: AssetStatus) => {
    setCampaignAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              scheduledTime: newScheduledTime,
              status: newStatus || a.status,
            }
          : a
      )
    );

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      timestamp: new Date().toISOString(),
      actor: currentWorkspace.members[0].name,
      action: 'scheduler.post.rescheduled',
      details: `Rescheduled asset ${assetId} to ${newScheduledTime}`,
      ipAddress: '103.21.244.12',
      securitySeverity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Helper: Quick Schedule New Post
  const handleQuickScheduleNewPost = (title: string, caption: string, platform: Platform, scheduledTime: string) => {
    const newAsset: CampaignAsset = {
      id: `asset-sched-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      title,
      platform,
      status: 'scheduled',
      currentVersion: 1,
      caption,
      hashtags: ['#Scheduled', '#SocialMarketing', '#AIStudio'],
      imagePrompt: `Custom branded creative asset graphics for ${title}`,
      visualDirection: 'Enterprise Social Campaign Style',
      scheduledTime,
      decidedAt: new Date().toISOString(),
      versions: [
        {
          versionNumber: 1,
          createdAt: new Date().toISOString(),
          createdBy: currentWorkspace.members[0].name,
          caption,
          hashtags: ['#Scheduled', '#SocialMarketing', '#AIStudio'],
          imagePrompt: `Custom branded creative asset graphics for ${title}`,
          visualDirection: 'Enterprise Social Campaign Style',
          costCredits: 0,
        },
      ],
      comments: [],
    };

    setCampaignAssets((prev) => [newAsset, ...prev]);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      timestamp: new Date().toISOString(),
      actor: currentWorkspace.members[0].name,
      action: 'scheduler.post.created',
      details: `Queued new scheduled post "${title}" for ${scheduledTime}`,
      ipAddress: '103.21.244.12',
      securitySeverity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Helper: Generate Content for Influencer
  const handleGenerateContentForInfluencer = (influencer: AIInfluencer, prompt: string, platform: Platform) => {
    const cost = 15;
    handleReserveCredits(cost, `AI Influencer Content Generation: ${influencer.name} (${platform.toUpperCase()})`);

    const newAsset: CampaignAsset = {
      id: `asset-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      title: `${influencer.name}: ${prompt.substring(0, 45)}...`,
      platform,
      status: 'pending_review',
      currentVersion: 1,
      caption: `[${influencer.name} - ${influencer.handle}]: ${prompt}. Exploring zero-drift workflows with ${influencer.archetype}. #AIInfluencer #${influencer.name.replace(/\s+/g, '')} #TechInnovation`,
      hashtags: ['#AIInfluencer', '#VirtualPersonality', '#ZeroDriftAI', '#GenerativeContent'],
      imagePrompt: `[IP-Adapter Locked Face #${influencer.seed} - ${influencer.faceEmbeddingHash}]: ${influencer.appearancePrompt}. Action: ${prompt}`,
      visualDirection: `Rendered with ${influencer.loraWeights.lightingModel} lighting. Face Consistency: ${(influencer.loraWeights.faceConsistency * 100).toFixed(0)}%`,
      versions: [
        {
          versionNumber: 1,
          createdAt: new Date().toISOString(),
          createdBy: influencer.name,
          caption: `[${influencer.name} - ${influencer.handle}]: ${prompt}.`,
          hashtags: ['#AIInfluencer', '#VirtualPersonality'],
          imagePrompt: `[IP-Adapter Locked Face #${influencer.seed}]: ${influencer.appearancePrompt}`,
          visualDirection: `${influencer.loraWeights.lightingModel} Studio Lighting`,
          costCredits: cost,
        },
      ],
      comments: [
        {
          id: `c-${Date.now()}`,
          authorName: 'System AI Engine',
          authorAvatar: influencer.avatarUrl,
          text: `Generated using locked facial matrix #${influencer.seed} (${influencer.faceEmbeddingHash}). Ready for Decider review.`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setCampaignAssets((prev) => [newAsset, ...prev]);

    // Update influencer posts count
    setInfluencers((prev) =>
      prev.map((inf) =>
        inf.id === influencer.id
          ? { ...inf, postsGeneratedCount: inf.postsGeneratedCount + 1 }
          : inf
      )
    );

    setActiveTab('approvals');
  };

  // Helper: Execute GDPR Erase
  const handleExecuteGdprErase = (wsId: string) => {
    setCampaignAssets((prev) => prev.filter((a) => a.workspaceId !== wsId));
    setWebhookEndpoints((prev) => prev.filter((w) => w.workspaceId !== wsId));

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      workspaceId: wsId,
      timestamp: new Date().toISOString(),
      actor: currentWorkspace.members[0].name,
      action: 'gdpr.workspace.erasure',
      details: 'Executed 2-step permanent data erasure for workspace.',
      ipAddress: '103.21.244.12',
      securitySeverity: 'critical',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
      themeMode === 'light' 
        ? 'bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white' 
        : 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white'
    }`}>
      {/* Left Navigation Sidebar */}
      <SidebarNav
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        onSelectWorkspace={setCurrentWorkspaceId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTopUp={() => setIsTopUpOpen(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        themeMode={themeMode}
        onToggleTheme={toggleThemeMode}
      />

      {/* Main Content Area - Responsive padding on desktop only */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Top Header Bar */}
        <TopHeaderBar
          currentWorkspace={currentWorkspace}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenTopUp={() => setIsTopUpOpen(true)}
          themeMode={themeMode}
          onToggleTheme={toggleThemeMode}
        />

        {/* Main Content View Switcher */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {activeTab === 'campaign_os' && (
          <CampaignOperatingSystem workspaceId={currentWorkspace.id} />
        )}

        {activeTab === 'overview' && (
          <LandingHero
            onStartDemo={setActiveTab}
            workspaceName={currentWorkspace.name}
            themeMode={themeMode}
          />
        )}

        {activeTab === 'studio' && (
          <AssetStudio
            currentWorkspace={currentWorkspace}
            onAddAsset={handleAddAsset}
            onReserveCredits={handleReserveCredits}
            onNavigateToApprovals={() => setActiveTab('approvals')}
          />
        )}

        {activeTab === 'influencers' && (
          <InfluencerStudio
            currentWorkspace={currentWorkspace}
            influencers={influencers}
            onSaveInfluencer={handleSaveInfluencer}
            onToggleLock={handleToggleLockInfluencer}
            onGenerateContentForInfluencer={handleGenerateContentForInfluencer}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovalQueue
            currentWorkspace={currentWorkspace}
            assets={campaignAssets}
            onUpdateAssetStatus={handleUpdateAssetStatus}
            onBatchApproveAll={handleBatchApproveAll}
          />
        )}

        {activeTab === 'publisher' && (
          <SocialPublisher
            currentWorkspace={currentWorkspace}
            assets={campaignAssets}
            onPublishNow={handlePublishNow}
          />
        )}

        {activeTab === 'scheduler' && (
          <SocialScheduler
            currentWorkspace={currentWorkspace}
            assets={campaignAssets}
            influencers={influencers}
            onUpdateAssetSchedule={handleUpdateAssetSchedule}
            onPublishNow={handlePublishNow}
            onQuickScheduleNewPost={handleQuickScheduleNewPost}
          />
        )}

        {activeTab === 'engagement' && (
          <SmartEngagement
            currentWorkspace={currentWorkspace}
            assets={campaignAssets}
            onReplyAdded={(assetId, commentId, replyText) => {
              setCampaignAssets((prev) =>
                prev.map((a) =>
                  a.id === assetId
                    ? {
                        ...a,
                        comments: [
                          ...a.comments,
                          {
                            id: `reply-${Date.now()}`,
                            authorName: `${currentWorkspace.name} Community Bot`,
                            authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
                            text: replyText,
                            createdAt: new Date().toISOString(),
                          },
                        ],
                      }
                    : a
                )
              );
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <CampaignAnalytics
            currentWorkspace={currentWorkspace}
            assets={campaignAssets}
          />
        )}

        {activeTab === 'brand_library' && (
          <BrandAssetLibrary
            currentWorkspace={currentWorkspace}
          />
        )}

        {activeTab === 'billing' && (
          <BillingLedger
            currentWorkspace={currentWorkspace}
            ledgerEntries={ledgerEntries}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onOpenPlanModal={() => setIsPlanModalOpen(true)}
            themeMode={themeMode}
          />
        )}

        {activeTab === 'presence' && (
          <WorkspacePresence
            currentWorkspace={currentWorkspace}
            onUpdateMemberRole={handleUpdateMemberRole}
          />
        )}

        {activeTab === 'webhooks' && (
          <WebhooksSecurity
            currentWorkspace={currentWorkspace}
            webhookEndpoints={webhookEndpoints}
            webhookLogs={webhookLogs}
            auditLogs={auditLogs}
            onAddWebhook={handleAddWebhook}
            onToggleLegalHold={handleToggleLegalHold}
            onExecuteGdprErase={handleExecuteGdprErase}
          />
        )}

        {activeTab === 'audit_inspector' && (
          <ReleaseAuditMonitor />
        )}
      </main>

      {/* Modals */}
      <TopUpModal
        currentWorkspace={currentWorkspace}
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onConfirmTopUp={handleConfirmTopUp}
      />

      <PlanModal
        currentWorkspace={currentWorkspace}
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />

      {/* Floating Marketing Showcase Bar */}
      <FloatingMarketingWidget onNavigateToTab={setActiveTab} themeMode={themeMode} />
      </div>
    </div>
  );
}
