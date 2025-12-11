'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

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
  position: 'left' | 'center' | 'right';
  vertical: 'top' | 'middle' | 'bottom';
  size: 'small' | 'medium' | 'large';
  mechanisms: string[];
  importance_score: number;
  label: string;
  color: 'green' | 'red' | 'yellow' | 'cyan';
}

interface Person {
  id: string;
  description: string;
  position: 'left' | 'center' | 'right';
  bond_status: string;
  label: string;
  importance_score: number;
}

interface Connection {
  from: string;
  to: string;
  type: string;
  color: 'green' | 'red' | 'yellow';
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
  error?: string;
}

export default function HUDApp() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = async (base64: string) => {
    setUploadedImage(base64);
    setAnalysis(null);
    setError(null);
    setLoading(true);
    
    try {
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
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Canvas-based HUD rendering
  useEffect(() => {
    if (!uploadedImage || !analysis || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      const isRed = analysis.overall_color_scheme === 'red' || analysis.is_mismatch;
      const primaryColor = isRed ? '#ff4444' : '#44ff88';
      const accentColor = isRed ? '#ff6666' : '#66ffaa';
      
      // Apply mismatch tint
      if (analysis.is_mismatch) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawRadarSweep(ctx, canvas.width, canvas.height);
      }
      
      // Draw HUD elements
      drawBiometricsPanel(ctx, analysis.biometrics, isRed);
      drawStatusPanel(ctx, canvas.width, analysis.status_panel, isRed);
      drawTargetReticle(ctx, canvas.width, canvas.height, analysis.primary_target, isRed);
      drawDetectedItems(ctx, canvas.width, canvas.height, analysis.detected_items);
      drawPeopleLabels(ctx, canvas.width, canvas.height, analysis.people);
      drawAction(ctx, canvas.width, canvas.height, analysis.action, isRed);
      
      if (analysis.is_mismatch && analysis.mismatch_details) {
        drawMismatchWarning(ctx, canvas.width, canvas.height, analysis.mismatch_details);
      }
      
      // Draw summary bar
      drawSummaryBar(ctx, canvas.width, canvas.height, analysis.aggregate, primaryColor);
    };
    img.src = uploadedImage;
  }, [uploadedImage, analysis]);

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
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'evolutionary-hud.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
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
              {loading ? (
                <div className="space-y-3">
                  <div className="animate-spin w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-[#8B8B8B] text-lg">Analyzing through evolutionary lens...</p>
                  <p className="text-[#555] text-sm">This takes ~10-20 seconds</p>
                </div>
              ) : isDragActive ? (
                <p className="text-amber-500 text-xl">Drop image here...</p>
              ) : (
                <div className="space-y-3">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-[#8B8B8B] text-xl">Drag & drop an image</p>
                  <p className="text-[#555]">or click to select</p>
                </div>
              )}
            </label>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 max-w-2xl mx-auto">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results */}
        {uploadedImage && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setAnalysis(null);
                  setError(null);
                }}
                className="text-[#555] hover:text-white transition-colors"
              >
                ← Upload new image
              </button>
              
              {analysis && (
                <button
                  onClick={downloadHUD}
                  className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition-colors"
                >
                  Download HUD
                </button>
              )}
            </div>

            {/* Canvas Display */}
            <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
              {loading && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-amber-400">Analyzing...</p>
                  </div>
                </div>
              )}
              
              {!analysis && !loading && uploadedImage && (
                <img src={uploadedImage} alt="Uploaded" className="w-full" />
              )}
              
              <canvas 
                ref={canvasRef} 
                className={`w-full ${analysis ? 'block' : 'hidden'}`}
              />
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
                        {analysis.scene_type.toUpperCase()}
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

// ============ Canvas Drawing Functions ============

function drawPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, isRed: boolean = false) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = isRed ? 'rgba(255, 100, 100, 0.6)' : 'rgba(100, 200, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

