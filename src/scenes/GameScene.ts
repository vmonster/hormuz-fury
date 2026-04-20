import * as Phaser from 'phaser';
import {
  GAME_W, GAME_H, COLORS, WORLD_LENGTH, BASE_SCROLL_SPEED,
  PLAYER_MAX_LIVES, SHIP_MAX_HEALTH, FUEL_MAX, FUEL_DRAIN_PER_SEC,
  COUNTRIES,
} from '../game/constants';
import type { CountryCode } from '../game/constants';
import { sampleCorridor, STAGES, stageForY, LANDMARK_PLACEMENTS, RIGHT_BANK_BANDS, LEFT_BANK_BAND, coastOffset } from '../data/route';
import { LANDMARKS } from '../game/landmarks';
import type { LandmarkKind } from '../game/landmarks';
import { GameInput } from '../game/input';
import { sfx } from '../game/sfx';
import { loadSave, updateSave } from '../game/storage';
import { drawFlag } from '../game/flags';

type EnemyKind = 'speedboat' | 'heli' | 'jet' | 'mine';

interface Enemy {
  sprite: Phaser.GameObjects.Image;
  kind: EnemyKind;
  worldY: number;
  baseX: number;
  /** -1 facing south (toward player), +1 facing north (away). */
  vy: number;
  vx: number;
  drift?: number; // heli swing amplitude
  alive: boolean;
  hp: number;
  rotor?: Phaser.GameObjects.Image; // helicopter rotor (spins)
  wash?: Phaser.GameObjects.Image; // ground-wash under helicopter
}

interface Bullet {
  sprite: Phaser.GameObjects.Image;
  worldY: number;
  x: number;
  alive: boolean;
}

interface ShoreMissileWarn {
  reticle: Phaser.GameObjects.Image;
  worldY: number;
  x: number;
  fireAt: number;
  fromLeft: boolean;
}

interface Pickup {
  sprite: Phaser.GameObjects.Image;
  kind: 'fuel' | 'repair';
  worldY: number;
  x: number;
  taken: boolean;
}

interface LandmarkSprite {
  placement: typeof LANDMARK_PLACEMENTS[number];
  gfx: Phaser.GameObjects.Graphics;
  label: Phaser.GameObjects.Text;
  announced: boolean;
}

const LANDMARK_SCALE = 1.5;

export class GameScene extends Phaser.Scene {
  private input2!: GameInput;

  // World/camera
  private playerWorldY = 0; // position of player along world
  private scrollSpeed = BASE_SCROLL_SPEED;

  // Entities
  private plane!: Phaser.GameObjects.Image;
  private ship!: Phaser.GameObjects.Image;
  private shipWorldY = 0; // trails behind player
  private playerScreenOffset = GAME_H - 200;

  private bullets: Bullet[] = [];
  private enemyBullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private pickups: Pickup[] = [];
  private warnings: ShoreMissileWarn[] = [];
  private landmarkSprites: LandmarkSprite[] = [];

  // Layers
  private bgLayer!: Phaser.GameObjects.Graphics; // water + coastline
  private labelLayer!: Phaser.GameObjects.Container; // vertical country labels
  private landmarkLayer!: Phaser.GameObjects.Container;
  private entityLayer!: Phaser.GameObjects.Container;
  private fxLayer!: Phaser.GameObjects.Container;
  private tintOverlay!: Phaser.GameObjects.Rectangle; // day/night tint per stage

  private planeShadow!: Phaser.GameObjects.Image;
  private shipShadow!: Phaser.GameObjects.Image;

  // State
  private lives = PLAYER_MAX_LIVES;
  private shipHealth = SHIP_MAX_HEALTH;
  private fuel = FUEL_MAX;
  private score = 0;
  private invulnerableUntil = 0;
  private respawnPending = false;
  private lastFireTime = 0;
  private lastEnemySpawnY = 0;
  private lastPickupSpawnY = 0;
  private lastShoreMissileY = 0;
  private planeWasOverLand = false;

  private stageIndex = 0;
  private shownCountry: string | null = null;

  private gameOverFired = false;
  private wonFired = false;

  constructor() { super('Game'); }

  init(data: { stageIndex?: number }) {
    this.stageIndex = Math.max(0, Math.min(STAGES.length - 1, data.stageIndex ?? 0));
    const stage = STAGES[this.stageIndex];
    this.playerWorldY = stage.startY;
    this.shipWorldY = stage.startY - 70; // ship trails behind plane
    this.lives = PLAYER_MAX_LIVES;
    this.shipHealth = SHIP_MAX_HEALTH;
    this.fuel = FUEL_MAX;
    this.score = 0;
    this.invulnerableUntil = 0;
    this.respawnPending = false;
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.pickups = [];
    this.warnings = [];
    this.landmarkSprites = [];
    this.countryLabels = [];
    this.shownCountry = null;
    this.gameOverFired = false;
    this.wonFired = false;
    this.lastFireTime = 0;
    this.lastEnemySpawnY = this.playerWorldY;
    this.lastPickupSpawnY = this.playerWorldY;
    this.lastShoreMissileY = this.playerWorldY;
  }

