import * as Phaser from 'phaser';
import { GAME_W, GAME_H, PLAYER_MAX_LIVES, SHIP_MAX_HEALTH, FUEL_MAX, COUNTRIES, WORLD_LENGTH } from '../game/constants';
import type { CountryCode } from '../game/constants';
import { RIGHT_BANK_BANDS } from '../data/route';
import { drawFlag } from '../game/flags';

export class HUDScene extends Phaser.Scene {
  private livesText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private fuelBar!: Phaser.GameObjects.Graphics;
  private shipBar!: Phaser.GameObjects.Graphics;
  private miniGfx!: Phaser.GameObjects.Graphics;
  private miniProgress!: Phaser.GameObjects.Graphics;
  private miniFlags: Phaser.GameObjects.Graphics[] = [];
  private countryLabel!: Phaser.GameObjects.Text;
  private countryFlag!: Phaser.GameObjects.Graphics;
  private tourist!: Phaser.GameObjects.Container;
  private touristName!: Phaser.GameObjects.Text;
  private touristHint!: Phaser.GameObjects.Text;
  private touristBg!: Phaser.GameObjects.Rectangle;

  private lastFuel = FUEL_MAX;
  private lastShipHp = SHIP_MAX_HEALTH;
  private lastLives = PLAYER_MAX_LIVES;

  constructor() { super('HUD'); }

  create() {
    // Top bar background
    const top = 0;
    const barH = 58;
    const g = this.add.graphics();
    g.fillStyle(0x05101f, 0.88);
    g.fillRect(0, top, GAME_W, barH);
    g.fillStyle(0x2a4a6e, 1);
    g.fillRect(0, top + barH - 1, GAME_W, 1);

    // Country flag (top-left)
    this.countryFlag = this.add.graphics();
    this.countryFlag.x = 10;
    this.countryFlag.y = 10;
    this.countryLabel = this.add.text(48, 12, '', {
      fontSize: '14px', fontStyle: 'bold', color: '#e6eef8', fontFamily: 'monospace',
    });
    // Score top-right
    this.scoreText = this.add.text(GAME_W - 10, 12, 'SCORE 0', {
      fontSize: '14px', fontStyle: 'bold', color: '#ffe680', fontFamily: 'monospace',
    }).setOrigin(1, 0);
    // Lives (below flag)
    this.livesText = this.add.text(10, 32, '', {
      fontSize: '13px', color: '#cfe0f0', fontFamily: 'monospace',
    });

    // Mini-map route bar: across top
    const miniY = 40;
    const miniX = 110;
    const miniW = GAME_W - miniX - 10;
    const miniH = 12;
    this.miniGfx = this.add.graphics();
    this.miniGfx.fillStyle(0x1b3252, 1);
    this.miniGfx.fillRect(miniX, miniY, miniW, miniH);
    this.miniGfx.lineStyle(1, 0x3a5a7a);
    this.miniGfx.strokeRect(miniX, miniY, miniW, miniH);
    // country segment ticks + tiny flags
    for (const band of RIGHT_BANK_BANDS) {
      const t0 = band.startY / WORLD_LENGTH;
      const t1 = band.endY / WORLD_LENGTH;
      const x0 = miniX + t0 * miniW;
      const x1 = miniX + t1 * miniW;
      // segment color shade
      this.miniGfx.fillStyle(0x243c5f, 1);
      this.miniGfx.fillRect(x0, miniY + 1, x1 - x0, miniH - 2);
      // tick
      this.miniGfx.fillStyle(0x6aa5e0, 1);
      this.miniGfx.fillRect(x0, miniY - 4, 1, miniH + 8);
      // tiny flag stripe above tick
      const flagG = this.add.graphics();
      drawFlag(flagG, band.country, x0 + 2, miniY - 10, 12, 8);
      this.miniFlags.push(flagG);
    }
    // end tick
    this.miniGfx.fillStyle(0x58d36a, 1);
    this.miniGfx.fillRect(miniX + miniW, miniY - 4, 1, miniH + 8);

    // Progress marker
    this.miniProgress = this.add.graphics();

    // Bottom bars: fuel and ship health
    const bottomH = 38;
    const bY = GAME_H - bottomH;
    g.fillStyle(0x05101f, 0.88);
    g.fillRect(0, bY, GAME_W, bottomH);
    g.fillStyle(0x2a4a6e, 1);
    g.fillRect(0, bY, GAME_W, 1);

    this.add.text(10, bY + 4, 'FUEL', { fontSize: '10px', color: '#8ea6c2', fontFamily: 'monospace' });
    this.add.text(10, bY + 20, 'SHIP', { fontSize: '10px', color: '#8ea6c2', fontFamily: 'monospace' });
    this.fuelBar = this.add.graphics();
    this.shipBar = this.add.graphics();

    // Tourist popup (center, below top bar)
    this.tourist = this.add.container(GAME_W / 2, 100).setAlpha(0);
    this.touristBg = this.add.rectangle(0, 0, 320, 46, 0x0b1a2e, 0.9).setStrokeStyle(2, 0xffcc33);
    this.touristName = this.add.text(0, -10, '', {
      fontSize: '14px', fontStyle: 'bold', color: '#ffe680', fontFamily: 'monospace', align: 'center',
    }).setOrigin(0.5);
    this.touristHint = this.add.text(0, 10, '', {
      fontSize: '11px', color: '#cfe0f0', fontFamily: 'monospace', align: 'center',
    }).setOrigin(0.5);
    this.tourist.add([this.touristBg, this.touristName, this.touristHint]);

    // Listen to GameScene events
    const gs = this.scene.get('Game');
    gs.events.on('hud:update', this.onUpdate, this);
    gs.events.on('hud:country', this.onCountry, this);
    gs.events.on('hud:tourist', this.onTourist, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      gs.events.off('hud:update', this.onUpdate, this);
      gs.events.off('hud:country', this.onCountry, this);
      gs.events.off('hud:tourist', this.onTourist, this);
    });

