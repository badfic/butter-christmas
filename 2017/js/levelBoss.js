Levels.levelBoss = {
    background: undefined,
    trees: undefined,
    portal: undefined,
    hero: undefined,
    laser: undefined,
    enemy: undefined,
    enemyHp: undefined,
    help: undefined,
    goal: undefined,
    destroyAfterAnimation: undefined,
    setup: function(setupObj) {
        console.log("Loading boss level");

        bgMusic = new Howl({
            src: ['music/level-3.mp3'],
            autoplay: true,
            volume: 0.4,
            loop: true
        });
        bgMusic.play();

        laser = new Howl({
            src: ['music/laser.mp3'],
            volume: 0.2
        });

        background = new PIXI.Sprite(PIXI.loader.resources["images/background-1.png"].texture);
        portal = new PIXI.Sprite(PIXI.loader.resources["images/portal.png"].texture);
        trees = new PIXI.Container();

        for (var i = 0; i < 3; i++) {
            var tree = new PIXI.Sprite(PIXI.loader.resources["images/christmas-tree.png"].texture);
            tree.interactive = false;
            tree.buttonMode = false;
            tree.scale.set(0.2);
            tree.x = (250 * i) + 150;
            tree.y = 395;

            trees.addChild(tree);
        }
        
        hero = Utils.createAndInitShootingHero("images/james-sprite.png", function(mouseData) {
            var projectile = new PIXI.Graphics();

            projectile.beginFill(0xFF0000, 1);
            projectile.drawRect(hero.x + 41, hero.y + 25, 10, 3);
            projectile.endFill();

            stage.addChild(projectile);
            laser.play();

            new TWEEN.Tween(projectile)
                .to({x: 1281, y: 0}, 2000)
                .onUpdate(function() {
                    if (projectile.alpha !== 0 && enemy.alpha !== 0) {
                        if (Utils.collisionDetected(projectile.getBounds(), enemy.getBounds())) {
                            projectile.alpha = 0;
                            enemy.hp -= 10;
                            if (enemy.hp >= 70 && enemy.hp <= 100) {
                                enemyHp.style.fill = 0xffff00;
                            } else if (enemy.hp >= 40 && enemy.hp <= 70) {
                                enemyHp.style.fill = 0xffa500;
                            } else if (enemy.hp < 40) {
                                enemyHp.style.fill = 0xff0000;
                            }
                            enemyHp.text = (parseInt(enemyHp.text) - 10).toString();
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
        help = new PIXI.Text(" [a] = move left\n  [d] = move right\n[space] = jump\n      [left click] = shoot", {fontFamily : "Courier, monospace", fontSize: 24, fill : 0xffffff, align : "center"});
        goal = new PIXI.Text("Shoot the enemy", {fontFamily : "Courier, monospace", fontSize: 48, fill : 0xffffff, align : "center"});
        destroyAfterAnimation = 0;

        goal.x = 600;
        goal.y = 200;

        background.scale.set(0.24, 0.24);
        background.interactive = true;
        background.buttonMode = true;

        portal.scale.set(0.2, 0.2);
        portal.interactive = false;
        portal.buttonMode = false;
        portal.x = 1170;
        portal.y = 350;

        enemy = new PIXI.Sprite(PIXI.loader.resources["images/margarine-boss.png"].texture);
        enemy.scale.set(0.2, 0.2);
        enemy.x = 850;
        enemy.y = 400;
        enemy.hp = 100;

        enemyHp = new PIXI.Text("100", {fontFamily : "Arial, Helvetica Neue, Helvetica, sans-serif", fontSize: 24, "font-weight": "bold", fill : 0x00ff00, align : "center"});
        enemyHp.x = 855;
        enemyHp.y = 380;

        stage.addChild(background);
        stage.addChild(trees);
        stage.addChild(portal);
        stage.addChild(hero);
        stage.addChild(enemy);
        stage.addChild(enemyHp);
        stage.addChild(help);
        stage.addChild(goal);
    },
    state: function() {
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

        hero.x += hero.vx;
        hero.y += hero.vy;

        if (hero.y >= 450) {
            hero.vy = 0;
            hero.y = 450;
        }

        if (enemy.alpha !== 0) {
            if (enemy.hp <= 0) {
                enemy.alpha = 0;
                enemyHp.alpha = 0;
            }

            if (Utils.collisionDetected(hero, enemy.getBounds())) {
                // todo: death animation
                hero.x = 0;
                hero.y = 450;
            }
        } else {
            goal.text = "Great, now head into the portal";
            goal.style = {fontFamily : "Courier, monospace", fontSize: 24, fill : 0xffffff, align : "center"};
        }

        if (hero.x >= portal.x) {
            if (enemy.alpha !== 0) {
                goal.text = "Kill the enemy first";
                goal.style = {fontFamily : "Courier, monospace", fontSize: 48, fill : 0xff0000, align : "center"};
                return;
            }

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
        console.log("Destroying boss level");

        stage.removeChild(hero);
        stage.removeChild(portal);
        stage.removeChild(trees);
        stage.removeChild(background);
        stage.removeChild(help);
        stage.removeChild(goal);
        stage.removeChild(enemy);
        stage.removeChild(enemyHp);

        hero.destroy({children: true});
        portal.destroy({children: true});
        trees.destroy({children: true});
        background.destroy({children: true});
        help.destroy({children: true});
        goal.destroy({children: true});
        enemy.destroy({children: true});
        enemyHp.destroy({children: true});

        bgMusic.stop();
        laser.stop();

        setupObj = {};
        activeLevel = Levels.levelCredits;
    }
}
