/**
 * PowerUp - Clase para power-ups que caen de los enemigos
 */
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 24;
        this.height = 24;
        this.vy = 2;
        this.active = true;
        this.floatOffset = Math.random() * Math.PI * 2;
        this.time = 0;

        // Tipos de power-ups
        this.types = {
            'SHIELD': {
                color: '#0ff',
                description: 'Escudo de energía',
                duration: 15000
            },
            'TRIPLE': {
                color: '#f00',
                description: 'Triple disparo',
                duration: 12000
            },
            'LASER': {
                color: '#0f0',
                description: 'Láser continuo',
                duration: 10000
            },
            'BOMB': {
                color: '#f80',
                description: 'Bomba nuclear',
                duration: 0
            },
            'LIFE': {
                color: '#f0f',
                description: 'Vida extra',
                duration: 0
            }
        };
    }

    update(deltaTime) {
        this.time += deltaTime;

        // Movimiento hacia abajo con flotación
        this.y += this.vy;
        this.x += Math.sin(this.time * 0.003 + this.floatOffset) * 1.5;

        // Rotación suave
        this.rotation = Math.sin(this.time * 0.005) * 0.2;
    }

    render(ctx, spriteSystem, particleSystem) {
        if (!this.active) return;

        ctx.save();

        // Efecto de resplandor
        const glowSize = 30 + Math.sin(this.time * 0.01) * 5;
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2,
            this.y + this.height / 2,
            0,
            this.x + this.width / 2,
            this.y + this.height / 2,
            glowSize
        );

        const typeData = this.types[this.type];
        gradient.addColorStop(0, typeData.color);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            glowSize,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Renderizar sprite
        ctx.globalAlpha = 1;
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        let spriteName;
        switch (this.type) {
            case 'SHIELD':
                spriteName = 'powerUpShield';
                break;
            case 'TRIPLE':
                spriteName = 'powerUpTriple';
                break;
            case 'LASER':
                spriteName = 'powerUpLaser';
                break;
            case 'BOMB':
                spriteName = 'powerUpBomb';
                break;
            case 'LIFE':
                spriteName = 'powerUpLife';
                break;
        }

        const sprite = spriteSystem.getSprite(spriteName);
        if (sprite) {
            ctx.drawImage(sprite, -this.width / 2, -this.height / 2);
        }

        ctx.restore();

        // Crear partículas ocasionalmente
        if (Math.random() > 0.9) {
            particleSystem.createPowerUpGlow(
                this.x + this.width / 2,
                this.y + this.height / 2,
                typeData.color
            );
        }
    }

    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }

    collect() {
        this.active = false;
        return this.type;
    }

    getDescription() {
        return this.types[this.type].description;
    }

    getDuration() {
        return this.types[this.type].duration;
    }
}
