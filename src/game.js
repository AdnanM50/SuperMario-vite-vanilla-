// Main game logic and state management
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = 'menu'; // menu, playing, gameOver, levelComplete
        this.score = 0;
        this.coins = 0;
        this.currentLevel = 1;
        this.maxLevel = 8; // Now we have 8 designed levels plus infinite random ones
        
        // Game objects
        this.player = new Player(100, 400);
        this.level = new Level(this.currentLevel);
        this.enemyManager = new EnemyManager();
        this.collectibleManager = new CollectibleManager();
        this.particleSystem = new ParticleSystem();
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.coinsElement = document.getElementById('coins');
        
        this.setupLevel();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartGame();
        });

        document.getElementById('nextLevelButton').addEventListener('click', () => {
            this.nextLevel();
        });
    }

    setupLevel() {
        // Reset player position
        this.player.reset(this.level.spawnX, this.level.spawnY);
        
        // Populate level with enemies and collectibles
        this.level.populateEnemies(this.enemyManager);
        this.level.populateCollectibles(this.collectibleManager);
        
        // Clear particles
        this.particleSystem.clear();
    }

    startGame() {
        this.state = 'playing';
        this.hideAllScreens();
        this.score = 0;
        this.coins = 0;
        this.currentLevel = 1;
        this.player.lives = 3;
        this.level = new Level(this.currentLevel);
        this.setupLevel();
        this.updateUI();
    }

    restartGame() {
        this.startGame();
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
        } else {
            // Generate random levels beyond max level
            this.currentLevel++;
        }
        
        this.level = new Level(this.currentLevel);
        this.setupLevel();
        this.state = 'playing';
        this.hideAllScreens();
        this.updateUI();
        
        // Show level transition message
        this.showLevelTransition();
    }

    showLevelTransition() {
        // Create a temporary overlay showing the new level
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px;
            font-size: 24px; font-weight: bold; z-index: 300; text-align: center;
        `;
        overlay.innerHTML = `
            <h2>Level ${this.currentLevel}</h2>
            <p>${this.getLevelDescription()}</p>
        `;
        document.getElementById('gameContainer').appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
        }, 2000);
    }

    getLevelDescription() {
        const descriptions = {
            1: "Welcome to the Adventure!",
            2: "The Journey Continues",
            3: "Expert Challenges Await",
            4: "Underground Depths",
            5: "Castle of Challenges",
            6: "Sky High Adventure",
            7: "Desert Expedition",
            8: "Frozen Wasteland",
        };
        
        if (this.currentLevel <= 8) {
            return descriptions[this.currentLevel];
        } else {
            return `Endless Challenge ${this.currentLevel - 8}`;
        }
    }

    pauseGame() {
        // Toggle pause (could be implemented)
    }

    gameOver() {
        this.state = 'gameOver';
        const highScore = localStorage.getItem('marioHighScore') || 0;
        document.getElementById('finalScore').innerHTML = `Final Score: ${this.score}<br>High Score: ${Math.max(this.score, highScore)}`;
        document.getElementById('gameOver').classList.remove('hidden');
        SoundManager.play('death');
        
        // Save high score
        if (this.score > highScore) {
            localStorage.setItem('marioHighScore', this.score);
        }
    }

    levelComplete() {
        this.state = 'levelComplete';
        const levelBonus = this.player.lives * 1000 + this.currentLevel * 500;
        this.score += levelBonus;
        document.getElementById('levelScore').innerHTML = `
            Level ${this.currentLevel} Complete!<br>
            Level Bonus: ${levelBonus}<br>
            Total Score: ${this.score}
        `;
        document.getElementById('levelComplete').classList.remove('hidden');
        SoundManager.play('levelComplete');
    }

    hideAllScreens() {
        document.getElementById('gameMenu').classList.add('hidden');
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('levelComplete').classList.add('hidden');
    }

    update() {
        if (this.state !== 'playing') return;

        // Update game objects
        this.level.update(); // Update level (moving platforms, etc.)
        this.player.update();
        this.enemyManager.update();
        this.collectibleManager.update();
        this.particleSystem.update();

        // Handle collisions
        this.handleCollisions();

        // Update camera
        this.level.updateCamera(this.player, this.canvas);

        // Check win/lose conditions
        this.checkGameConditions();
        
        // Apply level-specific effects
        this.applyLevelEffects();

        // Update UI
        this.updateUI();
    }

    applyLevelEffects() {
        // Wind effect for sky levels
        if (this.level.windForce && !this.player.onGround) {
            this.player.vx += this.level.windForce;
        }
        
        // Slippery surfaces for ice levels
        if (this.level.slippery && this.player.onGround) {
            this.player.vx *= 0.95; // Less friction
        }
        
        // Heat damage in volcano levels (future feature)
        if (this.level.theme === 'volcano' && Math.random() > 0.998) {
            // Occasional heat damage
        }
    }

    handleCollisions() {
        // Player-Platform collisions
        this.level.getPlatforms().forEach(platform => {
            if (platform.visible !== false) {
                const wasOnPlatform = this.player.handlePlatformCollision(platform);
                if (wasOnPlatform && platform.disappearing) {
                    platform.playerOn = true;
                }
            }
        });

        // Enemy-Platform collisions
        const visiblePlatforms = this.level.getPlatforms().filter(p => p.visible !== false);
        this.enemyManager.handlePlatformCollisions(visiblePlatforms);

        // Player-Enemy collisions
        if (this.enemyManager.checkPlayerCollisions(this.player)) {
            const isDead = this.player.takeDamage();
            if (isDead) {
                this.gameOver();
                return;
            }
        }

        // Player-Collectible collisions
        this.collectibleManager.checkPlayerCollisions(this.player);

        // Keep player in bounds
        this.keepPlayerInBounds();
    }

    keepPlayerInBounds() {
        // Left boundary
        if (this.player.x < 0) {
            this.player.x = 0;
            this.player.vx = 0;
        }

        // Right boundary
        if (this.player.x > this.level.width - this.player.width) {
            this.player.x = this.level.width - this.player.width;
            this.player.vx = 0;
        }

        // Death from falling
        if (this.player.y > this.canvas.height + 100) {
            const isDead = this.player.takeDamage();
            if (isDead) {
                this.gameOver();
                return;
            } else {
                // Respawn player
                this.player.reset(this.level.spawnX, this.level.spawnY);
            }
        }
    }

    checkGameConditions() {
        // Check if player reached the goal
        if (this.level.isPlayerAtGoal(this.player)) {
            this.levelComplete();
        }

        // Add score for surviving (less frequent for balance)
        if (Math.floor(Date.now() / 1000) % 15 === 0) {
            this.score += 1;
        }
        
        // Bonus score for higher levels
        if (Math.floor(Date.now() / 1000) % 20 === 0 && this.currentLevel > 5) {
            this.score += this.currentLevel;
        }
    }

    updateUI() {
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.livesElement.textContent = `Lives: ${this.player.lives}`;
        this.levelElement.textContent = `Level: ${this.currentLevel}`;
        this.coinsElement.textContent = `Coins: ${this.coins}`;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === 'playing') {
            // Save context for camera transforms
            this.ctx.save();
            
            // Apply camera transform
            this.ctx.translate(-this.level.camera.x, -this.level.camera.y);
            
            // Draw level
            this.level.draw(this.ctx, this.canvas);
            
            // Draw game objects
            this.collectibleManager.draw(this.ctx);
            this.enemyManager.draw(this.ctx);
            this.player.draw(this.ctx);
            this.particleSystem.draw(this.ctx);
            
            // Restore context
            this.ctx.restore();
        }
    }

    run() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.run());
    }
}

// Global game instance
let game;