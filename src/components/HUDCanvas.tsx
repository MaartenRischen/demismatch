'use client';

import { useEffect, useRef, useCallback } from 'react';

interface HUDCanvasProps {
  imageSrc: string;
  analysis: any;
  onRender?: (dataUrl: string) => void;
}

export default function HUDCanvas({ imageSrc, analysis, onRender }: HUDCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderHUD = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analysis) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Apply color tint for mismatch
      if (analysis.is_mismatch) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawRadarSweep(ctx, canvas.width, canvas.height);
      }
      
      // Draw HUD elements
      drawBiometricsPanel(ctx, analysis.biometrics, analysis.is_mismatch);
      drawStatusPanel(ctx, canvas.width, analysis.right_panel, analysis.is_mismatch);
      drawTargetReticle(ctx, canvas.width, canvas.height, analysis.primary_target, analysis.is_mismatch);
      drawCostBenefit(ctx, canvas.width, canvas.height, analysis.cost_benefit);
      drawAction(ctx, canvas.width, canvas.height, analysis.action, analysis.is_mismatch);
      
      if (analysis.is_mismatch && analysis.mismatch_details) {
        drawMismatchWarning(ctx, canvas.width, canvas.height, analysis.mismatch_details);
      }
      
      // Callback with rendered image
      if (onRender) {
        onRender(canvas.toDataURL('image/png'));
      }
    };
    img.src = imageSrc;
  }, [imageSrc, analysis, onRender]);

  useEffect(() => {
    renderHUD();
  }, [renderHUD]);

  return <canvas ref={canvasRef} className="w-full rounded-lg shadow" />;
}

function drawPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, isRed: boolean = false) {
  // Dark semi-transparent background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(x, y, w, h);
  
  // Glowing border
  ctx.strokeStyle = isRed ? 'rgba(255, 100, 100, 0.6)' : 'rgba(100, 200, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

function drawBiometricsPanel(ctx: CanvasRenderingContext2D, biometrics: any, isRed: boolean) {
  const padding = 15;
  const panelWidth = 220;
  const lineHeight = 28;
  const entries = Object.entries(biometrics || {});
  const panelHeight = entries.length * lineHeight + 20;
  
  drawPanel(ctx, padding, padding, panelWidth, panelHeight, isRed);
  
  let y = padding + 20;
  entries.forEach(([key, val]: [string, any]) => {
    const level = val.level || val;
    const levelNum = getLevelNumber(level);
    
    // Label
    ctx.fillStyle = '#888888';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, padding + 10, y);
    
    // Value
    ctx.fillStyle = getLevelColor(level, isRed, key);
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(level, padding + 100, y);
    
    // Bar
    const barX = padding + 10;
    const barY = y + 4;
    const barWidth = panelWidth - 25;
    const barHeight = 6;
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const barColor = getLevelColor(level, isRed, key);
    ctx.fillStyle = barColor;
    ctx.fillRect(barX, barY, barWidth * levelNum, barHeight);
    
    y += lineHeight;
  });
}

function drawStatusPanel(ctx: CanvasRenderingContext2D, canvasWidth: number, panel: any, isRed: boolean) {
  const padding = 15;
  const panelWidth = 250;
  const panelHeight = 180;
  const x = canvasWidth - panelWidth - padding;
  
  drawPanel(ctx, x, padding, panelWidth, panelHeight, isRed);
  
  const items = [
    { label: 'Resource Value', value: panel?.resource_value },
    { label: 'Tribe Status', value: panel?.tribe_status },
    { label: 'Mate Opportunity', value: panel?.mate_opportunity },
    { label: 'Threat Level', value: panel?.threat_level },
    { label: 'Social Bond', value: panel?.social_bond }
  ].filter(item => item.value && item.value !== 'N/A');
  
  let y = padding + 25;
  items.forEach(item => {
    ctx.fillStyle = '#888888';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText(item.label + ':', x + 10, y);
    
    const isThreat = item.label.includes('Threat') && item.value !== 'ZERO' && item.value !== 'LOW';
    ctx.fillStyle = isThreat ? '#ff4444' : (isRed ? '#ff8888' : '#44ffaa');
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(item.value, x + 10, y + 14);
    
    y += 32;
  });
}

