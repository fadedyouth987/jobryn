import React, { useState } from 'react';
import { Workspace, WebhookEndpoint, WebhookDeliveryLog, AuditLog } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Send, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  FileText, 
  Plus, 
  Key,
  ShieldAlert,
  Activity
} from 'lucide-react';

interface WebhooksSecurityProps {
  currentWorkspace: Workspace;
  webhookEndpoints: WebhookEndpoint[];
  webhookLogs: WebhookDeliveryLog[];
  auditLogs: AuditLog[];
  onAddWebhook: (endpoint: WebhookEndpoint) => void;
  onToggleLegalHold: (wsId: string) => void;
  onExecuteGdprErase: (wsId: string) => void;
}

export const WebhooksSecurity: React.FC<WebhooksSecurityProps> = ({
  currentWorkspace,
  webhookEndpoints,
  webhookLogs,
  auditLogs,
  onAddWebhook,
  onToggleLegalHold,
  onExecuteGdprErase,
}) => {
  const [testUrlInput, setTestUrlInput] = useState<string>('https://api.acme.com/v1/jobryn-events');
  const [ssrfTestResult, setSsrfTestResult] = useState<any | null>(null);
  const [isTestingSsrf, setIsTestingSsrf] = useState<boolean>(false);

  const [newWebhookUrl, setNewWebhookUrl] = useState<string>('');
  const [newWebhookDesc, setNewWebhookDesc] = useState<string>('');

  const [showErasureModal, setShowErasureModal] = useState<boolean>(false);
  const [erasureConfirmationText, setErasureConfirmationText] = useState<string>('');

  const workspaceEndpoints = webhookEndpoints.filter((w) => w.workspaceId === currentWorkspace.id);
  const workspaceAuditLogs = auditLogs.filter((a) => a.workspaceId === currentWorkspace.id);

  const handleTestWebhookDelivery = async (targetUrl?: string) => {
    const urlToTest = targetUrl || testUrlInput;
    setIsTestingSsrf(true);
    setSsrfTestResult(null);

    try {
      const res = await fetch('/api/webhooks/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlToTest,
          payload: { event: 'test.delivery', workspaceId: currentWorkspace.id, timestamp: new Date().toISOString() },
        }),
      });

      const data = await res.json();
      setSsrfTestResult(data);
    } catch (err: any) {
      setSsrfTestResult({
        success: false,
        error: 'NETWORK_ERROR',
        message: err.message,
      });
    } finally {
      setIsTestingSsrf(false);
    }
  };

  const handleAddEndpoint = () => {
    if (!newWebhookUrl.trim()) return;

    const newEp: WebhookEndpoint = {
      id: `wh-${Date.now().toString().substring(6)}`,
      workspaceId: currentWorkspace.id,
      url: newWebhookUrl,
      description: newWebhookDesc || 'Production Endpoint Receiver',
      secret: `whsec_${Math.random().toString(36).substring(2, 12)}`,
      events: ['approval.requested', 'asset.published', 'credit.threshold_low'],
      status: 'active',
      lastDeliveryStatus: 200,
      lastLatencyMs: 120,
    };

    onAddWebhook(newEp);
    setNewWebhookUrl('');
    setNewWebhookDesc('');
  };

  const handleDownloadGdprExport = async () => {
    try {
      const res = await fetch('/api/gdpr/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: currentWorkspace.id }),
      });
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Jobryn_GDPR_Export_${currentWorkspace.slug}_${Date.now()}.json`;
      a.click();
    } catch (err) {
      alert('Failed to generate export JSON package.');
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white">Webhooks Egress Guard & GDPR Compliance</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              SSRF Egress Shield Active
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            SSRF-protected outbound webhooks, immutable security audit logs, full data export, and 2-step erasure safeguards.
          </p>
        </div>

        <button
          onClick={handleDownloadGdprExport}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Download GDPR Data Export (JSON)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Webhooks & SSRF Guard Test Runner (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SSRF Egress Security Test Runner */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>SSRF Egress Security Validator</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                SSRF Guard Enabled
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Test outbound webhook dispatch against public endpoints or simulate SSRF attack targets (e.g. <code>127.0.0.1</code> or <code>169.254.169.254</code>) to verify egress blocking.
            </p>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={testUrlInput}
                onChange={(e) => setTestUrlInput(e.target.value)}
                placeholder="https://api.yourdomain.com/webhook"
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-indigo-500 outline-none font-mono"
              />
              <button
                onClick={() => handleTestWebhookDelivery()}
                disabled={isTestingSsrf}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Dispatch</span>
              </button>
            </div>

            {/* Quick SSRF Attack Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500">Test SSRF Targets:</span>
              <button
                onClick={() => handleTestWebhookDelivery('http://127.0.0.1:8080/internal-admin')}
                className="text-[10px] bg-rose-950/60 text-rose-300 border border-rose-800/60 px-2.5 py-1 rounded-lg font-mono hover:bg-rose-900 transition-colors"
              >
                🚫 127.0.0.1:8080
              </button>
              <button
                onClick={() => handleTestWebhookDelivery('http://169.254.169.254/latest/meta-data/')}
                className="text-[10px] bg-rose-950/60 text-rose-300 border border-rose-800/60 px-2.5 py-1 rounded-lg font-mono hover:bg-rose-900 transition-colors"
              >
                🚫 169.254.169.254 (Cloud Metadata)
              </button>
              <button
                onClick={() => handleTestWebhookDelivery('https://api.acme.com/v1/jobryn-events')}
                className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded-lg font-mono hover:bg-emerald-900 transition-colors"
              >
                ✓ Public HTTPS Endpoint
              </button>
            </div>

            {/* SSRF Result Output Box */}
            {ssrfTestResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                ssrfTestResult.status === 'blocked_ssrf'
                  ? 'bg-rose-950/80 border-rose-800 text-rose-200'
                  : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Result: {ssrfTestResult.status?.toUpperCase()}</span>
                  <span>HTTP Status: {ssrfTestResult.statusCode} ({ssrfTestResult.latencyMs}ms)</span>
                </div>
                <p className="text-[11px] leading-relaxed font-sans">
                  {ssrfTestResult.message || ssrfTestResult.responsePreview}
                </p>
              </div>
            )}
          </div>

          {/* Webhook Endpoints List */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Configured Webhook Receivers ({workspaceEndpoints.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {workspaceEndpoints.map((ep) => (
                <div key={ep.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-200 font-bold truncate max-w-xs">{ep.url}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                      HTTP 200 ({ep.lastLatencyMs}ms)
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{ep.description}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                    <span>Secret: {ep.secret}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Endpoint Input */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300">Add Webhook Receiver</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  placeholder="https://api.domain.com/webhook"
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none"
                />
                <input
                  type="text"
                  value={newWebhookDesc}
                  onChange={(e) => setNewWebhookDesc(e.target.value)}
                  placeholder="Receiver description..."
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none"
                />
              </div>
              <button
                onClick={handleAddEndpoint}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Webhook Receiver</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Logs & GDPR Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* GDPR & Data Retention Policy Control */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>GDPR / OAIC Data Retention Controls</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-slate-200 block">Legal Hold Status</span>
                  <span className="text-[10px] text-slate-400">Prevents retention auto-purge when active</span>
                </div>

                <button
                  onClick={() => onToggleLegalHold(currentWorkspace.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    currentWorkspace.legalHoldActive
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {currentWorkspace.legalHoldActive ? 'Legal Hold ACTIVE' : 'Enable Hold'}
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Retention Policy Window</span>
                  <span className="font-mono text-indigo-400 font-bold">{currentWorkspace.retentionDays} Days</span>
                </div>
                <p className="text-[11px] text-slate-400">Assets and logs exceeding window are purged unless on Legal Hold.</p>
              </div>

              {/* Data Erasure Safety Trigger */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowErasureModal(true)}
                  className="w-full bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Request Permanent Workspace Erasure (GDPR)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Immutable Security Audit Logs */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Immutable System Audit Trail</span>
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
              {workspaceAuditLogs.map((log) => (
                <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-300">{log.actor}</span>
                    <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Erasure Safety Modal */}
      {showErasureModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Confirm Workspace Permanent Erasure</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This action is irreversible under GDPR / OAIC compliance protocols. All campaign assets, credit ledgers, media files, and webhook receivers will be permanently scrubbed.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase">
                Type <code className="text-rose-400">{currentWorkspace.slug}</code> to confirm:
              </label>
              <input
                type="text"
                value={erasureConfirmationText}
                onChange={(e) => setErasureConfirmationText(e.target.value)}
                placeholder={currentWorkspace.slug}
                className="w-full bg-slate-950 border border-slate-800 text-rose-300 text-xs rounded-xl p-3 font-mono outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowErasureModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={erasureConfirmationText !== currentWorkspace.slug}
                onClick={() => {
                  onExecuteGdprErase(currentWorkspace.id);
                  setShowErasureModal(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                  erasureConfirmationText === currentWorkspace.slug
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Execute Permanent Erasure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
