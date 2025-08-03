// Level management and platform generation
class Platform {
    constructor(x, y, width, height, type = 'ground') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    draw(ctx) {
        ctx.save();

        switch(this.type) {
            case 'ground':
                this.drawGround(ctx);
                break;
            case 'brick':
                this.drawBrick(ctx);
                break;
            case 'pipe':
                this.drawPipe(ctx);
                break;
            case 'cloud':
                this.drawCloud(ctx);
                break;
        }

        ctx.restore();
    }

    drawGround(ctx) {
        // Green grass-like ground
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Dirt underneath
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
        
        // Grass texture
        ctx.fillStyle = '#228B22';
        for (let x = this.x; x < this.x + this.width; x += 8) {
            ctx.fillRect(x, this.y, 2, 8);
            ctx.fillRect(x + 4, this.y, 2, 6);
        }
    }

    drawBrick(ctx) {
        // Orange brick
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Brick pattern
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let y = this.y + 16; y < this.y + this.height; y += 16) {
            ctx.beginPath();
            ctx.moveTo(this.x, y);
            ctx.lineTo(this.x + this.width, y);
            ctx.stroke();
        }
        
        // Vertical lines (offset pattern)
        for (let x = this.x + 32; x < this.x + this.width; x += 32) {
            for (let y = this.y; y < this.y + this.height; y += 32) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + 16);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(x - 16, y + 16);
                ctx.lineTo(x - 16, y + 32);
                ctx.stroke();
            }
        }
    }

    drawPipe(ctx) {
        // Green pipe
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Pipe rim
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(this.x - 4, this.y, this.width + 8, 16);
        
        // Pipe highlights
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(this.x + 4, this.y + 16, 4, this.height - 16);
        ctx.fillRect(this.x + this.width - 8, this.y + 16, 4, this.height - 16);
    }

    drawCloud(ctx) {
        // White cloud platform
        ctx.fillStyle = '#FFF';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Cloud bumps
        ctx.beginPath();
        for (let x = this.x; x < this.x + this.width; x += 20) {
            ctx.arc(x + 10, this.y, 8, 0, Math.PI, true);
        }
        ctx.fill();
        
        // Slight shadow
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(this.x, this.y + this.height - 4, this.width, 4);
    }
}

class Level {
    constructor(levelNumber) {
        this.levelNumber = levelNumber;
        this.platforms = [];
        this.camera = { x: 0, y: 0 };
        this.width = 3200 + (levelNumber * 400); // Levels get longer
        this.height = 576; // Level height
        this.spawnX = 100;
        this.spawnY = 400;
        this.goalX = this.width - 200;
        this.theme = this.getTheme(levelNumber);
        this.generateLevel();
    }

    getTheme(levelNumber) {
        const themes = ['grassland', 'underground', 'castle', 'sky', 'desert', 'ice', 'volcano', 'space'];
        return themes[(levelNumber - 1) % themes.length];
    }

    generateLevel() {
        this.platforms = [];
        
        // Ground platforms
        for (let x = 0; x < this.width; x += 64) {
            this.platforms.push(new Platform(x, this.height - 64, 64, 64, 'ground'));
        }

        // Generate platforms based on level
        switch(this.levelNumber) {
            case 1:
                this.generateLevel1();
                break;
            case 2:
                this.generateLevel2();
                break;
            case 3:
                this.generateLevel3();
                break;
            case 4:
                this.generateLevel4();
                break;
            case 5:
                this.generateLevel5();
                break;
            case 6:
                this.generateLevel6();
                break;
            case 7:
                this.generateLevel7();
                break;
            case 8:
                this.generateLevel8();
                break;
            default:
                this.generateRandomLevel();
                break;
        }
        
        // Add level-specific challenges
        this.addLevelChallenges();
    }

    generateLevel1() {
        // Simple platforms for level 1
        this.platforms.push(new Platform(300, 400, 128, 32, 'brick'));
        this.platforms.push(new Platform(500, 350, 96, 32, 'cloud'));
        this.platforms.push(new Platform(700, 300, 128, 32, 'brick'));
        this.platforms.push(new Platform(900, 400, 64, 64, 'pipe'));
        this.platforms.push(new Platform(1100, 350, 160, 32, 'brick'));
        this.platforms.push(new Platform(1400, 250, 96, 32, 'cloud'));
        this.platforms.push(new Platform(1600, 300, 128, 32, 'brick'));
        this.platforms.push(new Platform(1800, 400, 96, 32, 'brick'));
        this.platforms.push(new Platform(2000, 200, 160, 32, 'cloud'));
        this.platforms.push(new Platform(2300, 350, 128, 32, 'brick'));
        this.platforms.push(new Platform(2600, 280, 96, 32, 'cloud'));
        this.platforms.push(new Platform(2900, 400, 64, 96, 'pipe'));
    }