function drawBiometricsPanel(ctx: CanvasRenderingContext2D, biometrics: Record<string, BiometricData>, isRed: boolean) {
  const padding = 15;
  const panelWidth = 200;
  const lineHeight = 24;
  const entries = Object.entries(biometrics || {});
  const panelHeight = entries.length * lineHeight + 30;
  
  drawPanel(ctx, padding, padding, panelWidth, panelHeight, isRed);
  
  ctx.fillStyle = isRed ? '#ff6666' : '#66ffaa';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText('BIOMETRICS', padding + 10, padding + 18);
  
  let y = padding + 38;
  entries.forEach(([key, val]) => {
    const score = val.score || getLevelScore(val.level);
    
    ctx.fillStyle = '#888888';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText(key.charAt(0).toUpperCase() + key.slice(1), padding + 10, y);
    
    // Bar background
    const barX = padding + 10;
    const barY = y + 4;
    const barWidth = panelWidth - 25;
    const barHeight = 5;
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Bar fill
    const fillColor = getScoreColor(score, isRed, key);
    ctx.fillStyle = fillColor;
    ctx.fillRect(barX, barY, barWidth * (score / 100), barHeight);
    
    y += lineHeight;
  });
}

function drawStatusPanel(ctx: CanvasRenderingContext2D, canvasWidth: number, panel: Record<string, StatusItem>, isRed: boolean) {
  const padding = 15;
  const panelWidth = 220;
  const panelHeight = 160;
  const x = canvasWidth - panelWidth - padding;
  
  drawPanel(ctx, x, padding, panelWidth, panelHeight, isRed);
  
  ctx.fillStyle = isRed ? '#ff6666' : '#66ffaa';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText('STATUS', x + 10, padding + 18);
  
  const items = [
    { key: 'threat_level', label: 'Threat' },
    { key: 'resource_value', label: 'Resources' },
    { key: 'tribe_status', label: 'Tribe' },
    { key: 'mate_opportunity', label: 'Mate Opp.' },
    { key: 'social_bond', label: 'Bonds' }
  ];
  
  let y = padding + 38;
  items.forEach(item => {
    const data = panel?.[item.key];
    if (!data) return;
    
    ctx.fillStyle = '#666666';
    ctx.font = '9px system-ui, sans-serif';
    ctx.fillText(item.label + ':', x + 10, y);
    
    const isThreat = item.key === 'threat_level' && data.level !== 'ZERO' && data.level !== 'LOW';
    ctx.fillStyle = isThreat ? '#ff4444' : (isRed ? '#ffaaaa' : '#aaffcc');
    ctx.font = 'bold 10px system-ui, sans-serif';
    ctx.fillText(data.level, x + 10, y + 12);
    
    y += 28;
  });
}

function drawTargetReticle(ctx: CanvasRenderingContext2D, w: number, h: number, target: { what: string; label: string; analysis: string; importance_score: number } | undefined, isRed: boolean) {
  if (!target) return;
  
  const centerX = w / 2;
  const centerY = h / 2;
  const color = isRed ? '#ff6644' : '#ffcc44';
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // Outer circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
  ctx.stroke();
  
  // Inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
  ctx.stroke();
  
  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(centerX - 80, centerY);
  ctx.lineTo(centerX - 45, centerY);
  ctx.moveTo(centerX + 45, centerY);
  ctx.lineTo(centerX + 80, centerY);
  ctx.moveTo(centerX, centerY - 80);
  ctx.lineTo(centerX, centerY - 45);
  ctx.moveTo(centerX, centerY + 45);
  ctx.lineTo(centerX, centerY + 80);
  ctx.stroke();
  
  // Label
  const labelY = centerY - 100;
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(centerX - 120, labelY - 20, 240, 50);
  
  ctx.fillStyle = color;
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(target.label, centerX, labelY);
  
  ctx.fillStyle = '#cccccc';
  ctx.font = '10px system-ui, sans-serif';
  ctx.fillText(target.analysis, centerX, labelY + 16);
  
  ctx.fillStyle = '#888888';
  ctx.font = '9px system-ui, sans-serif';
  ctx.fillText(`Importance: ${target.importance_score}/100`, centerX, labelY + 30);
  
  ctx.textAlign = 'left';
}

