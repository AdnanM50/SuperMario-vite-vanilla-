// Collectible items (coins, power-ups)
class Collectible {
    constructor(x, y, type = 'coin') {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.floatOffset = 0;
        this.floatSpeed = 0.1;
        this.originalY = y;
    }

    update() {
        if (this.collected) return;

        this.updateAnimation();
        this.updateFloat();
    }

    updateAnimation() {
        this.animTimer++;
        if (this.animTimer > 15) {
            this.animFrame = (this.animFrame + 1) % 4;
            this.animTimer = 0;
        }
    }

    updateFloat() {
        this.floatOffset += this.floatSpeed;
        this.y = this.originalY + Math.sin(this.floatOffset) * 3;
    }

    checkPlayerCollision(player) {
        if (this.collected) return false;

        if (Utils.rectCollision(this, player)) {
            this.collect(player);
            return true;
        }
        return false;
    }

    collect(player) {
        this.collected = true;
        
        switch(this.type) {
            case 'coin':
                game.coins++;
                game.score += 200;
                SoundManager.play('coin');
                game.particleSystem.createCoinEffect(this.x + this.width / 2, this.y + this.height / 2);
                break;
            case 'mushroom':
                player.grow();
                game.score += 1000;
                break;
            case 'star':
                player.makeInvulnerable();
                player.invulnerabilityTimer = 600; // 10 seconds
                game.score += 1000;
                break;
        }
    }

    draw(ctx) {
        if (this.collected) return;

        ctx.save();

        switch(this.type) {
            case 'coin':
                this.drawCoin(ctx);
                break;
            case 'mushroom':
                this.drawMushroom(ctx);
                break;
            case 'star':
                this.drawStar(ctx);
                break;
        }

        ctx.restore();
    }

    drawCoin(ctx) {
        // Spinning coin effect
        const spinWidth = Math.abs(Math.cos(this.animFrame * Math.PI / 2)) * this.width;
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x + (this.width - spinWidth) / 2, this.y, spinWidth, this.height);
        
        // Inner circle
        ctx.fillStyle = '#FFA500';
        const innerWidth = spinWidth * 0.6;
        ctx.fillRect(this.x + (this.width - innerWidth) / 2, this.y + 4, innerWidth, this.height - 8);
        
        // Highlight
        ctx.fillStyle = '#FFFF99';
        const highlightWidth = spinWidth * 0.3;
        ctx.fillRect(this.x + (this.width - highlightWidth) / 2, this.y + 2, highlightWidth, 4);
    }

    drawMushroom(ctx) {
        // Mushroom cap
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(this.x, this.y, this.width, 12);
        
        // White spots
        ctx.fillStyle = '#FFF';
        ctx.fillRect(this.x + 4, this.y + 2, 4, 4);
        ctx.fillRect(this.x + 12, this.y + 2, 4, 4);
        ctx.fillRect(this.x + 8, this.y + 6, 4, 4);
        
        // Stem
        ctx.fillStyle = '#FFFACD';
        ctx.fillRect(this.x + 6, this.y + 12, 8, 8);
    }

    drawStar(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const size = 8;
        
        // Star shape with animation
        const rotation = this.animFrame * Math.PI / 8;
        
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Star glow
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Inner star
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const x = Math.cos(angle) * (size * 0.6);
            const y = Math.sin(angle) * (size * 0.6);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }
}

class CollectibleManager {
    constructor() {
        this.collectibles = [];
    }

    addCollectible(x, y, type) {
        this.collectibles.push(new Collectible(x, y, type));
    }

    update() {
        this.collectibles.forEach(collectible => collectible.update());
        
        // Remove collected items
        this.collectibles = this.collectibles.filter(collectible => !collectible.collected);
    }

    checkPlayerCollisions(player) {
        this.collectibles.forEach(collectible => {
            collectible.checkPlayerCollision(player);
        });
    }

    draw(ctx) {
        this.collectibles.forEach(collectible => collectible.draw(ctx));
    }

    clear() {
        this.collectibles = [];
    }

    getCount() {
        return this.collectibles.length;
    }
}