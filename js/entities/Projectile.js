/**
 * Projectile - Clase para proyectiles del jugador y enemigos
 */
class Projectile {
    constructor(x, y, vx, vy, type = 'bullet', damage = 1, isPlayerProjectile = true) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.damage = damage;
        this.isPlayerProjectile = isPlayerProjectile;
        this.active = true;
        this.homing = false;
        this.target = null;

        // Dimensiones según el tipo
        switch (type) {
            case 'laser':
                this.width = 12;
                this.height = 24;
                break;
            case 'missile':
                this.width = 12;
                this.height = 20;
                break;
            default:
                this.width = 8;
                this.height = 16;
        }

        this.trailParticles = [];
    }

    update(deltaTime, enemies = []) {
        // Movimiento homing para misiles
        if (this.homing && this.isPlayerProjectile && enemies.length > 0) {
            if (!this.target || !this.target.active) {
                this.target = this.findNearestEnemy(enemies);
            }

            if (this.target && this.target.active) {
                const dx = (this.target.x + this.target.width / 2) - (this.x + this.width / 2);
                const dy = (this.target.y + this.target.height / 2) - (this.y + this.height / 2);
                const angle = Math.atan2(dy, dx);

                const homingStrength = 0.2;
                this.vx += Math.cos(angle) * homingStrength;
                this.vy += Math.sin(angle) * homingStrength;

                // Limitar velocidad máxima
                const maxSpeed = 10;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }
            }
        }

        // Actualizar posición
        this.x += this.vx;
        this.y += this.vy;

        // Crear estela para misiles
        if (this.type === 'missile' && Math.random() > 0.5) {
            this.trailParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                life: 1.0
            });
        }

        // Actualizar partículas de estela
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            this.trailParticles[i].life -= 0.05;
            if (this.trailParticles[i].life <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }
    }

    findNearestEnemy(enemies) {
        let nearest = null;
        let minDist = Infinity;

        for (const enemy of enemies) {
            if (!enemy.active) continue;

            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = dx * dx + dy * dy;

            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }

        return nearest;
    }

    render(ctx, spriteSystem) {
        if (!this.active) return;

        // Renderizar estela de misiles
        if (this.type === 'missile') {
            for (const particle of this.trailParticles) {
                ctx.save();
                ctx.globalAlpha = particle.life * 0.5;
                ctx.fillStyle = '#ff0';
                ctx.fillRect(particle.x - 2, particle.y, 4, 4);
                ctx.restore();
            }
        }

        // Renderizar proyectil
        let sprite;
        if (this.isPlayerProjectile) {
            sprite = spriteSystem.getSprite(this.type);
        } else {
            sprite = spriteSystem.getSprite('enemyBullet');
        }

        if (sprite) {
            ctx.drawImage(sprite, this.x, this.y);
        }

        // Efecto de brillo para láser
        if (this.type === 'laser') {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#0ff';
            ctx.fillRect(this.x - 4, this.y, this.width + 8, this.height);
            ctx.restore();
        }
    }

    isOffScreen(canvasHeight) {
        return this.y < -this.height || this.y > canvasHeight;
    }

    destroy() {
        this.active = false;
    }
}
