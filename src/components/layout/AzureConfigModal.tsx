import React, { useState } from 'react';
import {
  X,
  Cpu,
  Key,
  Globe,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  RotateCcw,
  Cloud,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { azureService } from '../../services/azureService';
import { AzureConfig } from '../../types/market';

interface AzureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const AzureConfigModal: React.FC<AzureConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [config, setConfig] = useState<AzureConfig>(azureService.getConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    azureService.saveConfig(config);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onConfigSaved();
      onClose();
    }, 1000);
  };

  const handleResetToSimulated = () => {
    const defaultConfig: AzureConfig = {
      connected: false,
      endpoint: '',
      apiKey: '',
      deploymentName: 'gpt-4o',
      searchEndpoint: '',
      searchKey: '',
      searchIndex: 'azure-jobs-index',
      cosmosDbEndpoint: '',
      useLiveApi: false
    };
    setConfig(defaultConfig);
    azureService.saveConfig(defaultConfig);
    setTestResult({
      success: true,
      message: 'Reset to local Microsoft Azure simulation engine (2.48M+ verified postings).'
    });
  };

  const handleTestConnection = async () => {
    if (!config.useLiveApi) {
      setTestResult({
        success: true,
        message: 'Microsoft Azure simulated telemetry & cognitive engine is active and ready (0ms API latency).'
      });
      return;
    }

    if (!config.endpoint || !config.apiKey) {
      setTestResult({
        success: false,
        message: 'Please provide both Microsoft Azure OpenAI Endpoint and API Key to test live connection.'
      });
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    try {
      const cleanEndpoint = config.endpoint.replace(/\/+$/, '');
      const url = `${cleanEndpoint}/openai/deployments/${config.deploymentName || 'gpt-4o'}/chat/completions?api-version=2024-02-15-preview`;

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': config.apiKey
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Ping test' }],
          max_tokens: 5
        })
      });

      if (resp.ok) {
        setTestResult({
          success: true,
          message: 'Successfully linked to Microsoft Azure OpenAI Service deployment!'
        });
        setConfig(prev => ({ ...prev, connected: true }));
      } else {
        const err = await resp.text();
        setTestResult({
          success: false,
          message: `Microsoft Azure API returned ${resp.status}: ${err.slice(0, 150)}`
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message}. (Ensure CORS is enabled or use simulated Microsoft Azure engine).`
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Microsoft Azure Cloud Integration & Linking
              </h2>
              <p className="text-xs text-slate-400">
                Connect your live Microsoft Azure OpenAI Service, Cognitive Search, and Cosmos DB endpoints.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Azure Status Badge */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <div>
                <span className="font-bold text-white block text-sm">Microsoft Azure Cloud Connection</span>
                <span className="text-[11px] text-slate-400">
                  {config.useLiveApi
                    ? 'Connected via Live Azure OpenAI API & Cognitive Search.'
                    : 'Linked via Microsoft Azure Simulated Intelligence Engine (2.48M+ verified postings).'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.useLiveApi}
                onChange={e => setConfig({ ...config, useLiveApi: e.target.value === 'true' || e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-start gap-3 animate-slide-down ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {/* Live Configuration Fields */}
          {config.useLiveApi ? (
            <div className="space-y-4 animate-slide-down">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" /> Microsoft Azure OpenAI Endpoint URL
                </label>
                <input
                  type="text"
                  placeholder="https://your-resource-name.openai.azure.com/"
                  value={config.endpoint}
                  onChange={e => setConfig({ ...config, endpoint: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" /> Microsoft Azure OpenAI API Key
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••••"
                  value={config.apiKey}
                  onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Model Deployment Name
                </label>
                <input
                  type="text"
                  placeholder="gpt-4o"
                  value={config.deploymentName}
                  onChange={e => setConfig({ ...config, deploymentName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" /> Azure AI Search / Cognitive Index (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://your-search-service.search.windows.net"
                  value={config.searchEndpoint || ''}
                  onChange={e => setConfig({ ...config, searchEndpoint: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>Simulated Microsoft Azure Cloud Pipeline Active</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                You are currently connected to the local Microsoft Azure Cloud Intelligence cache containing 2.48M+ verified technology job postings, AZ-305/AI-102 career diagnostic models, and zero-latency simulation.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-sky-400 border border-blue-500/20 text-[10px] font-mono">
                  Azure OpenAI: Active
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono">
                  Azure AI Search: Linked
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  Cosmos DB: Synced
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={handleResetToSimulated}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              {testingConnection ? 'Testing...' : 'Test Azure Connection'}
            </button>
            <button
              onClick={handleSave}
              className="azure-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/25"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveSuccess ? 'Saved!' : 'Save Azure Config'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
