import type { BookSpread } from './bookData';

const PAGE_WIDTH = 1024;
const PAGE_HEIGHT = 1440;

// Preloaded HTML images cache for canvas rendering
const imageCache: { [url: string]: HTMLImageElement } = {};

function getImage(url: string): HTMLImageElement | null {
  if (!url) return null;
  if (!imageCache[url]) {
    const img = new Image();
    img.src = url;
    imageCache[url] = img;
  }
  return imageCache[url].complete ? imageCache[url] : null;
}

function drawParchmentBackground(ctx: CanvasRenderingContext2D, isLeftPage: boolean) {
  const bgGrad = ctx.createLinearGradient(
    isLeftPage ? 0 : PAGE_WIDTH,
    0,
    isLeftPage ? PAGE_WIDTH : 0,
    PAGE_HEIGHT
  );
  bgGrad.addColorStop(0, '#F6EFE0');
  bgGrad.addColorStop(0.5, '#EFE4CD');
  bgGrad.addColorStop(1, '#E5D6B6');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

  const imgData = ctx.getImageData(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i] + noise * 0.9));
    data[i + 2] = Math.min(255, Math.max(0, data[i] + noise * 0.7));
  }
  ctx.putImageData(imgData, 0, 0);

  const spineShadow = ctx.createLinearGradient(
    isLeftPage ? PAGE_WIDTH - 90 : 0,
    0,
    isLeftPage ? PAGE_WIDTH : 90,
    0
  );
  spineShadow.addColorStop(isLeftPage ? 0 : 1, 'rgba(30, 20, 10, 0)');
  spineShadow.addColorStop(isLeftPage ? 1 : 0, 'rgba(30, 20, 10, 0.42)');
  ctx.fillStyle = spineShadow;
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

  ctx.strokeStyle = '#BCA171';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, PAGE_WIDTH - 80, PAGE_HEIGHT - 80);
  ctx.strokeRect(48, 48, PAGE_WIDTH - 96, PAGE_HEIGHT - 96);
}

export function renderLeftPageCanvas(spread: BookSpread): string {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawParchmentBackground(ctx, true);

  // Header row
  ctx.fillStyle = '#7A5B36';
  ctx.font = '600 18px "Cinzel", serif';
  ctx.textAlign = 'left';
  ctx.fillText(spread.chapterTitle.toUpperCase(), 70, 100);

  ctx.textAlign = 'right';
  ctx.fillText(`PLATE ${spread.pageNumber}`, PAGE_WIDTH - 70, 100);

  ctx.strokeStyle = '#C7AE82';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, 120);
  ctx.lineTo(PAGE_WIDTH - 70, 120);
  ctx.stroke();

  // Central Sacred Temple Visual Container
  const boxX = 70;
  const boxY = 150;
  const boxW = PAGE_WIDTH - 140;
  const boxH = 680;

  const loadedImg = getImage(spread.leftPage.imageUrl);
  if (loadedImg) {
    ctx.drawImage(loadedImg, boxX, boxY, boxW, boxH);
    // Subtle vignette overlay on photo
    const vig = ctx.createLinearGradient(boxX, boxY + boxH - 200, boxX, boxY + boxH);
    vig.addColorStop(0, 'rgba(17, 10, 5, 0)');
    vig.addColorStop(1, 'rgba(17, 10, 5, 0.85)');
    ctx.fillStyle = vig;
    ctx.fillRect(boxX, boxY, boxW, boxH);
  } else {
    // Elegant temple illustration fallback
    const visualGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
    visualGrad.addColorStop(0, '#351C12');
    visualGrad.addColorStop(0.5, '#221109');
    visualGrad.addColorStop(1, '#110804');
    ctx.fillStyle = visualGrad;
    ctx.fillRect(boxX, boxY, boxW, boxH);
  }

  ctx.strokeStyle = '#8E6B3C';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  const cx = boxX + boxW / 2;

  // Plate Title
  ctx.font = 'bold 36px "Cinzel", "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#FCE38A';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 10;
  ctx.fillText(spread.leftPage.title, cx, boxY + 590);

  // Plate Subtitle
  ctx.font = 'italic 24px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#E8D2AF';
  ctx.fillText(spread.leftPage.subtitle, cx, boxY + 640);
  ctx.shadowBlur = 0;

  // Mantra Banner Box
  if (spread.leftPage.mantraOrVerse) {
    const mY = boxY + boxH + 35;
    ctx.fillStyle = '#E4D4B4';
    ctx.fillRect(boxX, mY, boxW, 80);
    ctx.strokeStyle = '#C4AC82';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, mY, boxW, 80);

    ctx.fillStyle = '#4A2E14';
    ctx.font = 'bold 24px "Cinzel", "Cormorant Garamond", serif';
    ctx.fillText(spread.leftPage.mantraOrVerse, cx, mY + 48);
  }

  // Accent Quote
  ctx.fillStyle = '#5A3E26';
  ctx.font = 'italic 24px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(spread.leftPage.accentQuote, cx, 1010);

  // Footer Page Number
  ctx.font = '22px "Cinzel", serif';
  ctx.fillStyle = '#7A5B36';
  ctx.fillText(`— ${spread.pageNumber} —`, cx, 1370);

  return canvas.toDataURL('image/png');
}