function drawDetectedItems(ctx: CanvasRenderingContext2D, w: number, h: number, items: DetectedItem[]) {
  if (!items) return;
  
  items.forEach(item => {
    const x = item.position === 'left' ? w * 0.2 : item.position === 'right' ? w * 0.8 : w * 0.5;
    const y = item.vertical === 'top' ? h * 0.25 : item.vertical === 'bottom' ? h * 0.75 : h * 0.5;
    
    const color = item.color === 'red' ? '#ff4444' : 
                  item.color === 'yellow' ? '#ffaa44' : 
                  item.color === 'cyan' ? '#44aaff' : '#44ff88';
    
    // Small marker
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(x - 50, y + 12, 100, 18);
    ctx.fillStyle = color;
    ctx.font = '9px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label.substring(0, 20), x, y + 24);
    ctx.textAlign = 'left';
  });
}

function drawPeopleLabels(ctx: CanvasRenderingContext2D, w: number, h: number, people: Person[]) {
  if (!people) return;
  
  people.forEach((person, i) => {
    const x = person.position === 'left' ? w * 0.25 : person.position === 'right' ? w * 0.75 : w * 0.5;
    const y = h * 0.4 + (i * 30);
    
    const isPositive = person.bond_status === 'KIN' || person.bond_status === 'ALLY';
    const color = isPositive ? '#44ff88' : person.bond_status === 'THREAT' ? '#ff4444' : '#ffaa44';
    
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(x - 60, y - 10, 120, 20);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 60, y - 10, 120, 20);
    
    ctx.fillStyle = color;
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(person.label.substring(0, 25), x, y + 4);
    ctx.textAlign = 'left';
  });
}

function drawAction(ctx: CanvasRenderingContext2D, w: number, h: number, action: { recommendation: string; urgency: string } | undefined, isRed: boolean) {
  if (!action || action.recommendation === 'NONE') return;
  
  const isUrgent = action.urgency === 'CRITICAL' || action.urgency === 'HIGH';
  
  if (isUrgent) {
    const y = h - 70;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(w/2 - 120, y - 5, 240, 35);
    
    ctx.fillStyle = isRed ? '#ff4444' : '#44ff88';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACTION: ' + action.recommendation, w/2, y + 20);
    ctx.textAlign = 'left';
  }
}

function drawRadarSweep(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const centerX = w / 2;
  const centerY = h / 3;
  const radius = Math.min(w, h) * 0.35;
  
  // Concentric circles
  ctx.strokeStyle = 'rgba(255, 100, 100, 0.15)';
  ctx.lineWidth = 1;
  for (let r = radius * 0.25; r <= radius; r += radius * 0.25) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawMismatchWarning(ctx: CanvasRenderingContext2D, w: number, h: number, details: string) {
  const y = h - 35;
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(10, y - 12, w - 20, 40);
  
  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText('⚠ ENVIRONMENTAL MISMATCH', 20, y);
  
  ctx.fillStyle = '#ffaaaa';
  ctx.font = '10px system-ui, sans-serif';
  ctx.fillText(details.substring(0, 100) + (details.length > 100 ? '...' : ''), 20, y + 15);
}

function drawSummaryBar(ctx: CanvasRenderingContext2D, w: number, h: number, aggregate: { emotional_valence: number; arousal_level: number } | undefined, color: string) {
  if (!aggregate) return;
  
  const barY = h - 8;
  const valence = (aggregate.emotional_valence + 1) / 2; // -1 to 1 → 0 to 1
  
  // Valence bar
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, barY, w, 8);
  
  const barColor = aggregate.emotional_valence > 0 ? '#44ff88' : '#ff4444';
  ctx.fillStyle = barColor;
  ctx.fillRect(w/2, barY, (valence - 0.5) * w, 8);
}

function getLevelScore(level: string): number {
  const levels: Record<string, number> = {
    'ZERO': 0, 'LOW': 25, 'MODERATE': 50, 'STABLE': 50,
    'HIGH': 75, 'MAX': 100, 'OPTIMAL': 85, 'SECURE': 80
  };
  return levels[level] || 50;
}

function getScoreColor(score: number, isRed: boolean, key: string): string {
  const stressors = ['cortisol', 'adrenaline'];
  const isStressor = stressors.includes(key.toLowerCase());
  
  if (isStressor) {
    return score > 50 ? '#ff4444' : '#44ff88';
  }
  
  if (isRed) {
    return score < 40 ? '#ff4444' : '#ff8844';
  }
  
  return score > 50 ? '#44ff88' : '#ffaa44';
}
