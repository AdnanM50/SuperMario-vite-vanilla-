// Utility functions for the game
class Utils {
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    static rectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    static pointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
               y >= rect.y && y <= rect.y + rect.height;
    }

    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    static sign(value) {
        return value > 0 ? 1 : value < 0 ? -1 : 0;
    }
}

// Sound simulation class
class SoundManager {
    static play(type) {
        // Simulate sound effects with visual feedback
        switch(type) {
            case 'jump':
                console.log('🔊 Jump sound');
                break;
            case 'coin':
                console.log('🔊 Coin collected');
                break;
            case 'enemyDefeat':
                console.log('🔊 Enemy defeated');
                break;
            case 'powerUp':
                console.log('🔊 Power up');
                break;
            case 'death':
                console.log('🔊 Death sound');
                break;
            case 'levelComplete':
                console.log('🔊 Level complete');
                break;
        }
    }
}

// Input manager
class InputManager {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault();
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
    }

    isPressed(key) {
        return !!this.keys[key];
    }

    isAnyPressed(keys) {
        return keys.some(key => this.keys[key]);
    }
}

// Create global input manager
const inputManager = new InputManager();