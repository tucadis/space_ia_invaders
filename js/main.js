/**
 * main.js - Punto de entrada principal del juego
 * Space IA Invaders - Humans vs Robots
 */

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Space IA Invaders - Iniciando...');

    // Crear instancia del motor del juego
    const game = new GameEngine();

    console.log('✅ Motor del juego inicializado');
    console.log('🎮 Listo para jugar!');
    console.log('');
    console.log('Controles:');
    console.log('  ← → o A D - Mover nave');
    console.log('  ESPACIO - Disparar');
    console.log('  P - Pausar');
    console.log('');

    // Manejo de errores global
    window.addEventListener('error', (e) => {
        console.error('Error del juego:', e.error);
    });

    // Prevenir comportamientos por defecto que interfieran con el juego
    window.addEventListener('keydown', (e) => {
        // Prevenir scroll con las flechas
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Manejo de visibilidad de la página
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && game.gameState.running && !game.gameState.paused) {
            game.togglePause();
        }
    });

    // Mostrar información de depuración en consola
    if (typeof window !== 'undefined') {
        window.gameDebug = {
            getGameState: () => game.gameState,
            getPlayer: () => game.gameState.player,
            getEnemies: () => game.gameState.enemies,
            getBoss: () => game.gameState.boss,
            addScore: (amount) => {
                game.gameState.score += amount;
                console.log(`Puntuación actualizada: ${game.gameState.score}`);
            },
            spawnPowerUp: (type) => {
                const player = game.gameState.player;
                if (player) {
                    game.gameState.powerUps.push(new PowerUp(
                        player.x + player.width / 2,
                        100,
                        type
                    ));
                    console.log(`Power-up ${type} generado`);
                }
            },
            godMode: () => {
                if (game.gameState.player) {
                    game.gameState.player.maxHealth = 999999;
                    game.gameState.player.health = 999999;
                    console.log('🛡️ Modo Dios activado');
                }
            },
            info: () => {
                console.log('=== Space IA Invaders - Debug Info ===');
                console.log('Versión: 1.0.0');
                console.log('WebGL Soportado:', game.renderer3D.isSupported());
                console.log('Nivel:', game.gameState.level);
                console.log('Puntuación:', game.gameState.score);
                console.log('Enemigos activos:', game.gameState.enemies.length);
                console.log('Proyectiles activos:', game.gameState.projectiles.length);
                console.log('Partículas activas:', game.particleSystem.getParticleCount());
                console.log('FPS estimado:', Math.round(1000 / (performance.now() - game.lastTime)));
                console.log('=====================================');
            }
        };

        console.log('💡 Comandos de depuración disponibles:');
        console.log('  gameDebug.info() - Información del juego');
        console.log('  gameDebug.godMode() - Modo Dios');
        console.log('  gameDebug.addScore(1000) - Añadir puntuación');
        console.log('  gameDebug.spawnPowerUp("SHIELD") - Generar power-up');
        console.log('  gameDebug.getGameState() - Ver estado del juego');
    }
});

// Mensajes de inicio retro
console.log('%c╔═══════════════════════════════════════╗', 'color: #0ff; font-family: monospace;');
console.log('%c║  SPACE IA INVADERS                    ║', 'color: #0ff; font-family: monospace;');
console.log('%c║  HUMANS VS ROBOTS                     ║', 'color: #f00; font-family: monospace;');
console.log('%c║                                       ║', 'color: #0ff; font-family: monospace;');
console.log('%c║  Estilo 16 bits                       ║', 'color: #ff0; font-family: monospace;');
console.log('%c║  Powered by JavaScript + WebGL        ║', 'color: #0f0; font-family: monospace;');
console.log('%c║                                       ║', 'color: #0ff; font-family: monospace;');
console.log('%c║  © 2024 - AI Generated Game           ║', 'color: #fff; font-family: monospace;');
console.log('%c╚═══════════════════════════════════════╝', 'color: #0ff; font-family: monospace;');
