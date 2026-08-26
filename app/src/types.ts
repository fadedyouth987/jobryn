export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'twitter' | 'facebook';

export type AssetStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'scheduled' | 'published';

export type WorkspaceRole = 'owner' | 'admin' | 'approver' | 'creator' | 'viewer';

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: WorkspaceRole;
  status: 'active' | 'idle' | 'offline';
  currentEditingAssetId?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  creditsRemaining: number;
  totalCreditsAllocated: number;
  members: WorkspaceMember[];
  legalHoldActive: boolean;
  retentionDays: number;
}

export interface AssetVersion {
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  visualDirection: string;
  costCredits: number;
}

export interface CampaignAsset {
  id: string;
  workspaceId: string;
  title: string;
  platform: Platform;
  status: AssetStatus;
  currentVersion: number;
  versions: AssetVersion[];
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  visualDirection: string;
  scheduledTime?: string;
  approverId?: string;
  decidedAt?: string;
  rejectionReason?: string;
  lockedBy?: string;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    createdAt: string;
  }[];
}

export interface LedgerEntry {
  id: string;
  workspaceId: string;
  timestamp: string;
  type: 'reservation' | 'deduction' | 'refund' | 'purchase' | 'topup';
  description: string;
  amountCredits: number;
  resultingBalance: number;
  stripeReference?: string;
  assetId?: string;
}

export interface WebhookEndpoint {
  id: string;
  workspaceId: string;
  url: string;
  description: string;
  secret: string;
  events: string[];
  status: 'active' | 'suspended' | 'failing';
  lastDeliveryStatus?: number;
  lastLatencyMs?: number;
}

export interface WebhookDeliveryLog {
  id: string;
  endpointId: string;
  timestamp: string;
  event: string;
  status: 'success' | 'failed' | 'blocked_ssrf';
  statusCode: number;
  latencyMs: number;
  requestBodyPreview: string;
  responsePreview: string;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  ipAddress: string;
  securitySeverity: 'info' | 'warning' | 'critical';
}

export interface AuditCheckItem {
  code: string;
  severity: 'P0' | 'P1' | 'P2';
  title: string;
  category: 'Build & Imports' | 'Database & Schema' | 'Billing & Ledger' | 'Tenant Security' | 'SSRF & Webhooks' | 'Compliance';
  description: string;
  resolutionStatus: 'Resolved & Verified' | 'Pending Verification';
  verifiedEndpoint?: string;
}

export interface InfluencerVoiceProfile {
  tone: string;
  pitch: number;
  speed: number;
  accent: string;
  samplePhrase: string;
}

export interface AIInfluencer {
  id: string;
  workspaceId: string;
  name: string;
  handle: string;
  archetype: string;
  niche: string;
  bio: string;
  avatarUrl: string;
  locked: boolean;
  faceEmbeddingHash: string;
  seed: number;
  loraWeights: {
    faceConsistency: number;
    styleStrength: number;
    lightingModel: string;
  };
  appearancePrompt: string;
  negativePrompt: string;
  voiceProfile: InfluencerVoiceProfile;
  postsGeneratedCount: number;
  avgEngagementRate: string;
  createdAt: string;
}

