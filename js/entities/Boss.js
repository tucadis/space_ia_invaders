/**
 * Boss - Clase para jefes finales con efectos especiales
 */
class Boss {
    constructor(x, y, level = 1) {
        this.x = x;
        this.y = y;
        this.width = 128;
        this.height = 128;
        this.level = level;

        // Salud escalada por nivel
        this.maxHealth = 50 + (level * 30);
        this.health = this.maxHealth;

        // Movimiento
        this.vx = 2;
        this.vy = 0;
        this.baseY = y;
        this.movementTime = 0;

        // Combate
        this.active = true;
        this.phase = 1; // Fases de combate
        this.maxPhases = 3;

        // Patrones de ataque
        this.attackPatterns = ['spread', 'spiral', 'laser', 'missiles'];
        this.currentPattern = 'spread';
        this.attackCooldown = 2000;
        this.lastAttack = Date.now();

        // Partes destructibles (puntos débiles)
        this.weakPoints = this.createWeakPoints();

        // Animación
        this.animationFrame = 0;
        this.animationTime = 0;

        // Efectos
        this.shaking = false;
        this.shakeIntensity = 0;

        // Puntuación
        this.score = 5000 * level;

        // Estado 3D
        this.is3D = false;
        this.rotation3D = { x: 0, y: 0, z: 0 };
    }

    createWeakPoints() {
        return [
            { x: 50, y: 60, width: 24, height: 24, health: 10, active: true },
            { x: 20, y: 50, width: 20, height: 20, health: 8, active: true },
            { x: 90, y: 50, width: 20, height: 20, health: 8, active: true }
        ];
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        this.movementTime += deltaTime;

        // Movimiento horizontal
        this.x += this.vx;

        // Cambiar dirección en los bordes
        if (this.x <= 50 || this.x >= canvasWidth - this.width - 50) {
            this.vx *= -1;
            this.y = Math.min(this.y + 20, 150);
        }

        // Movimiento vertical ondulante
        this.y = this.baseY + Math.sin(this.movementTime * 0.001) * 30;

        // Actualizar fase basada en salud
        const healthPercentage = this.health / this.maxHealth;
        if (healthPercentage < 0.33 && this.phase < 3) {
            this.phase = 3;
            this.attackCooldown = 1200;
        } else if (healthPercentage < 0.66 && this.phase < 2) {
            this.phase = 2;
            this.attackCooldown = 1500;
        }

        // Actualizar animación
        this.animationTime += deltaTime;
        if (this.animationTime > 150) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTime = 0;
        }

        // Actualizar sacudida
        if (this.shaking) {
            this.shakeIntensity *= 0.9;
            if (this.shakeIntensity < 0.5) {
                this.shaking = false;
                this.shakeIntensity = 0;
            }
        }

