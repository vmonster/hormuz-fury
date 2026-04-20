import * as Phaser from 'phaser';
import type { CountryCode } from './constants';

/**
 * Detailed national flag rendering. Drawn into a Phaser Graphics buffer at (x, y)
 * with size (w, h). All coordinates are local to the Graphics object.
 */
export function drawFlag(
  g: Phaser.GameObjects.Graphics,
  code: CountryCode,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  switch (code) {
    case 'KW': {
      const bandH = h / 3;
      g.fillStyle(0x007A3D, 1); g.fillRect(x, y, w, bandH);
      g.fillStyle(0xFFFFFF, 1); g.fillRect(x, y + bandH, w, bandH);
      g.fillStyle(0xCE1126, 1); g.fillRect(x, y + bandH * 2, w, bandH);
      // Black hoist trapezoid
      const tw = w * 0.3;
      g.fillStyle(0x000000, 1);
      g.fillPoints([
        new Phaser.Math.Vector2(x, y),
        new Phaser.Math.Vector2(x + tw, y + bandH),
        new Phaser.Math.Vector2(x + tw, y + bandH * 2),
        new Phaser.Math.Vector2(x, y + h),
      ], true);
      break;
    }
    case 'SA': {
      g.fillStyle(0x006C35, 1); g.fillRect(x, y, w, h);
      // Stylized shahada (three thin horizontal lines suggesting script)
      g.fillStyle(0xFFFFFF, 1);
      const sy = y + h * 0.28;
      g.fillRect(x + w * 0.16, sy, w * 0.68, Math.max(1, h * 0.04));
      g.fillRect(x + w * 0.12, sy + h * 0.12, w * 0.76, Math.max(1, h * 0.05));
      g.fillRect(x + w * 0.18, sy + h * 0.26, w * 0.64, Math.max(1, h * 0.04));
      // Sword: horizontal blade with pointed tip on left, hilt+pommel on right
      const swY = y + h * 0.72;
      const swBladeH = Math.max(1, h * 0.07);
      g.fillRect(x + w * 0.22, swY, w * 0.55, swBladeH);
      g.fillTriangle(
        x + w * 0.22, swY - swBladeH,
        x + w * 0.22, swY + swBladeH * 2,
        x + w * 0.1, swY + swBladeH / 2,
      );
      // Hilt
      g.fillRect(x + w * 0.77, swY - swBladeH, Math.max(1, w * 0.04), swBladeH * 3);
      // Pommel
      g.fillRect(x + w * 0.82, swY - swBladeH / 2, Math.max(1, w * 0.04), swBladeH * 2);
      break;
    }
    case 'BH': {
      // Fill red everywhere, then carve white hoist with 5 triangular teeth biting into red
      g.fillStyle(0xCE1126, 1); g.fillRect(x, y, w, h);
      g.fillStyle(0xFFFFFF, 1);
      const hoistW = w * 0.32;
      g.fillRect(x, y, hoistW, h);
      const teeth = 5;
      const tH = h / teeth;
      const tW = Math.min(w * 0.12, tH * 0.5);
      for (let i = 0; i < teeth; i++) {
        const ny = y + i * tH;
        g.fillTriangle(
          x + hoistW, ny,
          x + hoistW + tW, ny + tH / 2,
          x + hoistW, ny + tH,
        );
      }
      break;
    }
    case 'QA': {
      g.fillStyle(0x8D1B3D, 1); g.fillRect(x, y, w, h);
      g.fillStyle(0xFFFFFF, 1);
      const hoistW = w * 0.32;
      g.fillRect(x, y, hoistW, h);
      const teeth = 9;
      const tH = h / teeth;
      const tW = Math.min(w * 0.1, tH * 0.55);
      for (let i = 0; i < teeth; i++) {
        const ny = y + i * tH;
        g.fillTriangle(
          x + hoistW, ny,
          x + hoistW + tW, ny + tH / 2,
          x + hoistW, ny + tH,
        );
      }
      break;
    }
    case 'AE': {
      const hoistW = w * 0.25;
      g.fillStyle(0xFF0000, 1); g.fillRect(x, y, hoistW, h);
      const bandH = h / 3;
      const fx = x + hoistW;
      const fw = w - hoistW;
      g.fillStyle(0x00732F, 1); g.fillRect(fx, y, fw, bandH);
      g.fillStyle(0xFFFFFF, 1); g.fillRect(fx, y + bandH, fw, bandH);
      g.fillStyle(0x000000, 1); g.fillRect(fx, y + bandH * 2, fw, bandH);
      break;
    }
    case 'IR': {
      const bandH = h / 3;
      g.fillStyle(0x239F40, 1); g.fillRect(x, y, w, bandH);
      g.fillStyle(0xFFFFFF, 1); g.fillRect(x, y + bandH, w, bandH);
      g.fillStyle(0xDA0000, 1); g.fillRect(x, y + bandH * 2, w, bandH);
      // Takbir ornamental stripes on green and red edges (22 repetitions simplified to dashes)
      const dashH = Math.max(1, h * 0.05);
      const dashes = 11;
      const dashW = w / (dashes * 1.6);
      g.fillStyle(0xFFFFFF, 1);
      for (let i = 0; i < dashes; i++) {
        const dx = x + (i + 0.3) * (w / dashes);
        g.fillRect(dx, y + bandH - dashH, dashW, dashH);
      }
      g.fillStyle(0xFFFFFF, 1);
      for (let i = 0; i < dashes; i++) {
        const dx = x + (i + 0.3) * (w / dashes);
        g.fillRect(dx, y + bandH * 2, dashW, dashH);
      }
      // Central emblem — stylized tulip/Allah (4-petal rosette)
      g.fillStyle(0xDA0000, 1);
      const cx = x + w / 2, cy = y + h / 2;
      const r = Math.max(2, h * 0.18);
      g.fillTriangle(cx - r, cy, cx, cy - r, cx + r, cy);
      g.fillTriangle(cx - r, cy, cx, cy + r, cx + r, cy);
      g.fillStyle(0xFFFFFF, 1);
      g.fillRect(cx - 0.5, cy - r * 0.4, 1, r * 0.8);
      break;
    }
    case 'OM': {
      // Three horizontal bands
      const bandH = h / 3;
      g.fillStyle(0xFFFFFF, 1); g.fillRect(x, y, w, bandH);
      g.fillStyle(0xDA0000, 1); g.fillRect(x, y + bandH, w, bandH);
      g.fillStyle(0x009E49, 1); g.fillRect(x, y + bandH * 2, w, bandH);
      // Red hoist band (vertical)
      const hoistW = w * 0.3;
      g.fillStyle(0xDA0000, 1); g.fillRect(x, y, hoistW, h);
      // Khanjar (dagger in sheath over crossed swords) — simplified
      g.fillStyle(0xFFFFFF, 1);
      const ex = x + hoistW * 0.5;
      const ey = y + h * 0.5;
      // Crossed swords (X)
      const armL = hoistW * 0.45;
      g.lineStyle(Math.max(1, h * 0.05), 0xFFFFFF, 1);
      g.beginPath();
      g.moveTo(ex - armL, ey - armL);
      g.lineTo(ex + armL, ey + armL);
      g.moveTo(ex + armL, ey - armL);
      g.lineTo(ex - armL, ey + armL);
      g.strokePath();
      // Khanjar body (curved dagger — approximated as small rectangle with triangle tip)
      g.fillRect(ex - 1, ey - h * 0.12, 2, h * 0.24);
      g.fillTriangle(ex - 1.5, ey - h * 0.12, ex + 1.5, ey - h * 0.12, ex, ey - h * 0.22);
      // Hilt crossguard
      g.fillRect(ex - 3, ey + h * 0.1, 6, Math.max(1, h * 0.04));
      break;
    }
  }
}
