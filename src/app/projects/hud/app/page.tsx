'use client';

import { useEffect, useState, useCallback } from 'react';
import Navigation from "@/components/Navigation";

interface BiometricData {
  level: string;
  score: number;
}

interface StatusItem {
  level: string;
  detail: string;
}

interface DetectedItem {
  id: string;
  class: string;
  position: string;
  vertical: string;
  size: string;
  mechanisms: string[];
  importance_score: number;
  label: string;
  color: string;
}

interface Person {
  id: string;
  description: string;
  position: string;
  bond_status: string;
  label: string;
  importance_score: number;
}

interface Connection {
  from: string;
  to: string;
  type: string;
  color: string;
}

interface AnalysisData {
  scene_type: string;
  overall_color_scheme: 'red' | 'green' | 'mixed';
  pov_context: string;
  biometrics: Record<string, BiometricData>;
  status_panel: Record<string, StatusItem>;
  primary_target: {
    what: string;
    label: string;
    analysis: string;
    importance_score: number;
    mechanisms: string[];
  };
  detected_items: DetectedItem[];
  people: Person[];
  connections: Connection[];
  action: {
    recommendation: string;
    urgency: string;
    rationale: string;
  };
  is_mismatch: boolean;
  mismatch_details: string;
  aggregate: {
    top_survival_items: string[];
    top_reproduction_items: string[];
    global_summary: string;
    emotional_valence: number;
    arousal_level: number;
  };
  metadata?: {
    llm_model: string;
    created_at: string;
  };
  error?: string;
}

type ViewerSex = 'male' | 'female' | 'unspecified';
type ViewerAgeBand = 'teen' | 'young_adult' | 'adult' | 'elder';
type ViewerTribeRelation = 'in_group' | 'out_group' | 'unknown';
type ViewerObserverMode = 'in_scene' | 'observing';
type ViewerRelationToPrimary = 'self' | 'kin' | 'ally' | 'stranger' | 'rival' | 'potential_mate' | 'unknown';

interface ViewerProfile {
  sex: ViewerSex;
  age_band: ViewerAgeBand;
  tribe_relation_to_scene: ViewerTribeRelation;
  observer_mode: ViewerObserverMode;
  relation_to_primary_target: ViewerRelationToPrimary;
}

interface HistoryEntry {
  id: string;
  created_at: string | null;
  viewer_profile: ViewerProfile | null;
  analysis: AnalysisData | null;
  original_url: string | null;
  overlay_url: string | null;
}

// Map action to evopsych response
function getEvoPsychAction(analysis: AnalysisData): { action: string; description: string; color: string } {
  const { action, is_mismatch, status_panel, primary_target } = analysis;
  const threatLevel = status_panel?.threat_level?.level;
  const mateOpp = status_panel?.mate_opportunity?.level;
  const resourceLevel = status_panel?.resource_value?.level;
  const mechanisms = primary_target?.mechanisms || [];
  
  // Threat responses
  if (threatLevel === 'CRITICAL' || threatLevel === 'HIGH') {
    if (action?.recommendation === 'RUN' || action?.recommendation === 'FLEE') {
      return { action: 'FLIGHT', description: 'Immediate escape recommended. Threat exceeds capacity to confront.', color: 'text-red-400' };
    }
    if (action?.recommendation === 'DEFEND' || action?.recommendation === 'FIGHT') {
      return { action: 'FIGHT', description: 'Confront threat directly. Resources or kin at stake.', color: 'text-orange-400' };
    }
    return { action: 'FREEZE', description: 'Assess threat before committing to action. Avoid detection.', color: 'text-yellow-400' };
  }
  
  // Reproduction responses
  if (mateOpp === 'HIGH' || mechanisms.includes('mate_value')) {
    return { action: 'COURT / DISPLAY', description: 'Mate opportunity detected. Signal fitness through display behaviors.', color: 'text-pink-400' };
  }
  
  // Resource responses
  if (resourceLevel === 'HIGH' && mechanisms.includes('resource_immediate')) {
    return { action: 'GATHER', description: 'High-value resources available. Acquire and secure.', color: 'text-green-400' };
  }
  
  // Social responses
  if (mechanisms.includes('kinship') || mechanisms.includes('coalition')) {
    return { action: 'RECIPROCATE', description: 'Strengthen alliance through reciprocal exchange.', color: 'text-cyan-400' };
  }
  
  if (mechanisms.includes('social_support')) {
    return { action: 'BOND', description: 'Invest in social connection. Build trust and alliance.', color: 'text-blue-400' };
  }
  
  // Mismatch
  if (is_mismatch) {
    return { action: 'RECOGNIZE MISMATCH', description: 'Modern environment triggering ancestral responses. Conscious override recommended.', color: 'text-purple-400' };
  }
  
  // Default
  if (action?.recommendation === 'OBSERVE') {
    return { action: 'OBSERVE', description: 'No immediate action required. Continue monitoring environment.', color: 'text-gray-400' };
  }
  
  return { action: 'APPROACH', description: 'Environment appears safe. Explore and engage.', color: 'text-green-400' };
}

