/**
 * CollisionDetector - Sistema de detección de colisiones
 */
class CollisionDetector {
    // Detección de colisión rectangular (AABB)
    checkAABB(entity1, entity2) {
        return entity1.x < entity2.x + entity2.width &&
               entity1.x + entity1.width > entity2.x &&
               entity1.y < entity2.y + entity2.height &&
               entity1.y + entity1.height > entity2.y;
    }

    // Detección de colisión circular
    checkCircle(entity1, entity2) {
        const dx = (entity1.x + entity1.width / 2) - (entity2.x + entity2.width / 2);
        const dy = (entity1.y + entity1.height / 2) - (entity2.y + entity2.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        const radius1 = entity1.width / 2;
        const radius2 = entity2.width / 2;

        return distance < radius1 + radius2;
    }

    // Detección híbrida (más precisa)
    checkCollision(entity1, entity2, useCircle = false) {
        if (useCircle) {
            return this.checkCircle(entity1, entity2);
        }
        return this.checkAABB(entity1, entity2);
    }

    // Obtener el punto de colisión
    getCollisionPoint(entity1, entity2) {
        return {
            x: (entity1.x + entity1.width / 2 + entity2.x + entity2.width / 2) / 2,
            y: (entity1.y + entity1.height / 2 + entity2.y + entity2.height / 2) / 2
        };
    }

    // Verificar colisión con lista de entidades
    checkCollisionWithList(entity, list, callback) {
        for (let i = list.length - 1; i >= 0; i--) {
            if (this.checkAABB(entity, list[i])) {
                if (callback) {
                    callback(entity, list[i], i);
                }
            }
        }
    }
}
