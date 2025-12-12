'use client';

import { useState, useCallback } from 'react';

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
        body: JSON.stringify({ image: base64 })
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
      const generateRes = await fetch('/api/hud/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: base64,
          analysis: analysisData 
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
          setGeneratedImage(generateData.image);
        }
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

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Evolutionary HUD Generator
          </h1>
          <p className="text-lg text-[#8B8B8B]">
            See what your ancestral brain is computing
          </p>
        </div>

        {/* Drop Zone */}
        {!uploadedImage && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            className={`
              border-2 border-dashed rounded-xl p-16 text-center cursor-pointer
              transition-all duration-200 max-w-2xl mx-auto
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

            {/* Image Display */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-[#555] mb-2 uppercase tracking-wider">Original</h3>
                <img src={uploadedImage} alt="Original" className="w-full rounded-xl" />
              </div>
              <div>
                <h3 className="text-sm text-amber-400 mb-2 uppercase tracking-wider">Fitness Overlay</h3>
                {generatedImage ? (
                  <img src={generatedImage} alt="Overlay" className="w-full rounded-xl" />
                ) : (
                  <div className="bg-[#111] rounded-xl aspect-video flex items-center justify-center text-[#333]">
                    {analysis ? 'Overlay generation in progress...' : 'Processing...'}
                  </div>
                )}
              </div>
            </div>

            {/* Comprehensive Analysis */}
            {analysis && (
              <div className="space-y-6">
                
                {/* NEXT ACTION - Prominent */}
                {evoPsychAction && (
                  <div className={`bg-[#111] border-2 ${analysis.is_mismatch ? 'border-red-500/50' : 'border-amber-500/50'} rounded-xl p-6`}>
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl font-bold ${evoPsychAction.color}`}>
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

                {/* Scene Overview */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-amber-400">Scene Overview</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-500 text-sm">Scene Type</p>
                      <p className={`text-xl font-semibold ${analysis.is_mismatch ? 'text-red-400' : 'text-green-400'}`}>
                        {analysis.scene_type?.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Emotional Valence</p>
                      <p className={`text-xl font-semibold ${(analysis.aggregate?.emotional_valence || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(analysis.aggregate?.emotional_valence || 0) > 0 ? 'Positive' : 'Negative'} ({analysis.aggregate?.emotional_valence?.toFixed(2)})
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Arousal Level</p>
                      <p className="text-xl font-semibold text-white">
                        {((analysis.aggregate?.arousal_level || 0) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Context</p>
                    <p className="text-gray-300">{analysis.pov_context}</p>
                  </div>
                </div>

                {/* Biometrics */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-amber-400">Neurochemical State</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(analysis.biometrics || {}).map(([key, val]) => (
                      <div key={key} className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm capitalize">{key}</span>
                          <span className={`text-sm font-semibold ${
                            val.level === 'MAX' || val.level === 'HIGH' ? 'text-green-400' :
                            val.level === 'LOW' || val.level === 'ZERO' ? 'text-red-400' : 'text-yellow-400'
                          }`}>{val.level}</span>
                        </div>
                        <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              val.level === 'MAX' ? 'bg-green-500 w-full' :
                              val.level === 'HIGH' ? 'bg-green-400 w-3/4' :
                              val.level === 'MODERATE' || val.level === 'STABLE' ? 'bg-yellow-400 w-1/2' :
                              val.level === 'LOW' ? 'bg-orange-400 w-1/4' : 'bg-red-400 w-[10%]'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Panel */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-amber-400">Environmental Assessment</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(analysis.status_panel || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-start p-3 bg-[#0a0a0a] rounded-lg">
                        <div>
                          <p className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</p>
                          <p className="text-gray-500 text-xs mt-1">{val.detail}</p>
                        </div>
                        <span className={`font-semibold ${
                          val.level === 'HIGH' || val.level === 'CRITICAL' || val.level === 'COHESIVE' || val.level === 'SECURE' ? 'text-green-400' :
                          val.level === 'ZERO' || val.level === 'NONE' || val.level === 'ISOLATED' ? 'text-gray-500' :
                          val.level === 'LOW' || val.level === 'FRAGMENTED' ? 'text-yellow-400' : 'text-orange-400'
                        }`}>{val.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Target */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-amber-400">Primary Focus</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
                      🎯
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-white">{analysis.primary_target?.label}</p>
                      <p className="text-gray-400 mt-1">{analysis.primary_target?.what}</p>
                      <p className="text-gray-300 mt-2">{analysis.primary_target?.analysis}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(analysis.primary_target?.mechanisms || []).map((m, i) => (
                          <span key={i} className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">
                            {m.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                        Importance: {analysis.primary_target?.importance_score}/100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detected Items */}
                {analysis.detected_items?.length > 0 && (
                  <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-amber-400">Detected Elements</h3>
                    <div className="space-y-3">
                      {analysis.detected_items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${
                            item.color === 'green' ? 'bg-green-500' :
                            item.color === 'red' ? 'bg-red-500' :
                            item.color === 'yellow' ? 'bg-yellow-500' : 'bg-cyan-500'
                          }`} />
                          <div className="flex-1">
                            <span className="text-white">{item.class}</span>
                            <span className="text-gray-500 text-sm ml-2">({item.position} {item.vertical})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-400 text-sm">{item.importance_score}%</span>
                            <div className="flex gap-1 mt-1">
                              {item.mechanisms?.slice(0, 2).map((m, j) => (
                                <span key={j} className="px-1.5 py-0.5 bg-[#222] text-gray-500 text-xs rounded">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* People */}
                {analysis.people?.length > 0 && (
                  <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-amber-400">Social Entities</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {analysis.people.map((person, i) => (
                        <div key={i} className="p-4 bg-[#0a0a0a] rounded-lg border-l-4" style={{
                          borderColor: person.bond_status === 'KIN' || person.bond_status === 'ALLY' ? '#22c55e' :
                                       person.bond_status === 'THREAT' ? '#ef4444' :
                                       person.bond_status === 'POTENTIAL_MATE' ? '#ec4899' : '#eab308'
                        }}>
                          <p className="text-white font-medium">{person.description}</p>
                          <p className="text-gray-400 text-sm mt-1">{person.label}</p>
                          <div className="flex justify-between mt-2">
                            <span className={`text-sm ${
                              person.bond_status === 'KIN' || person.bond_status === 'ALLY' ? 'text-green-400' :
                              person.bond_status === 'THREAT' ? 'text-red-400' :
                              person.bond_status === 'POTENTIAL_MATE' ? 'text-pink-400' : 'text-yellow-400'
                            }`}>{person.bond_status}</span>
                            <span className="text-gray-500 text-sm">{person.importance_score}% important</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connections */}
                {analysis.connections?.length > 0 && (
                  <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-amber-400">Social Connections</h3>
                    <div className="space-y-2">
                      {analysis.connections.map((conn, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-[#0a0a0a] rounded">
                          <span className="text-gray-300">{conn.from}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            conn.color === 'green' ? 'bg-green-500/20 text-green-400' :
                            conn.color === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>{conn.type}</span>
                          <span className="text-gray-300">{conn.to}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Survival/Reproduction Items */}
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.aggregate?.top_survival_items?.length > 0 && (
                    <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-3 text-red-400">Survival Relevance</h3>
                      <ul className="space-y-2">
                        {analysis.aggregate.top_survival_items.map((item, i) => (
                          <li key={i} className="text-gray-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.aggregate?.top_reproduction_items?.length > 0 && (
                    <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-3 text-pink-400">Reproduction Relevance</h3>
                      <ul className="space-y-2">
                        {analysis.aggregate.top_reproduction_items.map((item, i) => (
                          <li key={i} className="text-gray-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Mismatch Warning */}
                {analysis.is_mismatch && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-2 text-red-400">⚠ Environmental Mismatch Detected</h3>
                    <p className="text-red-300">{analysis.mismatch_details}</p>
                    <p className="text-red-400/70 text-sm mt-2">
                      This modern environment is triggering ancestral responses that may not serve your fitness in the current context.
                    </p>
                  </div>
                )}

                {/* Global Summary */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3 text-amber-400">Evolutionary Summary</h3>
                  <p className="text-gray-300 leading-relaxed">{analysis.aggregate?.global_summary}</p>
                </div>

              </div>
            )}

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