        // Actualizar rotación 3D
        if (this.is3D) {
            this.rotation3D.y += 0.02;
            this.rotation3D.x = Math.sin(this.movementTime * 0.001) * 0.3;
        }
    }

    shouldAttack() {
        const now = Date.now();
        if (now - this.lastAttack > this.attackCooldown) {
            this.lastAttack = now;
            return true;
        }
        return false;
    }

    attack() {
        // Cambiar patrón basado en la fase
        const patterns = this.getAvailablePatterns();
        this.currentPattern = patterns[Math.floor(Math.random() * patterns.length)];

        return this.executeAttackPattern();
    }

    getAvailablePatterns() {
        switch (this.phase) {
            case 1:
                return ['spread', 'spiral'];
            case 2:
                return ['spread', 'spiral', 'laser'];
            case 3:
                return ['spread', 'spiral', 'laser', 'missiles'];
            default:
                return ['spread'];
        }
    }

    executeAttackPattern() {
        const projectiles = [];
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height;

        switch (this.currentPattern) {
            case 'spread':
                // Disparo en abanico
                const spreadCount = 5 + this.phase * 2;
                const spreadAngle = Math.PI / 3;
                for (let i = 0; i < spreadCount; i++) {
                    const angle = -Math.PI / 2 + (spreadAngle * (i / (spreadCount - 1)) - spreadAngle / 2);
                    projectiles.push({
                        x: centerX,
                        y: centerY,
                        vx: Math.cos(angle) * 4,
                        vy: Math.sin(angle) * 4 + 2,
                        width: 12,
                        height: 12,
                        damage: 15,
                        type: 'enemyBullet'
                    });
                }
                break;

            case 'spiral':
                // Espiral
                const spiralCount = 8;
                for (let i = 0; i < spiralCount; i++) {
                    const angle = (Math.PI * 2 / spiralCount) * i + this.movementTime * 0.003;
                    projectiles.push({
                        x: centerX,
                        y: centerY,
                        vx: Math.cos(angle) * 3,
                        vy: Math.sin(angle) * 3 + 1,
                        width: 10,
                        height: 10,
                        damage: 12,
                        type: 'enemyBullet'
                    });
                }
                break;

            case 'laser':
                // Láser potente
                projectiles.push({
                    x: centerX - 6,
                    y: centerY,
                    vx: 0,
                    vy: 8,
                    width: 12,
                    height: 40,
                    damage: 20,
                    type: 'enemyBullet'
                });
                break;

            case 'missiles':
                // Misiles
                for (let i = 0; i < 3; i++) {
                    projectiles.push({
                        x: centerX + (i - 1) * 30,
                        y: centerY,
                        vx: (i - 1) * 2,
                        vy: 3,
                        width: 12,
                        height: 20,
                        damage: 25,
                        type: 'enemyBullet',
                        homing: false
                    });
                }
                break;
        }

        return projectiles;
    }

    takeDamage(damage, hitX, hitY) {
        // Verificar si golpeó un punto débil
        let hitWeakPoint = false;
        for (const wp of this.weakPoints) {
            if (!wp.active) continue;

            const wpX = this.x + wp.x;
            const wpY = this.y + wp.y;

            if (hitX >= wpX && hitX <= wpX + wp.width &&
                hitY >= wpY && hitY <= wpY + wp.height) {
                wp.health -= damage * 2; // Daño doble en puntos débiles
                hitWeakPoint = true;

                if (wp.health <= 0) {
                    wp.active = false;
                    this.health -= 10; // Daño extra al destruir punto débil
                }
                break;
            }
        }

        if (!hitWeakPoint) {
            this.health -= damage;
        }

        // Efecto de sacudida
        this.shaking = true;
        this.shakeIntensity = 5;

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

    render(ctx, spriteSystem, particleSystem) {
        if (!this.active) return;

        ctx.save();

        // Aplicar sacudida
        let shakeX = 0;
        let shakeY = 0;
        if (this.shaking) {
            shakeX = (Math.random() - 0.5) * this.shakeIntensity;
            shakeY = (Math.random() - 0.5) * this.shakeIntensity;
        }

        const renderX = this.x + shakeX;
        const renderY = this.y + shakeY;

        // Aura de energía
        const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
        const gradient = ctx.createRadialGradient(
            renderX + this.width / 2,
            renderY + this.height / 2,
            0,
            renderX + this.width / 2,
            renderY + this.height / 2,
            this.width
        );
        gradient.addColorStop(0, `rgba(255, 0, 0, ${pulse * 0.3})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(
            renderX - this.width * 0.2,
            renderY - this.height * 0.2,
            this.width * 1.4,
            this.height * 1.4
        );

        // Renderizar boss
        const bossSprite = spriteSystem.getSprite('boss');
        if (bossSprite) {
            // Efecto de daño
            if (this.health < this.maxHealth * 0.3) {
                ctx.globalAlpha = 0.7 + Math.sin(Date.now() * 0.02) * 0.3;
            }

            ctx.drawImage(bossSprite, renderX, renderY);
            ctx.globalAlpha = 1;
        }

        // Renderizar puntos débiles activos
        for (const wp of this.weakPoints) {
            if (!wp.active) continue;

            const wpX = renderX + wp.x;
            const wpY = renderY + wp.y;

            // Brillo del punto débil
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.fillRect(wpX - 2, wpY - 2, wp.width + 4, wp.height + 4);

            ctx.fillStyle = '#0ff';
            ctx.fillRect(wpX, wpY, wp.width, wp.height);

            // Indicador de vida del punto débil
            const wpHealthPercent = wp.health / 10;
            ctx.fillStyle = wpHealthPercent > 0.5 ? '#0f0' : '#f00';
            ctx.fillRect(wpX, wpY - 4, wp.width * wpHealthPercent, 2);
        }

        // Barra de vida principal
        const barWidth = this.width;
        const barHeight = 8;
        const healthPercentage = this.health / this.maxHealth;

        ctx.fillStyle = '#300';
        ctx.fillRect(renderX, renderY - barHeight - 10, barWidth, barHeight);

        // Gradiente de color basado en salud
        let healthColor;
        if (healthPercentage > 0.66) {
            healthColor = '#0f0';
        } else if (healthPercentage > 0.33) {
            healthColor = '#ff0';
        } else {
            healthColor = '#f00';
        }

        ctx.fillStyle = healthColor;
        ctx.fillRect(
            renderX,
            renderY - barHeight - 10,
            barWidth * healthPercentage,
            barHeight
        );

        // Borde de la barra
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(renderX, renderY - barHeight - 10, barWidth, barHeight);

        // Indicador de fase
        ctx.fillStyle = '#fff';
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(`FASE ${this.phase}`, renderX + this.width / 2, renderY - 25);

        ctx.restore();

        // Crear partículas de daño
        if (this.shaking && Math.random() > 0.5) {
            particleSystem.createSparks(
                renderX + Math.random() * this.width,
                renderY + Math.random() * this.height,
                3
            );
        }
    }

    getHealthPercentage() {
        return (this.health / this.maxHealth) * 100;
    }

    enable3DMode() {
        this.is3D = true;
    }

    disable3DMode() {
        this.is3D = false;
        this.rotation3D = { x: 0, y: 0, z: 0 };
    }
}
