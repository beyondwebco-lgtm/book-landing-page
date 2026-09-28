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

export function createPageSpreadTexture(spreadIndex: number): { left: string; right: string } {
  // Generate Left & Right Canvas Textures
  const w = 1024;
  const h = 1440;

  const renderBasePaper = (ctx: CanvasRenderingContext2D, isLeft: boolean) => {
    // Parchment paper gradient
    const pGrad = ctx.createLinearGradient(isLeft ? 0 : w, 0, isLeft ? w : 0, h);
    pGrad.addColorStop(0, '#F5EEDC');
    pGrad.addColorStop(0.5, '#EFE4CB');
    pGrad.addColorStop(1, '#E4D5B7');
    ctx.fillStyle = pGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle page binding shadow at the inner spine
    const spineGrad = ctx.createLinearGradient(isLeft ? w - 120 : 0, 0, isLeft ? w : 120, 0);
    spineGrad.addColorStop(isLeft ? 0 : 1, 'rgba(40, 25, 15, 0)');
    spineGrad.addColorStop(isLeft ? 1 : 0, 'rgba(40, 25, 15, 0.45)');
    ctx.fillStyle = spineGrad;
    ctx.fillRect(0, 0, w, h);

    // Filigree outer border
    ctx.strokeStyle = '#B89B6A';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, w - 72, h - 72);
    ctx.strokeRect(44, 44, w - 88, h - 88);
  };

  // Left Canvas
  const lCanvas = document.createElement('canvas');
  lCanvas.width = w;
  lCanvas.height = h;
  const lCtx = lCanvas.getContext('2d');
  if (lCtx) {
    renderBasePaper(lCtx, true);

    // Left Page Temple Visual Placeholder / Sacred Illustration
    lCtx.fillStyle = '#2A1F18';
    lCtx.fillRect(70, 100, w - 140, 700);

    // Subtle temple glow in illustration
    const templeGlow = lCtx.createRadialGradient(w / 2, 450, 40, w / 2, 450, 360);
    templeGlow.addColorStop(0, '#E5A93C');
    templeGlow.addColorStop(0.4, '#8E4A23');
    templeGlow.addColorStop(1, '#1A120E');
    lCtx.fillStyle = templeGlow;
    lCtx.fillRect(70, 100, w - 140, 700);

    // Temple silhouette illustration
    lCtx.fillStyle = '#0E0906';
    lCtx.beginPath();
    // Central Kalash & Gopuram tiers
    lCtx.moveTo(w / 2, 220);
    lCtx.lineTo(w / 2 + 18, 260);
    lCtx.lineTo(w / 2 + 60, 340);
    lCtx.lineTo(w / 2 + 120, 480);
    lCtx.lineTo(w / 2 + 180, 680);
    lCtx.lineTo(w / 2 + 240, 800);
    lCtx.lineTo(w / 2 - 240, 800);
    lCtx.lineTo(w / 2 - 180, 680);
    lCtx.lineTo(w / 2 - 120, 480);
    lCtx.lineTo(w / 2 - 60, 340);
    lCtx.lineTo(w / 2 - 18, 260);
    lCtx.closePath();
    lCtx.fill();

    // Sacred Caption & Mantras
    lCtx.fillStyle = '#3E2D1E';
    lCtx.textAlign = 'center';
    lCtx.font = 'italic 28px "Cinzel", "Cormorant Garamond", Georgia, serif';
    lCtx.fillText('SACRED KSHETRA VISUALIZATION', w / 2, 880);

    lCtx.font = '22px "Cormorant Garamond", serif';
    lCtx.fillStyle = '#654C34';
    lCtx.fillText('Plate ' + (spreadIndex * 2 + 1) + ' — Architectural & Spiritual Topography', w / 2, 930);

    lCtx.font = 'italic 20px "Cinzel", Georgia, serif';
    lCtx.fillStyle = '#8B6538';
    lCtx.fillText('“Where sacred vibrations sanctify the pilgrim seeker.”', w / 2, 1060);

    // Page Number
    lCtx.font = '20px "Cinzel", serif';
    lCtx.fillStyle = '#7C5C39';
    lCtx.fillText('— ' + (spreadIndex * 24 + 12) + ' —', w / 2, 1360);
  }

  // Right Canvas
  const rCanvas = document.createElement('canvas');
  rCanvas.width = w;
  rCanvas.height = h;
  const rCtx = rCanvas.getContext('2d');
  if (rCtx) {
    renderBasePaper(rCtx, false);

    // Chapter header
    rCtx.fillStyle = '#7A5832';
    rCtx.textAlign = 'left';
    rCtx.font = '600 18px "Cinzel", serif';
    rCtx.fillText('THIRTHA YATRA GUIDE • SECTION ' + (spreadIndex + 1), 80, 110);

    // Chapter Divider
    rCtx.strokeStyle = '#C2A374';
    rCtx.lineWidth = 1;
    rCtx.beginPath();
    rCtx.moveTo(80, 130);
    rCtx.lineTo(w - 80, 130);
    rCtx.stroke();

    // Main Heading
    rCtx.fillStyle = '#2B1A0E';
    rCtx.font = 'bold 36px "Cinzel", "Cormorant Garamond", serif';
    rCtx.fillText('KSHETRA MAHATMATHYA', 80, 200);

    // Body text paragraphs
    rCtx.fillStyle = '#3D2A1C';
    rCtx.font = '24px/36px "Cormorant Garamond", Georgia, serif';
    const lines = [
      'The ancient pilgrim path is sanctified by centuries of continuous',
      'devotion and inner realization. Within each temple lies not merely',
      'sculpted stone, but sacred geometric mandalas channeling cosmic prana.',
      '',
      'Pilgrims traversing these sacred grounds follow the traditional',
      'Pradakshina (circumambulation) entering deep contemplation.',
      'Here, geography transforms into a living conduit of peace, connecting',
      'the individual consciousness with eternal spiritual light.'
    ];

    let startY = 280;
    lines.forEach((l) => {
      rCtx.fillText(l, 80, startY);
      startY += 38;
    });

    // Kshetra notes box
    rCtx.fillStyle = 'rgba(180, 140, 90, 0.15)';
    rCtx.fillRect(80, startY + 40, w - 160, 260);
    rCtx.strokeStyle = '#C2A374';
    rCtx.strokeRect(80, startY + 40, w - 160, 260);

    rCtx.fillStyle = '#5A3D22';
    rCtx.font = 'bold 20px "Cinzel", serif';
    rCtx.fillText('PILGRIMAGE GUIDELINES & DHARMA', 110, startY + 90);

    rCtx.font = 'italic 20px "Cormorant Garamond", Georgia, serif';
    rCtx.fillStyle = '#442F1C';
    rCtx.fillText('• Auspicious timings: Brahma Muhurta (04:30 - 06:00)', 110, startY + 140);
    rCtx.fillText('• Theertham protocol: Mindful ritual cleansing prior to darshan', 110, startY + 180);
    rCtx.fillText('• Parikrama: Clockwise circumambulation honoring cardinal deities', 110, startY + 220);

    // Page Number
    rCtx.textAlign = 'center';
    rCtx.font = '20px "Cinzel", serif';
    rCtx.fillStyle = '#7C5C39';
    rCtx.fillText('— ' + (spreadIndex * 24 + 13) + ' —', w / 2, 1360);
  }

  return {
    left: lCanvas.toDataURL('image/png'),
    right: rCanvas.toDataURL('image/png')
  };
}