    generateLevel2() {
        // More challenging platforms for level 2
        this.platforms.push(new Platform(250, 450, 96, 32, 'brick'));
        this.platforms.push(new Platform(400, 380, 64, 32, 'cloud'));
        this.platforms.push(new Platform(550, 320, 96, 32, 'brick'));
        this.platforms.push(new Platform(700, 260, 64, 32, 'cloud'));
        this.platforms.push(new Platform(850, 350, 128, 32, 'brick'));
        this.platforms.push(new Platform(1050, 200, 96, 32, 'cloud'));
        this.platforms.push(new Platform(1250, 280, 160, 32, 'brick'));
        this.platforms.push(new Platform(1500, 180, 64, 32, 'cloud'));
        this.platforms.push(new Platform(1650, 320, 96, 32, 'brick'));
        this.platforms.push(new Platform(1850, 150, 128, 32, 'cloud'));
        this.platforms.push(new Platform(2100, 250, 96, 32, 'brick'));
        this.platforms.push(new Platform(2350, 380, 160, 32, 'brick'));
        this.platforms.push(new Platform(2650, 200, 96, 32, 'cloud'));
        this.platforms.push(new Platform(2900, 450, 96, 96, 'pipe'));
    }

    generateLevel3() {
        // Expert level platforms
        this.platforms.push(new Platform(200, 480, 64, 32, 'cloud'));
        this.platforms.push(new Platform(350, 420, 64, 32, 'brick'));
        this.platforms.push(new Platform(480, 360, 64, 32, 'cloud'));
        this.platforms.push(new Platform(620, 300, 64, 32, 'brick'));
        this.platforms.push(new Platform(780, 180, 96, 32, 'cloud'));
        this.platforms.push(new Platform(950, 240, 64, 32, 'brick'));
        this.platforms.push(new Platform(1100, 320, 128, 32, 'brick'));
        this.platforms.push(new Platform(1300, 160, 64, 32, 'cloud'));
        this.platforms.push(new Platform(1450, 280, 96, 32, 'brick'));
        this.platforms.push(new Platform(1650, 120, 64, 32, 'cloud'));
        this.platforms.push(new Platform(1800, 200, 128, 32, 'brick'));
        this.platforms.push(new Platform(2000, 350, 96, 32, 'cloud'));
        this.platforms.push(new Platform(2200, 180, 64, 32, 'brick'));
        this.platforms.push(new Platform(2400, 280, 160, 32, 'brick'));
        this.platforms.push(new Platform(2700, 400, 96, 32, 'cloud'));
        this.platforms.push(new Platform(2950, 320, 128, 128, 'pipe'));
    }

    generateLevel4() {
        // Underground theme - tight spaces and vertical challenges
        this.platforms.push(new Platform(200, 500, 128, 32, 'brick'));
        this.platforms.push(new Platform(400, 450, 64, 32, 'brick'));
        this.platforms.push(new Platform(500, 400, 64, 32, 'brick'));
        this.platforms.push(new Platform(600, 350, 64, 32, 'brick'));
        this.platforms.push(new Platform(700, 300, 128, 32, 'brick'));
        this.platforms.push(new Platform(900, 250, 64, 32, 'brick'));
        this.platforms.push(new Platform(1100, 200, 96, 32, 'brick'));
        this.platforms.push(new Platform(1300, 150, 64, 32, 'brick'));
        this.platforms.push(new Platform(1500, 200, 128, 32, 'brick'));
        this.platforms.push(new Platform(1700, 350, 96, 32, 'brick'));
        this.platforms.push(new Platform(1900, 300, 64, 32, 'brick'));
        this.platforms.push(new Platform(2100, 250, 128, 32, 'brick'));
        this.platforms.push(new Platform(2400, 400, 96, 32, 'brick'));
        this.platforms.push(new Platform(2700, 200, 160, 32, 'brick'));
        this.platforms.push(new Platform(3000, 350, 128, 32, 'brick'));
        
        // Add ceiling obstacles
        this.platforms.push(new Platform(800, 100, 128, 32, 'brick'));
        this.platforms.push(new Platform(1200, 80, 96, 32, 'brick'));
        this.platforms.push(new Platform(1800, 120, 160, 32, 'brick'));
        this.platforms.push(new Platform(2500, 100, 128, 32, 'brick'));
    }

