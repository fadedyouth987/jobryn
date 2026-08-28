import { Workspace, CampaignAsset, LedgerEntry, WebhookEndpoint, WebhookDeliveryLog, AuditLog, AuditCheckItem, AIInfluencer } from '../types';

export const initialWorkspaces: Workspace[] = [
  {
    id: 'ws-acme-enterprise',
    name: 'Acme Corp Marketing',
    slug: 'acme-corp',
    plan: 'enterprise',
    creditsRemaining: 4850,
    totalCreditsAllocated: 10000,
    legalHoldActive: false,
    retentionDays: 365,
    members: [
      {
        id: 'user-jack',
        name: 'Jack Bradley',
        email: 'jack.bradley@acme.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'owner',
        status: 'active',
      },
      {
        id: 'user-elena',
        name: 'Elena Rostova',
        email: 'elena.r@acme.com',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        role: 'approver',
        status: 'active',
        currentEditingAssetId: 'asset-001',
      },
      {
        id: 'user-marcus',
        name: 'Marcus Vance',
        email: 'marcus.v@acme.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'creator',
        status: 'idle',
      },
      {
        id: 'user-sophia',
        name: 'Sophia Chen',
        email: 'sophia.c@acme.com',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        status: 'active',
      }
    ]
  },
  {
    id: 'ws-jobryn-agency',
    name: 'Jobryn Global Studio',
    slug: 'jobryn-studio',
    plan: 'professional',
    creditsRemaining: 1820,
    totalCreditsAllocated: 3000,
    legalHoldActive: false,
    retentionDays: 90,
    members: [
      {
        id: 'user-jack',
        name: 'Jack Bradley',
        email: 'jack.bradley@jobryn.org',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'owner',
        status: 'active',
      },
      {
        id: 'user-sarah',
        name: 'Sarah Jenkins',
        email: 'sarah.j@jobryn.org',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        role: 'approver',
        status: 'active',
      }
    ]
  }
];

