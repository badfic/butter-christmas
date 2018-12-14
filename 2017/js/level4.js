Levels.level4 = {
    background: undefined,
    portal: undefined,
    trees: undefined,
    bee: undefined,
    hero: undefined,
    obstacles: undefined,
    help: undefined,
    goal: undefined,
    destroyAfterAnimation: undefined,
    setup: function(setupObj) {
        console.log("Loading level 4");

        bgMusic = new Howl({
            src: ['music/level-4.mp3'],
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
            tree.interactive = false;
            tree.buttonMode = false;
            tree.scale.set(0.2);
            tree.x = (250 * i) + 150;
            tree.y = 375;

            trees.addChild(tree);
        }

        hero = Utils.createAndInitHero("images/ariel-sprite.png");
        help = new PIXI.Text(" [a] = move left\n  [d] = move right\n[space] = jump", {fontFamily : "Courier, monospace", fontSize: 24, fill : 0xffffff, align : "center"});
        goal = new PIXI.Text("Avoid the moving margarine pucks!", {fontFamily : "Courier, monospace", fontSize: 34, fill : 0xffffff, align : "center"});
        destroyAfterAnimation = 0;

        goal.x = 600;
        goal.y = 200;

        background.scale.set(0.24, 0.24);
        background.interactive = false;
        background.buttonMode = false;

        portal.scale.set(0.2, 0.2);
        portal.interactive = false;
        portal.buttonMode = false;
        portal.x = 1170;
        portal.y = 350;

        obstacles = [new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture),
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture),
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture),
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture)];

        obstacles[0].scale.set(0.06, 0.06);
        obstacles[0].x = 170;
        obstacles[0].y = 530;
        obstacles[0].interactive = false;
        obstacles[0].buttonMode = false;

        obstacles[1].scale.set(0.06, 0.06);
        obstacles[1].x = 370;
        obstacles[1].y = 530;
        obstacles[1].vy = -1;
        obstacles[1].yMin = 390;
        obstacles[1].yMax = 530;

        obstacles[2].scale.set(0.06, 0.06);
        obstacles[2].x = 570;
        obstacles[2].y = 530;
        obstacles[2].vx = -1;
        obstacles[2].xMin = 570;
        obstacles[2].xMax = 700;

        obstacles[3].scale.set(0.06, 0.06);
        obstacles[3].x = 800;
        obstacles[3].y = 530;
        obstacles[3].vy = -1;
        obstacles[3].yMin = 390;
        obstacles[3].yMax = 530;
        obstacles[3].vx = -1;
        obstacles[3].xMin = 800;
        obstacles[3].xMax = 1000;

        stage.addChild(background);
        stage.addChild(portal);
        stage.addChild(trees);
        stage.addChild(hero);
        stage.addChild(help);
        stage.addChild(goal);

        for (i = 0; i < obstacles.length; i++) {
            stage.addChild(obstacles[i]);
        }

        bee = new PIXI.Sprite(PIXI.loader.resources["images/bee-sprite.png"].texture);

        bee.scale.set(0.1, 0.1);
        bee.y = 313;
        bee.x = 890;

        stage.addChild(bee);
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

        // todo: this should probably be extracted to utils or something
        for (i = 0; i < obstacles.length; i++) {
            if (obstacles[i].vy) {
                if (obstacles[i].vy === -1 && obstacles[i].y <= obstacles[i].yMin) {
                    obstacles[i].vy = 1;
                } else if (obstacles[i].vy === 1 && obstacles[i].y >= obstacles[i].yMax) {
                    obstacles[i].vy = -1;
                }

                obstacles[i].y += obstacles[i].vy;
            }

            if (obstacles[i].vx) {
                if (obstacles[i].vx === -1 && obstacles[i].x <= obstacles[i].xMin) {
                    obstacles[i].vx = 1;
                } else if (obstacles[i].vx === 1 && obstacles[i].x >= obstacles[i].xMax) {
                    obstacles[i].vx = -1;
                }

                obstacles[i].x += obstacles[i].vx;
            }
        }

        var heroHitbox = {x: hero.x + 11, y: hero.y, width: hero.width - 22, height: hero.height};
        for (i = 0; i < obstacles.length; i++) {
            if (Utils.collisionDetected(heroHitbox, obstacles[i])) {
                // todo: death animation
                hero.x = 0;
                hero.y = 450;
            }
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
        console.log("Destroying level 4");

        stage.removeChild(bee);
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

        bee.destroy({children: true});
        hero.destroy({children: true});
        portal.destroy({children: true});
        trees.destroy({children: true});
        background.destroy({children: true});
        help.destroy({children: true});
        goal.destroy({children: true});

        bgMusic.stop();

        setupObj = {};
        activeLevel = Levels.level5;
    }
}