    generateLevel5() {
        // Castle theme - moving platforms and hazards
        this.platforms.push(new Platform(300, 480, 96, 32, 'brick'));
        this.platforms.push(new Platform(500, 420, 64, 32, 'brick'));
        this.platforms.push(new Platform(700, 360, 96, 32, 'brick'));
        this.platforms.push(new Platform(900, 300, 64, 32, 'brick'));
        this.platforms.push(new Platform(1100, 240, 128, 32, 'brick'));
        this.platforms.push(new Platform(1350, 180, 64, 32, 'brick'));
        this.platforms.push(new Platform(1550, 240, 96, 32, 'brick'));
        this.platforms.push(new Platform(1750, 300, 128, 32, 'brick'));
        this.platforms.push(new Platform(2000, 200, 64, 32, 'brick'));
        this.platforms.push(new Platform(2200, 280, 96, 32, 'brick'));
        this.platforms.push(new Platform(2450, 160, 128, 32, 'brick'));
        this.platforms.push(new Platform(2700, 320, 96, 32, 'brick'));
        this.platforms.push(new Platform(2950, 240, 160, 32, 'brick'));
        
        // Add tower structures
        this.platforms.push(new Platform(1000, 150, 32, 150, 'pipe'));
        this.platforms.push(new Platform(2000, 100, 32, 200, 'pipe'));
        this.platforms.push(new Platform(2800, 120, 32, 180, 'pipe'));
    }

    generateLevel6() {
        // Sky theme - cloud platforms and wind effects
        this.platforms.push(new Platform(250, 450, 96, 32, 'cloud'));
        this.platforms.push(new Platform(450, 380, 64, 32, 'cloud'));
        this.platforms.push(new Platform(650, 320, 96, 32, 'cloud'));
        this.platforms.push(new Platform(850, 260, 64, 32, 'cloud'));
        this.platforms.push(new Platform(1050, 200, 128, 32, 'cloud'));
        this.platforms.push(new Platform(1300, 140, 64, 32, 'cloud'));
        this.platforms.push(new Platform(1500, 180, 96, 32, 'cloud'));
        this.platforms.push(new Platform(1750, 120, 128, 32, 'cloud'));
        this.platforms.push(new Platform(2000, 200, 64, 32, 'cloud'));
        this.platforms.push(new Platform(2250, 160, 96, 32, 'cloud'));
        this.platforms.push(new Platform(2500, 100, 128, 32, 'cloud'));
        this.platforms.push(new Platform(2750, 180, 96, 32, 'cloud'));
        this.platforms.push(new Platform(3000, 240, 160, 32, 'cloud'));
        
        // High altitude platforms
        this.platforms.push(new Platform(1200, 60, 64, 32, 'cloud'));
        this.platforms.push(new Platform(2100, 40, 96, 32, 'cloud'));
        this.platforms.push(new Platform(2900, 80, 128, 32, 'cloud'));
    }

    generateLevel7() {
        // Desert theme - sand platforms and oasis
        this.platforms.push(new Platform(200, 480, 128, 32, 'brick'));
        this.platforms.push(new Platform(400, 420, 96, 32, 'brick'));
        this.platforms.push(new Platform(600, 360, 64, 32, 'brick'));
        this.platforms.push(new Platform(800, 300, 128, 32, 'brick'));
        this.platforms.push(new Platform(1050, 240, 96, 32, 'brick'));
        this.platforms.push(new Platform(1300, 180, 64, 32, 'brick'));
        this.platforms.push(new Platform(1500, 240, 128, 32, 'brick'));
        this.platforms.push(new Platform(1750, 300, 96, 32, 'brick'));
        this.platforms.push(new Platform(2000, 200, 64, 32, 'brick'));
        this.platforms.push(new Platform(2250, 280, 128, 32, 'brick'));
        this.platforms.push(new Platform(2500, 160, 96, 32, 'brick'));
        this.platforms.push(new Platform(2750, 320, 64, 32, 'brick'));
        this.platforms.push(new Platform(3000, 240, 160, 32, 'brick'));
        
        // Sand dunes (sloped platforms)
        this.platforms.push(new Platform(1200, 400, 32, 32, 'brick'));
        this.platforms.push(new Platform(1232, 380, 32, 32, 'brick'));
        this.platforms.push(new Platform(1264, 360, 32, 32, 'brick'));
        this.platforms.push(new Platform(1296, 380, 32, 32, 'brick'));
        this.platforms.push(new Platform(1328, 400, 32, 32, 'brick'));
    }

