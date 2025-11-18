/**
 * Physics - Sistema de física básico para el juego
 */
class Physics {
    constructor() {
        this.gravity = 0;
    }

    update(entity, deltaTime) {
        if (!entity.vx && !entity.vy) return;

        // Actualizar posición basada en velocidad
        entity.x += entity.vx * deltaTime;
        entity.y += entity.vy * deltaTime;

        // Aplicar fricción si existe
        if (entity.friction) {
            entity.vx *= entity.friction;
            entity.vy *= entity.friction;
        }
    }

    applyForce(entity, fx, fy) {
        if (!entity.vx) entity.vx = 0;
        if (!entity.vy) entity.vy = 0;

        entity.vx += fx;
        entity.vy += fy;
    }

    constrainToScreen(entity, width, height, margin = 0) {
        if (entity.x < margin) entity.x = margin;
        if (entity.x > width - entity.width - margin) {
            entity.x = width - entity.width - margin;
        }
        if (entity.y < margin) entity.y = margin;
        if (entity.y > height - entity.height - margin) {
            entity.y = height - entity.height - margin;
        }
    }

    isOffScreen(entity, width, height, margin = 100) {
        return entity.x < -margin ||
               entity.x > width + margin ||
               entity.y < -margin ||
               entity.y > height + margin;
    }
}
