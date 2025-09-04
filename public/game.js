class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [];
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.food = {};
        
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = 100;
        this.gameLoop = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateHighScoreDisplay();
        this.resetGame();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button controls
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideGameOver();
            this.resetGame();
            this.startGame();
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const key = e.key;
        const prevDirection = this.direction;
        
        // Prevent 180-degree turns
        switch(key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (prevDirection.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (prevDirection.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (prevDirection.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (prevDirection.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                e.preventDefault();
                break;
            case ' ':
                this.togglePause();
                e.preventDefault();
                break;
        }
    }
    
    resetGame() {
        // Initialize snake in the center
        const centerX = Math.floor(this.tileCount / 2);
        const centerY = Math.floor(this.tileCount / 2);
        
        this.snake = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY }
        ];
        
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.gameSpeed = 100;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.generateFood();
        this.updateScore();
        this.draw();
        
        // Reset button states
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.runGameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
        
        if (!this.gamePaused) {
            this.runGameLoop();
        }
    }
    
    runGameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => this.runGameLoop(), this.gameSpeed);
    }
    
    update() {
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Calculate new head position
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        // Move snake
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }
    
    eatFood() {
        this.score += 10;
        this.updateScore();
        
        // Increase speed every 50 points
        if (this.score % 50 === 0 && this.gameSpeed > 50) {
            this.gameSpeed -= 10;
        }
        
        this.generateFood();
    }
    
    generateFood() {
        let validPosition = false;
        
        while (!validPosition) {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            
            // Check if food spawned on snake
            validPosition = true;
            for (let segment of this.snake) {
                if (segment.x === this.food.x && segment.y === this.food.y) {
                    validPosition = false;
                    break;
                }
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines (subtle)
        this.ctx.strokeStyle = '#2a2a2a';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.tileCount; i++) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Draw head
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.shadowColor = '#4CAF50';
                this.ctx.shadowBlur = 10;
            } else {
                // Draw body
                this.ctx.fillStyle = '#8BC34A';
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 2,
                segment.y * this.gridSize + 2,
                this.gridSize - 4,
                this.gridSize - 4
            );
            
            // Draw eyes on head
            if (index === 0) {
                this.ctx.fillStyle = 'white';
                const eyeSize = 3;
                const eyeOffset = 5;
                
                if (this.direction.x === 1) { // Right
                    this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset, segment.y * this.gridSize + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset, segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (this.direction.x === -1) { // Left
                    this.ctx.fillRect(segment.x * this.gridSize + eyeOffset - eyeSize, segment.y * this.gridSize + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + eyeOffset - eyeSize, segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (this.direction.y === -1) { // Up
                    this.ctx.fillRect(segment.x * this.gridSize + eyeOffset, segment.y * this.gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset - eyeSize, segment.y * this.gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (this.direction.y === 1) { // Down
                    this.ctx.fillRect(segment.x * this.gridSize + eyeOffset, segment.y * this.gridSize + this.gridSize - eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset - eyeSize, segment.y * this.gridSize + this.gridSize - eyeOffset, eyeSize, eyeSize);
                }
            }
        });
        
        this.ctx.shadowBlur = 0;
        
        // Draw food
        this.ctx.fillStyle = '#FF5252';
        this.ctx.shadowColor = '#FF5252';
        this.ctx.shadowBlur = 15;
        
        // Draw food as a circle
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 3,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
        
        // Draw pause indicator
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            
            this.ctx.font = '16px Arial';
            this.ctx.fillText('Press Space or Pause button to resume', this.canvas.width / 2, this.canvas.height / 2 + 30);
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateHighScoreDisplay();
        }
    }
    
    updateHighScoreDisplay() {
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        this.showGameOver();
        
        // Reset button states
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Pause';
    }
    
    showGameOver() {
        document.getElementById('gameOver').classList.add('show');
    }
    
    hideGameOver() {
        document.getElementById('gameOver').classList.remove('show');
    }
}

// --- Test hook (safe in prod; no-op if window is undefined) ---
if (typeof window !== 'undefined') {
  // Utilities for the hook only
  const _dirFromString = (s) => {
    const m = String(s || '').toLowerCase();
    if (m === 'arrowup' || m === 'up' || m === 'w')   return { x: 0, y: -1 };
    if (m === 'arrowdown' || m === 'down' || m === 's') return { x: 0, y: 1 };
    if (m === 'arrowleft' || m === 'left' || m === 'a') return { x: -1, y: 0 };
    if (m === 'arrowright' || m === 'right' || m === 'd') return { x: 1, y: 0 };
    return null;
  };

  const _isOnSnake = (game, x, y) => game.snake.some(seg => seg.x === x && seg.y === y);

  const _placeFoodAhead = (game) => {
    const head = game.snake[0];
    const d = game.direction; // {x,y}
    let fx = head.x + d.x;
    let fy = head.y + d.y;

    // Keep food inside bounds
    fx = Math.max(0, Math.min(game.tileCount - 1, fx));
    fy = Math.max(0, Math.min(game.tileCount - 1, fy));

    // If that spot is on snake, pick the first free cell we find
    if (_isOnSnake(game, fx, fy)) {
      outer: for (let y = 0; y < game.tileCount; y++) {
        for (let x = 0; x < game.tileCount; x++) {
          if (!_isOnSnake(game, x, y)) { fx = x; fy = y; break outer; }
        }
      }
    }

    game.food = { x: fx, y: fy };
    game.draw();
  };

  const _forceWallHit = (game) => {
    // Move head calculation outside bounds on next update
    // E.g., push nextDirection towards a wall and tick enough times.
    const head = game.snake[0];
    // Choose a direction that will hit a wall quickly
    if (head.x < game.tileCount - 1) {
      game.nextDirection = { x: 1, y: 0 };
      const steps = game.tileCount - head.x; // to go out of bounds
      for (let i = 0; i < steps; i++) { game.update(); }
    } else {
      game.nextDirection = { x: -1, y: 0 };
      for (let i = 0; i < head.x + 1; i++) { game.update(); }
    }
    game.draw();
  };

  // Expose a deterministic API for tests
  Object.defineProperty(window, '__snakeTestApi__', {
    configurable: true,
    writable: true,
    value: {
      /** @returns {SnakeGame|undefined} */
      get instance() { return window.game; },

      // Read state
      getScore:   () => window.game?.score ?? 0,
      getHighScore: () => Number(localStorage.getItem('snakeHighScore') || 0),
      getSpeedMs: () => window.game?.gameSpeed ?? 0,
      getDirection:     () => ({ ...(window.game?.direction ?? { x: 0, y: 0 }) }),
      getNextDirection: () => ({ ...(window.game?.nextDirection ?? { x: 0, y: 0 }) }),
      getHead:    () => ({ ...(window.game?.snake?.[0] ?? { x: 0, y: 0 }) }),
      getFood:    () => ({ ...(window.game?.food ?? { x: 0, y: 0 }) }),

      // Control game loop / session
      start:  () => window.game?.startGame(),
      pause:  () => window.game && window.game.gameRunning && !window.game.gamePaused && window.game.togglePause(),
      resume: () => window.game && window.game.gameRunning && window.game.gamePaused && window.game.togglePause(),
      reset:  () => window.game?.resetGame(),

      // Deterministic ticking (bypass setTimeout)
      tick:   (n = 1) => {
        const game = window.game;
        if (!game) return;
        for (let i = 0; i < n; i++) game.update();
        game.draw();
      },

      // Inputs / state mutation
      setDirection: (dirStr) => {
        const game = window.game;
        if (!game) return;
        const d = _dirFromString(dirStr);
        if (!d) return;
        // Respect your 180° prevention (same as keyboard: only change axis)
        if (game.direction.x === 0 && d.x !== 0) game.nextDirection = d;
        if (game.direction.y === 0 && d.y !== 0) game.nextDirection = d;
      },

      setFood: (x, y) => {
        const game = window.game;
        if (!game) return;
        const fx = Math.max(0, Math.min(game.tileCount - 1, Number(x)));
        const fy = Math.max(0, Math.min(game.tileCount - 1, Number(y)));
        game.food = { x: fx, y: fy };
        game.draw();
      },

      placeFoodAhead: () => {
        const game = window.game;
        if (game) _placeFoodAhead(game);
      },

      forceWallHit: () => {
        const game = window.game;
        if (game) _forceWallHit(game);
      },
    }
  });
}


// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new SnakeGame();
  // expose to the window so the test hook can reach it
  if (typeof window !== 'undefined') {
    window.game = game;
  }
});
