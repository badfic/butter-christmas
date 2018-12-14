Levels.level2 = {
    background: undefined,
    portal: undefined,
    trees: undefined,
    hero: undefined,
    obstacles: undefined,
    help: undefined,
    goal: undefined,
    destroyAfterAnimation: undefined,
    setup: function(setupObj) {
        console.log("Loading level 2");

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
            var tree = new PIXI.Sprite(PIXI.loader.resources["images/christmas-tree.png"].texture);
            tree.interactive = false;
            tree.buttonMode = false;
            tree.scale.set(0.2);
            tree.x = (250 * i) + 150;
            tree.y = 395;

            trees.addChild(tree);
        }

        hero = Utils.createAndInitHero("images/chelsea-sprite.png");
        help = new PIXI.Text(" [a] = move left\n  [d] = move right\n[space] = jump", {fontFamily : "Courier, monospace", fontSize: 24, fill : 0xffffff, align : "center"});
        goal = new PIXI.Text("Jump over the margarine pucks", {fontFamily : "Courier, monospace", fontSize: 38, fill : 0xffffff, align : "center"});
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

        obstacles = [
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture),
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture),
                new PIXI.Sprite(PIXI.loader.resources["images/butter-puck.png"].texture)
            ];

        obstacles[0].scale.set(0.06, 0.06);
        obstacles[0].x = 310;
        obstacles[0].y = 540;

        obstacles[1].scale.set(0.06, 0.06);
        obstacles[1].x = 530;
        obstacles[1].y = 540;

        obstacles[2].scale.set(0.06, 0.06);
        obstacles[2].x = 800;
        obstacles[2].y = 540;

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
            if (Utils.collisionDetected(heroHitbox, obstacles[i])) {
                // todo: death animation
                hero.x = 0;
                hero.y = 450;
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
        console.log("Destroying level 2");

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
        activeLevel = Levels.level3;
    }
}
