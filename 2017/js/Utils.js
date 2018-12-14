var Utils = {
    getQueryParam: function (name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");

        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);

        if (!results) {
            return null;
        }

        if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    containHelper: function (sprite, container) {
        if (sprite.x < container.x) {
            sprite.x = container.x;
            return "left";
        }

        if (sprite.y < container.y) {
            sprite.y = container.y;
            return "top";
        }

        if (sprite.x + sprite.width > container.width) {
            sprite.x = container.width - sprite.width;
            return "right";
        }

        if (sprite.y + sprite.height > container.height) {
            sprite.y = container.height - sprite.height;
            return "bottom";
        }

        return undefined;
    },
    containObject: function (sprite) {
        var contained = Utils.containHelper(sprite, {x: 0, y: 0, width: 1280, height: 720});

        if (!contained) {
            return;
        }

        if (contained === "left") {
            if (sprite.vx > 0) {
                sprite.vx = 0;
            }
        } else if (contained === "right") {
            if (sprite.vx < 0) {
                sprite.vx = 0;
            }
        } else if (contained === "top") {
            if (sprite.vy < 0) {
                sprite.vy = 0;
            }
        } else if (contained === "bottom") {
            if (sprite.vy > 0) {
                sprite.vy = 0;
            }
        }
    },
    keyboardHelper: function (keyCode) {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;

        key.downHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) {
                    key.press();
                }

                key.isDown = true;
                key.isUp = false;

                event.preventDefault();
            }
        };

        key.upHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) {
                    key.release();
                }

                key.isDown = false;
                key.isUp = true;

                event.preventDefault();
            }
        };

        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );

        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );

        return key;
    },
    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    collisionDetected: function (r1, r2) {
        return !(r2.x > (r1.x + r1.width) ||
                (r2.x + r2.width) < r1.x ||
                r2.y > (r1.y + r1.height) ||
                (r2.y + r2.height) < r1.y);
    },
    collisionDetectedWithDirection: function (r1, r2) {
        if (!(r2.x > (r1.x + r1.width))) {
            return "left";
        }

        if ((r2.x + r2.width) < r1.x) {
            return "right";
        }

        if (r2.y > (r1.y + r1.height)) {
            return "top";
        }

        if ((r2.y + r2.height) < r1.y) {
            return "down";
        }

        return null;
    },
    createAndInitHero: function (spriteLocation) {
        var hero = new PIXI.Sprite(PIXI.loader.resources[spriteLocation].texture);

        hero.vx = 0;
        hero.vy = 0;
        hero.scale.set(0.1, 0.1);
        hero.y = 450;

        hero.interactive = false;
        hero.buttonMode = false;

        left.press = function () {
            hero.vx = -4;
        };
        left.release = function () {
            if (!right.isDown) {
                hero.vx = 0;
            }
        };

        right.press = function () {
            hero.vx = 4;
        };
        right.release = function () {
            if (!left.isDown) {
                hero.vx = 0;
            }
        };

        spacebar.press = function () {
            if (hero.vy === 0) {
                hero.vy = -4;
            }
        };

        return hero;
    },
    createAndInitShootingHero: function (spriteLocation, shootFunction) {
        var shootingHero = Utils.createAndInitHero(spriteLocation);
        background.pointerdown = shootFunction;

        return shootingHero;
    },
    createFullRangeOfMotionHero: function (spriteLocation) {
        var hero = Utils.createAndInitHero(spriteLocation);
        hero.vx = 0;
        hero.vy = 0;
        hero.scale.set(1.0, 1.0);
        hero.y = 400;

        up.press = function () {
            hero.vy = -4;
        };

        up.release = function () {
            hero.vy = 0;
        };

        down.press = function () {
            hero.vy = 4;
        };

        down.release = function () {
            hero.vy = 0;
        };

        return hero;
    }
};