  create() {
    this.input2 = new GameInput(this);
    const save = loadSave();
    this.scrollSpeed = BASE_SCROLL_SPEED * save.speedMultiplier;

    this.bgLayer = this.add.graphics();
    this.labelLayer = this.add.container(0, 0);
    this.landmarkLayer = this.add.container(0, 0);
    this.entityLayer = this.add.container(0, 0);
    this.fxLayer = this.add.container(0, 0);

    // Shadows (depth below ship/plane)
    this.shipShadow = this.add.image(GAME_W / 2 + 12, this.worldToScreenY(this.shipWorldY) + 8, 'ship_shadow');
    this.shipShadow.setDepth(4);
    this.entityLayer.add(this.shipShadow);

    this.planeShadow = this.add.image(GAME_W / 2 + 10, this.playerScreenOffset + 14, 'plane_shadow');
    this.planeShadow.setDepth(9);
    this.entityLayer.add(this.planeShadow);

    // Player + escort
    this.ship = this.add.image(GAME_W / 2, this.worldToScreenY(this.shipWorldY), 'ship');
    this.ship.setDepth(5);
    this.entityLayer.add(this.ship);

    this.plane = this.add.image(GAME_W / 2, this.playerScreenOffset, 'plane');
    this.plane.setDepth(10);
    this.entityLayer.add(this.plane);

    // Day/night tint overlay (per stage)
    this.tintOverlay = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x000000, 0);
    this.tintOverlay.setDepth(98);
    this.applyStageTint();

    // Stage banner
    this.showBanner(STAGES[this.stageIndex].banner);
    sfx.play('stage');

    // Notify HUD
    this.emitHudUpdate();

