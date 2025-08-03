// Particle system for visual effects
class Particle {
    constructor(x, y, vx, vy, color, size, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.life = life;
        this.maxLife = life;
        this.gravity = 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
        
        // Fade out over time
        this.alpha = this.life / this.maxLife;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    addParticle(x, y, vx, vy, color, size, life) {
        this.particles.push(new Particle(x, y, vx, vy, color, size, life));
    }

    createCoinEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const speed = Utils.random(2, 5);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 2;
            this.addParticle(x, y, vx, vy, '#FFD700', 3, 30);
        }
    }

    createEnemyDefeatEffect(x, y) {
        for (let i = 0; i < 12; i++) {
            const vx = Utils.random(-4, 4);
            const vy = Utils.random(-6, -2);
            this.addParticle(x, y, vx, vy, '#FF6B6B', 2, 40);
        }
    }

    createJumpEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            const vx = Utils.random(-2, 2);
            const vy = Utils.random(1, 3);
            this.addParticle(x, y + 20, vx, vy, '#FFFFFF', 2, 20);
        }
    }

    createPowerUpEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const speed = Utils.random(3, 6);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.addParticle(x, y, vx, vy, '#00FF00', 4, 50);
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}

// Make ParticleSystem globally available
window.ParticleSystem = ParticleSystem;