/**
 * SpriteSystem - Sistema de generación de sprites estilo 16 bits
 * Genera todos los gráficos del juego usando canvas
 */
class SpriteSystem {
    constructor() {
        this.sprites = {};
        this.generateAllSprites();
    }

    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    generateAllSprites() {
        // Nave del jugador
        this.sprites.player = this.generatePlayerShip();
        this.sprites.playerThrust = this.generatePlayerThrust();

        // Enemigos
        this.sprites.enemy1 = this.generateEnemy1();
        this.sprites.enemy2 = this.generateEnemy2();
        this.sprites.enemy3 = this.generateEnemy3();
        this.sprites.enemyElite = this.generateEnemyElite();

        // Proyectiles
        this.sprites.bullet = this.generateBullet();
        this.sprites.enemyBullet = this.generateEnemyBullet();
        this.sprites.laser = this.generateLaser();
        this.sprites.missile = this.generateMissile();

        // Power-ups
        this.sprites.powerUpShield = this.generatePowerUpShield();
        this.sprites.powerUpTriple = this.generatePowerUpTriple();
        this.sprites.powerUpLaser = this.generatePowerUpLaser();
        this.sprites.powerUpBomb = this.generatePowerUpBomb();
        this.sprites.powerUpLife = this.generatePowerUpLife();

        // Explosiones (frames de animación)
        this.sprites.explosion = this.generateExplosion();

        // Estrellas para el fondo
        this.sprites.stars = this.generateStars();

        // Boss
        this.sprites.boss = this.generateBoss();
    }

    // Nave del jugador - Diseño épico
    generatePlayerShip() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');

        // Cuerpo principal
        ctx.fillStyle = '#0af';
        ctx.fillRect(28, 40, 8, 20);

        // Cabina
        ctx.fillStyle = '#0ff';
        ctx.fillRect(26, 32, 12, 12);
        ctx.fillStyle = '#fff';
        ctx.fillRect(28, 34, 8, 8);

        // Alas
        ctx.fillStyle = '#08d';
        ctx.beginPath();
        ctx.moveTo(12, 60);
        ctx.lineTo(24, 40);
        ctx.lineTo(24, 60);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(52, 60);
        ctx.lineTo(40, 40);
        ctx.lineTo(40, 60);
        ctx.fill();

        // Cañones
        ctx.fillStyle = '#f80';
        ctx.fillRect(20, 50, 4, 8);
        ctx.fillRect(40, 50, 4, 8);

        // Detalles brillantes
        ctx.fillStyle = '#fff';
        ctx.fillRect(30, 36, 1, 2);
        ctx.fillRect(33, 36, 1, 2);

        // Luces laterales
        ctx.fillStyle = '#0f0';
        ctx.fillRect(14, 54, 2, 2);
        ctx.fillRect(48, 54, 2, 2);

        // Borde de detalle
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(26, 32, 12, 28);

