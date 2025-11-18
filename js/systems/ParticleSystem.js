/**
 * ParticleSystem - Sistema de partículas para efectos visuales
 */
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createExplosion(x, y, color = '#ff0', count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = 2 + Math.random() * 3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                size: 3 + Math.random() * 3,
                color: color,
                type: 'explosion'
            });
        }
    }

    createTrail(x, y, color = '#0ff') {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: 0.5 + Math.random() * 1,
            life: 0.6,
            decay: 0.02,
            size: 2,
            color: color,
            type: 'trail'
        });
    }

    createSparks(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.8,
                decay: 0.03,
                size: 1,
                color: '#fff',
                type: 'spark'
            });
        }
    }

    createPowerUpGlow(x, y, color) {
        const count = 5;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const radius = 10;

            this.particles.push({
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius,
                vx: Math.cos(angle) * 0.2,
                vy: Math.sin(angle) * 0.2,
                life: 0.5,
                decay: 0.01,
                size: 3,
                color: color,
                type: 'glow'
            });
        }
    }

    update(deltaTime) {
        // Actualizar todas las partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Actualizar posición
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Actualizar vida
            particle.life -= particle.decay;

            // Aplicar gravedad ligera a explosiones
            if (particle.type === 'explosion') {
                particle.vy += 0.1;
            }

            // Eliminar partículas muertas
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        for (const particle of this.particles) {
            ctx.save();

            // Aplicar transparencia basada en vida
            ctx.globalAlpha = particle.life;

            // Color de la partícula
            ctx.fillStyle = particle.color;

            // Renderizar según el tipo
            if (particle.type === 'glow') {
                // Efecto de resplandor
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Partícula sólida
                ctx.fillRect(
                    particle.x - particle.size / 2,
                    particle.y - particle.size / 2,
                    particle.size,
                    particle.size
                );
            }

            ctx.restore();
        }
    }

    clear() {
        this.particles = [];
    }

    getParticleCount() {
        return this.particles.length;
    }
}
