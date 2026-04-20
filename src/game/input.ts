import * as Phaser from 'phaser';

export class GameInput {
  scene: Phaser.Scene;
  keys!: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    fire: Phaser.Input.Keyboard.Key;
    boost: Phaser.Input.Keyboard.Key;
  };
  // Touch state
  touchActive = false;
  touchX = 0;
  touchY = 0;
  touchStartX = 0;
  touchStartY = 0;
  fireHeld = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const kb = scene.input.keyboard!;
    this.keys = {
      left: kb.addKey('LEFT'),
      right: kb.addKey('RIGHT'),
      up: kb.addKey('UP'),
      down: kb.addKey('DOWN'),
      fire: kb.addKey('SPACE'),
      boost: kb.addKey('SHIFT'),
    };
    // Also WASD
    kb.addKeys('W,A,S,D');
    const wasd = {
      w: kb.addKey('W'), a: kb.addKey('A'),
      s: kb.addKey('S'), d: kb.addKey('D'),
    };
    scene.events.on('update', () => {
      // Merge WASD into arrow keys state via isDown OR
      (this.keys.left as any)._wasdDown = wasd.a.isDown;
      (this.keys.right as any)._wasdDown = wasd.d.isDown;
      (this.keys.up as any)._wasdDown = wasd.w.isDown;
      (this.keys.down as any)._wasdDown = wasd.s.isDown;
    });

    scene.input.addPointer(2);
    scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.touchActive = true;
      this.touchStartX = p.x;
      this.touchStartY = p.y;
      this.touchX = p.x;
      this.touchY = p.y;
      this.fireHeld = true;
    });
    scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!p.isDown) return;
      this.touchX = p.x;
      this.touchY = p.y;
    });
    scene.input.on('pointerup', () => {
      this.touchActive = false;
      this.fireHeld = false;
    });
  }

  /** Axis values -1..1 combining keyboard + touch drag. */
  axis(): { x: number; y: number } {
    let x = 0, y = 0;
    if (this.keys.left.isDown || (this.keys.left as any)._wasdDown) x -= 1;
    if (this.keys.right.isDown || (this.keys.right as any)._wasdDown) x += 1;
    if (this.keys.up.isDown || (this.keys.up as any)._wasdDown) y -= 1;
    if (this.keys.down.isDown || (this.keys.down as any)._wasdDown) y += 1;

    if (this.touchActive) {
      const dx = this.touchX - this.touchStartX;
      const dy = this.touchY - this.touchStartY;
      const deadzone = 6;
      const maxRange = 60;
      if (Math.abs(dx) > deadzone) x += Phaser.Math.Clamp(dx / maxRange, -1, 1);
      if (Math.abs(dy) > deadzone) y += Phaser.Math.Clamp(dy / maxRange, -1, 1);
      x = Phaser.Math.Clamp(x, -1, 1);
      y = Phaser.Math.Clamp(y, -1, 1);
    }
    return { x, y };
  }

  isFiring(): boolean {
    return this.keys.fire.isDown || this.fireHeld;
  }

  isBoosting(): boolean {
    return this.keys.boost.isDown;
  }
}
