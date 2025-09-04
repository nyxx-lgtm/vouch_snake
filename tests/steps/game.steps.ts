import { createBdd } from 'playwright-bdd';
import { test, expect } from '../fixtures/fixtures';

const { Given, When, Then } = createBdd(test);

// ---------- Navigation ----------
Given('I open the Snake Game', async ({ home }) => {
  await home.goto();
});

// ---------- Start / Pause ----------
When('I start the game', async ({ game }) => {
  await game.start(); // hook call
});

When('I pause the game', async ({ game }) => {
  await game.pauseHook();
});

When('I resume the game', async ({ game }) => {
  await game.resumeHook();
});

// ---------- Controls ----------
When('I press {string} {int} times', async ({ game }, key: string, times: number) => {
  for (let i = 0; i < times; i++) {
    await game.press(key); // real keyboard
  }
});

When('I set the direction to {string}', async ({ game }, dir: string) => {
  await game.setDirection(dir as any); // or dir as DirString
});

// ---------- Food / scoring ----------
When('I place food ahead of the snake', async ({ game }) => {
  await game.placeFoodAhead();
});

When('I tick the game {int} times', async ({ game }, n: number) => {
  await game.tick(n);
});

Then('the score is {int}', async ({ game }, expected: number) => {
  const score = await game.getScore();
  expect(score).toBe(expected);
});

Then('the high score is at least {int}', async ({ game }, min: number) => {
  const hs = await game.getHighScore();
  expect(hs).toBeGreaterThanOrEqual(min);
});

// ---------- Speed ----------
Then('the game speed is less than {int}', async ({ game }, ms: number) => {
  const speed = await game.getSpeedMs();
  expect(speed).toBeLessThan(ms);
});

// ---------- Game over ----------
When('I force a wall hit', async ({ game }) => {
  await game.forceWallHit();
});

Then('the game over screen is visible', async ({ game }) => {
  await game.expectGameOverVisible();
});
