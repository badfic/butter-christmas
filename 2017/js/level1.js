Levels.level1 = {
    background: undefined,
    portal: undefined,
    hero: undefined,
    help: undefined,
    goal: undefined,
    destroyAfterAnimation: undefined,
    setup: function(setupObj) {
        console.log("Loading level 1");

        bgMusic = new Howl({
            src: ['music/level-1.mp3'],
            autoplay: true,
            volume: 0.4,
            loop: true
        });
        bgMusic.play();

        background = new PIXI.Sprite(PIXI.loader.resources["images/background-1.png"].texture);
        portal = new PIXI.Sprite(PIXI.loader.resources["images/portal.png"].texture);
        hero = Utils.createAndInitHero("images/desdemona-sprite.png");
        help = new PIXI.Text(" [a] = move left\n  [d] = move right\n[space] = jump", {fontFamily : "Courier, monospace", fontSize: 24, fill : 0xffffff, align : "center"});
        goal = new PIXI.Text("Walk into the portal", {fontFamily : "Courier, monospace", fontSize: 48, fill : 0xffffff, align : "center"});
        destroyAfterAnimation = 0;

        goal.x = 640;
        goal.y = 200;

        background.scale.set(0.24, 0.24);
        background.interactive = false;
        background.buttonMode = false;

        portal.scale.set(0.2, 0.2);
        portal.interactive = false;
        portal.buttonMode = false;
        portal.x = 1170;
        portal.y = 350;

        stage.addChild(background);
        stage.addChild(portal);
        stage.addChild(hero);
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

        if (hero.x >= portal.x) {
            destroyAfterAnimation = 1;
            hero.x = portal.x + 50;

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
        console.log("Destroying level 1");

        stage.removeChild(hero);
        stage.removeChild(portal);
        stage.removeChild(background);
        stage.removeChild(help);
        stage.removeChild(goal);

        hero.destroy({children: true});
        portal.destroy({children: true});
        background.destroy({children: true});
        help.destroy({children: true});
        goal.destroy({children: true});

        bgMusic.stop();

        setupObj = {};
        activeLevel = Levels.level2;
    }
}
