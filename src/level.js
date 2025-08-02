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
        this.width = 3200; // Level width
        this.height = 576; // Level height
        this.spawnX = 100;
        this.spawnY = 400;
        this.goalX = this.width - 200;
        this.generateLevel();
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
            default:
                this.generateRandomLevel();
                break;
        }
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

    generateRandomLevel() {
        // Generate random platforms for levels beyond 3
        const platformCount = 15 + this.levelNumber * 2;
        
        for (let i = 0; i < platformCount; i++) {
            const x = Utils.random(200, this.width - 200);
            const y = Utils.random(150, 450);
            const width = Utils.randomInt(64, 160);
            const height = 32;
            const types = ['brick', 'cloud', 'pipe'];
            const type = types[Utils.randomInt(0, types.length - 1)];
            
            this.platforms.push(new Platform(x, y, width, height, type));
        }
    }

    populateEnemies(enemyManager) {
        enemyManager.clear();
        
        // Add enemies based on level
        const enemyCount = Math.min(8 + this.levelNumber, 15);
        
        for (let i = 0; i < enemyCount; i++) {
            const x = Utils.random(400, this.width - 400);
            const y = this.height - 120;
            const type = Utils.random(0, 1) > 0.7 ? 'koopa' : 'goomba';
            enemyManager.addEnemy(x, y, type);
        }
    }

    populateCollectibles(collectibleManager) {
        collectibleManager.clear();
        
        // Add coins throughout the level
        const coinCount = 20 + this.levelNumber * 5;
        
        for (let i = 0; i < coinCount; i++) {
            const x = Utils.random(200, this.width - 200);
            const y = Utils.random(100, 400);
            collectibleManager.addCollectible(x, y, 'coin');
        }
        
        // Add power-ups
        const powerUpCount = Math.max(1, Math.floor(this.levelNumber / 2));
        
        for (let i = 0; i < powerUpCount; i++) {
            const x = Utils.random(500, this.width - 500);
            const y = Utils.random(200, 350);
            const type = Utils.random(0, 1) > 0.5 ? 'mushroom' : 'star';
            collectibleManager.addCollectible(x, y, type);
        }
    }

    updateCamera(player, canvas) {
        // Follow player with smooth camera movement
        const targetX = player.x - canvas.width / 3;
        this.camera.x = Utils.lerp(this.camera.x, targetX, 0.1);
        
        // Keep camera within level bounds
        this.camera.x = Utils.clamp(this.camera.x, 0, this.width - canvas.width);
        this.camera.y = 0;
    }

    isPlayerAtGoal(player) {
        return player.x >= this.goalX;
    }

    draw(ctx, canvas) {
        ctx.save();
        
        // Apply camera transform
        ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw background elements
        this.drawBackground(ctx);
        
        // Draw platforms
        this.platforms.forEach(platform => platform.draw(ctx));
        
        // Draw goal flag
        this.drawGoal(ctx);
        
        ctx.restore();
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