export const initialCampaignAssets: CampaignAsset[] = [
  {
    id: 'asset-001',
    workspaceId: 'ws-acme-enterprise',
    title: 'Q3 Enterprise AI Product Announcement',
    platform: 'linkedin',
    status: 'pending_review',
    currentVersion: 2,
    approverId: 'user-elena',
    caption: '🚀 Scaling marketing workflows shouldn’t mean sacrificing brand governance. Today, we are unveiling Jobryn v2.4 — featuring atomic credit reservations, SSRF-guarded webhooks, and sub-second multi-channel social publishing.',
    hashtags: ['#EnterpriseSaaS', '#AIMarketing', '#ProductUpdate', '#Automation'],
    imagePrompt: 'A sleek, obsidian-dark 3D technological dashboard with neon cyan glass overlays, showing floating real-time analytics graphs and high-contrast typography.',
    visualDirection: '3D Render, Tech Minimalist, High Contrast Obsidian and Electric Cyan highlights, 4k ultra precision',
    scheduledTime: '2026-08-01T14:00:00Z',
    lockedBy: 'user-elena',
    versions: [
      {
        versionNumber: 1,
        createdAt: '2026-07-26T10:15:00Z',
        createdBy: 'Marcus Vance',
        caption: 'Exciting news! Check out our new AI tools for social media publishing.',
        hashtags: ['#AI', '#Marketing'],
        imagePrompt: '3D floating dashboard',
        visualDirection: 'Clean corporate 3D',
        costCredits: 15,
      },
      {
        versionNumber: 2,
        createdAt: '2026-07-27T08:30:00Z',
        createdBy: 'Marcus Vance',
        caption: '🚀 Scaling marketing workflows shouldn’t mean sacrificing brand governance. Today, we are unveiling Jobryn v2.4 — featuring atomic credit reservations, SSRF-guarded webhooks, and sub-second multi-channel social publishing.',
        hashtags: ['#EnterpriseSaaS', '#AIMarketing', '#ProductUpdate', '#Automation'],
        imagePrompt: 'A sleek, obsidian-dark 3D technological dashboard with neon cyan glass overlays, showing floating real-time analytics graphs and high-contrast typography.',
        visualDirection: '3D Render, Tech Minimalist, High Contrast Obsidian and Electric Cyan highlights, 4k ultra precision',
        costCredits: 15,
      }
    ],
    comments: [
      {
        id: 'c-101',
        authorName: 'Elena Rostova',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        text: 'The copy on v2 hits all our enterprise positioning points! Checking visual contrast before final seal.',
        createdAt: '2026-07-27T09:12:00Z'
      }
    ]
  },
  {
    id: 'asset-002',
    workspaceId: 'ws-acme-enterprise',
    title: 'Behind The Scenes: Engineering Resilience',
    platform: 'instagram',
    status: 'approved',
    currentVersion: 1,
    approverId: 'user-elena',
    decidedAt: '2026-07-26T16:20:00Z',
    caption: 'How do you build a credit ledger that NEVER double-spends under high concurrency? Slide through to see how our engineering team solved transaction idempotency and outbox queues! 💡',
    hashtags: ['#BehindTheScenes', '#EngineeringExcellence', '#SystemDesign', '#SoftwareEngineering'],
    imagePrompt: 'Minimalist editorial carousel slide showing glowing circuit diagrams overlaid on dark textured slate.',
    visualDirection: 'Luxury Editorial, Dark Slate, Emerald Green Accents',
    scheduledTime: '2026-08-02T16:00:00Z',
    versions: [
      {
        versionNumber: 1,
        createdAt: '2026-07-26T14:00:00Z',
        createdBy: 'Sophia Chen',
        caption: 'How do you build a credit ledger that NEVER double-spends under high concurrency? Slide through to see how our engineering team solved transaction idempotency and outbox queues! 💡',
        hashtags: ['#BehindTheScenes', '#EngineeringExcellence', '#SystemDesign', '#SoftwareEngineering'],
        imagePrompt: 'Minimalist editorial carousel slide showing glowing circuit diagrams overlaid on dark textured slate.',
        visualDirection: 'Luxury Editorial, Dark Slate, Emerald Green Accents',
        costCredits: 15,
      }
    ],
    comments: []
  },
  {
    id: 'asset-003',
    workspaceId: 'ws-acme-enterprise',
    title: 'TikTok Viral Hook: 3 Marketing Myths Busted',
    platform: 'tiktok',
    status: 'scheduled',
    currentVersion: 1,
    approverId: 'user-jack',
    decidedAt: '2026-07-27T11:00:00Z',
    caption: 'Stop relying on manual posting schedules in 2026! Here are 3 automation hacks top growth leads use to scale content 10x without burning out. 📈🔥 #GrowthHacks #ContentCreator #MarketingTips',
    hashtags: ['#GrowthHacks', '#ContentCreator', '#MarketingTips', '#TikTokGrowth'],
    imagePrompt: 'Vertical 9:16 high-energy visual preview with dynamic text overlays and vibrant gradient lighting.',
    visualDirection: 'Bold Cyberpunk, 9:16 Portrait, High Energy Motion Blur',
    scheduledTime: '2026-08-03T18:30:00Z',
    versions: [
      {
        versionNumber: 1,
        createdAt: '2026-07-27T10:00:00Z',
        createdBy: 'Jack Bradley',
        caption: 'Stop relying on manual posting schedules in 2026! Here are 3 automation hacks top growth leads use to scale content 10x without burning out. 📈🔥 #GrowthHacks #ContentCreator #MarketingTips',
        hashtags: ['#GrowthHacks', '#ContentCreator', '#MarketingTips', '#TikTokGrowth'],
        imagePrompt: 'Vertical 9:16 high-energy visual preview with dynamic text overlays and vibrant gradient lighting.',
        visualDirection: 'Bold Cyberpunk, 9:16 Portrait, High Energy Motion Blur',
        costCredits: 15,
      }
    ],
    comments: []
  }
];

export const initialLedgerEntries: LedgerEntry[] = [
  {
    id: 'ledg-9901',
    workspaceId: 'ws-acme-enterprise',
    timestamp: '2026-07-27T12:00:00Z',
    type: 'deduction',
    description: 'AI Generation Settlement: Q3 Enterprise AI Product Announcement (v2)',
    amountCredits: -15,
    resultingBalance: 4850,
    assetId: 'asset-001'
  },
  {
    id: 'ledg-9900',
    workspaceId: 'ws-acme-enterprise',
    timestamp: '2026-07-27T08:30:00Z',
    type: 'reservation',
    description: 'Credit Reservation Hold: Asset Generation #asset-001',
    amountCredits: -15,
    resultingBalance: 4865,
    assetId: 'asset-001'
  },
  {
    id: 'ledg-9899',
    workspaceId: 'ws-acme-enterprise',
    timestamp: '2026-07-25T00:00:00Z',
    type: 'purchase',
    description: 'Enterprise Plan Monthly Renewal (10,000 Credits)',
    amountCredits: 5000,
    resultingBalance: 4880,
    stripeReference: 'sub_1Pq9872x910Z'
  }
];

