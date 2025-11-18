/**
 * Enemy - Clase para enemigos
 */
class Enemy {
    constructor(x, y, type = 'enemy1', formationIndex = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.formationIndex = formationIndex;
        this.active = true;

        // Dimensiones según tipo
        this.setTypeProperties();

        // Movimiento
        this.baseX = x;
        this.baseY = y;
        this.vx = 0;
        this.vy = 0;

        // Combate
        this.shootCooldown = 1000 + Math.random() * 2000;
        this.lastShot = Date.now();
        this.shootProbability = 0.01;

        // Animación
        this.animationFrame = 0;
        this.animationTime = 0;

        // Patrón de movimiento
        this.movementPattern = 'sine';
        this.randomPattern = null;

        // Drop de power-ups
        this.dropChance = 0.15;
    }

    setTypeProperties() {
        switch (this.type) {
            case 'enemy1':
                this.width = 40;
                this.height = 40;
                this.health = 1;
                this.maxHealth = 1;
                this.score = 100;
                this.speed = 1;
                break;

            case 'enemy2':
                this.width = 40;
                this.height = 40;
                this.health = 2;
                this.maxHealth = 2;
                this.score = 200;
                this.speed = 1.5;
                this.shootProbability = 0.015;
                break;

            case 'enemy3':
                this.width = 48;
                this.height = 48;
                this.health = 3;
                this.maxHealth = 3;
                this.score = 300;
                this.speed = 0.8;
                this.shootProbability = 0.02;
                break;

            case 'enemyElite':
                this.width = 56;
                this.height = 56;
                this.health = 5;
                this.maxHealth = 5;
                this.score = 500;
                this.speed = 1.2;
                this.shootProbability = 0.025;
                this.dropChance = 0.4;
                break;

            default:
                this.width = 40;
                this.height = 40;
                this.health = 1;
                this.maxHealth = 1;
                this.score = 100;
                this.speed = 1;
        }
    }

    update(deltaTime, formationSystem, time, canvasWidth) {
        // Obtener patrón de movimiento de la formación
        const movement = formationSystem.getMovePattern(this.movementPattern, time, this);

        // Actualizar posición basada en el patrón
        this.vx = movement.x * this.speed;
        this.vy = movement.y * this.speed;

        this.x += this.vx;
        this.y += this.vy;

        // Limitar a los bordes laterales
        if (this.x < 0) this.x = 0;
        if (this.x > canvasWidth - this.width) {
            this.x = canvasWidth - this.width;
        }

        // Actualizar animación
        this.animationTime += deltaTime;
        if (this.animationTime > 200) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTime = 0;
        }
    }

    shouldShoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shootCooldown && Math.random() < this.shootProbability) {
            this.lastShot = now;
            return true;
        }
        return false;
    }

    shoot() {
        return {
            x: this.x + this.width / 2 - 4,
            y: this.y + this.height,
            vx: 0,
            vy: 4 + Math.random() * 2,
            width: 8,
            height: 16,
            damage: 10,
            type: 'enemyBullet'
        };
    }

    takeDamage(damage) {
        this.health -= damage;

        if (this.health <= 0) {
            this.health = 0;
            this.destroy();
            return true;
        }

        return false;
    }

    destroy() {
        this.active = false;
    }

    shouldDropPowerUp() {
        return Math.random() < this.dropChance;
    }

    getRandomPowerUpType() {
        const types = ['SHIELD', 'TRIPLE', 'LASER', 'BOMB', 'LIFE'];
        const weights = [25, 30, 25, 10, 10]; // Porcentajes

        const total = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * total;

        for (let i = 0; i < types.length; i++) {
            if (random < weights[i]) {
                return types[i];
            }
            random -= weights[i];
        }

        return types[0];
    }

    render(ctx, spriteSystem) {
        if (!this.active) return;

        ctx.save();

        // Efecto de daño (parpadeo rojo)
        if (this.health < this.maxHealth) {
            const damageAlpha = 1 - (this.health / this.maxHealth);
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
            ctx.fillStyle = `rgba(255, 0, 0, ${damageAlpha * 0.3})`;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
        }

        // Renderizar enemigo
        const sprite = spriteSystem.getSprite(this.type);
        if (sprite) {
            // Pequeña oscilación para dar sensación de vida
            const wobble = Math.sin(Date.now() * 0.003 + this.formationIndex) * 2;
            ctx.drawImage(sprite, this.x + wobble, this.y);
        }

        // Barra de vida para enemigos más fuertes
        if (this.maxHealth > 1) {
            const healthBarWidth = this.width;
            const healthBarHeight = 4;
            const healthPercentage = this.health / this.maxHealth;

            // Fondo de la barra
            ctx.fillStyle = '#600';
            ctx.fillRect(
                this.x,
                this.y - healthBarHeight - 2,
                healthBarWidth,
                healthBarHeight
            );

            // Barra de vida
            ctx.fillStyle = healthPercentage > 0.5 ? '#0f0' : healthPercentage > 0.25 ? '#ff0' : '#f00';
            ctx.fillRect(
                this.x,
                this.y - healthBarHeight - 2,
                healthBarWidth * healthPercentage,
                healthBarHeight
            );
        }

        ctx.restore();
    }

    isOffScreen(canvasHeight) {
        return this.y > canvasHeight + this.height;
    }

    setMovementPattern(pattern) {
        this.movementPattern = pattern;
    }

    setBasePosition(x, y) {
        this.baseX = x;
        this.baseY = y;
    }
}
