/**
 * HUD - Interfaz de usuario durante el juego
 */
class HUD {
    constructor() {
        this.elements = {
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            lives: document.getElementById('lives'),
            weapon: document.getElementById('weapon'),
            healthBar: document.getElementById('health-bar')
        };
    }

    update(gameState) {
        // Actualizar puntuación
        this.updateScore(gameState.score);

        // Actualizar nivel
        this.updateLevel(gameState.level);

        // Actualizar vidas
        this.updateLives(gameState.player.lives);

        // Actualizar arma
        this.updateWeapon(gameState.weaponSystem.getCurrentWeaponName());

        // Actualizar barra de vida
        this.updateHealth(gameState.player.getHealthPercentage());
    }

    updateScore(score) {
        if (this.elements.score) {
            this.elements.score.textContent = score.toString().padStart(8, '0');
        }
    }

    updateLevel(level) {
        if (this.elements.level) {
            this.elements.level.textContent = level;
        }
    }

    updateLives(lives) {
        if (this.elements.lives) {
            this.elements.lives.textContent = '❤️'.repeat(Math.max(0, lives));
        }
    }

    updateWeapon(weaponName) {
        if (this.elements.weapon) {
            this.elements.weapon.textContent = weaponName;

            // Cambiar color según el arma
            switch (weaponName) {
                case 'BÁSICA':
                    this.elements.weapon.style.color = '#0f0';
                    break;
                case 'TRIPLE':
                    this.elements.weapon.style.color = '#f00';
                    break;
                case 'LÁSER':
                    this.elements.weapon.style.color = '#0ff';
                    break;
                case 'MISILES':
                    this.elements.weapon.style.color = '#f80';
                    break;
            }
        }
    }

    updateHealth(healthPercentage) {
        if (this.elements.healthBar) {
            this.elements.healthBar.style.width = `${healthPercentage}%`;

            // Cambiar color basado en salud
            if (healthPercentage > 66) {
                this.elements.healthBar.style.background = 'linear-gradient(90deg, #0f0, #0ff)';
            } else if (healthPercentage > 33) {
                this.elements.healthBar.style.background = 'linear-gradient(90deg, #ff0, #f80)';
            } else {
                this.elements.healthBar.style.background = 'linear-gradient(90deg, #f00, #f80)';
            }
        }
    }

    showBossWarning(callback) {
        const warning = document.getElementById('boss-warning');
        if (warning) {
            warning.style.display = 'flex';

            setTimeout(() => {
                warning.style.display = 'none';
                if (callback) callback();
            }, 3000);
        }
    }

    showLevelComplete(score, callback) {
        const overlay = document.getElementById('level-complete-overlay');
        const scoreElement = document.getElementById('level-score');

        if (overlay && scoreElement) {
            scoreElement.textContent = score.toString().padStart(8, '0');
            overlay.style.display = 'flex';

            const nextBtn = document.getElementById('next-level-btn');
            if (nextBtn) {
                nextBtn.onclick = () => {
                    overlay.style.display = 'none';
                    if (callback) callback();
                };
            }
        }
    }

    showGameOver(score, callback) {
        const overlay = document.getElementById('game-over-overlay');
        const scoreElement = document.getElementById('final-score');

        if (overlay && scoreElement) {
            scoreElement.textContent = score.toString().padStart(8, '0');
            overlay.style.display = 'flex';

            const restartBtn = document.getElementById('restart-btn');
            const menuBtn = document.getElementById('menu-btn');

            if (restartBtn) {
                restartBtn.onclick = () => {
                    overlay.style.display = 'none';
                    if (callback) callback('restart');
                };
            }

            if (menuBtn) {
                menuBtn.onclick = () => {
                    overlay.style.display = 'none';
                    if (callback) callback('menu');
                };
            }
        }
    }

    showPause(resumeCallback, quitCallback) {
        const overlay = document.getElementById('pause-overlay');

        if (overlay) {
            overlay.style.display = 'flex';

            const resumeBtn = document.getElementById('resume-btn');
            const quitBtn = document.getElementById('quit-btn');

            if (resumeBtn) {
                resumeBtn.onclick = () => {
                    overlay.style.display = 'none';
                    if (resumeCallback) resumeCallback();
                };
            }

            if (quitBtn) {
                quitBtn.onclick = () => {
                    overlay.style.display = 'none';
                    if (quitCallback) quitCallback();
                };
            }
        }
    }

    hidePause() {
        const overlay = document.getElementById('pause-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    hide() {
        document.getElementById('hud').style.display = 'none';
    }

    show() {
        document.getElementById('hud').style.display = 'flex';
    }
}