    // Broadcast when HUD-related events occur
    this.events.on('shutdown', () => this.input2 && this.input.removeAllListeners());
  }

  // ------------------------------------------------------------
  update(_time: number, deltaMs: number) {
    if (this.gameOverFired) return;
    const dt = deltaMs / 1000;

    // Scroll world: player advances (worldY increases)
    const boost = this.input2.isBoosting() ? 1.5 : 1;
    const axis = this.input2.axis();
    // vertical axis speeds up / slows down the scroll slightly
    const accel = 1 + (-axis.y) * 0.25; // pushing up accelerates, down decelerates
    const speed = this.scrollSpeed * boost * accel;
    if (!this.respawnPending) this.playerWorldY += speed * dt;
    if (this.playerWorldY > WORLD_LENGTH) this.playerWorldY = WORLD_LENGTH;

    // Ship follows with easing, trailing ~70 world-units behind plane
    // (shows the ship just below and behind the plane on screen).
    const targetShipY = this.playerWorldY - 70;
    this.shipWorldY += (targetShipY - this.shipWorldY) * Math.min(1, dt * 1.6);

    // Fuel
    this.fuel -= FUEL_DRAIN_PER_SEC * dt;
    if (this.fuel <= 0) {
      this.fuel = 0;
      this.loseLife('Out of fuel!');
    }

    // Horizontal steering
    const corridor = sampleCorridor(this.playerWorldY);
    const planeSpeed = 220;
    let planeX = this.plane.x + axis.x * planeSpeed * dt;
    // Clamp so plane can't leave screen
    planeX = Phaser.Math.Clamp(planeX, 14, GAME_W - 14);
    if (!this.respawnPending) this.plane.x = planeX;

    // Over-land check: plane can fly over land freely, but the unescorted ship
    // loses health at 3 HP/sec while the player is not above water.
    const corridorLeft = corridor.centerX - corridor.halfWidth;
    const corridorRight = corridor.centerX + corridor.halfWidth;
    const planeOverLand = planeX < corridorLeft || planeX > corridorRight;
    if (planeOverLand && !this.respawnPending) {
      this.damageShip(3 * dt);
      if (!this.planeWasOverLand) {
        this.scene.get('HUD').events.emit('hud:tourist', { name: '⚠ SHIP UNESCORTED', hint: 'Return to water!' });
      }
    }
    this.planeWasOverLand = planeOverLand;

    // Escort ship follows plane X with easing (trails ~140px below on screen),
    // but is clamped to its own water corridor — it hugs the near bank when
    // the plane flies over land, and never leaves the water.
    const shipCorr = sampleCorridor(this.shipWorldY);
    const shipMargin = 12;
    const shipMinX = shipCorr.centerX - shipCorr.halfWidth + shipMargin;
    const shipMaxX = shipCorr.centerX + shipCorr.halfWidth - shipMargin;
    const shipTargetX = Phaser.Math.Clamp(this.plane.x, shipMinX, shipMaxX);
    this.ship.x += (shipTargetX - this.ship.x) * Math.min(1, dt * 2.2);
    this.ship.y = this.worldToScreenY(this.shipWorldY);

    // Shadows
    this.planeShadow.x = this.plane.x + 10;
    this.planeShadow.y = this.plane.y + 14;
    this.planeShadow.setRotation(this.plane.rotation);
    this.shipShadow.x = this.ship.x + 12;
    this.shipShadow.y = this.ship.y + 8;

    // Plane banking
    const bankTarget = axis.x * 0.18;
    this.plane.rotation += (bankTarget - this.plane.rotation) * Math.min(1, dt * 6);
    const bankMag = Math.abs(this.plane.rotation);
    if (bankMag > 0.04) {
      const key = this.plane.rotation < 0 ? 'plane_left' : 'plane_right';
      if (this.plane.texture.key !== key) this.plane.setTexture(key);
    } else if (this.plane.texture.key !== 'plane') {
      this.plane.setTexture('plane');
    }

    // Render background, coastline, labels
    this.renderWorld(corridor);
    // Spawn enemies + pickups + shore missiles as we advance
    this.handleSpawns();

    // Update + render entities
    this.updateBullets(dt);
    this.updateEnemies(dt);
    this.updateEnemyBullets(dt);
    this.updatePickups();
    this.updateWarnings();
    this.updateLandmarks();

    // Firing
    if (this.input2.isFiring() && !this.respawnPending) this.tryFire();

    // Collisions
    this.checkCollisions();

    // Stage transitions
    const stage = stageForY(this.playerWorldY);
    if (stage.index !== this.stageIndex) {
      this.stageIndex = stage.index;
      updateSave({ lastCompletedStage: stage.index - 1 });
      this.showBanner(stage.banner);
      sfx.play('stage');
      this.tweens.add({
        targets: this.tintOverlay,
        alpha: 0,
        duration: 300,
        onComplete: () => this.applyStageTint(),
      });
    }

    // Country popup
    this.updateCountryPopup(corridor);

    // Win check
    if (this.playerWorldY >= WORLD_LENGTH - 40 && !this.wonFired) {
      this.wonFired = true;
      this.winGame();
    }

    this.emitHudUpdate();
  }

  // ------------------------------------------------------------
  private worldToScreenY(worldY: number): number {
    // player is always at playerScreenOffset. Items at worldY > playerWorldY appear
    // below player (farther behind), items at worldY < playerWorldY appear above.
    const delta = worldY - this.playerWorldY;
    return this.playerScreenOffset - delta;
  }

  private screenYToWorld(screenY: number): number {
    return this.playerWorldY + (this.playerScreenOffset - screenY);
  }

  // ------------------------------------------------------------
  private renderWorld(_corridor: ReturnType<typeof sampleCorridor>) {
    const g = this.bgLayer;
    g.clear();

    // Flat water fill — no stripes, no highlights
    g.fillStyle(COLORS.water, 1);
    g.fillRect(0, 0, GAME_W, GAME_H);

    // Render coastline: sample corridor at many screen-Y points with deterministic
    // noise so the banks have bays and small headlands (low-relief Gulf coast).
    const samples = 96;
    const left: { x: number; y: number }[] = [];
    const right: { x: number; y: number }[] = [];
    for (let i = 0; i <= samples; i++) {
      const sy = (i / samples) * GAME_H;
      const wy = this.screenYToWorld(sy);
      const s = sampleCorridor(wy);
      // coastOffset is positive toward the water; subtract on left bank, add on right bank.
      const lx = s.centerX - s.halfWidth - coastOffset(wy, -1);
      const rx = s.centerX + s.halfWidth + coastOffset(wy, 1);
      left.push({ x: lx, y: sy });
      right.push({ x: rx, y: sy });
    }

    // Left bank polygon
    g.fillStyle(COLORS.land, 1);
    g.beginPath();
    g.moveTo(0, 0);
    for (const p of left) g.lineTo(p.x, p.y);
    g.lineTo(0, GAME_H);
    g.closePath();
    g.fillPath();

    // Right bank
    g.beginPath();
    g.moveTo(GAME_W, 0);
    for (const p of right) g.lineTo(p.x, p.y);
    g.lineTo(GAME_W, GAME_H);
    g.closePath();
    g.fillPath();

    // Subtle shore edge (darker line so the coast reads as land meeting water)
    g.lineStyle(1, COLORS.landShore, 1);
    g.beginPath();
    g.moveTo(left[0].x, left[0].y);
    for (const p of left) g.lineTo(p.x, p.y);
    g.strokePath();
    g.beginPath();
    g.moveTo(right[0].x, right[0].y);
    for (const p of right) g.lineTo(p.x, p.y);
    g.strokePath();

    // Sparse inland detail specks (rocks / scrub) — deterministic by worldY so they don't flicker.
    g.fillStyle(COLORS.landDark, 0.6);
    const spanMin = this.screenYToWorld(GAME_H);
    const spanMax = this.screenYToWorld(0);
    const stepY = 24;
    for (let wy = Math.floor(spanMin / stepY) * stepY; wy <= spanMax; wy += stepY) {
      const sy = this.worldToScreenY(wy);
      if (sy < -4 || sy > GAME_H + 4) continue;
      const s = sampleCorridor(wy);
      // Pseudo-random but stable: hash worldY → two speck offsets per side.
      const h = (wy * 2654435761) >>> 0;
      // Left bank spec
      if ((h & 3) !== 0) {
        const leftEdge = s.centerX - s.halfWidth - coastOffset(wy, -1);
        const dx = ((h >>> 4) % 40) + 6;
        const x = leftEdge - dx;
        if (x > 6) g.fillRect(x, sy, 2, 1);
      }
      // Right bank spec
      if ((h & 12) !== 0) {
        const rightEdge = s.centerX + s.halfWidth + coastOffset(wy, 1);
        const dx = ((h >>> 10) % 40) + 6;
        const x = rightEdge + dx;
        if (x < GAME_W - 6) g.fillRect(x, sy, 2, 1);
      }
    }

    // Country vertical labels on banks
    this.renderCountryLabels(left, right);

    // Escort ship wake
    if (this.ship) {
      g.fillStyle(0xe0ecf6, 0.45);
      for (let i = 0; i < 5; i++) {
        const wy = this.ship.y + 18 + i * 6;
        if (wy < GAME_H) g.fillRect(this.ship.x - 4 + (i % 2) * 2, wy, 2, 2);
      }
    }
  }

  private countryLabels: Phaser.GameObjects.Container[] = [];
  private renderCountryLabels(_leftPoly: { x: number; y: number }[], _rightPoly: { x: number; y: number }[]) {
    this.countryLabels.forEach(c => c.setVisible(false));
    let used = 0;
    const getLabel = () => {
      if (used < this.countryLabels.length) {
        const c = this.countryLabels[used++];
        c.setVisible(true);
        return c;
      }
      const gfx = this.add.graphics();
      const txt = this.add.text(0, 0, '', {
        fontSize: '13px', fontStyle: 'bold',
        color: '#4a3a1a', fontFamily: 'monospace',
      }).setOrigin(0, 0.5);
      const c = this.add.container(0, 0, [gfx, txt]);
      this.labelLayer.add(c);
      this.countryLabels.push(c);
      used++;
      return c;
    };

    const placeLabel = (code: CountryCode, bankX: number, screenY: number) => {
      const container = getLabel();
      const gfx = container.list[0] as Phaser.GameObjects.Graphics;
      const txt = container.list[1] as Phaser.GameObjects.Text;
      txt.setText(COUNTRIES[code].name);
      const flagW = 20, flagH = 13, gap = 5;
      const nameW = txt.width;
      const total = flagW + gap + nameW;
      const startX = -total / 2;
      gfx.clear();
      drawFlag(gfx, code, startX, -flagH / 2, flagW, flagH);
      txt.setPosition(startX + flagW + gap, 0);
      container.setPosition(bankX, screenY);
      container.setRotation(-Math.PI / 2);
    };

    // Labels slide every ~700px so at least one is always on-screen (GAME_H=800)
    const minY = this.screenYToWorld(GAME_H + 60);
    const maxY = this.screenYToWorld(-60);
    const step = 700;

    // Right bank (Arab coast) — one label per band, picking the visible step nearest band mid
    for (const band of RIGHT_BANK_BANDS) {
      const from = Math.max(band.startY, Math.floor(minY / step) * step);
      for (let y = from; y <= Math.min(maxY, band.endY); y += step) {
        if (y < band.startY || y > band.endY) continue;
        const screenY = this.worldToScreenY(y);
        if (screenY < -60 || screenY > GAME_H + 60) continue;
        const s = sampleCorridor(y);
        const bankX = Math.min(GAME_W - 18, s.centerX + s.halfWidth + 28);
        placeLabel(band.country, bankX, screenY);
      }
    }

    // Left bank (Iran spans entire Gulf)
    {
      const b = LEFT_BANK_BAND;
      for (let y = Math.floor(minY / step) * step; y <= maxY; y += step) {
        if (y < b.startY || y > b.endY) continue;
        const screenY = this.worldToScreenY(y);
        if (screenY < -60 || screenY > GAME_H + 60) continue;
        const s = sampleCorridor(y);
        const bankX = Math.max(18, s.centerX - s.halfWidth - 28);
        placeLabel(b.country, bankX, screenY);
      }
    }
  }

  // ------------------------------------------------------------
  private handleSpawns() {
    // Enemies: spawn when player has advanced past last spawn by some delta
    const delta = this.playerWorldY - this.lastEnemySpawnY;
    // Spawn frequency scales up per stage
    const spawnEvery = [140, 110, 85][this.stageIndex] ?? 100;
    if (delta >= spawnEvery) {
      this.lastEnemySpawnY = this.playerWorldY;
      this.spawnEnemy();
    }

    // Pickups
    const pdelta = this.playerWorldY - this.lastPickupSpawnY;
    const pickupEvery = 400;
    if (pdelta >= pickupEvery) {
      this.lastPickupSpawnY = this.playerWorldY;
      this.spawnPickup();
    }

    // Shore missiles (pre-warn)
    const mdelta = this.playerWorldY - this.lastShoreMissileY;
    const missileEvery = [999999, 600, 380][this.stageIndex] ?? 500;
    if (mdelta >= missileEvery) {
      this.lastShoreMissileY = this.playerWorldY;
      this.spawnShoreMissileWarning();
    }
  }

  private spawnEnemy() {
    const spawnWorldY = this.playerWorldY + GAME_H - this.playerScreenOffset + 40; // just below bottom? Actually top of screen.
    // Actually enemies appear at TOP of screen (worldY = screenYToWorld(0-ish))
    const topWorldY = this.screenYToWorld(-30);
    const corr = sampleCorridor(topWorldY);
    const kinds: EnemyKind[] = this.stageIndex === 0
      ? ['speedboat', 'speedboat', 'heli', 'mine']
      : this.stageIndex === 1
        ? ['speedboat', 'heli', 'jet', 'mine', 'speedboat']
        : ['jet', 'heli', 'mine', 'mine', 'speedboat'];
    const kind = Phaser.Utils.Array.GetRandom(kinds);
    const x = Phaser.Math.Between(
      Math.floor(corr.centerX - corr.halfWidth + 20),
      Math.floor(corr.centerX + corr.halfWidth - 20),
    );
    const texKey = kind === 'speedboat' ? 'speedboat' : kind === 'heli' ? 'heli' : kind === 'jet' ? 'jet' : 'mine';
    const sprite = this.add.image(x, this.worldToScreenY(topWorldY), texKey);
    sprite.setDepth(6);
    this.entityLayer.add(sprite);
    // Orient so sprite faces south (toward player) — bases drawn pointing up, so flip 180 for boats/jets facing us
    if (kind === 'speedboat' || kind === 'jet') sprite.setRotation(Math.PI);

    const enemy: Enemy = {
      sprite, kind, worldY: topWorldY, baseX: x,
      vy: 0, vx: 0, alive: true,
      hp: kind === 'heli' ? 2 : kind === 'jet' ? 2 : kind === 'mine' ? 1 : 1,
    };
    switch (kind) {
      case 'speedboat': enemy.vy = -20; break; // drifts slowly toward player
      case 'heli':      enemy.vy = -10; enemy.drift = 80; break;
      case 'jet':       enemy.vy = -140; break; // fast dive
      case 'mine':      enemy.vy = 0; break;    // static (relative to world)
      default:          enemy.vy = 0;
    }
    if (kind === 'heli') {
      // Attach rotor blur + ground wash
      const wash = this.add.image(x, sprite.y + 6, 'rotor_wash');
      wash.setDepth(3);
      this.entityLayer.add(wash);
      enemy.wash = wash;
      const rotor = this.add.image(x + 4, sprite.y - 8, 'heli_rotor');
      rotor.setDepth(7);
      this.entityLayer.add(rotor);
      enemy.rotor = rotor;
    }
    void spawnWorldY;
    this.enemies.push(enemy);
  }

  private spawnPickup() {
    const topWorldY = this.screenYToWorld(-30);
    const corr = sampleCorridor(topWorldY);
    // 65% fuel, 35% repair
    const kind: 'fuel' | 'repair' = Math.random() < 0.65 ? 'fuel' : 'repair';
    const x = Phaser.Math.Between(
      Math.floor(corr.centerX - corr.halfWidth + 24),
      Math.floor(corr.centerX + corr.halfWidth - 24),
    );
    const texKey = kind === 'fuel' ? 'fuel' : 'repair';
    const sprite = this.add.image(x, this.worldToScreenY(topWorldY), texKey);
    sprite.setDepth(4);
    this.entityLayer.add(sprite);
    this.pickups.push({ sprite, kind, worldY: topWorldY, x, taken: false });
  }

  private spawnShoreMissileWarning() {
    const topWorldY = this.screenYToWorld(-30);
    // Pick which shore to fire from
    const fromLeft = Math.random() < 0.5;
    const corr = sampleCorridor(topWorldY);
    const shoreX = fromLeft ? corr.centerX - corr.halfWidth + 4 : corr.centerX + corr.halfWidth - 4;
    const warnY = this.worldToScreenY(topWorldY);
    // target position: plane's current corridor center ± random
    const targetX = Phaser.Math.Clamp(
      this.plane.x + Phaser.Math.Between(-40, 40),
      corr.centerX - corr.halfWidth + 10,
      corr.centerX + corr.halfWidth - 10,
    );
    const reticle = this.add.image(targetX, warnY + 200, 'reticle');
    reticle.setDepth(12);
    reticle.setAlpha(0.9);
    this.tweens.add({ targets: reticle, alpha: 0.3, duration: 200, yoyo: true, repeat: -1 });
    this.fxLayer.add(reticle);
    sfx.play('alarm');
    this.warnings.push({
      reticle,
      worldY: this.screenYToWorld(warnY + 200),
      x: targetX,
      fireAt: this.time.now + 900,
      fromLeft,
    });
    void shoreX;
  }

  // ------------------------------------------------------------
  private updateEnemies(dt: number) {
    for (const e of this.enemies) {
      if (!e.alive) continue;
      // Move in world coordinates. vy is "world-y per second" (negative = toward lower worldY, but player advances positive Y...
      // Reframe: we want enemies to move toward the player (screen-down). Player screen is fixed. As playerWorldY increases, enemy's screen-Y goes DOWN if its own worldY also increases at the same rate. To make enemy appear to move down on screen, enemy.worldY should increase slower than player.
      // vy here: delta worldY per second. Set negative vy means worldY decreases so screen-y increases faster (enemy comes toward us).
      e.worldY += e.vy * dt;
      if (e.kind === 'heli' && e.drift) {
        e.sprite.x = e.baseX + Math.sin(this.time.now * 0.003) * e.drift;
      } else {
        e.sprite.x = e.baseX + (e.vx * dt);
      }
      e.sprite.y = this.worldToScreenY(e.worldY);
      // Rotor + wash for heli
      if (e.kind === 'heli') {
        // Face heading: cos(t) > 0 means drifting right, otherwise left
        const facingRight = Math.cos(this.time.now * 0.003) >= 0;
        e.sprite.setFlipX(!facingRight);
        if (e.rotor) {
          e.rotor.x = e.sprite.x + (facingRight ? 4 : -4);
          e.rotor.y = e.sprite.y - 8;
          e.rotor.rotation = this.time.now * 0.05;
        }
        if (e.wash) {
          e.wash.x = e.sprite.x;
          e.wash.y = e.sprite.y + 6;
          e.wash.setAlpha(0.55 + 0.25 * Math.sin(this.time.now * 0.01));
        }
      }
      // cull off-screen bottom
      if (e.sprite.y > GAME_H + 40 || e.worldY < this.playerWorldY - 200) {
        e.alive = false;
        e.sprite.destroy();
        e.rotor?.destroy();
        e.wash?.destroy();
      }
      // Enemy shoots occasionally (heli, jet)
      if ((e.kind === 'heli' || e.kind === 'jet') && Math.random() < 0.006) {
        this.spawnEnemyBullet(e.sprite.x, e.sprite.y + 8);
      }
    }
    this.enemies = this.enemies.filter(e => e.alive);
  }

  private tryFire() {
    const now = this.time.now;
    if (now - this.lastFireTime < 140) return;
    this.lastFireTime = now;
    const x = this.plane.x;
    const y = this.plane.y - 20;
    const sprite = this.add.image(x, y, 'bullet');
    sprite.setDepth(9);
    this.entityLayer.add(sprite);
    this.bullets.push({ sprite, worldY: this.screenYToWorld(y), x, alive: true });
    this.muzzleFlash(x, y + 4);
    sfx.play('shoot');
  }

  private updateBullets(dt: number) {
    for (const b of this.bullets) {
      if (!b.alive) continue;
      // bullets move up screen quickly: increase worldY faster than player
      b.worldY += (this.scrollSpeed + 400) * dt;
      b.sprite.y = this.worldToScreenY(b.worldY);
      if (b.sprite.y < -20) {
        b.alive = false;
        b.sprite.destroy();
      }
    }
    this.bullets = this.bullets.filter(b => b.alive);
  }

  private spawnEnemyBullet(x: number, y: number) {
    const sprite = this.add.image(x, y, 'missile');
    sprite.setDepth(8);
    this.entityLayer.add(sprite);
    this.enemyBullets.push({ sprite, worldY: this.screenYToWorld(y), x, alive: true });
  }

  private updateEnemyBullets(dt: number) {
    for (const b of this.enemyBullets) {
      if (!b.alive) continue;
      // Enemy bullets move toward plane (downward on screen)
      b.worldY -= (this.scrollSpeed + 180) * dt;
      b.sprite.y = this.worldToScreenY(b.worldY);
      if (b.sprite.y > GAME_H + 20) {
        b.alive = false;
        b.sprite.destroy();
      }
    }
    this.enemyBullets = this.enemyBullets.filter(b => b.alive);
  }

  private updatePickups() {
    for (const p of this.pickups) {
      if (p.taken) continue;
      p.sprite.y = this.worldToScreenY(p.worldY);
      if (p.sprite.y > GAME_H + 40) {
        p.taken = true;
        p.sprite.destroy();
      }
    }
    this.pickups = this.pickups.filter(p => !p.taken);
  }

  private updateWarnings() {
    const now = this.time.now;
    for (const w of this.warnings) {
      w.reticle.y = this.worldToScreenY(w.worldY);
      if (now >= w.fireAt) {
        // Fire: spawn a missile from shore toward reticle target
        const corr = sampleCorridor(w.worldY);
        const startX = w.fromLeft ? corr.centerX - corr.halfWidth + 4 : corr.centerX + corr.halfWidth - 4;
        const startY = this.worldToScreenY(w.worldY);
        const missile = this.add.image(startX, startY, 'missile');
        missile.setDepth(8);
        const angle = Phaser.Math.Angle.Between(startX, startY, w.x, startY);
        missile.setRotation(angle + Math.PI / 2);
        this.entityLayer.add(missile);
        const dx = w.x - startX;
        const speed = 180;
        this.enemyBullets.push({
          sprite: missile,
          worldY: this.screenYToWorld(startY),
          x: startX,
          alive: true,
        });
        // Give it horizontal motion via tween (override y-world tracking)
        this.tweens.add({
          targets: missile,
          x: w.x,
          duration: (Math.abs(dx) / speed) * 1000,
          onComplete: () => { /* bullet will cull normally */ },
        });
        // Immediately remove warning
        w.reticle.destroy();
        sfx.play('alarm');
        (w as any)._done = true;
      }
    }
    this.warnings = this.warnings.filter(w => !(w as any)._done);
  }

  // ------------------------------------------------------------
  private updateLandmarks() {
    // Lazily create landmark graphics as they come within range
    const visibleTopY = this.screenYToWorld(-200);
    const visibleBotY = this.screenYToWorld(GAME_H + 200);
    for (const p of LANDMARK_PLACEMENTS) {
      if (p.worldY < visibleBotY - 100 || p.worldY > visibleTopY + 100) continue;
      let existing = this.landmarkSprites.find(ls => ls.placement === p);
      if (!existing) {
        const def = LANDMARKS[p.kind as LandmarkKind];
        const gfx = this.add.graphics();
        def.draw(gfx);
        gfx.setDepth(3);
        gfx.setScale(LANDMARK_SCALE * (def.scale ?? 1));
        if (def.rotation) gfx.setRotation(def.rotation);
        this.landmarkLayer.add(gfx);
        const label = this.add.text(0, 0, def.name, {
          fontSize: '10px', fontStyle: 'bold',
          color: '#ffe680', fontFamily: 'monospace',
          stroke: '#05101f', strokeThickness: 3,
          align: 'center',
        }).setOrigin(0.5, 0).setDepth(4);
        this.landmarkLayer.add(label);
        existing = { placement: p, gfx, label, announced: false };
        this.landmarkSprites.push(existing);
      }
      // Position: compute world X and screen Y (accounting for scale and rotation).
      const def = LANDMARKS[p.kind as LandmarkKind];
      const sc = LANDMARK_SCALE * (def.scale ?? 1);
      const rot = def.rotation ?? 0;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      // Rotated bounding box of the scaled sprite
      const boxW = def.w * sc * Math.abs(cos) + def.h * sc * Math.abs(sin);
      const boxH = def.w * sc * Math.abs(sin) + def.h * sc * Math.abs(cos);
      // Min corner offsets from pivot (0,0) after rotation — used to shift pivot so
      // the bbox lands at the intended (boxLeft, boxTop).
      const cornersX = [0, cos * def.w * sc, -sin * def.h * sc, cos * def.w * sc - sin * def.h * sc];
      const cornersY = [0, sin * def.w * sc,  cos * def.h * sc, sin * def.w * sc + cos * def.h * sc];
      const bboxMinX = Math.min(...cornersX);
      const bboxMinY = Math.min(...cornersY);

      const s = sampleCorridor(p.worldY);
      let boxLeft: number;
      if (p.side === -1) {
        const leftEdge = s.centerX - s.halfWidth - coastOffset(p.worldY, -1);
        boxLeft = leftEdge - (p.offset ?? 0) - boxW;
      } else if (p.side === 1) {
        const rightEdge = s.centerX + s.halfWidth + coastOffset(p.worldY, 1);
        boxLeft = rightEdge + (p.offset ?? 0);
      } else {
        boxLeft = s.centerX + (p.waterX ?? 0) - boxW / 2;
      }
      const boxTop = this.worldToScreenY(p.worldY) - boxH;
      existing.gfx.x = boxLeft - bboxMinX;
      existing.gfx.y = boxTop - bboxMinY;

      // Name label sits just below the bbox, centered
      existing.label.setPosition(boxLeft + boxW / 2, boxTop + boxH + 2);

      // Tourist popup when the landmark center passes near the player screen pos
      const centerScreenY = boxTop + boxH / 2;
      if (!existing.announced && centerScreenY > 200 && centerScreenY < this.playerScreenOffset) {
        existing.announced = true;
        this.announceLandmark(def.name, def.hint);
      }
    }
    // cull passed landmarks (once fully below the screen)
    this.landmarkSprites = this.landmarkSprites.filter(ls => {
      const d = LANDMARKS[ls.placement.kind as LandmarkKind];
      const scCull = LANDMARK_SCALE * (d.scale ?? 1);
      const rotCull = d.rotation ?? 0;
      const cc = Math.cos(rotCull), ss = Math.sin(rotCull);
      const minY = Math.min(0, ss * d.w * scCull, cc * d.h * scCull, ss * d.w * scCull + cc * d.h * scCull);
      if (ls.gfx.y + minY > GAME_H + 60) {
        ls.gfx.destroy();
        ls.label.destroy();
        return false;
      }
      return true;
    });
  }

  private announceLandmark(name: string, hint?: string) {
    this.events.emit('hud:tourist', { name, hint });
  }

  private updateCountryPopup(corridor: ReturnType<typeof sampleCorridor>) {
    const rc = corridor.rightCountry;
    if (rc !== this.shownCountry) {
      this.shownCountry = rc;
      this.events.emit('hud:country', { code: rc });
    }
  }

  // ------------------------------------------------------------
  private checkCollisions() {
    if (this.respawnPending) return;
    // Player bullets vs enemies
    for (const b of this.bullets) {
      if (!b.alive) continue;
      for (const e of this.enemies) {
        if (!e.alive) continue;
        if (Math.abs(b.sprite.x - e.sprite.x) < 12 && Math.abs(b.sprite.y - e.sprite.y) < 12) {
          b.alive = false; b.sprite.destroy();
          e.hp--;
          if (e.hp <= 0) {
            e.alive = false;
            this.explodeAt(e.sprite.x, e.sprite.y, 1);
            e.sprite.destroy();
            e.rotor?.destroy();
            e.wash?.destroy();
            this.score += { speedboat: 50, heli: 100, jet: 150, mine: 30 }[e.kind];
            sfx.play('explosion');
          } else {
            this.hitFlash(e.sprite);
            sfx.play('hit');
          }
          break;
        }
      }
    }

    // Enemies vs plane — surface units (mines, speedboats) can't hit aircraft
    if (this.time.now > this.invulnerableUntil) {
      for (const e of this.enemies) {
        if (!e.alive) continue;
        if (e.kind === 'mine' || e.kind === 'speedboat') continue;
        if (Math.abs(e.sprite.x - this.plane.x) < 14 && Math.abs(e.sprite.y - this.plane.y) < 14) {
          e.alive = false;
          this.explodeAt(this.plane.x, this.plane.y);
          e.sprite.destroy();
          this.loseLife('Collision!');
          return;
        }
      }
      // Enemy bullets vs plane
      for (const b of this.enemyBullets) {
        if (!b.alive) continue;
        if (Math.abs(b.sprite.x - this.plane.x) < 10 && Math.abs(b.sprite.y - this.plane.y) < 12) {
          b.alive = false; b.sprite.destroy();
          this.explodeAt(this.plane.x, this.plane.y);
          this.loseLife('Hit!');
          return;
        }
      }
    }

    // Enemies + enemy bullets vs escort ship — aerial units (heli, jet) can't ram the ship
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (e.kind === 'heli' || e.kind === 'jet') continue;
      if (Math.abs(e.sprite.x - this.ship.x) < 16 && Math.abs(e.sprite.y - this.ship.y) < 30) {
        e.alive = false;
        this.explodeAt(this.ship.x, this.ship.y, 1.1);
        e.sprite.destroy();
        e.rotor?.destroy();
        e.wash?.destroy();
        this.hitFlash(this.ship);
        this.damageShip(18);
      }
    }
    for (const b of this.enemyBullets) {
      if (!b.alive) continue;
      if (Math.abs(b.sprite.x - this.ship.x) < 12 && Math.abs(b.sprite.y - this.ship.y) < 28) {
        b.alive = false; b.sprite.destroy();
        this.hitFlash(this.ship);
        this.damageShip(10);
      }
    }
