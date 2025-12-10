'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Navigation from '@/components/Navigation';

export default function HUDApp() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'idle' | 'analyzing' | 'generating'>('idle');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      setGeneratedImage(null);
      setAnalysis(null);
      setError(null);
      
      // Start processing
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
        setGeneratedImage(generateData.image);
        
      } catch (err) {
        console.error('Error processing image:', err);
        setError(err instanceof Error ? err.message : 'Processing failed');
      } finally {
        setLoading(false);
        setStage('idle');
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false
  });

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Evolutionary HUD Generator
          </h1>
          <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            Upload any image. See what your ancient brain is actually computing—
            the survival dashboard you never knew you had.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-300 bg-white
            ${isDragActive 
              ? 'border-[#C75B39] bg-[#C75B39]/5 scale-[1.02]' 
              : 'border-[#E5E0D8] hover:border-[#C75B39]/50 hover:bg-[#FAF9F6]'}
            ${loading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input {...getInputProps()} />
          {loading ? (
            <div className="space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-[#C75B39]/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-[#C75B39] rounded-full animate-spin" />
              </div>
              <p className="text-[#4A4A4A] text-lg font-medium">
                {stage === 'analyzing' 
                  ? 'Analyzing through evopsych lens...' 
                  : 'Generating HUD overlay...'}
              </p>
              <p className="text-[#8B8B8B] text-sm">
                {stage === 'analyzing'
                  ? 'Identifying threats, resources, bonds, and mismatches'
                  : 'Rendering biometrics, targets, and survival data'}
              </p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-[#C75B39]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#C75B39]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-[#C75B39] text-lg font-medium">Drop image here...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-[#F5F3EF] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#8B8B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[#4A4A4A] text-lg font-medium">Drag & drop an image here</p>
                <p className="text-[#8B8B8B] mt-1">or click to select</p>
              </div>
              <p className="text-xs text-[#8B8B8B]">
                PNG, JPG, JPEG, or WebP
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {(uploadedImage || generatedImage) && (
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Original */}
            {uploadedImage && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#1A1A1A]">Original Image</h2>
                <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                  <img src={uploadedImage} alt="Original" className="w-full" />
                </div>
              </div>
            )}
            
            {/* Generated */}
            {generatedImage && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#1A1A1A]">HUD Analysis</h2>
                <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                  <img src={generatedImage} alt="With HUD" className="w-full" />
                </div>
                <a 
                  href={generatedImage} 
                  download="evolutionary-hud.png"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#C75B39] text-white rounded-lg hover:bg-[#A84A2D] transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download HUD Image
                </a>
              </div>
            )}
          </div>
        )}

        {/* Analysis Data (collapsible) */}
        {analysis && (
          <details className="mt-8 bg-white rounded-xl border border-[#E5E0D8] overflow-hidden">
            <summary className="cursor-pointer px-6 py-4 text-[#4A4A4A] hover:bg-[#F5F3EF] transition-colors font-medium">
              View raw analysis data
            </summary>
            <pre className="p-6 bg-[#F5F3EF] overflow-auto text-sm text-[#4A4A4A] border-t border-[#E5E0D8]">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </details>
        )}

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔴</span>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Red = Mismatch</h3>
            <p className="text-sm text-[#4A4A4A]">
              Modern environments trigger ancient threat detection. Offices, screens, strangers everywhere.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Green = Aligned</h3>
            <p className="text-sm text-[#4A4A4A]">
              Real bonds, nature, tribe. The environment your brain evolved for.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Target Reticle</h3>
            <p className="text-sm text-[#4A4A4A]">
              What your brain is actually focused on—resources, mates, threats.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

