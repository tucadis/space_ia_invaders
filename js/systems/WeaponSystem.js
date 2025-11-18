/**
 * WeaponSystem - Sistema de armas y power-ups
 */
class WeaponSystem {
    constructor() {
        this.weapons = {
            'BASIC': {
                name: 'BÁSICA',
                damage: 1,
                cooldown: 200,
                projectileSpeed: -8,
                projectileType: 'bullet',
                sound: 'shoot'
            },
            'TRIPLE': {
                name: 'TRIPLE',
                damage: 1,
                cooldown: 250,
                projectileSpeed: -8,
                projectileType: 'bullet',
                sound: 'shoot',
                special: 'triple'
            },
            'LASER': {
                name: 'LÁSER',
                damage: 2,
                cooldown: 100,
                projectileSpeed: -12,
                projectileType: 'laser',
                sound: 'laser'
            },
            'MISSILE': {
                name: 'MISILES',
                damage: 3,
                cooldown: 400,
                projectileSpeed: -6,
                projectileType: 'missile',
                sound: 'missile',
                special: 'homing'
            }
        };

        this.currentWeapon = 'BASIC';
        this.weaponDuration = 0;
        this.lastShot = 0;
    }

    setWeapon(weaponType, duration = 10000) {
        this.currentWeapon = weaponType;
        this.weaponDuration = duration;
    }

    resetToBasic() {
        this.currentWeapon = 'BASIC';
        this.weaponDuration = 0;
    }

    getCurrentWeapon() {
        return this.weapons[this.currentWeapon];
    }

    getCurrentWeaponName() {
        return this.weapons[this.currentWeapon].name;
    }

    update(deltaTime) {
        if (this.weaponDuration > 0) {
            this.weaponDuration -= deltaTime;
            if (this.weaponDuration <= 0) {
                this.resetToBasic();
            }
        }
    }

    canShoot(currentTime) {
        const weapon = this.getCurrentWeapon();
        return currentTime - this.lastShot >= weapon.cooldown;
    }

    shoot(player, currentTime) {
        if (!this.canShoot(currentTime)) {
            return [];
        }

        this.lastShot = currentTime;
        const weapon = this.getCurrentWeapon();
        const projectiles = [];

        const centerX = player.x + player.width / 2;
        const centerY = player.y;

        switch (weapon.special) {
            case 'triple':
                // Disparo triple
                projectiles.push(this.createProjectile(centerX, centerY, 0, weapon));
                projectiles.push(this.createProjectile(centerX - 10, centerY + 10, -1, weapon));
                projectiles.push(this.createProjectile(centerX + 10, centerY + 10, 1, weapon));
                break;

            default:
                // Disparo simple
                projectiles.push(this.createProjectile(centerX, centerY, 0, weapon));
                break;
        }

        return projectiles;
    }

    createProjectile(x, y, angleOffset, weapon) {
        return {
            x: x - 4,
            y: y,
            width: weapon.projectileType === 'laser' ? 12 : 8,
            height: weapon.projectileType === 'laser' ? 24 : 16,
            vx: angleOffset * 2,
            vy: weapon.projectileSpeed,
            damage: weapon.damage,
            type: weapon.projectileType,
            homing: weapon.special === 'homing'
        };
    }

    getRemainingTime() {
        return Math.max(0, this.weaponDuration);
    }
}