    generateLevel8() {
        // Ice theme - slippery platforms
        this.platforms.push(new Platform(300, 460, 128, 32, 'cloud'));
        this.platforms.push(new Platform(500, 400, 96, 32, 'cloud'));
        this.platforms.push(new Platform(700, 340, 64, 32, 'cloud'));
        this.platforms.push(new Platform(900, 280, 128, 32, 'cloud'));
        this.platforms.push(new Platform(1150, 220, 96, 32, 'cloud'));
        this.platforms.push(new Platform(1400, 160, 64, 32, 'cloud'));
        this.platforms.push(new Platform(1600, 220, 128, 32, 'cloud'));
        this.platforms.push(new Platform(1850, 280, 96, 32, 'cloud'));
        this.platforms.push(new Platform(2100, 180, 64, 32, 'cloud'));
        this.platforms.push(new Platform(2350, 240, 128, 32, 'cloud'));
        this.platforms.push(new Platform(2600, 160, 96, 32, 'cloud'));
        this.platforms.push(new Platform(2850, 300, 64, 32, 'cloud'));
        this.platforms.push(new Platform(3100, 220, 160, 32, 'cloud'));
        
        // Ice spikes (hazard platforms)
        this.platforms.push(new Platform(800, 500, 32, 16, 'brick'));
        this.platforms.push(new Platform(1300, 480, 32, 16, 'brick'));
        this.platforms.push(new Platform(2000, 460, 32, 16, 'brick'));
        this.platforms.push(new Platform(2700, 500, 32, 16, 'brick'));
    }

    addLevelChallenges() {
        // Add moving platforms for higher levels
        if (this.levelNumber >= 5) {
            this.addMovingPlatforms();
        }
        
        // Add disappearing platforms for expert levels
        if (this.levelNumber >= 7) {
            this.addDisappearingPlatforms();
        }
        
        // Add wind effects for sky levels
        if (this.theme === 'sky') {
            this.windForce = 0.2;
        }
        
        // Add slippery surfaces for ice levels
        if (this.theme === 'ice') {
            this.slippery = true;
        }
    }

    addMovingPlatforms() {
        // Add some moving platforms
        const movingCount = Math.min(3, Math.floor(this.levelNumber / 2));
        for (let i = 0; i < movingCount; i++) {
            const x = Utils.random(500, this.width - 500);
            const y = Utils.random(200, 400);
            const platform = new Platform(x, y, 96, 32, 'cloud');
            platform.moving = true;
            platform.moveSpeed = 1;
            platform.moveRange = 200;
            platform.startX = x;
            this.platforms.push(platform);
        }
    }

    addDisappearingPlatforms() {
        // Replace some cloud platforms with disappearing ones
        this.platforms.forEach(platform => {
            if (platform.type === 'cloud' && Utils.random(0, 1) > 0.7) {
                platform.disappearing = true;
                platform.disappearTimer = 0;
            }
        });
    }

    generateRandomLevel() {
        // Generate random platforms for levels beyond 8
        const platformCount = 20 + (this.levelNumber - 8) * 3;
        const difficulty = Math.min(this.levelNumber - 8, 10);
        
        for (let i = 0; i < platformCount; i++) {
            const x = Utils.random(200 + i * 150, this.width - 200);
            const y = Utils.random(100 - difficulty * 5, 450 - difficulty * 10);
            const width = Utils.randomInt(64, 160);
            const height = 32;
            const types = ['brick', 'cloud', 'pipe'];
            const type = types[Utils.randomInt(0, types.length - 1)];
            
            const platform = new Platform(x, y, width, height, type);
            
            // Add special properties for higher levels
            if (difficulty > 3 && Utils.random(0, 1) > 0.8) {
                platform.moving = true;
                platform.moveSpeed = Utils.random(0.5, 2);
                platform.moveRange = Utils.random(100, 300);
                platform.startX = x;
            }
            
            if (difficulty > 5 && Utils.random(0, 1) > 0.9) {
                platform.disappearing = true;
                platform.disappearTimer = 0;
            }
            
            this.platforms.push(platform);
        }
        
        // Add more challenging gaps
        this.addChallengeGaps(difficulty);
    }