    this.drawFuelBar(FUEL_MAX);
    this.drawShipBar(SHIP_MAX_HEALTH);
    this.updateLives(PLAYER_MAX_LIVES);
    this.onCountry({ code: 'KW' });

    // Pause button
    const pauseBtn = this.add.text(GAME_W - 10, GAME_H - 18, 'II', {
      fontSize: '16px', color: '#8ea6c2', fontFamily: 'monospace',
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    pauseBtn.on('pointerup', () => this.togglePause());
    this.input.keyboard?.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard?.on('keydown-P', () => this.togglePause());
  }

  private paused = false;
  private pausedOverlay?: Phaser.GameObjects.Container;
  private togglePause() {
    this.paused = !this.paused;
    const game = this.scene.get('Game');
    if (this.paused) {
      game.scene.pause();
      const c = this.add.container(GAME_W / 2, GAME_H / 2);
      const r = this.add.rectangle(0, 0, 260, 80, 0x05101f, 0.92).setStrokeStyle(2, 0x2a4a6e);
      const t = this.add.text(0, 0, 'PAUSED\ntap/press to resume', {
        fontSize: '16px', color: '#e6eef8', fontFamily: 'monospace', align: 'center',
      }).setOrigin(0.5);
      c.add([r, t]);
      this.pausedOverlay = c;
    } else {
      game.scene.resume();
      this.pausedOverlay?.destroy();
      this.pausedOverlay = undefined;
    }
  }

  private onUpdate = (d: { lives: number; shipHealth: number; fuel: number; score: number; worldY: number; stageIndex: number }) => {
    if (d.lives !== this.lastLives) { this.updateLives(d.lives); this.lastLives = d.lives; }
    if (Math.abs(d.fuel - this.lastFuel) > 0.3) { this.drawFuelBar(d.fuel); this.lastFuel = d.fuel; }
    if (d.shipHealth !== this.lastShipHp) { this.drawShipBar(d.shipHealth); this.lastShipHp = d.shipHealth; }
    this.scoreText.setText(`SCORE ${d.score}`);
    // progress marker
    this.miniProgress.clear();
    const miniX = 110;
    const miniW = GAME_W - miniX - 10;
    const miniY = 40;
    const t = Math.max(0, Math.min(1, d.worldY / WORLD_LENGTH));
    const px = miniX + t * miniW;
    this.miniProgress.fillStyle(0xffe680, 1);
    this.miniProgress.fillTriangle(px, miniY + 12, px - 4, miniY + 20, px + 4, miniY + 20);
    this.miniProgress.fillStyle(0xffffff, 1);
    this.miniProgress.fillRect(px - 1, miniY, 2, 12);
  };

  private onCountry = (d: { code: CountryCode }) => {
    const c = COUNTRIES[d.code];
    this.countryLabel.setText(c.name);
    this.countryFlag.clear();
    drawFlag(this.countryFlag, d.code, 0, 0, 32, 20);
  };

  private onTourist = (d: { name: string; hint?: string }) => {
    this.touristName.setText(d.name);
    this.touristHint.setText(d.hint ?? '');
    this.tourist.setAlpha(0);
    this.tweens.killTweensOf(this.tourist);
    this.tweens.add({ targets: this.tourist, alpha: 1, duration: 200 });
    this.tweens.add({ targets: this.tourist, alpha: 0, delay: 2400, duration: 500 });
  };

  private drawFuelBar(fuel: number) {
    const g = this.fuelBar;
    g.clear();
    const bX = 56, bY = GAME_H - 34, bW = GAME_W - 66, bH = 10;
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(bX, bY, bW, bH);
    const pct = Math.max(0, Math.min(1, fuel / FUEL_MAX));
    const color = pct > 0.4 ? 0xff9a2e : pct > 0.2 ? 0xffcc33 : 0xff4a4a;
    g.fillStyle(color, 1);
    g.fillRect(bX, bY, bW * pct, bH);
    g.lineStyle(1, 0x2a4a6e);
    g.strokeRect(bX, bY, bW, bH);
  }

  private drawShipBar(hp: number) {
    const g = this.shipBar;
    g.clear();
    const bX = 56, bY = GAME_H - 18, bW = GAME_W - 66, bH = 10;
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(bX, bY, bW, bH);
    const pct = Math.max(0, Math.min(1, hp / SHIP_MAX_HEALTH));
    const color = pct > 0.5 ? 0x58d36a : pct > 0.25 ? 0xffcc33 : 0xff4a4a;
    g.fillStyle(color, 1);
    g.fillRect(bX, bY, bW * pct, bH);
    g.lineStyle(1, 0x2a4a6e);
    g.strokeRect(bX, bY, bW, bH);
  }

  private updateLives(n: number) {
    this.livesText.setText(`LIVES ${'\u2708'.repeat(Math.max(0, n))}`);
  }

}
