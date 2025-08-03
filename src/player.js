// Player character class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.vx = 0;
        this.vy = 0;
        this.speed = 4;
        this.jumpPower = 12;
        this.gravity = 0.5;
        this.maxFallSpeed = 15;
        this.onGround = false;
        this.direction = 1; // 1 for right, -1 for left
        this.animFrame = 0;
        this.animTimer = 0;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.lives = 3;
        this.big = false;
        this.powerUpTimer = 0;
        this.firePower = false;
        this.firePowerTimer = 0;
    }

    update() {
        this.handleInput();
        this.updatePhysics();
        this.updateAnimation();
        this.updateInvulnerability();
        this.updatePowerUp();
        this.updateFirePower();
    }

    handleInput() {
        // Horizontal movement
        if (inputManager.isPressed('ArrowLeft')) {
            this.vx = -this.speed;
            this.direction = -1;
        } else if (inputManager.isPressed('ArrowRight')) {
            this.vx = this.speed;
            this.direction = 1;
        } else {
            this.vx *= 0.8; // Friction
        }

        // Jumping
        if (inputManager.isPressed('Space') && this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
            SoundManager.play('jump');
            game.particleSystem.createJumpEffect(this.x + this.width / 2, this.y + this.height);
        }
        
        // Fire shooting (if player has fire power)
        if (inputManager.isPressed('KeyX') && this.firePower) {
            this.shootFireball();
        }
    }

    shootFireball() {
        // Add fireball shooting logic here
        console.log('🔥 Fireball shot!');
        SoundManager.play('fireball');
    }

    updatePhysics() {
        // Apply gravity
        if (!this.onGround) {
            this.vy += this.gravity;
            this.vy = Math.min(this.vy, this.maxFallSpeed);
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Reset ground state
        this.onGround = false;
    }

    updateAnimation() {
        if (Math.abs(this.vx) > 0.1) {
            this.animTimer++;
            if (this.animTimer > 8) {
                this.animFrame = (this.animFrame + 1) % 4;
                this.animTimer = 0;
            }
        } else {
            this.animFrame = 0;
        }
    }

    updateInvulnerability() {
        if (this.invulnerable) {
            this.invulnerabilityTimer--;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
    }

    updatePowerUp() {
        if (this.big && this.powerUpTimer > 0) {
            this.powerUpTimer--;
            if (this.powerUpTimer <= 0) {
                this.shrink();
            }
        }
    }

    updateFirePower() {
        if (this.firePower && this.firePowerTimer > 0) {
            this.firePowerTimer--;
            if (this.firePowerTimer <= 0) {
                this.firePower = false;
            }
        }
    }

    handlePlatformCollision(platform) {
        platform.playerOn = false; // Reset platform interaction
        
        const playerBottom = this.y + this.height;
        const playerTop = this.y;
        const playerLeft = this.x;
        const playerRight = this.x + this.width;
        
        const platformTop = platform.y;
        const platformBottom = platform.y + platform.height;
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;

        // Check if collision is happening
        if (Utils.rectCollision(this, platform)) {
            // Determine collision side based on overlap
            const overlapLeft = playerRight - platformLeft;
            const overlapRight = platformRight - playerLeft;
            const overlapTop = playerBottom - platformTop;
            const overlapBottom = platformBottom - playerTop;

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapTop && this.vy > 0) {
                // Landing on top
                this.y = platformTop - this.height;
                this.vy = 0;
                this.onGround = true;
                platform.playerOn = true;
                return true; // Player is on this platform
            } else if (minOverlap === overlapBottom && this.vy < 0) {
                // Hitting from below
                this.y = platformBottom;
                this.vy = 0;
            } else if (minOverlap === overlapLeft && this.vx > 0) {
                // Hitting from left
                this.x = platformLeft - this.width;
                this.vx = 0;
            } else if (minOverlap === overlapRight && this.vx < 0) {
                // Hitting from right
                this.x = platformRight;
                this.vx = 0;
            }
        }
        return false;
    }

    takeDamage() {
        if (this.invulnerable) return false;

        if (this.big) {
            this.shrink();
            this.makeInvulnerable();
            return false;
        } else {
            this.lives--;
            this.makeInvulnerable();
            SoundManager.play('death');
            return this.lives <= 0;
        }
    }

    makeInvulnerable() {
        this.invulnerable = true;
        this.invulnerabilityTimer = 120; // 2 seconds at 60fps
    }

    grow() {
        if (!this.big) {
            this.big = true;
            this.height = 48;
            this.y -= 16; // Adjust position to prevent clipping
            this.powerUpTimer = 1800; // 30 seconds
            SoundManager.play('powerUp');
            game.particleSystem.createPowerUpEffect(this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    gainFirePower() {
        this.firePower = true;
        this.firePowerTimer = 1800; // 30 seconds
        SoundManager.play('powerUp');
        game.particleSystem.createPowerUpEffect(this.x + this.width / 2, this.y + this.height / 2);
    }

    shrink() {
        if (this.big) {
            this.big = false;
            this.height = 32;
            this.y += 16;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Flash effect when invulnerable
        if (this.invulnerable && Math.floor(this.invulnerabilityTimer / 5) % 2) {
            ctx.globalAlpha = 0.5;
        }

        // Player body
        let bodyColor = '#4ECDC4';
        if (this.big) bodyColor = '#FF6B6B';
        if (this.firePower) bodyColor = '#FF4500';
        
        ctx.fillStyle = bodyColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Simple face
        ctx.fillStyle = '#FFF';
        const eyeY = this.y + 8;
        const eyeSize = 4;
        
        if (this.direction === 1) {
            // Eyes looking right
            ctx.fillRect(this.x + 18, eyeY, eyeSize, eyeSize);
            ctx.fillRect(this.x + 24, eyeY, eyeSize, eyeSize);
        } else {
            // Eyes looking left
            ctx.fillRect(this.x + 4, eyeY, eyeSize, eyeSize);
            ctx.fillRect(this.x + 10, eyeY, eyeSize, eyeSize);
        }

        // Mustache
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 8, this.y + 16, 16, 4);

        // Hat
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x + 4, this.y - 4, 24, 8);

        // Moving legs animation
        if (Math.abs(this.vx) > 0.1) {
            ctx.fillStyle = '#2C3E50';
            const legOffset = Math.sin(this.animFrame) * 2;
            ctx.fillRect(this.x + 8 + legOffset, this.y + this.height - 8, 6, 8);
            ctx.fillRect(this.x + 18 - legOffset, this.y + this.height - 8, 6, 8);
        } else {
            // Standing legs
            ctx.fillStyle = '#2C3E50';
            ctx.fillRect(this.x + 8, this.y + this.height - 8, 6, 8);
            ctx.fillRect(this.x + 18, this.y + this.height - 8, 6, 8);
        }

        ctx.restore();
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.direction = 1;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.shrink();
        this.firePower = false;
    }
}