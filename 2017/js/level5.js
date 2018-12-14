Levels.level5 = {
    background: undefined,
    trees: undefined,
    hero: undefined,
    finn: undefined,
    help: undefined,
    goal: undefined,
    destroyAfterAnimation: undefined,
    setup: function(setupObj) {
        console.log("Loading level 5");

        bgMusic = new Howl({
            src: ['music/level-1.mp3'],
            autoplay: true,
            volume: 0.4,
            loop: true
        });
        bgMusic.play();

        background = new PIXI.Sprite(PIXI.loader.resources["images/background-1.png"].texture);
        
        trees = new PIXI.Container();
        
        for (var i = 0; i < 4; i++) {
            var tree = new PIXI.Sprite(PIXI.loader.resources["images/christmas-tree-lights.png"].texture);
            tree.scale.set(0.2);
            tree.x = (250 * i) + 150;
            tree.y = 395;

            trees.addChild(tree);
        }

        hero = Utils.createAndInitHero("images/padme-sprite.png");

        help = new PIXI.Text(" [a] = move left\n  [d] = move right\n[space] = jump\n     [left click] = melt", {fontFamily : "Courier, monospace", fontSize: 24, fill : 0xffffff, align : "center"});
        goal = new PIXI.Text("Deliver the drink", {fontFamily : "Courier, monospace", fontSize: 45, fill : 0xffffff, align : "center"});
        destroyAfterAnimation = 0;

        goal.x = 600;
        goal.y = 200;

        background.scale.set(0.24, 0.24);
        background.interactive = true;
        background.buttonMode = true;

        stage.addChild(background);
        stage.addChild(trees);
        stage.addChild(hero);
        stage.addChild(help);
        stage.addChild(goal);

        finn = new PIXI.Sprite(PIXI.loader.resources["images/finn-sprite.png"].texture);

        finn.scale.set(0.1, 0.1);
        finn.y = hero.y;
        finn.x = 1090;

        stage.addChild(finn);
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
        if (Utils.collisionDetected(hero.getBounds(), finn.getBounds())) {
            destroyAfterAnimation = 1;
            
            bgMusic.stop();
            bgMusic = new Howl({
                src: ['music/warp.mp3'],
                autoplay: true,
                volume: 0.2,
                loop: true
            });
            bgMusic.play();
        }

        hero.x += hero.vx;
        hero.y += hero.vy;

        if (hero.y >= 450) {
            hero.vy = 0;
            hero.y = 450;
        }
    },
    destroy: function() {
        console.log("Destroying level 5");

        stage.removeChild(finn);
        stage.removeChild(hero);
        stage.removeChild(trees);
        stage.removeChild(background);
        stage.removeChild(help);
        stage.removeChild(goal);

        finn.destroy({children: true});
        hero.destroy({children: true});
        trees.destroy({children: true});
        background.destroy({children: true});
        help.destroy({children: true});
        goal.destroy({children: true});

        bgMusic.stop();

        setupObj = {};
        activeLevel = Levels.levelBoss;
    }
}