// Player pickups
    for (const p of this.pickups) {
      if (p.taken) continue;
      if (Math.abs(p.sprite.x - this.plane.x) < 16 && Math.abs(p.sprite.y - this.plane.y) < 18) {
        p.taken = true;
        p.sprite.destroy();
        if (p.kind === 'fuel') {
          this.fuel = Math.min(FUEL_MAX, this.fuel + 45);
          sfx.play('pickup');
        } else {
          this.shipHealth = Math.min(SHIP_MAX_HEALTH, this.shipHealth + 35);
          sfx.play('repair');
        }
        this.score += 25;
      }
    }
  }

  private damageShip(amount: number) {
    this.shipHealth -= amount;
    if (this.shipHealth <= 0) {
      this.shipHealth = 0;
      if (!this.gameOverFired) {
        this.gameOverFired = true;
        sfx.play('explosion');
        this.explodeAt(this.ship.x, this.ship.y);
        this.time.delayedCall(800, () => this.gameOver('Escort ship destroyed!'));
      }
    }
  }

  private loseLife(reason: string) {
    if (this.respawnPending) return;
    this.lives--;
    sfx.play('explosion');
    this.respawnPending = true;
    this.plane.setVisible(false);
    this.planeShadow.setVisible(false);
    if (this.lives <= 0) {
      this.time.delayedCall(900, () => this.gameOver(reason));
      return;
    }
    // Respawn after short pause at corridor center, with invulnerability
    this.time.delayedCall(900, () => {
      const corr = sampleCorridor(this.playerWorldY);
      this.plane.setVisible(true);
      this.planeShadow.setVisible(true);
      this.plane.x = corr.centerX;
      this.fuel = Math.max(this.fuel, 60);
      this.invulnerableUntil = this.time.now + 1800;
      this.respawnPending = false;
      // blink
      this.tweens.add({
        targets: this.plane, alpha: 0.3, duration: 120, yoyo: true, repeat: 7,
        onComplete: () => this.plane.setAlpha(1),
      });
    });
  }

  private explodeAt(x: number, y: number, size = 1) {
    // Main explosion: play frames 1-4
    const core = this.add.image(x, y, 'explosion_1');
    core.setDepth(12);
    core.setScale(0.6 * size);
    this.fxLayer.add(core);
    const frames = ['explosion_1', 'explosion_2', 'explosion_3', 'explosion_4'];
    let idx = 0;
    const timer = this.time.addEvent({
      delay: 70,
      repeat: frames.length - 1,
      callback: () => {
        idx++;
        if (idx < frames.length) core.setTexture(frames[idx]);
        core.setScale((0.6 + idx * 0.3) * size);
      },
    });
    this.tweens.add({
      targets: core, alpha: 0, duration: 280, delay: 260,
      onComplete: () => { core.destroy(); timer.remove(); },
    });
    // Sparks for extra flair
    const sparks = Math.floor(8 * size);
    for (let i = 0; i < sparks; i++) {
      const s = this.add.image(x, y, 'spark');
      s.setDepth(13);
      this.fxLayer.add(s);
      const ang = Math.random() * Math.PI * 2;
      const dist = Phaser.Math.Between(18, 40) * size;
      this.tweens.add({
        targets: s,
        x: x + Math.cos(ang) * dist,
        y: y + Math.sin(ang) * dist,
        alpha: 0, scale: 0.3,
        duration: 420,
        onComplete: () => s.destroy(),
      });
    }
    // smoke drift
    for (let i = 0; i < 3 * size; i++) {
      const s = this.add.image(x, y, 'smoke');
      s.setDepth(11);
      s.setAlpha(0.7);
      this.fxLayer.add(s);
      this.tweens.add({
        targets: s,
        x: x + Phaser.Math.Between(-10, 10),
        y: y - Phaser.Math.Between(10, 30),
        alpha: 0, scale: 2.2,
        duration: 700,
        onComplete: () => s.destroy(),
      });
    }
  }

  private muzzleFlash(x: number, y: number) {
    const m = this.add.image(x, y, 'muzzle');
    m.setDepth(12);
    m.setScale(0.9);
    this.fxLayer.add(m);
    this.tweens.add({
      targets: m, alpha: 0, scale: 1.6, duration: 90,
      onComplete: () => m.destroy(),
    });
  }

  private hitFlash(target: Phaser.GameObjects.Image) {
    if (!target || !target.active) return;
    target.setTint(0xff5a5a);
    this.time.delayedCall(120, () => {
      if (target.active) target.clearTint();
    });
  }

  private applyStageTint() {
    const conf = [
      { color: 0xffaa55, alpha: 0.06 }, // Stage 0: warm morning haze
      { color: 0x000000, alpha: 0.00 }, // Stage 1: noon clear
      { color: 0x1a1f4a, alpha: 0.22 }, // Stage 2: dusk/night
    ][this.stageIndex] ?? { color: 0x000000, alpha: 0 };
    this.tintOverlay.fillColor = conf.color;
    this.tintOverlay.fillAlpha = conf.alpha;
  }

  private showBanner(text: string) {
    // Anchored near the top of the play area so it doesn't block the mid-screen
    // flight path. HUD top bar occupies ~56px, so place the banner just below it.
    const bannerY = 120;
    const rect = this.add.rectangle(GAME_W / 2, bannerY, GAME_W, 76, 0x05101f, 0.82);
    rect.setDepth(100);
    const t = this.add.text(GAME_W / 2, bannerY, text, {
      fontSize: '18px', fontStyle: 'bold', align: 'center',
      color: '#ffe680', stroke: '#05101f', strokeThickness: 4, fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(101);
    this.tweens.add({
      targets: [rect, t],
      alpha: 0,
      delay: 1400,
      duration: 400,
      onComplete: () => { rect.destroy(); t.destroy(); },
    });
  }

  private emitHudUpdate() {
    this.events.emit('hud:update', {
      lives: this.lives,
      shipHealth: this.shipHealth,
      fuel: this.fuel,
      score: this.score,
      worldY: this.playerWorldY,
      stageIndex: this.stageIndex,
    });
  }

  private gameOver(reason: string) {
    this.gameOverFired = true;
    const save = loadSave();
    if (this.score > save.highScore) updateSave({ highScore: this.score });
    this.scene.stop('HUD');
    this.scene.start('GameOver', { won: false, reason, score: this.score });
  }

  private winGame() {
    sfx.play('win');
    const save = loadSave();
    if (this.score > save.highScore) updateSave({ highScore: this.score });
    updateSave({ lastCompletedStage: STAGES.length - 1 });
    this.time.delayedCall(900, () => {
      this.scene.stop('HUD');
      this.scene.start('GameOver', { won: true, reason: 'Mission complete — Muscat reached!', score: this.score });
    });
  }
}
