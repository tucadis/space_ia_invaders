/**
 * FormationSystem - Sistema de formaciones para enemigos
 */
class FormationSystem {
    constructor() {
        this.formations = {
            'V_SHAPE': this.createVFormation,
            'WAVE': this.createWaveFormation,
            'CIRCLE': this.createCircleFormation,
            'GRID': this.createGridFormation,
            'DIAGONAL': this.createDiagonalFormation,
            'SWARM': this.createSwarmFormation
        };
    }

    getRandomFormation() {
        const keys = Object.keys(this.formations);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return this.formations[randomKey].call(this);
    }

    getFormation(name) {
        return this.formations[name] ? this.formations[name].call(this) : this.createGridFormation();
    }

    // Formación en V
    createVFormation() {
        const positions = [];
        const rows = 3;
        const spacing = 60;

        for (let row = 0; row < rows; row++) {
            const enemiesInRow = row + 1;
            for (let col = 0; col < enemiesInRow; col++) {
                positions.push({
                    x: col * spacing - (enemiesInRow - 1) * spacing / 2,
                    y: row * spacing,
                    pattern: 'sine'
                });
            }
        }

        // Lado derecho del V
        for (let row = 0; row < rows; row++) {
            const enemiesInRow = row + 1;
            for (let col = 0; col < enemiesInRow; col++) {
                if (row === 0 && col === 0) continue; // Evitar duplicar el punto central

                positions.push({
                    x: -(col * spacing - (enemiesInRow - 1) * spacing / 2),
                    y: row * spacing,
                    pattern: 'sine'
                });
            }
        }

        return {
            positions: positions,
            movePattern: 'sine',
            name: 'V_SHAPE'
        };
    }

    // Formación en onda
    createWaveFormation() {
        const positions = [];
        const columns = 8;
        const spacing = 70;

        for (let col = 0; col < columns; col++) {
            positions.push({
                x: col * spacing - (columns - 1) * spacing / 2,
                y: Math.sin(col * 0.5) * 30,
                pattern: 'wave'
            });
        }

        return {
            positions: positions,
            movePattern: 'wave',
            name: 'WAVE'
        };
    }

    // Formación circular
    createCircleFormation() {
        const positions = [];
        const enemies = 12;
        const radius = 100;

        for (let i = 0; i < enemies; i++) {
            const angle = (Math.PI * 2 / enemies) * i;
            positions.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                pattern: 'circle'
            });
        }

        return {
            positions: positions,
            movePattern: 'circle',
            name: 'CIRCLE'
        };
    }

    // Formación en cuadrícula
    createGridFormation() {
        const positions = [];
        const rows = 4;
        const cols = 6;
        const spacingX = 70;
        const spacingY = 60;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                positions.push({
                    x: col * spacingX - (cols - 1) * spacingX / 2,
                    y: row * spacingY,
                    pattern: 'grid'
                });
            }
        }

        return {
            positions: positions,
            movePattern: 'grid',
            name: 'GRID'
        };
    }

    // Formación diagonal
    createDiagonalFormation() {
        const positions = [];
        const count = 10;
        const spacing = 60;

        for (let i = 0; i < count; i++) {
            positions.push({
                x: i * spacing - (count - 1) * spacing / 2,
                y: i * 40,
                pattern: 'diagonal'
            });
        }

        return {
            positions: positions,
            movePattern: 'diagonal',
            name: 'DIAGONAL'
        };
    }

    // Formación de enjambre (aleatoria)
    createSwarmFormation() {
        const positions = [];
        const count = 15;
        const rangeX = 300;
        const rangeY = 200;

        for (let i = 0; i < count; i++) {
            positions.push({
                x: Math.random() * rangeX - rangeX / 2,
                y: Math.random() * rangeY,
                pattern: 'random'
            });
        }

        return {
            positions: positions,
            movePattern: 'random',
            name: 'SWARM'
        };
    }

    // Patrones de movimiento
    getMovePattern(patternName, time, entity) {
        switch (patternName) {
            case 'sine':
                return {
                    x: Math.sin(time * 0.002 + entity.formationIndex) * 2,
                    y: 0.5
                };

            case 'wave':
                return {
                    x: Math.sin(time * 0.003) * 3,
                    y: Math.cos(time * 0.002 + entity.formationIndex) * 0.5 + 0.5
                };

            case 'circle':
                const angle = time * 0.001 + entity.formationIndex;
                return {
                    x: Math.cos(angle) * 1,
                    y: Math.sin(angle) * 0.5 + 0.5
                };

            case 'grid':
                return {
                    x: Math.sin(time * 0.002) * 1.5,
                    y: 0.3
                };

            case 'diagonal':
                return {
                    x: Math.sin(time * 0.003 + entity.formationIndex * 0.5) * 2,
                    y: 0.5 + Math.cos(time * 0.002) * 0.2
                };

            case 'random':
                if (!entity.randomPattern) {
                    entity.randomPattern = {
                        offsetX: Math.random() * 4 - 2,
                        offsetY: Math.random() * 2,
                        speedX: 0.001 + Math.random() * 0.002,
                        speedY: 0.0005 + Math.random() * 0.001
                    };
                }
                return {
                    x: Math.sin(time * entity.randomPattern.speedX) * entity.randomPattern.offsetX,
                    y: entity.randomPattern.offsetY
                };

            default:
                return { x: 0, y: 1 };
        }
    }
}
