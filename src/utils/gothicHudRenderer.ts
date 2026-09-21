import {
  GOTHIC_HUD_FRAME,
  GOTHIC_HUD_RED_ORB,
  GOTHIC_HUD_YELLOW_BAR,
  GOTHIC_HUD_BLUE_BAR,
} from './gothicHudData';

// Image cache for HUD elements
const hudImageCache = new Map<string, HTMLImageElement>();

function getOrLoadHudImage(src: string): HTMLImageElement {
  let img = hudImageCache.get(src);
  if (!img) {
    img = new Image();
    img.src = src;
    hudImageCache.set(src, img);
  }
  return img;
}

// Pre-initialize images
if (typeof window !== 'undefined') {
  getOrLoadHudImage(GOTHIC_HUD_FRAME);
  getOrLoadHudImage(GOTHIC_HUD_RED_ORB);
  getOrLoadHudImage(GOTHIC_HUD_YELLOW_BAR);
  getOrLoadHudImage(GOTHIC_HUD_BLUE_BAR);
}

export const GOTHIC_HUD_NATIVE_WIDTH = 196;
export const GOTHIC_HUD_NATIVE_HEIGHT = 96;

/**
 * Draws the gothic stone maiden UI bar matching the user's uploaded images
 * (Castlevania/Diablo style orb + maiden statue + dual gauge bars).
 */
export function drawGothicHud(
  ctx: CanvasRenderingContext2D,
  destX: number,
  destY: number,
  scale: number,
  healthRatio: number,    // 0.0 to 1.0 (Controls Red Liquid Orb)
  staminaRatio: number,   // 0.0 to 1.0 (Controls Yellow Bar)
  manaRatio: number,      // 0.0 to 1.0 (Controls 12-segment Blue Bar)
  options?: {
    hpText?: string;
    staminaText?: string;
    manaText?: string;
    heroName?: string;
  }
) {
  const frameImg = getOrLoadHudImage(GOTHIC_HUD_FRAME);
  const redOrbImg = getOrLoadHudImage(GOTHIC_HUD_RED_ORB);
  const yellowBarImg = getOrLoadHudImage(GOTHIC_HUD_YELLOW_BAR);
  const blueBarImg = getOrLoadHudImage(GOTHIC_HUD_BLUE_BAR);

  ctx.save();
  ctx.imageSmoothingEnabled = false; // Preserve crisp pixel-art look
  ctx.translate(destX, destY);
  ctx.scale(scale, scale);

  const orbCx = 47;
  const orbCy = 47;
  const orbR = 43;

  // 1. Dark empty glass orb background
  ctx.save();
  ctx.beginPath();
  ctx.arc(orbCx, orbCy, orbR - 0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#14080a';
  ctx.fill();
  // Inner glass shadow
  ctx.strokeStyle = '#281014';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // 2. Red Liquid Orb (drains vertically from top to bottom as HP drops)
  const clampedHp = Math.max(0, Math.min(1, healthRatio));
  if (clampedHp > 0 && redOrbImg.complete && redOrbImg.naturalWidth > 0) {
    ctx.save();
    // Clip to circle
    ctx.beginPath();
    ctx.arc(orbCx, orbCy, orbR - 0.5, 0, Math.PI * 2);
    ctx.clip();

    // Clip to current health level height
    const liquidTop = (orbCy + orbR) - (orbR * 2 * clampedHp);
    ctx.beginPath();
    ctx.rect(0, liquidTop, GOTHIC_HUD_NATIVE_WIDTH, GOTHIC_HUD_NATIVE_HEIGHT);
    ctx.clip();

    // Draw full red orb image
    ctx.drawImage(redOrbImg, 0, 0);

    // Subtle liquid surface gleam line
    if (clampedHp < 0.98) {
      ctx.fillStyle = 'rgba(255, 140, 150, 0.65)';
      ctx.fillRect(orbCx - orbR, liquidTop, orbR * 2, 1.5);
    }
    ctx.restore();
  }

  // 3. Yellow / Gold Bar (Stamina / Energy)
  // Slot dimensions: x = 109, y = 66, width = 58, height = 10
  const ySlotX = 109;
  const ySlotY = 66;
  const ySlotW = 58;
  const ySlotH = 10;
  const clampedStamina = Math.max(0, Math.min(1, staminaRatio));

  // Empty slot background
  ctx.fillStyle = '#1e1408';
  ctx.fillRect(ySlotX, ySlotY, ySlotW, ySlotH);

  if (clampedStamina > 0 && yellowBarImg.complete && yellowBarImg.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(ySlotX, ySlotY, ySlotW * clampedStamina, ySlotH);
    ctx.clip();
    ctx.drawImage(yellowBarImg, 0, 0);
    ctx.restore();
  }

  // 4. Blue Bar (Mana / Special / Stamina Segments)
  // Slot dimensions: x = 107, y = 78, width = 81, height = 12 (12 segments)
  const bSlotX = 107;
  const bSlotY = 78;
  const bSlotW = 81;
  const bSlotH = 12;
  const clampedMana = Math.max(0, Math.min(1, manaRatio));

  // Empty slot background with dark segment dividers
  ctx.fillStyle = '#060a18';
  ctx.fillRect(bSlotX, bSlotY, bSlotW, bSlotH);

  if (clampedMana > 0 && blueBarImg.complete && blueBarImg.naturalWidth > 0) {
    ctx.save();
    // Segmented clipping for clean 12-block step or smooth fill
    const activeWidth = bSlotW * clampedMana;
    ctx.beginPath();
    ctx.rect(bSlotX, bSlotY, activeWidth, bSlotH);
    ctx.clip();
    ctx.drawImage(blueBarImg, 0, 0);
    ctx.restore();
  }

  // 5. Gothic Stone Maiden & Metal Bezel Frame (Drawn ON TOP of all fills)
  if (frameImg.complete && frameImg.naturalWidth > 0) {
    ctx.drawImage(frameImg, 0, 0);
  }

  // 6. Value Indicators & Text Typography
  if (options?.hpText) {
    ctx.save();
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 3;
    ctx.fillText(options.hpText, orbCx, orbCy + 3);
    ctx.restore();
  }

  if (options?.heroName) {
    ctx.save();
    ctx.font = 'bold 8px "Cinzel", serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 3;
    ctx.fillText(options.heroName, 58, 87);
    ctx.restore();
  }

  ctx.restore();
}
