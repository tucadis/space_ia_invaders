/**
 * SceneGenerator - Motor de generación de escenarios y fondos
 */
class SceneGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.planets = [];
        this.nebulas = [];
        this.layers = [];

        this.generateScene();
    }

    generateScene() {
        this.generateStars(200);
        this.generatePlanets();
        this.generateNebulas();
    }

    generateStars(count) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 2 + 0.5,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }

    generatePlanets() {
        this.planets = [];
        const planetCount = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < planetCount; i++) {
            const size = 40 + Math.random() * 80;
            this.planets.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.6,
                size: size,
                color: this.getRandomPlanetColor(),
                speed: Math.random() * 0.3 + 0.1,
                rings: Math.random() > 0.7
            });
        }
    }

    generateNebulas() {
        this.nebulas = [];
        const nebulaCount = 1 + Math.floor(Math.random() * 2);

        for (let i = 0; i < nebulaCount; i++) {
            this.nebulas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.5,
                width: 200 + Math.random() * 300,
                height: 150 + Math.random() * 200,
                color1: this.getRandomNebulaColor(),
                color2: this.getRandomNebulaColor(),
                speed: Math.random() * 0.2 + 0.05,
                opacity: 0.1 + Math.random() * 0.2
            });
        }
    }

    getRandomPlanetColor() {
        const colors = [
            ['#4a90e2', '#2e5c8a'],
            ['#e74c3c', '#c0392b'],
            ['#f39c12', '#d68910'],
            ['#9b59b6', '#7d3c98'],
            ['#1abc9c', '#16a085'],
            ['#95a5a6', '#7f8c8d']
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomNebulaColor() {
        const colors = [
            'rgba(138, 43, 226, 0.3)',
            'rgba(75, 0, 130, 0.3)',
            'rgba(0, 128, 255, 0.3)',
            'rgba(255, 20, 147, 0.3)',
            'rgba(0, 255, 127, 0.3)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(deltaTime) {
        // Actualizar estrellas
        for (const star of this.stars) {
            star.y += star.speed;
            star.brightness += star.twinkleSpeed;
            if (star.brightness > 1 || star.brightness < 0) {
                star.twinkleSpeed *= -1;
            }

            // Wrap around
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        }

        // Actualizar planetas
        for (const planet of this.planets) {
            planet.y += planet.speed;

            if (planet.y > this.canvas.height + planet.size) {
                planet.y = -planet.size;
                planet.x = Math.random() * this.canvas.width;
            }
        }

        // Actualizar nebulosas
        for (const nebula of this.nebulas) {
            nebula.y += nebula.speed;

            if (nebula.y > this.canvas.height + nebula.height) {
                nebula.y = -nebula.height;
                nebula.x = Math.random() * this.canvas.width;
            }
        }
    }

    render(ctx) {
        // Renderizar nebulosas (fondo)
        for (const nebula of this.nebulas) {
            ctx.save();
            ctx.globalAlpha = nebula.opacity;

            const gradient = ctx.createRadialGradient(
                nebula.x + nebula.width / 2,
                nebula.y + nebula.height / 2,
                0,
                nebula.x + nebula.width / 2,
                nebula.y + nebula.height / 2,
                nebula.width / 2
            );

            gradient.addColorStop(0, nebula.color1);
            gradient.addColorStop(0.5, nebula.color2);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.fillRect(nebula.x, nebula.y, nebula.width, nebula.height);

            ctx.restore();
        }

        // Renderizar planetas
        for (const planet of this.planets) {
            ctx.save();

            // Gradiente del planeta
            const gradient = ctx.createRadialGradient(
                planet.x - planet.size * 0.2,
                planet.y - planet.size * 0.2,
                planet.size * 0.1,
                planet.x,
                planet.y,
                planet.size
            );

            gradient.addColorStop(0, planet.color[0]);
            gradient.addColorStop(1, planet.color[1]);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
            ctx.fill();

            // Anillos si los tiene
            if (planet.rings) {
                ctx.strokeStyle = planet.color[1];
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.6;

                ctx.beginPath();
                ctx.ellipse(
                    planet.x,
                    planet.y,
                    planet.size * 1.5,
                    planet.size * 0.3,
                    0.3,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }

            ctx.restore();
        }

        // Renderizar estrellas
        for (const star of this.stars) {
            ctx.save();
            ctx.globalAlpha = Math.abs(star.brightness);
            ctx.fillStyle = '#ffffff';

            if (star.size > 1.5) {
                // Estrellas grandes con brillo
                ctx.shadowBlur = 3;
                ctx.shadowColor = '#ffffff';
            }

            ctx.fillRect(
                star.x - star.size / 2,
                star.y - star.size / 2,
                star.size,
                star.size
            );

            ctx.restore();
        }
    }

    // Generar nuevo escenario para el siguiente nivel
    nextLevel() {
        this.generateScene();
    }

    // Cambiar intensidad para el boss
    setBossMode(active) {
        if (active) {
            // Aumentar velocidad de las estrellas
            for (const star of this.stars) {
                star.speed *= 2;
            }
        } else {
            // Restablecer velocidad
            for (const star of this.stars) {
                star.speed /= 2;
            }
        }
    }
}
