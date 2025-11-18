/**
 * Menu - Sistema de menús del juego
 */
class Menu {
    constructor() {
        this.screens = {
            menu: document.getElementById('menu-screen'),
            instructions: document.getElementById('instructions-screen'),
            game: document.getElementById('game-screen')
        };

        this.currentScreen = 'menu';

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botón de inicio
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.onStartGame();
            });
        }

        // Botón de instrucciones
        const instructionsBtn = document.getElementById('instructions-btn');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => {
                this.showScreen('instructions');
            });
        }

        // Botón de volver
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showScreen('menu');
            });
        }

        // Botón de créditos
        const creditsBtn = document.getElementById('credits-btn');
        if (creditsBtn) {
            creditsBtn.addEventListener('click', () => {
                this.showCredits();
            });
        }
    }

    showScreen(screenName) {
        // Ocultar todas las pantallas
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });

        // Mostrar la pantalla solicitada
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    }

    showMenu() {
        this.showScreen('menu');
    }

    showGame() {
        this.showScreen('game');
    }

    onStartGame() {
        // Este método será sobrescrito por el juego principal
        console.log('Start game called');
    }

    setStartGameCallback(callback) {
        this.onStartGame = callback;
    }

    showCredits() {
        alert(`
SPACE IA INVADERS
Humans vs Robots

Desarrollado por: IA Assistant
Motor: JavaScript + Canvas + WebGL
Año: 2024

¡Gracias por jugar!

Pulsa ESC para volver al menú.
        `);
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    isInGame() {
        return this.currentScreen === 'game';
    }
}
