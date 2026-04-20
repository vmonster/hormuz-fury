import * as Phaser from 'phaser';
import { createAllTextures } from '../game/textures';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    createAllTextures(this);
    this.scene.start('Menu');
  }
}
