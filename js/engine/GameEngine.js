/**
 * GameEngine - Motor principal del juego
 */
class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.canvas3D = document.getElementById('boss-canvas-3d');

        // Sistemas
        this.spriteSystem = new SpriteSystem();
        this.particleSystem = new ParticleSystem();
        this.physics = new Physics();
        this.collisionDetector = new CollisionDetector();
        this.formationSystem = new FormationSystem();
        this.weaponSystem = new WeaponSystem();
        this.audioSystem = new AudioSystem();
        this.sceneGenerator = new SceneGenerator(this.canvas);

        // Renderizado
        this.renderer2D = new Renderer2D(this.canvas);
        this.renderer3D = new Renderer3D(this.canvas3D);

        // UI
        this.hud = new HUD();
        this.menu = new Menu();

        // Estado del juego
        this.gameState = {
            running: false,
            paused: false,
            level: 1,
            score: 0,
            player: null,
            enemies: [],
            boss: null,
            projectiles: [],
            enemyProjectiles: [],
            powerUps: [],
            bossMode: false,
            screenFlash: 0,
            weaponSystem: this.weaponSystem
        };

        // Control
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            shoot: false
        };

        // Tiempo
        this.lastTime = 0;
        this.gameTime = 0;

        // Configuración de nivel
        this.levelConfig = {
            enemiesPerWave: 15,
            waveDelay: 3000,
            bossEvery: 3
        };

        this.currentWave = 0;
        this.waveTimer = 0;

        this.setupInputHandlers();
        this.setupMenuCallbacks();
    }

    setupInputHandlers() {
        // Teclado
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Touch para móviles (opcional)
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e));
        this.canvas.addEventListener('touchend', () => {
            this.keys.left = false;
            this.keys.right = false;
            this.keys.up = false;
            this.keys.down = false;
        });
    }

    handleKeyDown(e) {
        switch (e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                this.keys.left = true;
                e.preventDefault();
                break;
            case 'arrowright':
            case 'd':
                this.keys.right = true;
                e.preventDefault();
                break;
            case 'arrowup':
            case 'w':
                this.keys.up = true;
                e.preventDefault();
                break;
            case 'arrowdown':
            case 's':
                this.keys.down = true;
                e.preventDefault();
                break;
            case ' ':
                this.keys.shoot = true;
                e.preventDefault();
                break;
            case 'p':
                this.togglePause();
                e.preventDefault();
                break;
            case 'escape':
                if (this.gameState.running) {
                    this.togglePause();
                }
                e.preventDefault();
                break;
        }
    }

    handleKeyUp(e) {
        switch (e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                this.keys.left = false;
                break;
            case 'arrowright':
            case 'd':
                this.keys.right = false;
                break;
            case 'arrowup':
            case 'w':
                this.keys.up = false;
                break;
            case 'arrowdown':
            case 's':
                this.keys.down = false;
                break;
            case ' ':
                this.keys.shoot = false;
                break;
        }
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        if (!touch) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const centerX = this.canvas.width / 2;

        // Control básico táctil
        this.keys.left = x < centerX - 50;
        this.keys.right = x > centerX + 50;
        this.keys.shoot = true;
    }

    setupMenuCallbacks() {
        this.menu.setStartGameCallback(() => {
            this.startGame();
        });
    }

    startGame() {
        this.gameState.running = true;
        this.gameState.paused = false;
        this.gameState.level = 1;
        this.gameState.score = 0;
        this.currentWave = 0;

        this.menu.showGame();
        this.hud.show();

        this.initPlayer();
        this.spawnWave();

        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    initPlayer() {
        this.gameState.player = new Player(
            this.canvas.width / 2 - 32,
            this.canvas.height - 100,
            this.canvas
        );
    }

    spawnWave() {
        this.currentWave++;

        // Boss cada X niveles
        if (this.currentWave % this.levelConfig.bossEvery === 0) {
            this.spawnBoss();
            return;
        }

        // Formación aleatoria
        const formation = this.formationSystem.getRandomFormation();
        const enemyTypes = ['enemy1', 'enemy2', 'enemy3', 'enemyElite'];

        const centerX = this.canvas.width / 2;
        const startY = 50;

        formation.positions.forEach((pos, index) => {
            // Tipo de enemigo aleatorio (más difíciles en niveles superiores)
            let type;
            const rand = Math.random();
            if (this.gameState.level >= 5 && rand < 0.1) {
                type = 'enemyElite';
            } else if (this.gameState.level >= 3 && rand < 0.3) {
                type = 'enemy3';
            } else if (rand < 0.5) {
                type = 'enemy2';
            } else {
                type = 'enemy1';
            }

            const enemy = new Enemy(
                centerX + pos.x,
                startY + pos.y,
                type,
                index
            );

            enemy.setMovementPattern(formation.movePattern);
            this.gameState.enemies.push(enemy);
        });

        this.audioSystem.play('powerup');
    }

    spawnBoss() {
        this.gameState.bossMode = true;
        this.sceneGenerator.setBossMode(true);

        this.hud.showBossWarning(() => {
            const bossLevel = Math.floor(this.currentWave / this.levelConfig.bossEvery);
            this.gameState.boss = new Boss(
                this.canvas.width / 2 - 64,
                -128,
                bossLevel
            );

            this.audioSystem.play('boss');
        });
    }

    togglePause() {
        if (!this.gameState.running) return;

        this.gameState.paused = !this.gameState.paused;

        if (this.gameState.paused) {
            this.hud.showPause(
                () => this.togglePause(),
                () => this.quitToMenu()
            );
        } else {
            this.hud.hidePause();
            this.lastTime = performance.now();
            this.gameLoop(this.lastTime);
        }
    }

    quitToMenu() {
        this.gameState.running = false;
        this.gameState.paused = false;
        this.hud.hide();
        this.menu.showMenu();
        this.resetGame();
    }

    resetGame() {
        this.gameState.enemies = [];
        this.gameState.boss = null;
        this.gameState.projectiles = [];
        this.gameState.enemyProjectiles = [];
        this.gameState.powerUps = [];
        this.gameState.bossMode = false;
        this.particleSystem.clear();
        this.renderer3D.deactivate();
        this.sceneGenerator.setBossMode(false);
    }

    gameLoop(currentTime) {
        if (!this.gameState.running || this.gameState.paused) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.gameTime += deltaTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Actualizar sistemas
        this.sceneGenerator.update(deltaTime);
        this.particleSystem.update(deltaTime);
        this.weaponSystem.update(deltaTime);

        // Actualizar jugador
        if (this.gameState.player && this.gameState.player.active) {
            this.gameState.player.handleInput(this.keys);
            this.gameState.player.update(deltaTime);

            // Disparo del jugador
            if (this.keys.shoot && this.weaponSystem.canShoot(this.gameTime)) {
                const projectiles = this.weaponSystem.shoot(this.gameState.player, this.gameTime);
                this.gameState.projectiles.push(...projectiles.map(p => new Projectile(
                    p.x, p.y, p.vx, p.vy, p.type, p.damage, true
                )));

                const weaponName = this.weaponSystem.currentWeapon;
                this.audioSystem.play(weaponName === 'LASER' ? 'laser' :
                                     weaponName === 'MISSILE' ? 'missile' : 'shoot');
            }
        }

        // Actualizar enemigos
        for (let i = this.gameState.enemies.length - 1; i >= 0; i--) {
            const enemy = this.gameState.enemies[i];

            if (!enemy.active) {
                this.gameState.enemies.splice(i, 1);
                continue;
            }

            enemy.update(deltaTime, this.formationSystem, this.gameTime, this.canvas.width);

            // Enemigos disparan
            if (enemy.shouldShoot()) {
                const projectile = enemy.shoot();
                this.gameState.enemyProjectiles.push(projectile);
                this.audioSystem.play('shoot');
            }

            // Remover si está fuera de pantalla
            if (enemy.isOffScreen(this.canvas.height)) {
                this.gameState.enemies.splice(i, 1);
            }
        }

        // Actualizar boss
        if (this.gameState.boss && this.gameState.boss.active) {
            this.gameState.boss.update(deltaTime, this.canvas.width, this.canvas.height);

            if (this.gameState.boss.shouldAttack()) {
                const projectiles = this.gameState.boss.attack();
                this.gameState.enemyProjectiles.push(...projectiles);
                this.audioSystem.play('shoot');
            }
        }

        // Actualizar proyectiles
        this.updateProjectiles(deltaTime);

        // Actualizar power-ups
        this.updatePowerUps(deltaTime);

        // Colisiones
        this.handleCollisions();

        // Verificar fin de ola
        this.checkWaveComplete();

        // Verificar game over
        this.checkGameOver();

        // Actualizar efectos de pantalla
        if (this.gameState.screenFlash > 0) {
            this.gameState.screenFlash -= deltaTime * 0.005;
        }

        // Actualizar HUD
        this.hud.update(this.gameState);
    }

    updateProjectiles(deltaTime) {
        // Proyectiles del jugador
        for (let i = this.gameState.projectiles.length - 1; i >= 0; i--) {
            const proj = this.gameState.projectiles[i];

            if (!proj.active) {
                this.gameState.projectiles.splice(i, 1);
                continue;
            }

            proj.update(deltaTime, this.gameState.enemies);

            if (proj.isOffScreen(this.canvas.height)) {
                this.gameState.projectiles.splice(i, 1);
            }
        }

        // Proyectiles enemigos
        for (let i = this.gameState.enemyProjectiles.length - 1; i >= 0; i--) {
            const proj = this.gameState.enemyProjectiles[i];

            proj.y += proj.vy;
            proj.x += proj.vx || 0;

            if (proj.y > this.canvas.height || proj.y < 0) {
                this.gameState.enemyProjectiles.splice(i, 1);
            }
        }
    }

    updatePowerUps(deltaTime) {
        for (let i = this.gameState.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.gameState.powerUps[i];

            if (!powerUp.active) {
                this.gameState.powerUps.splice(i, 1);
                continue;
            }

            powerUp.update(deltaTime);

            if (powerUp.isOffScreen(this.canvas.height)) {
                this.gameState.powerUps.splice(i, 1);
            }
        }
    }

    handleCollisions() {
        const player = this.gameState.player;
        if (!player || !player.active) return;

        // Proyectiles del jugador vs enemigos
        for (let i = this.gameState.projectiles.length - 1; i >= 0; i--) {
            const proj = this.gameState.projectiles[i];
            if (!proj.active) continue;

            // vs enemigos normales
            for (let j = this.gameState.enemies.length - 1; j >= 0; j--) {
                const enemy = this.gameState.enemies[j];
                if (!enemy.active) continue;

                if (this.collisionDetector.checkAABB(proj, enemy)) {
                    const destroyed = enemy.takeDamage(proj.damage);

                    if (destroyed) {
                        this.gameState.score += enemy.score;
                        this.particleSystem.createExplosion(
                            enemy.x + enemy.width / 2,
                            enemy.y + enemy.height / 2,
                            '#f80',
                            15
                        );
                        this.audioSystem.play('explosion');

                        // Drop power-up
                        if (enemy.shouldDropPowerUp()) {
                            const powerUpType = enemy.getRandomPowerUpType();
                            this.gameState.powerUps.push(new PowerUp(
                                enemy.x + enemy.width / 2,
                                enemy.y + enemy.height / 2,
                                powerUpType
                            ));
                        }

                        this.gameState.enemies.splice(j, 1);
                    } else {
                        this.particleSystem.createSparks(
                            proj.x + proj.width / 2,
                            proj.y + proj.height / 2,
                            5
                        );
                        this.audioSystem.play('hit');
                    }

                    proj.destroy();
                    break;
                }
            }

            // vs boss
            if (this.gameState.boss && this.gameState.boss.active) {
                if (this.collisionDetector.checkAABB(proj, this.gameState.boss)) {
                    const destroyed = this.gameState.boss.takeDamage(
                        proj.damage,
                        proj.x + proj.width / 2,
                        proj.y + proj.height / 2
                    );

                    if (destroyed) {
                        this.gameState.score += this.gameState.boss.score;
                        this.particleSystem.createExplosion(
                            this.gameState.boss.x + this.gameState.boss.width / 2,
                            this.gameState.boss.y + this.gameState.boss.height / 2,
                            '#ff0',
                            30
                        );
                        this.audioSystem.play('explosion');

                        this.gameState.boss = null;
                        this.gameState.bossMode = false;
                        this.sceneGenerator.setBossMode(false);

                        // Nivel completado
                        setTimeout(() => {
                            this.levelComplete();
                        }, 1000);
                    } else {
                        this.particleSystem.createSparks(
                            proj.x + proj.width / 2,
                            proj.y + proj.height / 2,
                            8
                        );
                        this.audioSystem.play('hit');
                    }

                    proj.destroy();
                }
            }
        }

        // Proyectiles enemigos vs jugador
        for (let i = this.gameState.enemyProjectiles.length - 1; i >= 0; i--) {
            const proj = this.gameState.enemyProjectiles[i];

            if (this.collisionDetector.checkAABB(proj, player)) {
                const died = player.takeDamage(proj.damage);

                this.particleSystem.createExplosion(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    '#0ff',
                    10
                );

                this.audioSystem.play('hit');
                this.gameState.screenFlash = 0.5;

                if (died) {
                    this.audioSystem.play('explosion');
                }

                this.gameState.enemyProjectiles.splice(i, 1);
            }
        }

        // Power-ups vs jugador
        for (let i = this.gameState.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.gameState.powerUps[i];
            if (!powerUp.active) continue;

            if (this.collisionDetector.checkAABB(powerUp, player)) {
                const type = powerUp.collect();

                this.particleSystem.createExplosion(
                    powerUp.x + powerUp.width / 2,
                    powerUp.y + powerUp.height / 2,
                    powerUp.types[type].color,
                    15
                );

                this.audioSystem.play('powerup');

                // Aplicar power-up
                switch (type) {
                    case 'SHIELD':
                        player.activateShield(powerUp.getDuration());
                        break;
                    case 'TRIPLE':
                        this.weaponSystem.setWeapon('TRIPLE', powerUp.getDuration());
                        break;
                    case 'LASER':
                        this.weaponSystem.setWeapon('LASER', powerUp.getDuration());
                        break;
                    case 'BOMB':
                        this.destroyAllEnemies();
                        break;
                    case 'LIFE':
                        player.addLife();
                        player.heal(50);
                        break;
                }

                this.gameState.powerUps.splice(i, 1);
            }
        }

        // Enemigos vs jugador (colisión directa)
        for (const enemy of this.gameState.enemies) {
            if (!enemy.active) continue;

            if (this.collisionDetector.checkAABB(enemy, player)) {
                const died = player.takeDamage(20);
                enemy.takeDamage(999);

                this.particleSystem.createExplosion(
                    enemy.x + enemy.width / 2,
                    enemy.y + enemy.height / 2,
                    '#f80',
                    15
                );

                this.audioSystem.play('explosion');
                this.gameState.screenFlash = 0.7;

                if (died) {
                    this.audioSystem.play('explosion');
                }
            }
        }
    }

    destroyAllEnemies() {
        for (const enemy of this.gameState.enemies) {
            this.gameState.score += enemy.score;
            this.particleSystem.createExplosion(
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2,
                '#ff0',
                10
            );
            enemy.destroy();
        }

        this.audioSystem.play('explosion');
        this.gameState.screenFlash = 1.0;
    }

    checkWaveComplete() {
        if (this.gameState.bossMode) return;

        if (this.gameState.enemies.length === 0) {
            this.waveTimer += 16; // Aproximadamente 16ms por frame

            if (this.waveTimer > this.levelConfig.waveDelay) {
                this.waveTimer = 0;
                this.spawnWave();
            }
        }
    }

    levelComplete() {
        this.gameState.level++;
        this.audioSystem.play('levelComplete');

        this.hud.showLevelComplete(this.gameState.score, () => {
            this.sceneGenerator.nextLevel();
            this.gameState.player.heal(50);
            this.currentWave = 0;
            this.spawnWave();
        });
    }

    checkGameOver() {
        if (this.gameState.player && !this.gameState.player.active) {
            this.gameState.running = false;
            this.audioSystem.play('gameOver');

            setTimeout(() => {
                this.hud.showGameOver(this.gameState.score, (action) => {
                    if (action === 'restart') {
                        this.resetGame();
                        this.startGame();
                    } else {
                        this.quitToMenu();
                    }
                });
            }, 1000);
        }
    }

    render() {
        // Renderizado 2D principal
        this.renderer2D.render(
            this.gameState,
            this.spriteSystem,
            this.particleSystem,
            this.sceneGenerator
        );
    }
}
