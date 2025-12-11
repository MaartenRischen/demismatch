'use client';

import { useState, useCallback } from 'react';

interface AnalysisData {
  scene_type?: string;
  overall_color_scheme?: string;
  pov_context?: string;
  biometrics?: Record<string, { level: string; reason: string }>;
  right_panel?: Record<string, string>;
  primary_target?: { what?: string; label?: string; analysis?: string };
  cost_benefit?: { show?: boolean; payoff?: string; cost?: string };
  action?: { recommendation?: string; urgency?: string };
  people_or_animals?: Array<{ description: string; bond_status: string; label: string }>;
  resources_to_label?: Array<{ what: string; label: string }>;
  terrain_features?: Array<{ what: string; significance: string }>;
  is_mismatch?: boolean;
  mismatch_details?: string;
  connection_lines?: Array<{ from: string; to: string; type: string; color: string }>;
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
      // Stage 1: Analyze with Gemini
      setStage('analyzing');
      const analyzeRes = await fetch('/api/hud/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      
      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json();
        throw new Error(errData.error || 'Analysis failed');
      }
      
      const analysisData = await analyzeRes.json();
      setAnalysis(analysisData);

      // Stage 2: Generate HUD image
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
        throw new Error(errData.error || 'Generation failed');
      }
      
      const generateData = await generateRes.json();
      if (generateData.image) {
        setGeneratedImage(generateData.image);
      } else {
        throw new Error('No image in response');
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

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Evolutionary HUD Generator
          </h1>
          <p className="text-xl text-[#8B8B8B]">
            Upload any image. See what you&apos;re actually looking at.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
            transition-all duration-200
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
            {loading ? (
              <div className="space-y-3">
                <div className="animate-spin w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-[#8B8B8B]">
                  {stage === 'analyzing' ? 'Analyzing through evopsych lens...' : 'Generating HUD overlay...'}
                </p>
              </div>
            ) : isDragActive ? (
              <p className="text-amber-500 text-lg">Drop image here...</p>
            ) : (
              <div className="space-y-2">
                <div className="text-5xl mb-4">🎯</div>
                <p className="text-[#8B8B8B] text-lg">Drag & drop an image here</p>
                <p className="text-[#555]">or click to select</p>
              </div>
            )}
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results */}
        {(uploadedImage || generatedImage) && (
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Original */}
            {uploadedImage && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#8B8B8B]">Original</h2>
                <img src={uploadedImage} alt="Original" className="w-full rounded-lg shadow-lg" />
              </div>
            )}
            
            {/* Generated */}
            {generatedImage && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-amber-400">HUD Analysis</h2>
                <img src={generatedImage} alt="With HUD" className="w-full rounded-lg shadow-lg" />
                <a 
                  href={generatedImage} 
                  download="hud-analysis.png"
                  className="mt-4 inline-block px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition-colors"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        )}

        {/* Analysis Data (collapsible) */}
        {analysis && !analysis.error && (
          <details className="mt-8">
            <summary className="cursor-pointer text-[#555] hover:text-[#888] transition-colors">
              View raw analysis data
            </summary>
            <pre className="mt-4 p-4 bg-[#111] border border-[#222] rounded-lg overflow-auto text-sm text-[#888]">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </details>
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

