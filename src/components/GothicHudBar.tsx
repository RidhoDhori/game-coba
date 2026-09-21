import React, { useEffect, useRef } from 'react';
import {
  drawGothicHud,
  GOTHIC_HUD_NATIVE_WIDTH,
  GOTHIC_HUD_NATIVE_HEIGHT,
} from '../utils/gothicHudRenderer';

interface GothicHudBarProps {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  mana?: number;
  maxMana?: number;
  heroName?: string;
  scale?: number;
  className?: string;
  showTextOverlay?: boolean;
}

export const GothicHudBar: React.FC<GothicHudBarProps> = ({
  health,
  maxHealth,
  stamina,
  maxStamina,
  mana = 12,
  maxMana = 12,
  heroName,
  scale = 1.0,
  className = '',
  showTextOverlay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const healthRatio = maxHealth > 0 ? Math.max(0, Math.min(1, health / maxHealth)) : 0;
  const staminaRatio = maxStamina > 0 ? Math.max(0, Math.min(1, stamina / maxStamina)) : 0;
  const manaRatio = maxMana > 0 ? Math.max(0, Math.min(1, mana / maxMana)) : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGothicHud(
      ctx,
      0,
      0,
      scale,
      healthRatio,
      staminaRatio,
      manaRatio,
      showTextOverlay
        ? {
            hpText: `${Math.round(health)}`,
            heroName: heroName ? heroName.slice(0, 12) : undefined,
          }
        : undefined
    );
  }, [health, maxHealth, stamina, maxStamina, mana, maxMana, heroName, scale, showTextOverlay, healthRatio, staminaRatio, manaRatio]);

  const width = Math.round(GOTHIC_HUD_NATIVE_WIDTH * scale);
  const height = Math.round(GOTHIC_HUD_NATIVE_HEIGHT * scale);

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
