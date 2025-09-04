import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly startBtn: Locator;
  readonly pauseBtn: Locator;
  readonly score: Locator;
  readonly highScore: Locator;
  readonly canvas: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1, h2, [data-testid="title"]'); // fallback
    this.startBtn = page.getByRole('button', { name: /start/i });
    this.pauseBtn = page.getByRole('button', { name: /pause/i });
    this.score = page.locator('[id*=score], text=Score').first();
    this.highScore = page.locator('[id*="high"], text=High').first();
    this.canvas = page.locator('canvas');
  }

  async goto() {
    await this.page.goto('/');
  }

  async startGame() {
    await this.startBtn.click();
  }

  async pauseGame() {
    await this.pauseBtn.click();
  }

  async getScoreText() { return (await this.score.innerText()).trim(); }
  async getHighScoreText() { return (await this.highScore.innerText()).trim(); }
}