    addChallengeGaps(difficulty) {
        // Create challenging gaps that require precise jumping
        const gapCount = Math.min(difficulty, 5);
        
        for (let i = 0; i < gapCount; i++) {
            const gapStart = Utils.random(800, this.width - 800);
            const gapWidth = Utils.random(150 + difficulty * 10, 250 + difficulty * 15);
            
            // Remove platforms in gap area
            this.platforms = this.platforms.filter(platform => {
                return !(platform.x >= gapStart && platform.x <= gapStart + gapWidth);
            });
            
            // Add platforms on either side
            this.platforms.push(new Platform(gapStart - 96, Utils.random(300, 400), 96, 32, 'brick'));
            this.platforms.push(new Platform(gapStart + gapWidth, Utils.random(300, 400), 96, 32, 'brick'));
        }
    }

    populateEnemies(enemyManager) {
        enemyManager.clear();
        
        // Add enemies based on level
        const baseEnemyCount = Math.min(8 + this.levelNumber * 2, 25);
        const enemyCount = baseEnemyCount + Math.floor(this.levelNumber / 3) * 2;
        
        for (let i = 0; i < enemyCount; i++) {
            const x = Utils.random(400, this.width - 400);
            const y = this.height - 120;
            
            // More variety in enemy types for higher levels
            let type = 'goomba';
            if (this.levelNumber >= 3) {
                type = Utils.random(0, 1) > 0.6 ? 'koopa' : 'goomba';
            }
            if (this.levelNumber >= 5) {
                const rand = Utils.random(0, 1);
                if (rand > 0.8) type = 'spiny';
                else if (rand > 0.5) type = 'koopa';
                else type = 'goomba';
            }
            
            enemyManager.addEnemy(x, y, type);
        }
        
        // Add flying enemies for sky levels
        if (this.theme === 'sky' && this.levelNumber >= 6) {
            const flyingCount = Math.floor(this.levelNumber / 2);
            for (let i = 0; i < flyingCount; i++) {
                const x = Utils.random(500, this.width - 500);
                const y = Utils.random(100, 300);
                enemyManager.addEnemy(x, y, 'paratroopa');
            }
        }
    }

    populateCollectibles(collectibleManager) {
        collectibleManager.clear();
        
        // Add coins throughout the level
        const coinCount = 25 + this.levelNumber * 6;
        
        for (let i = 0; i < coinCount; i++) {
            const x = Utils.random(200, this.width - 200);
            const y = Utils.random(100, 400);
            collectibleManager.addCollectible(x, y, 'coin');
        }
        
        // Add power-ups
        const powerUpCount = Math.max(2, Math.floor(this.levelNumber / 2) + 1);
        
        for (let i = 0; i < powerUpCount; i++) {
            const x = Utils.random(500, this.width - 500);
            const y = Utils.random(200, 350);
            
            // More power-up variety for higher levels
            let type = 'mushroom';
            if (this.levelNumber >= 4) {
                const rand = Utils.random(0, 1);
                if (rand > 0.7) type = 'star';
                else if (rand > 0.4) type = 'fireflower';
                else type = 'mushroom';
            }
            
            collectibleManager.addCollectible(x, y, type);
        }
        
        // Add bonus items for completing challenging sections
        if (this.levelNumber >= 5) {
            const bonusCount = Math.floor(this.levelNumber / 3);
            for (let i = 0; i < bonusCount; i++) {
                const x = Utils.random(1000, this.width - 1000);
                const y = Utils.random(150, 250);
                collectibleManager.addCollectible(x, y, '1up');
            }
        }
    }

    update() {
        // Update moving platforms
        this.platforms.forEach(platform => {
            if (platform.moving) {
                if (!platform.moveDirection) platform.moveDirection = 1;
                
                platform.x += platform.moveSpeed * platform.moveDirection;
                
                if (platform.x >= platform.startX + platform.moveRange || 
                    platform.x <= platform.startX - platform.moveRange) {
                    platform.moveDirection *= -1;
                }
            }
            
            if (platform.disappearing && platform.playerOn) {
                platform.disappearTimer++;
                if (platform.disappearTimer > 60) { // 1 second
                    platform.visible = false;
                }
            }
        });
    }