export const initialWebhookEndpoints: WebhookEndpoint[] = [
  {
    id: 'wh-001',
    workspaceId: 'ws-acme-enterprise',
    url: 'https://api.acme.com/v1/jobryn-events',
    description: 'Production Marketing Automation Receiver',
    secret: 'whsec_vant_98a72b14c71e98a1290f',
    events: ['asset.published', 'approval.requested', 'credit.threshold_low'],
    status: 'active',
    lastDeliveryStatus: 200,
    lastLatencyMs: 142
  },
  {
    id: 'wh-002',
    workspaceId: 'ws-acme-enterprise',
    url: 'https://hooks.slack.com/services/T00/B00/XXXX',
    description: 'Slack Approvals Channel Bot',
    secret: 'whsec_slack_001928471a2e',
    events: ['approval.requested', 'approval.rejected'],
    status: 'active',
    lastDeliveryStatus: 200,
    lastLatencyMs: 98
  }
];

export const initialWebhookLogs: WebhookDeliveryLog[] = [
  {
    id: 'whlog-101',
    endpointId: 'wh-001',
    timestamp: '2026-07-27T11:05:22Z',
    event: 'approval.requested',
    status: 'success',
    statusCode: 200,
    latencyMs: 142,
    requestBodyPreview: '{"event":"approval.requested","asset_id":"asset-001","workspace_id":"ws-acme-enterprise"}',
    responsePreview: '{"received":true,"job_queued":"job_98124"}'
  },
  {
    id: 'whlog-102',
    endpointId: 'wh-001',
    timestamp: '2026-07-27T11:05:20Z',
    event: 'security.ssrf_test',
    status: 'blocked_ssrf',
    statusCode: 403,
    latencyMs: 3,
    requestBodyPreview: '{"test_target":"http://169.254.169.254/latest/meta-data/"}',
    responsePreview: '{"error":"SSRF_BLOCK","message":"Target host resolves to a restricted cloud metadata range."}'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit-501',
    workspaceId: 'ws-acme-enterprise',
    timestamp: '2026-07-27T11:00:00Z',
    actor: 'Jack Bradley (Owner)',
    action: 'campaign.asset.approve',
    details: 'Approved asset "TikTok Viral Hook: 3 Marketing Myths Busted" for scheduling',
    ipAddress: '103.21.244.12',
    securitySeverity: 'info'
  },
  {
    id: 'audit-500',
    workspaceId: 'ws-acme-enterprise',
    timestamp: '2026-07-27T08:30:00Z',
    actor: 'Marcus Vance (Creator)',
    action: 'ai.asset.generate',
    details: 'Generated v2 AI variant using Gemini API (Cost: 15 Credits)',
    ipAddress: '198.51.100.45',
    securitySeverity: 'info'
  },
  {
    id: 'audit-499',
    workspaceId: 'ws-acme-enterprise',
    timestamp: '2026-07-26T18:14:00Z',
    actor: 'System Security Engine',
    action: 'webhook.ssrf.block',
    details: 'Blocked outbound request attempt to private IP range 127.0.0.1:8080',
    ipAddress: 'System Internal',
    securitySeverity: 'warning'
  }
];

export const releaseAuditChecklist: AuditCheckItem[] = [
  {
    code: 'P0-1',
    severity: 'P0',
    category: 'Build & Imports',
    title: 'Inngest Relative Workflow Import Paths',
    description: 'Fixed all relative imports across job modules pointing to client files.',
    resolutionStatus: 'Resolved & Verified',
    verifiedEndpoint: '/api/inngest/health'
  },
  {
    code: 'P0-2',
    severity: 'P0',
    category: 'Database & Schema',
    title: 'Undefined Database Client Imports in Live Routes',
    description: 'Ensured all API routes correctly import DB instance or server proxy state.',
    resolutionStatus: 'Resolved & Verified',
    verifiedEndpoint: '/api/billing/credits/check'
  },
  {
    code: 'P0-3',
    severity: 'P0',
    category: 'Build & Imports',
    title: 'Social Publishing Platform Adapter Implementation',
    description: 'Replaced stubbed throw blocks with active multi-channel adapters & OAuth validation.',
    resolutionStatus: 'Resolved & Verified',
    verifiedEndpoint: '/api/health'
  },
  {
    code: 'P0-4',
    severity: 'P0',
    category: 'Billing & Ledger',
    title: 'Transactional Credit Ledger & Stripe Outbox Safety',
    description: 'Implemented atomic credit reservations, outbox pattern, and permanent ledger retention.',
    resolutionStatus: 'Resolved & Verified',
    verifiedEndpoint: '/api/billing/credits/check'
  },
  {
    code: 'P0-5',
    severity: 'P0',
    category: 'Tenant Security',
    title: 'Strict Workspace Tenant Membership & Isolation',
    description: 'Enforced header workspace verification against authenticated user roles.',
    resolutionStatus: 'Resolved & Verified',
    verifiedEndpoint: '/api/features/tenant_isolation'
  },
  {
    code: 'P0-6',
    severity: 'P0',
    category: 'Compliance',
    title: 'GDPR / OAIC Erasure & Export Flow Safety',
    description: 'Replaced soft-deletions with 2-step verification, media purging, and full JSON exports.',
    resolutionStatus: 'Resolved & Verified',
    verifiedEndpoint: '/api/gdpr/export'
  },
  {
    code: 'P1-1',
    severity: 'P1',
    category: 'SSRF & Webhooks',
    title: 'SSRF Webhook Egress Guard & Exponential Backoff',
    description: 'Blocked private IP ranges (127.0.0.1, 169.254.x.x, 10.x.x.x) for all outbound webhook calls.',
    resolutionStatus: 'Resolved & Verified',
    verifiedEndpoint: '/api/webhooks/deliver'
  },
  {
    code: 'P1-2',
    severity: 'P1',
    category: 'Tenant Security',
    title: 'Realtime Collaboration User Presence & Lock Synchronization',
    description: 'Replaced placeholder current-user-id with real workspace member IDs and asset locks.',
    resolutionStatus: 'Resolved & Verified',
    verifiedEndpoint: '/api/health'
  }
];

