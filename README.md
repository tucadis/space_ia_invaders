# 🚀 Space IA Invaders - Humans vs Robots

Un juego de Space Invaders estilo 16 bits altamente entretenido donde la humanidad lucha contra la invasión robótica. El juego cuenta con gráficos retro, efectos especiales, power-ups, múltiples armas y épicas batallas contra jefes finales con efectos 3D.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

## 🎮 Características

### Jugabilidad
- **Nave principal espectacular** con animaciones y efectos de propulsión
- **Sistema de power-ups** con 5 tipos diferentes de mejoras
- **Múltiples armas**: Básica, Triple disparo, Láser continuo, Misiles teledirigidos
- **Sistema de vidas y escudo energético**
- **Barra de salud dinámica** con indicadores visuales

### Enemigos
- **4 tipos de enemigos** con características únicas:
  - Robot básico (rápido y numeroso)
  - Robot volador (movimientos impredecibles)
  - Robot pesado (más resistente)
  - Robot élite (peligroso y con más drops)

- **Movimientos aleatorios y formaciones**:
  - Formación en V
  - Formación en onda
  - Formación circular
  - Formación en cuadrícula
  - Formación diagonal
  - Formación de enjambre

### Boss Fights
- **Jefes finales épicos** cada 3 niveles
- **Transición 2D a 3D** usando WebGL
- **Sistema de fases** que aumenta la dificultad
- **Puntos débiles destructibles**
- **Múltiples patrones de ataque**:
  - Disparo en abanico
  - Espiral
  - Láser potente
  - Misiles

### Motor de Escenarios
- **Fondos procedurales** con estrellas, planetas y nebulosas
- **Parallax scrolling** para profundidad
- **Efectos atmosféricos** dinámicos

### Efectos Visuales
- **Sistema de partículas** avanzado
- **Explosiones espectaculares** con múltiples frames
- **Efectos de brillo y resplandor**
- **Screen shake** en impactos
- **Efectos 3D en boss battles**

### Audio
- **Sonidos procedurales** generados con Web Audio API
- **Efectos de sonido** para todas las acciones
- **Música ambiental** (sistema preparado)

## 🎯 Controles

### Teclado
- **← → o A D** - Mover nave horizontalmente
- **↑ ↓ o W S** - Mover nave verticalmente
- **ESPACIO** - Disparar
- **P o ESC** - Pausar/Despausar

### Táctil
- **Tocar pantalla** - Mover y disparar (optimizado para móviles)

## 🎁 Power-Ups

| Power-Up | Efecto | Duración |
|----------|--------|----------|
| 🔵 Escudo | Protección contra un golpe | 15 segundos |
| 🔴 Triple Disparo | Dispara 3 proyectiles | 12 segundos |
| ⚡ Láser | Disparo continuo poderoso | 10 segundos |
| 💥 Bomba Nuclear | Destruye todos los enemigos | Instantáneo |
| ❤️ Vida Extra | +1 vida y +50 salud | Permanente |

## 🏗️ Arquitectura del Juego

```
space_ia_invaders/
├── index.html              # Página principal
├── css/
│   ├── styles.css         # Estilos generales
│   └── game.css           # Estilos del juego
├── js/
│   ├── main.js            # Punto de entrada
│   ├── engine/            # Motor del juego
│   │   ├── GameEngine.js
│   │   ├── Physics.js
│   │   └── CollisionDetector.js
│   ├── entities/          # Entidades del juego
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Boss.js
│   │   ├── Projectile.js
│   │   └── PowerUp.js
│   ├── systems/           # Sistemas auxiliares
│   │   ├── SpriteSystem.js
│   │   ├── ParticleSystem.js
│   │   ├── SceneGenerator.js
│   │   ├── FormationSystem.js
│   │   ├── WeaponSystem.js
│   │   └── AudioSystem.js
│   ├── rendering/         # Renderizado
│   │   ├── Renderer2D.js
│   │   └── Renderer3D.js
│   └── ui/                # Interfaz de usuario
│       ├── HUD.js
│       └── Menu.js
└── assets/                # Recursos
    ├── sprites/           # Sprites generados
    └── sounds/            # Sonidos
```

## 🚀 Cómo Jugar

### Instalación Local

1. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd space_ia_invaders
```

2. **Abrir en el navegador**:
```bash
# Opción 1: Directamente
open index.html

# Opción 2: Con servidor local (recomendado)
python -m http.server 8000
# Luego abrir http://localhost:8000
```

### Desplegar en GitHub Pages

1. Subir el código a GitHub
2. Ir a Settings → Pages
3. Seleccionar la rama main
4. El juego estará disponible en: `https://<username>.github.io/space_ia_invaders`

