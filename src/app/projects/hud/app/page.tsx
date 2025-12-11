'use client';

import { useState, useCallback } from 'react';

interface AnalysisData {
  scene_type: string;
  overall_color_scheme: 'red' | 'green' | 'mixed';
  pov_context: string;
  biometrics: Record<string, { level: string; score: number }>;
  status_panel: Record<string, { level: string; detail: string }>;
  primary_target: {
    what: string;
    label: string;
    analysis: string;
    importance_score: number;
    mechanisms: string[];
  };
  detected_items: Array<{
    id: string;
    class: string;
    position: string;
    label: string;
    color: string;
  }>;
  people: Array<{
    id: string;
    description: string;
    position: string;
    bond_status: string;
    label: string;
  }>;
  action: {
    recommendation: string;
    urgency: string;
    rationale: string;
  };
  is_mismatch: boolean;
  mismatch_details: string;
  aggregate: {
    global_summary: string;
    emotional_valence: number;
  };
  error?: string;
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
        const errData = await analyzeRes.json();
        throw new Error(errData.error || errData.details || 'Analysis failed');
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
        throw new Error(errData.error || errData.hint || 'Generation failed');
      }
      
      const generateData = await generateRes.json();
      
      if (generateData.error) {
        throw new Error(generateData.error);
      }
      
      if (generateData.image) {
        setGeneratedImage(generateData.image);
      } else {
        throw new Error('No image returned from generator');
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const downloadHUD = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = 'evolutionary-hud.png';
    link.href = generatedImage;
    link.click();
  };

  const retry = () => {
    if (uploadedImage) {
      processImage(uploadedImage);
    }
  };

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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-xl p-16 text-center cursor-pointer
              transition-all duration-200 max-w-2xl mx-auto
              ${isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-[#333] hover:border-[#555]'}
              ${loading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
              disabled={loading}
            />
            <label htmlFor="file-input" className="cursor-pointer block">
              <div className="space-y-3">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-[#8B8B8B] text-xl">Drag & drop an image</p>
                <p className="text-[#555]">or click to select</p>
              </div>
            </label>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-spin w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-6" />
            <p className="text-xl text-amber-400 mb-2">
              {stage === 'analyzing' ? 'Analyzing through evolutionary lens...' : 'Generating HUD overlay...'}
            </p>
            <p className="text-[#555]">
              {stage === 'analyzing' ? 'Claude is examining the scene' : 'Gemini is creating the visualization'}
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 max-w-2xl mx-auto">
            <strong>Error:</strong> {error}
            <div className="mt-3">
              <button
                onClick={retry}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {uploadedImage && !loading && (
          <div className="space-y-6">
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
              
              <div className="flex gap-3">
                {error && (
                  <button
                    onClick={retry}
                    className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/30 transition-colors"
                  >
                    Retry
                  </button>
                )}
                {generatedImage && (
                  <button
                    onClick={downloadHUD}
                    className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition-colors"
                  >
                    Download HUD
                  </button>
                )}
              </div>
            </div>

            {/* Image Display */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div>
                <h3 className="text-sm text-[#555] mb-2 uppercase tracking-wider">Original</h3>
                <div className="bg-black rounded-xl overflow-hidden">
                  <img src={uploadedImage} alt="Original" className="w-full" />
                </div>
              </div>

              {/* Generated */}
              <div>
                <h3 className="text-sm text-amber-400 mb-2 uppercase tracking-wider">
                  {generatedImage ? 'HUD Overlay' : 'Processing...'}
                </h3>
                <div className="bg-black rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center">
                  {generatedImage ? (
                    <img src={generatedImage} alt="With HUD" className="w-full" />
                  ) : error ? (
                    <div className="text-center p-8 text-[#555]">
                      <p>Generation failed</p>
                      <button
                        onClick={retry}
                        className="mt-4 px-4 py-2 bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/30 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="text-[#333]">Waiting for analysis...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis Summary */}
            {analysis && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Left: Key Metrics */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-amber-400">Scene Analysis</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Scene Type:</span>
                      <span className={analysis.is_mismatch ? 'text-red-400' : 'text-green-400'}>
                        {analysis.scene_type?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Primary Target:</span>
                      <span className="text-white">{analysis.primary_target?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Action:</span>
                      <span className={
                        analysis.action?.urgency === 'CRITICAL' ? 'text-red-400' :
                        analysis.action?.urgency === 'HIGH' ? 'text-orange-400' : 'text-green-400'
                      }>
                        {analysis.action?.recommendation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Emotional Valence:</span>
                      <span className={analysis.aggregate?.emotional_valence > 0 ? 'text-green-400' : 'text-red-400'}>
                        {analysis.aggregate?.emotional_valence?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Summary */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-amber-400">Evolutionary Summary</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {analysis.aggregate?.global_summary}
                  </p>
                  {analysis.is_mismatch && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-xs font-semibold mb-1">⚠ MISMATCH DETECTED</p>
                      <p className="text-red-300 text-sm">{analysis.mismatch_details}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Raw Analysis (collapsible) */}
            {analysis && (
              <details className="bg-[#111] border border-[#222] rounded-xl">
                <summary className="cursor-pointer p-4 text-[#555] hover:text-[#888] transition-colors">
                  View raw analysis data
                </summary>
                <pre className="p-4 overflow-auto text-xs text-[#666] border-t border-[#222]">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 text-center">
          <a href="/projects" className="text-[#555] hover:text-[#888] transition-colors">
            ← Back to Projects
          </a>
        </div>
      </div>
    </main>
  );
}
