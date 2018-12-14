Levels.level3 = {
    background: undefined,
    portal: undefined,
    trees: undefined,
    hero: undefined,
    obstacles: undefined,
    help: undefined,
    goal: undefined,
    destroyAfterAnimation: undefined,
    setup: function(setupObj) {
        console.log("Loading level 3");

        bgMusic = new Howl({
            src: ['music/level-2.mp3'],
            autoplay: true,
            volume: 0.4,
            loop: true
        });
        bgMusic.play();

        background = new PIXI.Sprite(PIXI.loader.resources["images/background-1.png"].texture);
        portal = new PIXI.Sprite(PIXI.loader.resources["images/portal.png"].texture);
        
        trees = new PIXI.Container();
        
        for (var i = 0; i < 4; i++) {
            var tree = new PIXI.Sprite(PIXI.loader.resources["images/christmas-tree-lights.png"].texture);
            tree.scale.set(0.2);
            tree.x = (250 * i) + 150;
            tree.y = 395;

            trees.addChild(tree);
        }

        hero = Utils.createAndInitShootingHero("images/caitlyn-sprite.png", function(mouseData) {
            var projectile = new PIXI.Graphics();

            projectile.beginFill(0xFF0000, 1);
            projectile.drawRect(hero.x + 77, hero.y + 55, 10, 10);
            projectile.endFill();

            stage.addChild(projectile);

            new TWEEN.Tween(projectile)
                .to({x: 20, y: 0}, 1000)
                .onUpdate(function() {
                    for (var i = 0; i < obstacles.length; i++) {
                        if (obstacles[i].alive) {
                            if (Utils.collisionDetected(projectile.getBounds(), obstacles[i].getBounds())) {
                                obstacles[i].alive = false;
                            }
                        }
                    }
                })
                .onComplete(function() {
                    stage.removeChild(projectile);
                    projectile.destroy();
                    this.stop();
                })
                .start();
        });

        help = new PIXI.Text(" [a] = move left\n  [d] = move right\n[space] = jump\n     [left click] = melt", {fontFamily : "Courier, monospace", fontSize: 24, fill : 0xffffff, align : "center"});
        goal = new PIXI.Text("Melt the margarine pucks", {fontFamily : "Courier, monospace", fontSize: 45, fill : 0xffffff, align : "center"});
        destroyAfterAnimation = 0;

        goal.x = 600;
        goal.y = 200;

        background.scale.set(0.24, 0.24);
        background.interactive = true;
        background.buttonMode = true;

        portal.scale.set(0.2, 0.2);
        portal.x = 1170;
        portal.y = 350;

        obstacles = [
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture),
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture),
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture)
            ];

        obstacles[0].scale.set(0.06, 0.06);
        obstacles[0].x = 320;
        obstacles[0].y = 500;
        obstacles[0].alive = true;

        obstacles[1].scale.set(0.06, 0.06);
        obstacles[1].x = 570;
        obstacles[1].y = 500;
        obstacles[1].alive = true;

        obstacles[2].scale.set(0.06, 0.06);
        obstacles[2].x = 800;
        obstacles[2].y = 500;
        obstacles[2].alive = true;

        stage.addChild(background);
        stage.addChild(portal);
        stage.addChild(trees);
        stage.addChild(hero);
        stage.addChild(help);
        stage.addChild(goal);

        for (i = 0; i < obstacles.length; i++) {
            stage.addChild(obstacles[i]);
        }
    },
    state: function() {
        for (var i = 0; i < obstacles.length; i++) {
            if (!obstacles[i].alive) {
                obstacles[i].alpha = 0;
            }
        }

        if (destroyAfterAnimation > 0) {
            destroyAfterAnimation += 1;

            hero.rotation += 0.1;
            hero.scale.set(hero.scale.x / 1.01, hero.scale.y / 1.01);

            if (destroyAfterAnimation > 200) {
                doDestroy = true;
            }

            return;
        }

        Utils.containObject(hero);

        if (hero.vy !== 0) {
            if (hero.y <= 350) {
                hero.vy = 4;
            }
        }

        var heroHitbox = {x: hero.x, y: hero.y, width: hero.width, height: hero.height};
        for (i = 0; i < obstacles.length; i++) {
            if (obstacles[i].alpha !== 0) {
                var dir = Utils.collisionDetectedWithDirection(heroHitbox, obstacles[i]);
                
                if (dir === "right") {
                    if (hero.vx < 0) {
                        hero.vx = 0;
                    }
                } else if (dir === "left") {
                    if (hero.vx > 0) {
                        hero.vx = 0;
                    }
                }
            }
        }

        hero.x += hero.vx;
        hero.y += hero.vy;

        if (hero.y >= 450) {
            hero.vy = 0;
            hero.y = 450;
        }

        if (hero.x >= portal.x) {
            destroyAfterAnimation = 1;
            hero.x = portal.x + 30;

            bgMusic.stop();
            bgMusic = new Howl({
                src: ['music/warp.mp3'],
                autoplay: true,
                volume: 0.2,
                loop: true
            });
            bgMusic.play();
        }
    },
    destroy: function() {
        console.log("Destroying level 3");

        stage.removeChild(hero);
        stage.removeChild(portal);
        stage.removeChild(trees);
        stage.removeChild(background);
        stage.removeChild(help);
        stage.removeChild(goal);

        for (i = 0; i < obstacles.length; i++) {
            stage.removeChild(obstacles[i]);
            obstacles[i].destroy({children: true});
        }

        hero.destroy({children: true});
        portal.destroy({children: true});
        trees.destroy({children: true});
        background.destroy({children: true});
        help.destroy({children: true});
        goal.destroy({children: true});

        bgMusic.stop();

        setupObj = {};
        activeLevel = Levels.levelFlavortown;
    }
}
