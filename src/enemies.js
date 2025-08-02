// Enemy classes
class Enemy {
    constructor(x, y, type = 'goomba') {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.vx = -1;
        this.vy = 0;
        this.gravity = 0.5;
        this.onGround = false;
        this.type = type;
        this.alive = true;
        this.animFrame = 0;
        this.animTimer = 0;
        this.direction = -1;
    }

    update() {
        if (!this.alive) return;

        this.updatePhysics();
        this.updateAnimation();
        this.checkWorldBounds();
    }

    updatePhysics() {
        // Apply gravity
        if (!this.onGround) {
            this.vy += this.gravity;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Reset ground state
        this.onGround = false;
    }

    updateAnimation() {
        this.animTimer++;
        if (this.animTimer > 30) {
            this.animFrame = (this.animFrame + 1) % 2;
            this.animTimer = 0;
        }
    }

    checkWorldBounds() {
        // Remove enemy if it falls off the world
        if (this.y > game.canvas.height + 100) {
            this.alive = false;
        }
    }

    handlePlatformCollision(platform) {
        if (!Utils.rectCollision(this, platform)) return;

        const enemyBottom = this.y + this.height;
        const enemyTop = this.y;
        const enemyLeft = this.x;
        const enemyRight = this.x + this.width;
        
        const platformTop = platform.y;
        const platformBottom = platform.y + platform.height;
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;

        const overlapLeft = enemyRight - platformLeft;
        const overlapRight = platformRight - enemyLeft;
        const overlapTop = enemyBottom - platformTop;
        const overlapBottom = platformBottom - enemyTop;

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapTop && this.vy > 0) {
            // Landing on top
            this.y = platformTop - this.height;
            this.vy = 0;
            this.onGround = true;
        } else if (minOverlap === overlapLeft && this.vx > 0) {
            // Hitting wall from left - turn around
            this.x = platformLeft - this.width;
            this.vx = -Math.abs(this.vx);
            this.direction = -1;
        } else if (minOverlap === overlapRight && this.vx < 0) {
            // Hitting wall from right - turn around
            this.x = platformRight;
            this.vx = Math.abs(this.vx);
            this.direction = 1;
        }
    }

    checkPlayerCollision(player) {
        if (!this.alive || player.invulnerable) return false;

        if (Utils.rectCollision(this, player)) {
            // Check if player is jumping on enemy (player is above and falling)
            if (player.y + player.height - 10 < this.y && player.vy > 0) {
                this.defeat();
                player.vy = -8; // Bounce effect
                game.score += 100;
                SoundManager.play('enemyDefeat');
                return false; // Player doesn't take damage
            } else {
                // Player takes damage
                return true;
            }
        }
        return false;
    }

    defeat() {
        this.alive = false;
        game.particleSystem.createEnemyDefeatEffect(this.x + this.width / 2, this.y + this.height / 2);
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.save();

        // Enemy body
        switch(this.type) {
            case 'goomba':
                this.drawGoomba(ctx);
                break;
            case 'koopa':
                this.drawKoopa(ctx);
                break;
        }

        ctx.restore();
    }

    drawGoomba(ctx) {
        // Brown body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y + 8, this.width, this.height - 8);

        // Head
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x + 2, this.y, this.width - 4, 16);

        // Eyes
        ctx.fillStyle = '#FFF';
        ctx.fillRect(this.x + 6, this.y + 4, 4, 4);
        ctx.fillRect(this.x + 14, this.y + 4, 4, 4);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 7, this.y + 5, 2, 2);
        ctx.fillRect(this.x + 15, this.y + 5, 2, 2);

        // Angry eyebrows
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 6, this.y + 2, 6, 2);
        ctx.fillRect(this.x + 12, this.y + 2, 6, 2);

        // Feet animation
        if (this.animFrame === 0) {
            ctx.fillStyle = '#654321';
            ctx.fillRect(this.x + 4, this.y + this.height - 4, 6, 4);
            ctx.fillRect(this.x + 14, this.y + this.height - 4, 6, 4);
        } else {
            ctx.fillStyle = '#654321';
            ctx.fillRect(this.x + 2, this.y + this.height - 4, 6, 4);
            ctx.fillRect(this.x + 16, this.y + this.height - 4, 6, 4);
        }
    }

    drawKoopa(ctx) {
        // Shell
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(this.x, this.y + 6, this.width, this.height - 6);

        // Shell pattern
        ctx.fillStyle = '#008800';
        ctx.fillRect(this.x + 4, this.y + 10, this.width - 8, 4);
        ctx.fillRect(this.x + 2, this.y + 16, this.width - 4, 4);

        // Head (if not in shell)
        ctx.fillStyle = '#FFFF99';
        ctx.fillRect(this.x + 6, this.y, 12, 10);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 8, this.y + 2, 2, 2);
        ctx.fillRect(this.x + 14, this.y + 2, 2, 2);

        // Feet
        ctx.fillStyle = '#FFFF99';
        if (this.animFrame === 0) {
            ctx.fillRect(this.x + 2, this.y + this.height - 4, 4, 4);
            ctx.fillRect(this.x + 18, this.y + this.height - 4, 4, 4);
        } else {
            ctx.fillRect(this.x + 4, this.y + this.height - 4, 4, 4);
            ctx.fillRect(this.x + 16, this.y + this.height - 4, 4, 4);
        }
    }
}

class EnemyManager {
    constructor() {
        this.enemies = [];
    }

    addEnemy(x, y, type) {
        this.enemies.push(new Enemy(x, y, type));
    }

    update() {
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.alive) {
                enemy.update();
                return true;
            }
            return false;
        });
    }

    handlePlatformCollisions(platforms) {
        this.enemies.forEach(enemy => {
            platforms.forEach(platform => {
                enemy.handlePlatformCollision(platform);
            });
        });
    }

    checkPlayerCollisions(player) {
        return this.enemies.some(enemy => enemy.checkPlayerCollision(player));
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }

    clear() {
        this.enemies = [];
    }

    getCount() {
        return this.enemies.length;
    }
}