export function renderRightPageCanvas(spread: BookSpread): string {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawParchmentBackground(ctx, false);

  // Header row
  ctx.fillStyle = '#7A5B36';
  ctx.font = '600 18px "Cinzel", serif';
  ctx.textAlign = 'left';
  ctx.fillText('THIRTHA YATRA GUIDE', 70, 100);

  ctx.textAlign = 'right';
  ctx.fillText('RAMESH GANGASHETTY', PAGE_WIDTH - 70, 100);

  ctx.strokeStyle = '#C7AE82';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, 120);
  ctx.lineTo(PAGE_WIDTH - 70, 120);
  ctx.stroke();

  // Heading
  ctx.textAlign = 'left';
  ctx.fillStyle = '#261408';
  ctx.font = 'bold 42px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillText(spread.rightPage.heading, 70, 200);

  // Body Paragraphs
  ctx.fillStyle = '#382414';
  ctx.font = '24px/38px "Cormorant Garamond", Georgia, serif';

  let curY = 270;
  spread.rightPage.content.forEach((para) => {
    const words = para.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > PAGE_WIDTH - 140 && n > 0) {
        ctx.fillText(line, 70, curY);
        line = words[n] + ' ';
        curY += 38;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 70, curY);
    curY += 56;
  });

  // Sanctum Highlights Box
  const hlBoxY = curY + 20;
  const hlBoxW = PAGE_WIDTH - 140;
  const hlBoxH = 260;

  ctx.fillStyle = '#E5D6B6';
  ctx.fillRect(70, hlBoxY, hlBoxW, hlBoxH);
  ctx.strokeStyle = '#C4AD80';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(70, hlBoxY, hlBoxW, hlBoxH);

  ctx.fillStyle = '#54381C';
  ctx.font = 'bold 20px "Cinzel", serif';
  ctx.fillText('KEY SANCTUM HIGHLIGHTS', 100, hlBoxY + 50);

  ctx.font = '22px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#3B2613';
  let itemY = hlBoxY + 95;
  spread.rightPage.kshetraHighlights.forEach((item) => {
    ctx.fillText(`☖  ${item}`, 100, itemY);
    itemY += 40;
  });

  // Guide Note
  ctx.font = 'italic 21px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#5A3D22';
  ctx.fillText(`Guide Note: ${spread.rightPage.sacredNotes}`, 70, hlBoxY + hlBoxH + 50);

  // Footer Page Number
  ctx.textAlign = 'center';
  ctx.font = '22px "Cinzel", serif';
  ctx.fillStyle = '#7A5B36';
  ctx.fillText(`— ${spread.pageNumber + 1} —`, PAGE_WIDTH / 2, 1370);

  return canvas.toDataURL('image/png');
}
