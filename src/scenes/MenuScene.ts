import * as Phaser from 'phaser';
import { GAME_W, GAME_H, COLORS } from '../game/constants';
import { loadSave, updateSave } from '../game/storage';
import { STAGES } from '../data/route';
import { sfx } from '../game/sfx';

export class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const save = loadSave();

    // Background water
    const g = this.add.graphics();
    g.fillStyle(COLORS.water, 1);
    g.fillRect(0, 0, GAME_W, GAME_H);
    // subtle waves
    g.fillStyle(COLORS.waterHighlight, 0.4);
    for (let y = 40; y < GAME_H; y += 28) {
      for (let x = (y % 56) ? 0 : 20; x < GAME_W; x += 60) {
        g.fillRect(x, y, 14, 2);
      }
    }
    // a couple of drifting clouds
    this.add.image(GAME_W * 0.25, 60, 'cloud_m').setAlpha(0.7);
    this.add.image(GAME_W * 0.78, 92, 'cloud_s').setAlpha(0.7);
    this.add.image(GAME_W * 0.5, GAME_H - 120, 'cloud_l').setAlpha(0.55);
    this.add.image(GAME_W * 0.2, GAME_H - 180, 'sunglint').setAlpha(0.6);

    // ── TITLE ───────────────────────────────────────────────────────
    const cx = GAME_W / 2;

    // HORMUZ — shadow
    this.add.text(cx + 3, 47 + 3, 'HORMUZ', {
      fontSize: '64px', fontStyle: 'bold', color: '#000000', fontFamily: 'monospace',
    }).setOrigin(0.5).setAlpha(0.55);
    // HORMUZ — main
    const title = this.add.text(cx, 47, 'HORMUZ', {
      fontSize: '64px', fontStyle: 'bold',
      color: '#ff9900', stroke: '#5a2000', strokeThickness: 8, fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, alpha: { from: 0.88, to: 1.0 },
      yoyo: true, repeat: -1, duration: 1600, ease: 'Sine.easeInOut' });

    // FURY
    this.add.text(cx, 104, 'F U R Y', {
      fontSize: '26px', fontStyle: 'bold',
      color: '#ff4a3a', stroke: '#2a0500', strokeThickness: 5, fontFamily: 'monospace',
    }).setOrigin(0.5);

    // subtitle
    this.add.text(cx, 132, 'PERSIAN GULF ESCORT', {
      fontSize: '12px', color: '#6a8faa', fontFamily: 'monospace',
    }).setOrigin(0.5);
    // ── END TITLE ───────────────────────────────────────────────────

    // Plane sprite (big)
    const plane = this.add.image(GAME_W / 2, 205, 'plane').setScale(2.2);
    this.tweens.add({ targets: plane, y: 211, yoyo: true, repeat: -1, duration: 1400, ease: 'Sine.easeInOut' });

    // Hint
    this.add.text(GAME_W / 2, 294,
      'Escort your cargo ship\nKUWAIT → QATAR → DUBAI → MUSCAT',
      { fontSize: '13px', color: '#cfe0f0', align: 'center', fontFamily: 'monospace' },
    ).setOrigin(0.5);

    // Stage selector — 3 buttons
    const selY = 358;
    this.add.text(GAME_W / 2, selY - 22, 'SELECT STAGE', {
      fontSize: '12px', color: '#8ea6c2', fontFamily: 'monospace',
    }).setOrigin(0.5);
    const stageLabels = ['STAGE 1\nKUWAIT', 'STAGE 2\nDUBAI', 'STAGE 3\nMUSCAT'];
    STAGES.forEach((stage, i) => {
      const x = GAME_W / 2 + (i - 1) * 130;
      const locked = false; // TEMP: all stages unlocked for testing (restore: i > save.lastCompletedStage + 1)
      const bg = this.add.rectangle(x, selY + 20, 118, 60, locked ? 0x0e1a2c : 0x12263f, 0.92)
        .setStrokeStyle(2, locked ? 0x223348 : 0x2a4a6e);
      const txt = this.add.text(x, selY + 20, stageLabels[i], {
        fontSize: '13px', fontStyle: 'bold',
        color: locked ? '#556a85' : '#e6eef8',
        align: 'center', fontFamily: 'monospace',
      }).setOrigin(0.5);
      if (locked) {
        this.add.text(x + 46, selY - 4, '🔒', { fontSize: '14px' }).setOrigin(0.5);
        return;
      }
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerup', () => { sfx.play('pickup'); this.start(stage.index); });
      bg.on('pointerover', () => bg.setStrokeStyle(2, 0x4a7ab0));
      bg.on('pointerout', () => bg.setStrokeStyle(2, 0x2a4a6e));
      void txt;
    });

    // New mission button (always stage 0, fresh save)
    const startY = selY + 100;
    const btn = (y: number, label: string, cb: () => void, enabled = true) => {
      const bg = this.add.rectangle(GAME_W / 2, y, 260, 44, 0x12263f, 0.9).setStrokeStyle(2, 0x2a4a6e);
      const txt = this.add.text(GAME_W / 2, y, label, {
        fontSize: '18px', color: enabled ? '#e6eef8' : '#556a85', fontFamily: 'monospace',
      }).setOrigin(0.5);
      if (!enabled) return;
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerup', () => { sfx.play('pickup'); cb(); });
      bg.on('pointerover', () => bg.setStrokeStyle(2, 0x4a7ab0));
      bg.on('pointerout', () => bg.setStrokeStyle(2, 0x2a4a6e));
      void txt;
    };

    btn(startY, 'NEW MISSION', () => this.start(0));

    // Speed selector
    const speedY = startY + 56;
    this.add.text(GAME_W / 2, speedY - 14, 'SPEED', { fontSize: '12px', color: '#8ea6c2', fontFamily: 'monospace' }).setOrigin(0.5);
    const speeds = [0.8, 1.0, 1.2];
    const speedLabels = ['SLOW', 'NORMAL', 'FAST'];
    const speedButtons: Phaser.GameObjects.Rectangle[] = [];
    const speedTxts: Phaser.GameObjects.Text[] = [];
    const highlight = () => {
      speedButtons.forEach((b, i) => {
        const sel = Math.abs(loadSave().speedMultiplier - speeds[i]) < 0.01;
        b.setFillStyle(sel ? 0x1e4a7a : 0x12263f, 0.9);
        b.setStrokeStyle(2, sel ? 0x6aa5e0 : 0x2a4a6e);
        speedTxts[i].setColor(sel ? '#ffffff' : '#cfe0f0');
      });
    };
    speeds.forEach((s, i) => {
      const x = GAME_W / 2 + (i - 1) * 90;
      const rc = this.add.rectangle(x, speedY + 10, 80, 32, 0x12263f, 0.9).setStrokeStyle(2, 0x2a4a6e);
      const t = this.add.text(x, speedY + 10, speedLabels[i], { fontSize: '14px', color: '#cfe0f0', fontFamily: 'monospace' }).setOrigin(0.5);
      rc.setInteractive({ useHandCursor: true });
      rc.on('pointerup', () => { updateSave({ speedMultiplier: s }); highlight(); sfx.play('pickup'); });
      speedButtons.push(rc);
      speedTxts.push(t);
    });
    highlight();

    // Controls hint
    this.add.text(GAME_W / 2, GAME_H - 80,
      'DESKTOP: ARROWS/WASD • SPACE fire • SHIFT boost • ESC/P pause\nMOBILE: drag to steer • tap/hold to fire',
      { fontSize: '11px', color: '#6a87a5', align: 'center', fontFamily: 'monospace' },
    ).setOrigin(0.5);

    if (save.highScore > 0) {
      this.add.text(GAME_W / 2, GAME_H - 30, `HI  ${save.highScore}`, {
        fontSize: '14px', color: '#ffcc33', fontFamily: 'monospace',
      }).setOrigin(0.5);
    }

    // Allow SPACE / ENTER to start new mission
    this.input.keyboard!.once('keydown-SPACE', () => this.start(0));
    this.input.keyboard!.once('keydown-ENTER', () => this.start(0));
  }

  private start(stageIdx: number) {
    this.scene.start('Game', { stageIndex: stageIdx });
    this.scene.launch('HUD');
  }
}