function drawTargetReticle(ctx: CanvasRenderingContext2D, w: number, h: number, target: any, isRed: boolean) {
  const centerX = w / 2;
  const centerY = h / 2;
  const color = isRed ? '#ff6644' : '#ffcc44';
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // Outer circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 70, 0, Math.PI * 2);
  ctx.stroke();
  
  // Inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
  ctx.stroke();
  
  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(centerX - 90, centerY);
  ctx.lineTo(centerX - 50, centerY);
  ctx.moveTo(centerX + 50, centerY);
  ctx.lineTo(centerX + 90, centerY);
  ctx.moveTo(centerX, centerY - 90);
  ctx.lineTo(centerX, centerY - 50);
  ctx.moveTo(centerX, centerY + 50);
  ctx.lineTo(centerX, centerY + 90);
  ctx.stroke();
  
  // Label
  if (target?.label) {
    const labelY = centerY - 110;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(centerX - 100, labelY - 18, 200, 45);
    
    ctx.fillStyle = color;
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(target.label, centerX, labelY);
    
    if (target.analysis) {
      ctx.fillStyle = '#cccccc';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('ANALYSIS: ' + target.analysis, centerX, labelY + 18);
    }
    ctx.textAlign = 'left';
  }
}

function drawCostBenefit(ctx: CanvasRenderingContext2D, w: number, h: number, cb: any) {
  if (!cb?.show) return;
  
  const centerX = w / 2;
  const y = h / 2 + 100;
  
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(centerX - 150, y - 10, 300, 50);
  
  // Payoff
  ctx.fillStyle = '#44ff88';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText('▲ PAYOFF:', centerX - 140, y + 8);
  ctx.font = '10px system-ui, sans-serif';
  ctx.fillText(cb.payoff || '', centerX - 140, y + 24);
  
  // Cost
  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText('▼ COST:', centerX + 20, y + 8);
  ctx.font = '10px system-ui, sans-serif';
  ctx.fillText(cb.cost || '', centerX + 20, y + 24);
}

function drawAction(ctx: CanvasRenderingContext2D, w: number, h: number, action: any, isRed: boolean) {
  if (!action?.recommendation || action.recommendation === 'NONE REQUIRED') return;
  
  const isUrgent = action.urgency === 'CRITICAL' || action.urgency === 'HIGH';
  
  if (isUrgent) {
    // Large prominent action
    const y = h - 80;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(w/2 - 150, y - 5, 300, 40);
    
    ctx.fillStyle = isRed ? '#ff4444' : '#44ff88';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACTION: ' + action.recommendation, w/2, y + 25);
    ctx.textAlign = 'left';
  }
}

function drawRadarSweep(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const centerX = w / 2;
  const centerY = h / 3;
  const radius = Math.min(w, h) * 0.4;
  
  // Red scanning sweep
  const gradient = ctx.createConicGradient(0, centerX, centerY);
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
  gradient.addColorStop(0.1, 'rgba(255, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Concentric circles
  ctx.strokeStyle = 'rgba(255, 100, 100, 0.2)';
  ctx.lineWidth = 1;
  for (let r = radius * 0.25; r <= radius; r += radius * 0.25) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawMismatchWarning(ctx: CanvasRenderingContext2D, w: number, h: number, details: string) {
  const y = h - 40;
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(10, y - 15, w - 20, 45);
  
  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('⚠ ENVIRONMENTAL MISMATCH DETECTED', 20, y);
  
  ctx.fillStyle = '#ffaaaa';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText(details.substring(0, 100) + (details.length > 100 ? '...' : ''), 20, y + 18);
}

function getLevelNumber(level: string): number {
  const levels: Record<string, number> = {
    'ZERO': 0, 'LOW': 0.25, 'MODERATE': 0.5, 'STABLE': 0.5,
    'HIGH': 0.75, 'MAX': 1, 'OPTIMAL': 0.85, 'RISING': 0.6
  };
  return levels[level] || 0.5;
}

function getLevelColor(level: string, isRed: boolean, key: string): string {
  const stressors = ['cortisol', 'adrenaline'];
  const isStressor = stressors.includes(key.toLowerCase());
  const levelNum = getLevelNumber(level);
  
  if (isStressor) {
    // High stress = red, low = green
    return levelNum > 0.5 ? '#ff4444' : '#44ff88';
  }
  
  if (isRed) {
    return levelNum < 0.4 ? '#ff4444' : '#ff8844';
  }
  
  return levelNum > 0.5 ? '#44ff88' : '#ffaa44';
}

