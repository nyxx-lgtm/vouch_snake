import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { GamePage } from '../pages/GamePage';

// Define the types of our custom fixtures
type MyFixtures = {
  home: HomePage;
  game: GamePage;
};

// Extend the base Playwright test with our fixtures
export const test = base.extend<MyFixtures>({
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  game: async ({ page }, use) => {
    await use(new GamePage(page));
  },
});

// Export expect as well, so steps can `import { test, expect }`
export { expect };
