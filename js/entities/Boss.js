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
        const time = Date.now();

        // Escudo rotatorio según la fase
        if (this.phase >= 2) {
            const shieldRadius = this.width * 0.7 + Math.sin(time * 0.003) * 5;
            const shieldSegments = 6;

            ctx.strokeStyle = `rgba(255, 100, 0, ${0.4 + Math.sin(time * 0.005) * 0.2})`;
            ctx.lineWidth = 3;

            for (let i = 0; i < shieldSegments; i++) {
                const angle = (Math.PI * 2 / shieldSegments) * i + time * 0.001;
                const x = renderX + this.width / 2 + Math.cos(angle) * shieldRadius;
                const y = renderY + this.height / 2 + Math.sin(angle) * shieldRadius;

                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = 'rgba(255, 200, 0, 0.6)';
                ctx.fill();
            }
        }

        // Aura de energía pulsante
        const pulse = Math.sin(time * 0.005) * 0.3 + 0.7;
        const gradient = ctx.createRadialGradient(
            renderX + this.width / 2,
            renderY + this.height / 2,
            0,
            renderX + this.width / 2,
            renderY + this.height / 2,
            this.width * 1.2
        );

        const phaseColors = [
            [255, 0, 0],    // Fase 1: Rojo
            [255, 100, 0],  // Fase 2: Naranja
            [255, 0, 100]   // Fase 3: Rojo-púrpura
        ];

        const color = phaseColors[this.phase - 1] || phaseColors[0];
        gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${pulse * 0.4})`);
        gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${pulse * 0.2})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(
            renderX - this.width * 0.3,
            renderY - this.height * 0.3,
            this.width * 1.6,
            this.height * 1.6
        );

        // Rayos de energía en fase 3
        if (this.phase === 3) {
            const numRays = 8;
            ctx.strokeStyle = `rgba(255, 50, 50, ${0.3 + Math.sin(time * 0.01) * 0.2})`;
            ctx.lineWidth = 2;

            for (let i = 0; i < numRays; i++) {
                const angle = (Math.PI * 2 / numRays) * i + time * 0.002;
                const startX = renderX + this.width / 2;
                const startY = renderY + this.height / 2;
                const endX = startX + Math.cos(angle) * (this.width * 0.8);
                const endY = startY + Math.sin(angle) * (this.height * 0.8);

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }

        // Renderizar boss con escala pulsante
        const bossSprite = spriteSystem.getSprite('boss');
        if (bossSprite) {
            // Efecto de daño
            if (this.health < this.maxHealth * 0.3) {
                ctx.globalAlpha = 0.7 + Math.sin(time * 0.02) * 0.3;
            }

            // Escala pulsante sutil
            const scale = 1.0 + Math.sin(time * 0.003) * 0.03;
            const scaledWidth = this.width * scale;
            const scaledHeight = this.height * scale;
            const offsetX = (this.width - scaledWidth) / 2;
            const offsetY = (this.height - scaledHeight) / 2;

            ctx.drawImage(
                bossSprite,
                renderX + offsetX,
                renderY + offsetY,
                scaledWidth,
                scaledHeight
            );
            ctx.globalAlpha = 1;
        }

        // Renderizar puntos débiles activos
        for (const wp of this.weakPoints) {
            if (!wp.active) continue;

            const wpX = renderX + wp.x;
            const wpY = renderY + wp.y;

            // Aura pulsante del punto débil
            const wpPulse = Math.sin(time * 0.008) * 0.5 + 0.5;
            const wpGradient = ctx.createRadialGradient(
                wpX + wp.width / 2,
                wpY + wp.height / 2,
                0,
                wpX + wp.width / 2,
                wpY + wp.height / 2,
                wp.width
            );
            wpGradient.addColorStop(0, `rgba(0, 255, 255, ${wpPulse * 0.6})`);
            wpGradient.addColorStop(1, 'transparent');

            ctx.fillStyle = wpGradient;
            ctx.fillRect(wpX - wp.width, wpY - wp.height, wp.width * 3, wp.height * 3);

            // Borde animado
            ctx.strokeStyle = `rgba(0, 255, 255, ${wpPulse})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(wpX - 2, wpY - 2, wp.width + 4, wp.height + 4);

            // Punto débil principal
            ctx.fillStyle = '#0ff';
            ctx.fillRect(wpX, wpY, wp.width, wp.height);

            // Núcleo brillante
            ctx.fillStyle = '#fff';
            const coreSize = 6 + wpPulse * 4;
            ctx.fillRect(
                wpX + wp.width / 2 - coreSize / 2,
                wpY + wp.height / 2 - coreSize / 2,
                coreSize,
                coreSize
            );

            // Indicador de vida del punto débil
            const wpHealthPercent = wp.health / 10;
            ctx.fillStyle = wpHealthPercent > 0.5 ? '#0f0' : '#f00';
            ctx.fillRect(wpX, wpY - 6, wp.width * wpHealthPercent, 3);

            // Borde del indicador
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.strokeRect(wpX, wpY - 6, wp.width, 3);
        }

        // Barra de vida principal
        const barWidth = this.width;
        const barHeight = 10;
        const healthPercentage = this.health / this.maxHealth;
        const barY = renderY - barHeight - 12;

        // Fondo de la barra con sombra
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#300';
        ctx.fillRect(renderX, barY, barWidth, barHeight);
        ctx.shadowBlur = 0;

        // Barra de vida con gradiente
        const healthGradient = ctx.createLinearGradient(
            renderX,
            barY,
            renderX + barWidth * healthPercentage,
            barY
        );

        if (healthPercentage > 0.66) {
            healthGradient.addColorStop(0, '#0f0');
            healthGradient.addColorStop(1, '#0ff');
        } else if (healthPercentage > 0.33) {
            healthGradient.addColorStop(0, '#ff0');
            healthGradient.addColorStop(1, '#f80');
        } else {
            healthGradient.addColorStop(0, '#f00');
            healthGradient.addColorStop(1, '#f50');
        }

        ctx.fillStyle = healthGradient;
        ctx.fillRect(
            renderX,
            barY,
            barWidth * healthPercentage,
            barHeight
        );

        // Efecto de brillo en la barra
        const glowGradient = ctx.createLinearGradient(
            renderX,
            barY,
            renderX,
            barY + barHeight
        );
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        glowGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

        ctx.fillStyle = glowGradient;
        ctx.fillRect(
            renderX,
            barY,
            barWidth * healthPercentage,
            barHeight
        );

        // Borde de la barra con brillo
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(renderX, barY, barWidth, barHeight);

        // Marcadores de daño
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            const markX = renderX + (barWidth / 4) * i;
            ctx.beginPath();
            ctx.moveTo(markX, barY);
            ctx.lineTo(markX, barY + barHeight);
            ctx.stroke();
        }

        // Indicador de fase con efecto de brillo
        ctx.shadowColor = color.length ? `rgb(${color[0]}, ${color[1]}, ${color[2]})` : '#f00';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fff';
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(`FASE ${this.phase}`, renderX + this.width / 2, renderY - 28);

        // Texto de nombre del boss
        ctx.shadowBlur = 8;
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = '#f00';
        ctx.fillText(`MEGA ROBOT LV.${this.level}`, renderX + this.width / 2, renderY - 45);
        ctx.shadowBlur = 0;

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
}
