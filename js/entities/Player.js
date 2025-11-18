/**
 * Player - Clase de la nave del jugador
 */
class Player {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.canvas = canvas;

        // Movimiento
        this.speed = 6;
        this.vx = 0;
        this.vy = 0;

        // Salud y escudo
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.shield = false;
        this.shieldDuration = 0;
        this.invulnerable = false;
        this.invulnerableTime = 0;

        // Vidas
        this.lives = 3;

        // Animación
        this.thrustFrame = 0;
        this.animationTime = 0;

        // Estado
        this.active = true;
        this.respawning = false;

        // Input
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            shoot: false
        };
    }

    handleInput(keys) {
        this.keys = keys;
    }

    update(deltaTime) {
        // Actualizar velocidad basada en input
        this.vx = 0;
        this.vy = 0;

        if (this.keys.left) this.vx = -this.speed;
        if (this.keys.right) this.vx = this.speed;
        if (this.keys.up) this.vy = -this.speed;
        if (this.keys.down) this.vy = this.speed;

        // Actualizar posición
        this.x += this.vx;
        this.y += this.vy;

        // Limitar a los bordes de la pantalla
        const margin = 10;
        if (this.x < margin) this.x = margin;
        if (this.x > this.canvas.width - this.width - margin) {
            this.x = this.canvas.width - this.width - margin;
        }
        if (this.y < this.canvas.height * 0.3) {
            this.y = this.canvas.height * 0.3;
        }
        if (this.y > this.canvas.height - this.height - margin) {
            this.y = this.canvas.height - this.height - margin;
        }

        // Actualizar animación de propulsión
        this.animationTime += deltaTime;
        if (this.animationTime > 100) {
            this.thrustFrame = (this.thrustFrame + 1) % 2;
            this.animationTime = 0;
        }

        // Actualizar escudo
        if (this.shieldDuration > 0) {
            this.shieldDuration -= deltaTime;
            if (this.shieldDuration <= 0) {
                this.shield = false;
            }
        }

        // Actualizar invulnerabilidad
        if (this.invulnerableTime > 0) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }

    render(ctx, spriteSystem, particleSystem) {
        if (!this.active) return;

        ctx.save();

        // Efecto de parpadeo si es invulnerable
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Renderizar escudo
        if (this.shield) {
            const shieldRadius = 40 + Math.sin(Date.now() * 0.01) * 3;
            const gradient = ctx.createRadialGradient(
                this.x + this.width / 2,
                this.y + this.height / 2,
                0,
                this.x + this.width / 2,
                this.y + this.height / 2,
                shieldRadius
            );
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
            gradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0.6)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                shieldRadius,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Renderizar propulsión
        const thrustSprite = spriteSystem.getSprite('playerThrust');
        if (thrustSprite && this.thrustFrame === 0) {
            ctx.drawImage(thrustSprite, this.x, this.y);
        }

        // Crear partículas de propulsión
        if (Math.random() > 0.7) {
            particleSystem.createTrail(
                this.x + this.width / 2,
                this.y + this.height,
                '#0ff'
            );
        }

        // Renderizar nave
        const playerSprite = spriteSystem.getSprite('player');
        if (playerSprite) {
            ctx.drawImage(playerSprite, this.x, this.y);
        }

        ctx.restore();
    }

    takeDamage(damage) {
        if (this.invulnerable) return false;

        if (this.shield) {
            // El escudo absorbe el daño
            this.shield = false;
            this.shieldDuration = 0;
            this.setInvulnerable(1000);
            return false;
        }

        this.health -= damage;

        if (this.health <= 0) {
            this.health = 0;
            this.die();
            return true;
        }

        this.setInvulnerable(1500);
        return false;
    }

    die() {
        this.lives--;
        if (this.lives > 0) {
            this.respawn();
        } else {
            this.active = false;
        }
    }

    respawn() {
        this.health = this.maxHealth;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = this.canvas.height - this.height - 50;
        this.setInvulnerable(3000);
        this.respawning = true;
        setTimeout(() => {
            this.respawning = false;
        }, 3000);
    }

    setInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerableTime = duration;
    }

    activateShield(duration) {
        this.shield = true;
        this.shieldDuration = duration;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    addLife() {
        this.lives++;
    }

    getHealthPercentage() {
        return (this.health / this.maxHealth) * 100;
    }

    reset() {
        this.health = this.maxHealth;
        this.lives = 3;
        this.shield = false;
        this.shieldDuration = 0;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.active = true;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = this.canvas.height - this.height - 50;
    }
}