export default function HUDApp() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'idle' | 'analyzing' | 'generating'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [viewerProfile, setViewerProfile] = useState<ViewerProfile>({
    sex: 'unspecified',
    age_band: 'adult',
    tribe_relation_to_scene: 'unknown',
    observer_mode: 'observing',
    relation_to_primary_target: 'unknown'
  });
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historySaving, setHistorySaving] = useState(false);

  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetch('/api/hud/history', { method: 'GET' });
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || 'Failed to load history');
      }
      if (!res.ok) throw new Error(data?.error || data?.details || 'Failed to load history');
      setHistoryEntries((data?.entries || []) as HistoryEntry[]);
    } catch (e) {
      setHistoryError(e instanceof Error ? e.message : String(e));
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const processImage = async (base64: string) => {
    setUploadedImage(base64);
    setGeneratedImage(null);
    setAnalysis(null);
    setError(null);
    setLoading(true);
    
    try {
      // Stage 1: Analyze with Claude
      setStage('analyzing');
      const analyzeRes = await fetch('/api/hud/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, viewer_profile: viewerProfile })
      });
      
      if (!analyzeRes.ok) {
        const errText = await analyzeRes.text();
        let errData: any = null;
        try {
          errData = JSON.parse(errText);
        } catch {
          // Non-JSON error payload (e.g. proxy HTML for 502)
        }
        const reqId = errData?.request_id ? ` (request_id: ${errData.request_id})` : '';
        throw new Error((errData?.error || errData?.details || errText || 'Analysis failed') + reqId);
      }
      
      const analysisData = await analyzeRes.json();
      
      if (analysisData.error) {
        throw new Error(analysisData.error);
      }
      
      setAnalysis(analysisData);

      // Stage 2: Generate HUD overlay with Gemini
      setStage('generating');
      let overlayImage: string | null = null;
      const generateRes = await fetch('/api/hud/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: base64,
          analysis: analysisData,
          viewer_profile: viewerProfile
        })
      });
      
      if (!generateRes.ok) {
        const errData = await generateRes.json();
        // Don't throw - we still have the analysis
        console.error('Generation failed:', errData);
        setError('Overlay generation failed, but analysis is complete');
      } else {
        const generateData = await generateRes.json();
        if (generateData.image) {
          overlayImage = generateData.image;
          setGeneratedImage(generateData.image);
        }
      }

      // Save to personal history (per-IP on server)
      try {
        setHistorySaving(true);
        await fetch('/api/hud/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            original_image: base64,
            overlay_image: overlayImage,
            analysis: analysisData,
            viewer_profile: viewerProfile
          })
        });
        await refreshHistory();
      } catch (e) {
        console.warn('Failed to save history:', e);
      } finally {
        setHistorySaving(false);
      }
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setStage('idle');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      processImage(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      processImage(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const evoPsychAction = analysis ? getEvoPsychAction(analysis) : null;

  const HistoryPanel = (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-amber-400">Personal HUD History</h3>
        <div className="flex items-center gap-3">
          {historySaving && <span className="text-xs text-gray-500">Saving…</span>}
          <button
            type="button"
            onClick={refreshHistory}
            className="px-3 py-1.5 text-sm rounded bg-[#0a0a0a] border border-[#222] text-gray-300 hover:border-amber-500/50"
          >
            Refresh
          </button>
        </div>
      </div>
      {historyError && (
        <div className="mb-3 text-sm text-red-400">{historyError}</div>
      )}
      {historyLoading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : historyEntries.length === 0 ? (
        <div className="text-sm text-gray-500">No history yet. Process an image to save it here.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {historyEntries.map((h) => (
            <div key={h.id} className="bg-[#0a0a0a] border border-[#222] rounded-lg overflow-hidden">
              <div className="aspect-video bg-black">
                {h.overlay_url ? (
                  <img src={h.overlay_url} alt="Overlay" className="w-full h-full object-cover" />
                ) : h.original_url ? (
                  <img src={h.original_url} alt="Original" className="w-full h-full object-cover opacity-80" />
                ) : null}
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {h.created_at ? new Date(h.created_at).toLocaleString() : '-'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {h.analysis?.scene_type ? h.analysis.scene_type.toUpperCase() : ''}
                  </div>
                </div>
                <div className="text-sm text-gray-300 line-clamp-2">
                  {h.analysis?.primary_target?.label || 'HUD Run'}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (h.original_url) setUploadedImage(h.original_url);
                      setGeneratedImage(h.overlay_url || null);
                      setAnalysis(h.analysis || null);
                      setError(null);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/hud/history?id=${encodeURIComponent(h.id)}`, { method: 'DELETE' });
                      await refreshHistory();
                    }}
                    className="px-3 py-1.5 text-sm rounded bg-[#0a0a0a] border border-red-500/30 text-red-400 hover:border-red-500/60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-3">
        History is saved per visitor (IP-hash) on the server and retrieved via signed URLs.
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Evolutionary HUD Generator
          </h1>
          <p className="text-lg text-[#8B8B8B]">
            See what your ancestral brain is computing
          </p>
        </div>

        {/* POV Settings + Drop Zone */}
        {!uploadedImage && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-[#111] border border-[#222] rounded-xl p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-sm uppercase tracking-wider text-amber-400">Viewer POV settings</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setViewerProfile({
                      sex: 'male',
                      age_band: 'young_adult',
                      tribe_relation_to_scene: 'in_group',
                      observer_mode: 'in_scene',
                      relation_to_primary_target: 'unknown'
                    })}
                    className="px-2 py-1 text-xs rounded bg-[#0a0a0a] border border-[#222] text-gray-300 hover:border-amber-500/50"
                  >
                    In-group young male
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerProfile({
                      sex: 'female',
                      age_band: 'young_adult',
                      tribe_relation_to_scene: 'in_group',
                      observer_mode: 'in_scene',
                      relation_to_primary_target: 'unknown'
                    })}
                    className="px-2 py-1 text-xs rounded bg-[#0a0a0a] border border-[#222] text-gray-300 hover:border-amber-500/50"
                  >
                    In-group young female
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerProfile({
                      sex: 'unspecified',
                      age_band: 'adult',
                      tribe_relation_to_scene: 'out_group',
                      observer_mode: 'observing',
                      relation_to_primary_target: 'unknown'
                    })}
                    className="px-2 py-1 text-xs rounded bg-[#0a0a0a] border border-[#222] text-gray-300 hover:border-amber-500/50"
                  >
                    Outsider observer
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Sex</label>
                  <select
                    value={viewerProfile.sex}
                    onChange={(e) => setViewerProfile(v => ({ ...v, sex: e.target.value as ViewerSex }))}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded px-2 py-2 text-sm"
                  >
                    <option value="unspecified">Unspecified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Age</label>
                  <select
                    value={viewerProfile.age_band}
                    onChange={(e) => setViewerProfile(v => ({ ...v, age_band: e.target.value as ViewerAgeBand }))}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded px-2 py-2 text-sm"
                  >
                    <option value="teen">Teen</option>
                    <option value="young_adult">Young adult</option>
                    <option value="adult">Adult</option>
                    <option value="elder">Elder</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Tribe</label>
                  <select
                    value={viewerProfile.tribe_relation_to_scene}
                    onChange={(e) => setViewerProfile(v => ({ ...v, tribe_relation_to_scene: e.target.value as ViewerTribeRelation }))}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded px-2 py-2 text-sm"
                  >
                    <option value="unknown">Unknown</option>
                    <option value="in_group">In-group</option>
                    <option value="out_group">Out-group</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Mode</label>
                  <select
                    value={viewerProfile.observer_mode}
                    onChange={(e) => setViewerProfile(v => ({ ...v, observer_mode: e.target.value as ViewerObserverMode }))}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded px-2 py-2 text-sm"
                  >
                    <option value="observing">Observing</option>
                    <option value="in_scene">In scene</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Relation to primary</label>
                  <select
                    value={viewerProfile.relation_to_primary_target}
                    onChange={(e) => setViewerProfile(v => ({ ...v, relation_to_primary_target: e.target.value as ViewerRelationToPrimary }))}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded px-2 py-2 text-sm"
                  >
                    <option value="unknown">Unknown</option>
                    <option value="self">Self</option>
                    <option value="kin">Kin</option>
                    <option value="ally">Ally</option>
                    <option value="stranger">Stranger</option>
                    <option value="rival">Rival</option>
                    <option value="potential_mate">Potential mate</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                These settings control how the system interprets threat/mate/kin/out-group salience and the recommended Next Action.
              </p>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              className={`
                border-2 border-dashed rounded-xl p-16 text-center cursor-pointer
                transition-all duration-200
                ${isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-[#333] hover:border-[#555]'}
              `}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-[#8B8B8B] text-xl">Drag & drop an image</p>
                <p className="text-[#555]">or click to select</p>
              </label>
            </div>

            {HistoryPanel}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-spin w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-6" />
            <p className="text-xl text-amber-400 mb-2">
              {stage === 'analyzing' ? 'Analyzing through evolutionary lens...' : 'Generating visual overlay...'}
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Results */}
        {uploadedImage && !loading && (
          <div className="space-y-8">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setGeneratedImage(null);
                  setAnalysis(null);
                  setError(null);
                }}
                className="text-[#555] hover:text-white transition-colors"
              >
                ← Upload new image
              </button>
              {generatedImage && (
                <a
                  href={generatedImage}
                  download="evolutionary-hud.png"
                  className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition-colors"
                >
                  Download Overlay
                </a>
              )}
            </div>

            {/* Unified Analysis Block */}
            {analysis && (
              <div className="bg-[#111] border border-[#222] rounded-xl p-6 md:p-8">

                {/* RECOMMENDED ACTION */}
                {evoPsychAction && (
                  <div className={`mb-8 pb-6 border-b ${analysis.is_mismatch ? 'border-red-500/30' : 'border-amber-500/30'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`text-3xl md:text-4xl font-bold ${evoPsychAction.color}`}>
                        {evoPsychAction.action}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300">{evoPsychAction.description}</p>
                        {analysis.action?.rationale && (
                          <p className="text-gray-500 text-sm mt-1">{analysis.action.rationale}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* SCENE OVERVIEW */}
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Scene Overview</h3>
                  <p className="text-gray-300 mb-2">
                    <span className="text-gray-500">Type:</span>{' '}
                    <span className={analysis.is_mismatch ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                      {analysis.scene_type?.toUpperCase()}
                    </span>
                    {' · '}
                    <span className="text-gray-500">Valence:</span>{' '}
                    <span className={(analysis.aggregate?.emotional_valence || 0) > 0 ? 'text-green-400' : 'text-red-400'}>
                      {(analysis.aggregate?.emotional_valence || 0) > 0 ? 'Positive' : 'Negative'} ({analysis.aggregate?.emotional_valence?.toFixed(2)})
                    </span>
                    {' · '}
                    <span className="text-gray-500">Arousal:</span>{' '}
                    <span className="text-white">{((analysis.aggregate?.arousal_level || 0) * 100).toFixed(0)}%</span>
                  </p>
                  <p className="text-gray-400">{analysis.pov_context}</p>
                </div>

                {/* NEUROCHEMICAL STATE */}
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Neurochemical State</h3>
                  <p className="text-gray-300">
                    {Object.entries(analysis.biometrics || {}).map(([key, val], i, arr) => (
                      <span key={key}>
                        <span className="text-gray-500 capitalize">{key}:</span>{' '}
                        <span className={
                          val.level === 'MAX' || val.level === 'HIGH' ? 'text-green-400' :
                          val.level === 'LOW' || val.level === 'ZERO' ? 'text-red-400' : 'text-yellow-400'
                        }>{val.level}</span>
                        {i < arr.length - 1 && ' · '}
                      </span>
                    ))}
                  </p>
                </div>

                {/* ENVIRONMENTAL ASSESSMENT */}
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Environmental Assessment</h3>
                  <div className="text-gray-300 space-y-1">
                    {Object.entries(analysis.status_panel || {}).map(([key, val]) => (
                      <p key={key}>
                        <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                        <span className={
                          val.level === 'HIGH' || val.level === 'CRITICAL' || val.level === 'COHESIVE' || val.level === 'SECURE' ? 'text-green-400 font-medium' :
                          val.level === 'ZERO' || val.level === 'NONE' || val.level === 'ISOLATED' ? 'text-gray-500' :
                          val.level === 'LOW' || val.level === 'FRAGMENTED' ? 'text-yellow-400' : 'text-orange-400'
                        }>{val.level}</span>
                        {val.detail && <span className="text-gray-500"> — {val.detail}</span>}
                      </p>
                    ))}
                  </div>
                </div>

                {/* PRIMARY FOCUS */}
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Primary Focus</h3>
                  <p className="text-white font-semibold text-lg mb-1">{analysis.primary_target?.label}</p>
                  <p className="text-gray-400 mb-2">{analysis.primary_target?.what}</p>
                  <p className="text-gray-300 mb-2">{analysis.primary_target?.analysis}</p>
                  <p className="text-gray-500 text-sm">
                    Mechanisms: {(analysis.primary_target?.mechanisms || []).map(m => m.replace(/_/g, ' ')).join(', ')} · Importance: {analysis.primary_target?.importance_score}/100
                  </p>
                </div>

                {/* DETECTED ELEMENTS */}
                {analysis.detected_items?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Detected Elements</h3>
                    <div className="text-gray-300 space-y-1">
                      {analysis.detected_items.map((item, i) => (
                        <p key={i}>
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            item.color === 'green' ? 'bg-green-500' :
                            item.color === 'red' ? 'bg-red-500' :
                            item.color === 'yellow' ? 'bg-yellow-500' : 'bg-cyan-500'
                          }`} />
                          <span className="text-white">{item.class}</span>
                          <span className="text-gray-500"> ({item.position} {item.vertical}) — {item.importance_score}% — {item.mechanisms?.slice(0, 2).join(', ')}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* SOCIAL ENTITIES */}
                {analysis.people?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Social Entities</h3>
                    <div className="text-gray-300 space-y-2">
                      {analysis.people.map((person, i) => (
                        <p key={i}>
                          <span className="text-white font-medium">{person.description}</span>
                          <span className="text-gray-500"> — {person.label} — </span>
                          <span className={
                            person.bond_status === 'KIN' || person.bond_status === 'ALLY' ? 'text-green-400' :
                            person.bond_status === 'THREAT' ? 'text-red-400' :
                            person.bond_status === 'POTENTIAL_MATE' ? 'text-pink-400' : 'text-yellow-400'
                          }>{person.bond_status}</span>
                          <span className="text-gray-500"> ({person.importance_score}% important)</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* SOCIAL CONNECTIONS */}
                {analysis.connections?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Social Connections</h3>
                    <p className="text-gray-300">
                      {analysis.connections.map((conn, i, arr) => (
                        <span key={i}>
                          {conn.from}{' '}
                          <span className={
                            conn.color === 'green' ? 'text-green-400' :
                            conn.color === 'red' ? 'text-red-400' : 'text-yellow-400'
                          }>→ {conn.type} →</span>{' '}
                          {conn.to}
                          {i < arr.length - 1 && ' · '}
                        </span>
                      ))}
                    </p>
                  </div>
                )}

                {/* SURVIVAL & REPRODUCTION */}
                {(analysis.aggregate?.top_survival_items?.length > 0 || analysis.aggregate?.top_reproduction_items?.length > 0) && (
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Fitness Relevance</h3>
                    {analysis.aggregate?.top_survival_items?.length > 0 && (
                      <p className="text-gray-300 mb-1">
                        <span className="text-red-400 font-medium">Survival:</span>{' '}
                        {analysis.aggregate.top_survival_items.join(' · ')}
                      </p>
                    )}
                    {analysis.aggregate?.top_reproduction_items?.length > 0 && (
                      <p className="text-gray-300">
                        <span className="text-pink-400 font-medium">Reproduction:</span>{' '}
                        {analysis.aggregate.top_reproduction_items.join(' · ')}
                      </p>
                    )}
                  </div>
                )}

                {/* MISMATCH WARNING */}
                {analysis.is_mismatch && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 font-semibold mb-1">⚠ Environmental Mismatch Detected</p>
                    <p className="text-red-300">{analysis.mismatch_details}</p>
                    <p className="text-red-400/70 text-sm mt-2">
                      This modern environment is triggering ancestral responses that may not serve your fitness in the current context.
                    </p>
                  </div>
                )}

                {/* EVOLUTIONARY SUMMARY */}
                <div className="pt-4 border-t border-[#222]">
                  <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-3">Evolutionary Summary</h3>
                  <p className="text-gray-300 leading-relaxed">{analysis.aggregate?.global_summary}</p>
                </div>

              </div>
            )}

            {/* IMAGE BATCH - All images together at bottom */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h3 className="text-sm uppercase tracking-wider text-amber-400 mb-4">Images</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Original</p>
                  <img src={uploadedImage} alt="Original" className="w-full rounded-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Fitness Overlay</p>
                  {generatedImage ? (
                    <img src={generatedImage} alt="Overlay" className="w-full rounded-lg" />
                  ) : (
                    <div className="bg-[#0a0a0a] rounded-lg aspect-video flex items-center justify-center text-[#333]">
                      {analysis ? 'Overlay generation in progress...' : 'Processing...'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History */}
            {HistoryPanel}

            {/* Back link */}
            <div className="text-center pt-8">
              <a href="/projects" className="text-[#555] hover:text-[#888] transition-colors">
                ← Back to Projects
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
