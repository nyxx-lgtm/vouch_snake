# Snake Game Automation Testing

## 📖 Overview
This repository contains an **end-to-end automated test suite** for the web-based Snake game using **Playwright**, **BDD (Gherkin)**, and the **Page Object Model (POM)**.  

The goal of this assessment is to demonstrate:
- How I identify and prioritize test scenarios  
- My approach to building maintainable and scalable test automation  
- Creativity in covering edge cases and game-specific behaviors  

> ⏱️ Completed within ~3 hours using a mix of **manual design** and **AI-assisted coding**.

---

## ▶️ How to Run the Tests

### 1. Clone the repository
```bash
git clone https://github.com/nyxx-lgtm/vouch_snake.git
cd vouch_snake
```

### 2. Install dependencies
```bash
npm install
npx playwright install
```

### 3. Run all tests
```bash
npm run test
```

### 4. Run with UI (debug mode)
```bash
npm run test:ui
```

### 5. Run tagged subsets
```bash
npx playwright test --grep @smoke
npx playwright test --grep @gameover
```

---

## 🧪 Testing Strategy

### Approach
- **Page Object Model (POM):** Encapsulates locators and game actions (`HomePage`, `GamePage`).  
- **BDD with Gherkin:** Human-readable scenarios (`.feature` files) describing gameplay, persistence, and edge cases.  
- **Deterministic Hooks:** Added a small `__snakeTestApi__` in `public/game.js` to reliably test game logic (score, speed, collisions) without relying on randomness.  
- **Tags:** Used scenario tags (`@smoke`, `@score`, `@gameover`, `@persist`) to organize test subsets.

### Core Scenarios (10+)
1. Landing page loads and canvas is visible  
2. Game starts at score 0  
3. Pause and resume functionality  
4. Eating food increases score by 10  
5. Speed increases after 50 points  
6. High score persists after reload  
7. Game ends when hitting a wall  
8. 180° turn prevention works  
9. Layout still works at smaller viewport  
10. Resume after pause continues same session  
11. Multiple reloads keep high score  

---

## 🔍 Interesting Findings

- **Randomness:** Food spawns randomly, which makes testing non-deterministic. The hook solved this by letting tests place food ahead of the snake.  
- **Speed thresholds:** Game speed is tied to score milestones (50, 100 points). Verifying this required accessing internal state (`gameSpeed`).  
- **Persistence:** High score storage works via `localStorage` (`snakeHighScore`). This was easy to assert across sessions.  
- **UI & Logic Coverage:** Balanced between UI button clicks (Start, Pause, Reset) and direct logic validation via hooks.  

---

## ⚠️ Challenges

- **Canvas rendering:** Pure pixel-level checks are brittle, so I relied on state hooks instead.  
- **180° turns:** Verified via direction state rather than trying to visually check the snake.  
- **Timeboxing:** With more time, I’d add performance tests (FPS under load), mobile layout validations, and negative tests (e.g., invalid keypresses).  

---

## ➕ If I Had More Time

- **Cross-browser matrix**: Already set up in Playwright config (Chromium/Firefox/WebKit) but not deeply explored.  
- **Performance tests**: Measure frame updates and latency.  
- **Accessibility checks**: Ensure buttons have ARIA roles, focus works with keyboard-only play.  
- **Visual regression**: Screenshot testing for canvas states.  

---

## 📂 Project Structure
```
tests/
  features/     # Gherkin scenarios
  steps/        # Step definitions
  pages/        # POM classes (HomePage, GamePage)
  fixtures/     # Shared Playwright fixtures
public/
  game.js       # Game logic + test hook (__snakeTestApi__)
playwright.config.ts
```

---

## ✅ Evaluation Fit

This project demonstrates:
- **Testing mindset:** Coverage spans UI flows, game rules, persistence, and edge cases.  
- **Code quality:** Modular structure with fixtures + POM.  
- **Innovation:** Deterministic hook for reliable testing of random game logic.  
- **Execution:** Working Playwright-BDD setup.  
- **Documentation:** This README explains approach, usage, findings, and improvements clearly.  

---

✨ *Built with Playwright, BDD, POM, and AI-assisted tooling.*  