        return canvas;
    }

    generatePlayerThrust() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');

        // Motor izquierdo
        ctx.fillStyle = '#ff0';
        ctx.fillRect(20, 58, 4, 4);
        ctx.fillStyle = '#f80';
        ctx.fillRect(21, 62, 2, 2);

        // Motor derecho
        ctx.fillStyle = '#ff0';
        ctx.fillRect(40, 58, 4, 4);
        ctx.fillStyle = '#f80';
        ctx.fillRect(41, 62, 2, 2);

        // Motor central
        ctx.fillStyle = '#0ff';
        ctx.fillRect(30, 60, 4, 3);

        return canvas;
    }

    // Enemigo tipo 1 - Robot básico
    generateEnemy1() {
        const canvas = this.createCanvas(40, 40);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f00';
        ctx.fillRect(12, 10, 16, 16);

        // Ojos
        ctx.fillStyle = '#ff0';
        ctx.fillRect(14, 14, 4, 4);
        ctx.fillRect(22, 14, 4, 4);

        // Antenas
        ctx.fillStyle = '#f00';
        ctx.fillRect(16, 6, 2, 4);
        ctx.fillRect(22, 6, 2, 4);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(15, 4, 4, 2);
        ctx.fillRect(21, 4, 4, 2);

        // Cuerpo
        ctx.fillStyle = '#c00';
        ctx.fillRect(10, 26, 20, 8);

        // Brazos
        ctx.fillStyle = '#f00';
        ctx.fillRect(6, 20, 4, 10);
        ctx.fillRect(30, 20, 4, 10);

        return canvas;
    }

    // Enemigo tipo 2 - Robot volador
    generateEnemy2() {
        const canvas = this.createCanvas(40, 40);
        const ctx = canvas.getContext('2d');

        // Cuerpo hexagonal
        ctx.fillStyle = '#f0f';
        ctx.beginPath();
        ctx.moveTo(20, 8);
        ctx.lineTo(30, 14);
        ctx.lineTo(30, 26);
        ctx.lineTo(20, 32);
        ctx.lineTo(10, 26);
        ctx.lineTo(10, 14);
        ctx.closePath();
        ctx.fill();

        // Núcleo
        ctx.fillStyle = '#fff';
        ctx.fillRect(16, 16, 8, 8);

        // Propulsores
        ctx.fillStyle = '#f0f';
        ctx.fillRect(6, 18, 4, 4);
        ctx.fillRect(30, 18, 4, 4);

        // Detalles
        ctx.fillStyle = '#ff0';
        ctx.fillRect(18, 18, 4, 4);

        return canvas;
    }

    // Enemigo tipo 3 - Robot pesado
    generateEnemy3() {
        const canvas = this.createCanvas(48, 48);
        const ctx = canvas.getContext('2d');

        // Cuerpo principal
        ctx.fillStyle = '#f80';
        ctx.fillRect(12, 12, 24, 24);

        // Torreta
        ctx.fillStyle = '#f80';
        ctx.fillRect(18, 8, 12, 8);

        // Cañón
        ctx.fillStyle = '#f00';
        ctx.fillRect(22, 4, 4, 12);

        // Ojos
        ctx.fillStyle = '#0ff';
        ctx.fillRect(16, 16, 6, 6);
        ctx.fillRect(26, 16, 6, 6);

        // Armadura
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.strokeRect(12, 12, 24, 24);

        // Ruedas/Propulsores
        ctx.fillStyle = '#f00';
        ctx.fillRect(10, 32, 6, 6);
        ctx.fillRect(32, 32, 6, 6);

        return canvas;
    }

    // Enemigo Elite - Robot comando
    generateEnemyElite() {
        const canvas = this.createCanvas(56, 56);
        const ctx = canvas.getContext('2d');

        // Escudo de energía
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(28, 28, 26, 0, Math.PI * 2);
        ctx.stroke();

        // Cuerpo principal
        ctx.fillStyle = '#f0f';
        ctx.fillRect(18, 18, 20, 20);

        // Núcleo de energía
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(28, 28, 6, 0, Math.PI * 2);
        ctx.fill();

        // Armas
        ctx.fillStyle = '#f00';
        ctx.fillRect(10, 24, 8, 4);
        ctx.fillRect(38, 24, 8, 4);

        // Detalles brillantes
        ctx.fillStyle = '#0ff';
        ctx.fillRect(22, 22, 2, 2);
        ctx.fillRect(32, 22, 2, 2);
        ctx.fillRect(22, 32, 2, 2);
        ctx.fillRect(32, 32, 2, 2);

        return canvas;
    }

    // Boss - Robot gigante
    generateBoss() {
        const canvas = this.createCanvas(128, 128);
        const ctx = canvas.getContext('2d');

        // Cuerpo principal
        ctx.fillStyle = '#a00';
        ctx.fillRect(24, 24, 80, 80);

        // Cabeza
        ctx.fillStyle = '#c00';
        ctx.fillRect(44, 14, 40, 30);

        // Ojos malignos
        ctx.fillStyle = '#ff0';
        ctx.fillRect(50, 22, 10, 10);
        ctx.fillRect(68, 22, 10, 10);
        ctx.fillStyle = '#f00';
        ctx.fillRect(54, 26, 2, 2);
        ctx.fillRect(72, 26, 2, 2);

        // Brazos con cañones
        ctx.fillStyle = '#a00';
        ctx.fillRect(4, 40, 20, 30);
        ctx.fillRect(104, 40, 20, 30);

        // Cañones
        ctx.fillStyle = '#f00';
        ctx.fillRect(0, 50, 24, 10);
        ctx.fillRect(104, 50, 24, 10);

        // Torso con armadura
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 3;
        ctx.strokeRect(24, 44, 80, 60);

        // Núcleo de energía
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(64, 74, 12, 0, Math.PI * 2);
        ctx.fill();

        // Detalles
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#f80' : '#f00';
            ctx.fillRect(30 + i * 18, 90, 12, 8);
        }

        // Propulsores
        ctx.fillStyle = '#f80';
        ctx.fillRect(30, 104, 14, 10);
        ctx.fillRect(84, 104, 14, 10);

        return canvas;
    }

    // Proyectiles
    generateBullet() {
        const canvas = this.createCanvas(8, 16);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#0ff';
        ctx.fillRect(2, 0, 4, 16);
        ctx.fillStyle = '#fff';
        ctx.fillRect(3, 0, 2, 8);

        return canvas;
    }

    generateEnemyBullet() {
        const canvas = this.createCanvas(8, 16);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f00';
        ctx.fillRect(2, 0, 4, 16);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(3, 0, 2, 8);

        return canvas;
    }

    generateLaser() {
        const canvas = this.createCanvas(12, 24);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#0ff';
        ctx.fillRect(4, 0, 4, 24);
        ctx.fillStyle = '#fff';
        ctx.fillRect(5, 0, 2, 24);

        // Glow effect
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.fillRect(2, 0, 8, 24);

        return canvas;
    }

    generateMissile() {
        const canvas = this.createCanvas(12, 20);
        const ctx = canvas.getContext('2d');

        // Cuerpo
        ctx.fillStyle = '#f80';
        ctx.fillRect(3, 0, 6, 16);

        // Punta
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(3, 4);
        ctx.lineTo(9, 4);
        ctx.fill();

        // Aletas
        ctx.fillStyle = '#f00';
        ctx.fillRect(0, 12, 3, 6);
        ctx.fillRect(9, 12, 3, 6);

        // Propulsor
        ctx.fillStyle = '#ff0';
        ctx.fillRect(4, 16, 4, 4);

        return canvas;
    }

    // Power-ups
    generatePowerUpShield() {
        const canvas = this.createCanvas(24, 24);
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.fill();

        return canvas;
    }

    generatePowerUpTriple() {
        const canvas = this.createCanvas(24, 24);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f00';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(4 + i * 6, 8, 3, 8);
        }

        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 20, 20);

        return canvas;
    }

    generatePowerUpLaser() {
        const canvas = this.createCanvas(24, 24);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#0f0';
        ctx.fillRect(10, 4, 4, 16);

        ctx.fillStyle = '#0ff';
        ctx.fillRect(6, 4, 2, 16);
        ctx.fillRect(16, 4, 2, 16);

        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 20, 20);

        return canvas;
    }

    generatePowerUpBomb() {
        const canvas = this.createCanvas(24, 24);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(12, 14, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff0';
        ctx.fillRect(10, 4, 4, 6);

        ctx.strokeStyle = '#f80';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 20, 20);

        return canvas;
    }

    generatePowerUpLife() {
        const canvas = this.createCanvas(24, 24);
        const ctx = canvas.getContext('2d');

        // Corazón
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(12, 20);
        ctx.lineTo(6, 10);
        ctx.lineTo(6, 8);
        ctx.arc(8, 8, 2, Math.PI, 0);
        ctx.lineTo(12, 8);
        ctx.lineTo(12, 8);
        ctx.arc(16, 8, 2, Math.PI, 0);
        ctx.lineTo(18, 10);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 20, 20);

        return canvas;
    }

    // Explosión (múltiples frames)
    generateExplosion() {
        const frames = [];
        const colors = ['#ff0', '#f80', '#f00', '#800', '#400'];

        for (let f = 0; f < 5; f++) {
            const canvas = this.createCanvas(48, 48);
            const ctx = canvas.getContext('2d');

            const size = 8 + f * 6;
            const particles = 8 + f * 2;

            ctx.fillStyle = colors[f];

            for (let i = 0; i < particles; i++) {
                const angle = (Math.PI * 2 / particles) * i;
                const distance = size * (0.5 + Math.random() * 0.5);
                const x = 24 + Math.cos(angle) * distance;
                const y = 24 + Math.sin(angle) * distance;
                const particleSize = 4 - f * 0.5;

                ctx.fillRect(x - particleSize / 2, y - particleSize / 2, particleSize, particleSize);
            }

            // Centro brillante
            if (f < 3) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(20, 20, 8, 8);
            }

            frames.push(canvas);
        }

        return frames;
    }

    // Estrellas para el fondo
    generateStars() {
        const canvas = this.createCanvas(2, 2);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 1, 1);

        return canvas;
    }

    getSprite(name) {
        return this.sprites[name];
    }
}
