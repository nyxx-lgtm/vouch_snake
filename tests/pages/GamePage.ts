// tests/pages/GamePage.ts
import { Page, Locator, expect } from '@playwright/test';

type DirString = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd';

export class GamePage {
  readonly page: Page;

  // UI elements
  readonly canvas: Locator;
  readonly startBtn: Locator;
  readonly pauseBtn: Locator;
  readonly resetBtn: Locator;
  readonly playAgainBtn: Locator;
  readonly scoreValue: Locator;
  readonly highScoreValue: Locator;
  readonly gameOverModal: Locator;
  readonly finalScoreValue: Locator;

  constructor(page: Page) {
    this.page = page;

    // Adjust these selectors if your HTML changes
    this.canvas = page.locator('#gameCanvas');
    this.startBtn = page.getByRole('button', { name: /^start$/i });
    this.pauseBtn = page.getByRole('button', { name: /^(pause|resume)$/i });
    this.resetBtn = page.getByRole('button', { name: /^reset$/i });
    this.playAgainBtn = page.getByRole('button', { name: /play again/i });

    this.scoreValue = page.locator('#score');
    this.highScoreValue = page.locator('#highScore');
    this.gameOverModal = page.locator('#gameOver'); // has class 'show' when visible
    this.finalScoreValue = page.locator('#finalScore');
  }

  // ---------- Navigation ----------
  async goto() {
    await this.page.goto('/');
    await this.canvas.waitFor({ state: 'visible' });
  }

  // ---------- Visible UI actions ----------
  async clickStart() {
    await this.startBtn.click();
  }

  async clickPause() {
    await this.pauseBtn.click();
  }

  async clickReset() {
    await this.resetBtn.click();
  }

  async clickPlayAgain() {
    await this.playAgainBtn.click();
  }

  async press(key: string) {
    await this.page.keyboard.press(key);
  }

  // Convenience: explicit pause/resume semantics over a single toggle button
  async pause() {
    // Only pause if it currently says "Pause"
    const label = (await this.pauseBtn.textContent())?.trim().toLowerCase();
    if (label === 'pause') {
      await this.pauseBtn.click();
    }
  }

  async resume() {
    // Only resume if it currently says "Resume"
    const label = (await this.pauseBtn.textContent())?.trim().toLowerCase();
    if (label === 'resume') {
      await this.pauseBtn.click();
    }
  }

  // ---------- Visible UI getters ----------
  async getScoreText(): Promise<string> {
    return (await this.scoreValue.textContent())?.trim() ?? '';
  }

  async getHighScoreText(): Promise<string> {
    return (await this.highScoreValue.textContent())?.trim() ?? '';
  }

  async getFinalScoreText(): Promise<string> {
    return (await this.finalScoreValue.textContent())?.trim() ?? '';
  }

  async isGameOverVisible(): Promise<boolean> {
    const classes = await this.gameOverModal.getAttribute('class');
    return !!classes && /\bshow\b/.test(classes);
  }

  // ---------- Hook helpers (non-UI, deterministic control) ----------
  // Generic hook invoker
  async call<T = any>(fn: string, ...args: any[]): Promise<T> {
    return this.page.evaluate(
      ([f, a]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const api = (window as any).__snakeTestApi__;
        if (!api || typeof api[f] !== 'function') {
          throw new Error(`__snakeTestApi__.${f} is not available. Did you include the test hook and expose window.game?`);
        }
        return api[f](...a);
      },
      [fn, args] as const
    );
  }

  // Shortcuts mapped to hook
  async start()   { await this.call('start'); }
  async pauseHook()   { await this.call('pause'); }
  async resumeHook()  { await this.call('resume'); }
  async reset()   { await this.call('reset'); }

  async tick(n = 1) { await this.call('tick', n); }
  async setDirection(dir: DirString) { await this.call('setDirection', dir); }
  async placeFoodAhead() { await this.call('placeFoodAhead'); }
  async setFood(x: number, y: number) { await this.call('setFood', x, y); }
  async forceWallHit() { await this.call('forceWallHit'); }

  // Hook state readers
  async getScore(): Promise<number> { return this.call('getScore'); }
  async getHighScore(): Promise<number> { return this.call('getHighScore'); }
  async getSpeedMs(): Promise<number> { return this.call('getSpeedMs'); }
  async getDirection(): Promise<{ x: number; y: number }> { return this.call('getDirection'); }
  async getNextDirection(): Promise<{ x: number; y: number }> { return this.call('getNextDirection'); }
  async getHead(): Promise<{ x: number; y: number }> { return this.call('getHead'); }
  async getFood(): Promise<{ x: number; y: number }> { return this.call('getFood'); }

  // ---------- Example composite actions (mixing UI + hook) ----------
  async eatFoodAheadOnce(): Promise<void> {
    await this.reset();
    await this.start();
    await this.placeFoodAhead();
    await this.tick(1); // single update should eat it
  }

  async expectScoreToBe(value: number) {
    const score = await this.getScore();
    await expect(score).toBe(value);
  }

  async expectSpeedLessThan(ms: number) {
    const speed = await this.getSpeedMs();
    await expect(speed).toBeLessThan(ms);
  }

  async expectGameOverVisible() {
    await expect(this.gameOverModal).toHaveClass(/show/);
  }
}