## 🎮 Estrategias y Consejos

### Para Principiantes
1. **Mantén la distancia** - No te acerques demasiado a los enemigos
2. **Recoge todos los power-ups** - Son esenciales para sobrevivir
3. **Usa el escudo sabiamente** - Guárdalo para situaciones críticas
4. **Aprende los patrones** - Cada formación tiene un punto débil

### Para Expertos
1. **Maximiza los combos** - Destruye enemigos rápidamente para multiplicar puntos
2. **Prioriza enemigos élite** - Dan más puntos y power-ups
3. **En boss fights**: Destruye los puntos débiles primero
4. **Movimiento predictivo** - Anticipa hacia dónde se moverán los enemigos

## 🔧 Desarrollo y Debug

### Comandos de Consola

Abre la consola del navegador (F12) y usa estos comandos:

```javascript
// Ver información del juego
gameDebug.info()

// Modo Dios (invencibilidad)
gameDebug.godMode()

// Añadir puntuación
gameDebug.addScore(10000)

// Generar power-up específico
gameDebug.spawnPowerUp("SHIELD")
gameDebug.spawnPowerUp("TRIPLE")
gameDebug.spawnPowerUp("LASER")
gameDebug.spawnPowerUp("BOMB")
gameDebug.spawnPowerUp("LIFE")

// Ver estado del juego
gameDebug.getGameState()

// Ver jugador
gameDebug.getPlayer()

// Ver enemigos
gameDebug.getEnemies()

// Ver boss
gameDebug.getBoss()
```

## 🛠️ Tecnologías Utilizadas

- **HTML5 Canvas** - Renderizado 2D
- **WebGL** - Efectos 3D en boss battles
- **Web Audio API** - Sonidos procedurales
- **JavaScript ES6+** - Lógica del juego
- **CSS3** - Interfaz y animaciones

## 📊 Sistema de Puntuación

| Acción | Puntos |
|--------|--------|
| Robot básico | 100 |
| Robot volador | 200 |
| Robot pesado | 300 |
| Robot élite | 500 |
| Boss (Nivel 1) | 5,000 |
| Boss (Nivel 2) | 10,000 |
| Boss (Nivel 3+) | 15,000+ |

## 🎨 Personalización

### Modificar Dificultad

Edita `js/engine/GameEngine.js`:

```javascript
this.levelConfig = {
    enemiesPerWave: 15,     // Enemigos por oleada
    waveDelay: 3000,        // Delay entre oleadas (ms)
    bossEvery: 3            // Boss cada X niveles
};
```

### Modificar Armas

Edita `js/systems/WeaponSystem.js` para ajustar daño, cadencia, etc.

### Añadir Nuevos Enemigos

1. Crea el sprite en `SpriteSystem.js`
2. Añade el tipo en `Enemy.js` → `setTypeProperties()`
3. Actualiza la lógica de spawn en `GameEngine.js`

## 🐛 Solución de Problemas

### El juego no se carga
- Verifica que estés usando un servidor web (no `file://`)
- Abre la consola para ver errores
- Asegúrate de que JavaScript esté habilitado

### Rendimiento bajo
- Cierra otras pestañas del navegador
- Desactiva extensiones del navegador
- Usa un navegador moderno (Chrome, Firefox, Edge)

### WebGL no funciona
- El juego funcionará en modo 2D
- Actualiza los drivers de tu tarjeta gráfica
- Prueba otro navegador

## 📝 Licencia

MIT License - Siéntete libre de usar, modificar y distribuir

## 👥 Créditos

- **Desarrollo**: IA Assistant
- **Concepto**: Space Invaders clásico + elementos modernos
- **Arte**: Sprites generados proceduralmente
- **Audio**: Web Audio API

## 🌟 Próximas Características

- [ ] Modo multijugador local
- [ ] Más tipos de enemigos
- [ ] Sistema de achievements
- [ ] Tabla de puntuaciones online
- [ ] Más tipos de armas
- [ ] Modo historia con cinemáticas
- [ ] Soporte para gamepads

## 📞 Contacto y Contribuciones

Si encuentras bugs o tienes sugerencias:
1. Abre un Issue en GitHub
2. Envía un Pull Request
3. Comparte tus puntuaciones más altas

---

**¡Defiende la Tierra de la invasión robótica!** 🌍🤖🚀

*Desarrollado con ❤️ usando JavaScript puro*
