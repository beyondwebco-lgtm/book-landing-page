/**
 * Procedural canvas texture generator for Thirtha Yatra book
 * Creates ultra high-res leather/gold foil cover textures, vintage aged parchment textures,
 * intricate Indian border patterns, sacred Yantra motifs, and embossed lettering.
 */

export function createBookCoverTexture(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Deep Obsidian / Temple Leather background with rich radial gradient
  const bgGrad = ctx.createRadialGradient(1024, 1024, 200, 1024, 1024, 1400);
  bgGrad.addColorStop(0, '#221510');
  bgGrad.addColorStop(0.5, '#160F0B');
  bgGrad.addColorStop(1, '#0A0806');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 2048);

  // 2. Add subtle leather/parchment grain noise
  const imgData = ctx.getImageData(0, 0, 2048, 2048);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.8));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.5));
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Front cover boundary with Antique Gold intricate filigree
  ctx.save();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 6;
  ctx.shadowColor = '#FAD02C';
  ctx.shadowBlur = 12;

  // Outer border
  ctx.strokeRect(100, 100, 1848, 1848);

  // Inner border
  ctx.lineWidth = 2;
  ctx.strokeRect(124, 124, 1800, 1800);
  ctx.strokeRect(140, 140, 1768, 1768);

  // Corner ornaments
  const corners = [
    [140, 140],
    [1908, 140],
    [140, 1908],
    [1908, 1908]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#C9A45C';
    ctx.fill();
  });

  // 4. Central Sacred Mandalic / Temple Gopuram Geometric Motif
  ctx.translate(1024, 820);
  ctx.strokeStyle = '#C9A45C';
  ctx.lineWidth = 3;

  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.beginPath();
    ctx.moveTo(0, -180);
    ctx.lineTo(60, -90);
    ctx.lineTo(0, 0);
    ctx.lineTo(-60, -90);
    ctx.closePath();
    ctx.stroke();
  }

  // Inner rings
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Central Kalash/Lotus emblem
  ctx.fillStyle = '#E6C687';
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 5. Embossed Gold Typography
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F5D77F';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  // Devanagari Sanskrit Mantra
  ctx.font = 'italic 34px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillStyle = '#C9A45C';
  ctx.fillText('॥ तीर्थ यात्रा महात्म्यम् ॥', 1024, 1200);

  // Main Book Title
  ctx.font = 'bold 82px "Cinzel", "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#FCE38A';
  ctx.letterSpacing = '8px';
  ctx.fillText('THIRTHA YATRA', 1024, 1320);

  // Subtitle
  ctx.font = '36px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillStyle = '#D4AF37';
  ctx.fillText('TEMPLES & KSHETRAS', 1024, 1400);

  // Ornamental Divider
  ctx.strokeStyle = '#8F6B32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(600, 1440);
  ctx.lineTo(1448, 1440);
  ctx.stroke();

  // Author Name
  ctx.font = 'italic 36px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#F1E7D0';
  ctx.fillText('A Comprehensive Pilgrimage Guide by', 1024, 1530);

  ctx.font = 'bold 44px "Cinzel", "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#ECC875';
  ctx.fillText('RAMESH RANGISHETTI', 1024, 1600);

  ctx.restore();

  return canvas.toDataURL('image/png');
}

import { SPREADS_DATA } from './bookData';
import { renderLeftPageCanvas, renderRightPageCanvas } from './pageCanvasRenderer';

export function createPageSpreadTexture(spreadIndex: number): { left: string; right: string } {
  const spread = SPREADS_DATA[spreadIndex % SPREADS_DATA.length];
  return {
    left: renderLeftPageCanvas(spread),
    right: renderRightPageCanvas(spread)
  };
}
