import * as Phaser from 'phaser';
import { GAME_W, GAME_H } from '../game/constants';
import { loadSave } from '../game/storage';
import { sfx } from '../game/sfx';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  create(data: { won: boolean; reason: string; score: number }) {
    const bg = this.add.graphics();
    bg.fillStyle(0x05101f, 1);
    bg.fillRect(0, 0, GAME_W, GAME_H);

    this.add.text(GAME_W / 2, 180, data.won ? 'MISSION\nCOMPLETE' : 'MISSION\nFAILED', {
      fontSize: '42px', fontStyle: 'bold', align: 'center',
      color: data.won ? '#58d36a' : '#ff4a4a',
      stroke: '#05101f', strokeThickness: 6, fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, 290, data.reason, {
      fontSize: '14px', color: '#cfe0f0', align: 'center', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const save = loadSave();

    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(
          { type: 'snapsh:score', game: 'hormuz-fury', score: data.score },
          '*',
        );
      } catch {
        /* cross-origin block or closed window — ignore */
      }
    }

    this.add.text(GAME_W / 2, 360, `SCORE  ${data.score}`, {
      fontSize: '22px', color: '#ffe680', fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, 390, `HI     ${save.highScore}`, {
      fontSize: '16px', color: '#8ea6c2', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const makeBtn = (y: number, label: string, cb: () => void) => {
      const bg2 = this.add.rectangle(GAME_W / 2, y, 240, 44, 0x12263f, 0.9).setStrokeStyle(2, 0x2a4a6e);
      const txt = this.add.text(GAME_W / 2, y, label, {
        fontSize: '16px', color: '#e6eef8', fontFamily: 'monospace',
      }).setOrigin(0.5);
      bg2.setInteractive({ useHandCursor: true });
      bg2.on('pointerup', () => { sfx.play('pickup'); cb(); });
      void txt;
    };
    makeBtn(480, 'RETRY', () => {
      this.scene.start('Game', { stageIndex: 0 });
      this.scene.launch('HUD');
    });
    makeBtn(534, 'MENU', () => this.scene.start('Menu'));

    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Menu'));
    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('Game', { stageIndex: 0 });
      this.scene.launch('HUD');
    });
  }
}