    updateCamera(player, canvas) {
        // Follow player with smooth camera movement
        const targetX = player.x - canvas.width / 3;
        this.camera.x = Utils.lerp(this.camera.x, targetX, 0.1);
        
        // Keep camera within level bounds
        this.camera.x = Utils.clamp(this.camera.x, 0, this.width - canvas.width);
        this.camera.y = 0;
        
        // Add camera shake for intense levels
        if (this.levelNumber >= 8) {
            this.camera.x += Math.sin(Date.now() * 0.01) * 2;
        }
    }

    isPlayerAtGoal(player) {
        return player.x >= this.goalX;
    }

    draw(ctx, canvas) {
        ctx.save();
        
        // Apply camera transform
        ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw themed background
        this.drawThemedBackground(ctx);
        
        // Draw background elements
        this.drawBackground(ctx);
        
        // Draw platforms
        this.platforms.forEach(platform => {
            if (platform.visible !== false) {
                platform.draw(ctx);
                
                // Draw warning for disappearing platforms
                if (platform.disappearing && platform.disappearTimer > 30) {
                    ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.02) * 0.3;
                }
            }
        });
        
        // Draw goal flag
        this.drawGoal(ctx);
        
        ctx.restore();
    }

    drawThemedBackground(ctx) {
        switch(this.theme) {
            case 'underground':
                ctx.fillStyle = '#2C1810';
                ctx.fillRect(0, 0, this.width, this.height);
                break;
            case 'castle':
                ctx.fillStyle = '#4A4A4A';
                ctx.fillRect(0, 0, this.width, this.height);
                break;
            case 'sky':
                const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(1, '#E0F6FF');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, this.width, this.height);
                break;
            case 'desert':
                const desertGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                desertGradient.addColorStop(0, '#FFE4B5');
                desertGradient.addColorStop(1, '#DEB887');
                ctx.fillStyle = desertGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                break;
            case 'ice':
                const iceGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                iceGradient.addColorStop(0, '#E6F3FF');
                iceGradient.addColorStop(1, '#B0E0E6');
                ctx.fillStyle = iceGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                break;
            case 'volcano':
                const volcanoGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                volcanoGradient.addColorStop(0, '#FF4500');
                volcanoGradient.addColorStop(1, '#8B0000');
                ctx.fillStyle = volcanoGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                break;
            case 'space':
                ctx.fillStyle = '#000011';
                ctx.fillRect(0, 0, this.width, this.height);
                // Add stars
                ctx.fillStyle = '#FFF';
                for (let i = 0; i < 100; i++) {
                    const x = (i * 137) % this.width;
                    const y = (i * 211) % this.height;
                    ctx.fillRect(x, y, 2, 2);
                }
                break;
            default:
                // Grassland theme (default)
                break;
        }
    }

    drawBackground(ctx) {
        // Draw clouds in background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < 10; i++) {
            const x = (i * 400) + (this.camera.x * 0.3) % 400;
            const y = 50 + (i % 3) * 30;
            
            // Cloud shape
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
            ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
            ctx.arc(x + 30, y - 15, 25, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw distant hills
        ctx.fillStyle = 'rgba(34, 139, 34, 0.6)';
        ctx.beginPath();
        for (let x = 0; x < this.width + 200; x += 100) {
            const hillX = x - (this.camera.x * 0.5) % 100;
            const hillY = this.height - 100 - Math.sin(x * 0.01) * 30;
            ctx.lineTo(hillX, hillY);
        }
        ctx.lineTo(this.width, this.height);
        ctx.lineTo(0, this.height);
        ctx.fill();
    }

    drawGoal(ctx) {
        // Goal flag
        const flagX = this.goalX;
        const flagY = this.height - 200;
        
        // Flag pole
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(flagX, flagY, 8, 136);
        
        // Flag
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(flagX + 8, flagY, 40, 30);
        
        // Flag pattern
        ctx.fillStyle = '#FFF';
        ctx.fillRect(flagX + 12, flagY + 4, 8, 8);
        ctx.fillRect(flagX + 28, flagY + 4, 8, 8);
        ctx.fillRect(flagX + 12, flagY + 18, 8, 8);
        ctx.fillRect(flagX + 28, flagY + 18, 8, 8);
    }

    getPlatforms() {
        return this.platforms;
    }
}