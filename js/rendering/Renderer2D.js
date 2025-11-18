/**
 * Renderer2D - Sistema de renderizado 2D principal
 */
class Renderer2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
    }

    setupCanvas() {
        // Configurar el canvas para que sea responsive
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Configuración de renderizado pixel-perfect
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(gameState, spriteSystem, particleSystem, sceneGenerator) {
        // Limpiar canvas
        this.clear();

        // Renderizar fondo (escenario)
        sceneGenerator.render(this.ctx);

        // Renderizar entidades en orden
        this.renderPowerUps(gameState.powerUps, spriteSystem, particleSystem);
        this.renderProjectiles(gameState.projectiles, spriteSystem);
        this.renderEnemyProjectiles(gameState.enemyProjectiles, spriteSystem);
        this.renderEnemies(gameState.enemies, spriteSystem);

        // Renderizar boss si existe
        if (gameState.boss && gameState.boss.active) {
            gameState.boss.render(this.ctx, spriteSystem, particleSystem);
        }

        // Renderizar jugador
        if (gameState.player && gameState.player.active) {
            gameState.player.render(this.ctx, spriteSystem, particleSystem);
        }

        // Renderizar partículas
        particleSystem.render(this.ctx);

        // Efectos especiales
        this.renderEffects(gameState);
    }

    renderPowerUps(powerUps, spriteSystem, particleSystem) {
        for (const powerUp of powerUps) {
            if (powerUp.active) {
                powerUp.render(this.ctx, spriteSystem, particleSystem);
            }
        }
    }

    renderProjectiles(projectiles, spriteSystem) {
        for (const projectile of projectiles) {
            if (projectile.active) {
                projectile.render(this.ctx, spriteSystem);
            }
        }
    }

    renderEnemyProjectiles(projectiles, spriteSystem) {
        for (const projectile of projectiles) {
            if (projectile.active) {
                // Renderizar proyectil enemigo
                const sprite = spriteSystem.getSprite('enemyBullet');
                if (sprite) {
                    this.ctx.drawImage(sprite, projectile.x, projectile.y);
                }
            }
        }
    }

    renderEnemies(enemies, spriteSystem) {
        for (const enemy of enemies) {
            if (enemy.active) {
                enemy.render(this.ctx, spriteSystem);
            }
        }
    }

    renderEffects(gameState) {
        // Efecto de flash al tomar daño
        if (gameState.screenFlash > 0) {
            this.ctx.save();
            this.ctx.globalAlpha = gameState.screenFlash;
            this.ctx.fillStyle = '#f00';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }

        // Efecto de vignette en boss battles
        if (gameState.boss && gameState.boss.active) {
            this.renderVignette();
        }
    }

    renderVignette() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.height * 0.3,
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.height * 0.8
        );

        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawText(text, x, y, options = {}) {
        const {
            size = 16,
            color = '#fff',
            align = 'left',
            shadow = true,
            shadowColor = '#000'
        } = options;

        this.ctx.save();

        this.ctx.font = `${size}px "Press Start 2P"`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;

        if (shadow) {
            this.ctx.shadowColor = shadowColor;
            this.ctx.shadowBlur = 4;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }

        this.ctx.fillText(text, x, y);

        this.ctx.restore();
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.ctx;
    }
}