export const initialAIInfluencers: AIInfluencer[] = [
  {
    id: 'inf-elena-vance',
    workspaceId: 'ws-acme-enterprise',
    name: 'Elena Vance',
    handle: '@elena.vance.ai',
    archetype: 'Enterprise AI & Tech Strategist',
    niche: 'SaaS, Artificial Intelligence & Cloud Architecture',
    bio: 'Virtual AI Executive breaking down generative workflows, autonomous agent orchestration, and enterprise scale.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    locked: true,
    faceEmbeddingHash: 'ip_adapter_v2_f8e910a3_elena',
    seed: 849204192,
    loraWeights: {
      faceConsistency: 0.96,
      styleStrength: 0.82,
      lightingModel: 'Studio Softbox High Key',
    },
    appearancePrompt: 'Ultra-realistic 35-year-old female tech executive, sharp cheekbones, almond hazel eyes, sleek dark hair in a neat low bun, wearing a tailored navy blazer, modern tech office background, soft volumetric studio lighting, 8k raw photography, hyper-detailed skin texture.',
    negativePrompt: 'deformed eyes, extra fingers, cartoonish, low resolution, plastic skin, oversaturated, blurry background artifacts',
    voiceProfile: {
      tone: 'Crisp, articulate, confident B2B executive',
      pitch: 1.02,
      speed: 1.0,
      accent: 'US West Coast Tech Standard',
      samplePhrase: 'Welcome back. Today we are exploring how autonomous agent networks cut workflow latency by 70 percent.',
    },
    postsGeneratedCount: 38,
    avgEngagementRate: '6.4%',
    createdAt: '2026-06-15T10:00:00Z',
  },
  {
    id: 'inf-marcus-thorne',
    workspaceId: 'ws-acme-enterprise',
    name: 'Marcus Thorne',
    handle: '@marcus.cyber.mode',
    archetype: 'Cyber-Fashion & Minimalist Tech',
    niche: 'Wearable Tech, Cyber-Aesthetics & Hardware Design',
    bio: 'Digital creator curating the intersection of minimalist high-fashion and next-gen spatial computing hardware.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    locked: true,
    faceEmbeddingHash: 'ip_adapter_v2_c3d77192_marcus',
    seed: 192840192,
    loraWeights: {
      faceConsistency: 0.94,
      styleStrength: 0.88,
      lightingModel: 'Cinematic Cyberpunk Neon',
    },
    appearancePrompt: 'Hyper-detailed 29-year-old male product designer, structured jawline, sharp dark eyes, short styled fade haircut, wearing a matte black tech-wear jacket, ambient subtle neon accent lighting, cinematic bokeh background, Hasselblad medium format photo quality.',
    negativePrompt: 'grainy, low contrast, oversaturated face, unnatural skin, distorted ears',
    voiceProfile: {
      tone: 'Deep, resonant, calm aesthetic voice',
      pitch: 0.88,
      speed: 0.95,
      accent: 'British Minimalist',
      samplePhrase: 'Form follows function, but elegance defines how we interact with technology every day.',
    },
    postsGeneratedCount: 24,
    avgEngagementRate: '5.2%',
    createdAt: '2026-07-01T14:30:00Z',
  },
];

