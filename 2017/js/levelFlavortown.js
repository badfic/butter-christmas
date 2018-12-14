Levels.levelFlavortown = {
    background: undefined,
    hero: undefined,
    help: undefined,
    goal: undefined,
    destroyAfterAnimation: undefined,
    burgers: undefined,
    setup: function (setupObj) {
        console.log("Loading flavortown");

        bgMusic = new Howl({
            src: ['music/level-2.mp3'],
            autoplay: true,
            volume: 0.3,
            loop: true
        });
        bgMusic.play();

        background = new PIXI.Sprite(PIXI.loader.resources["images/background-1.png"].texture);
        hero = Utils.createFullRangeOfMotionHero("images/fieri-sprite.png");
        help = new PIXI.Text("[w] = Move Up\n  [s] = Move Down\n  [a] = Move Left\n   [d] = Move Right", {
            fontFamily: "Courier, monospace",
            fontSize: 24,
            fill: 0xffffff,
            align: "center"
        });
        goal = new PIXI.Text("Ascend to flavor town by collecting all the burgers!", {
            fontFamily: "Courier, monospace",
            fontSize: 35,
            fill: 0xffffff,
            align: "center"
        });
        goal.y = 680;

        destroyAfterAnimation = 0;
        stage.addChild(background);
        burgers = this.initBurgers(stage);

        background.scale.set(0.24, 0.24);
        background.interactive = false;
        background.buttonMode = false;

        stage.addChild(hero);
        stage.addChild(help);
        stage.addChild(goal);
    },
    state: function () {
        if (destroyAfterAnimation > 0) {
            destroyAfterAnimation += 1;

            hero.rotation += 0.1;
            hero.scale.set(hero.scale.x / 1.01, hero.scale.y / 1.01);

            if (destroyAfterAnimation > 200) {
                doDestroy = true;
            }

            return;
        }

        var index = 0;
        burgers.forEach(function (burger) {
            if (Utils.collisionDetected(hero, burger)) {
                burger.visible = false;
                stage.removeChild(burger);
                index = burgers.indexOf(burger);
                if (index >= 0) {
                    burgers.splice(index, 1);
                }
            }
        });

        if (burgers.length === 0) {
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

        Utils.containObject(hero);

        hero.x += hero.vx;
        hero.y += hero.vy;

        if (hero.y >= 600) {
            hero.vy = 0;
            hero.y = 600;
        }
    },
    destroy: function () {
        console.log("Destroying flavortown");

        stage.removeChild(background);
        stage.removeChild(hero);
        stage.removeChild(help);
        stage.removeChild(goal);

        background.destroy({children: true});
        hero.destroy({children: true});
        help.destroy({children: true});
        goal.destroy({children: true});

        bgMusic.stop();

        setupObj = {};
        activeLevel = Levels.level4;
    },
    initBurgers: function (stage) {
        var numberOfBurgers = 15;
        var burgers = [];

        for (var i = 0; i < numberOfBurgers; i++) {
            //Make da burger
            var burger = new PIXI.Sprite(PIXI.loader.resources["images/burger.png"].texture);
            burger.scale.set(0.15, 0.15);
            var x = Utils.randomInt(0, 1280 - burger.width);
            var y = Utils.randomInt(0, 720 - burger.height);
            burger.x = x;
            burger.y = y;

            burgers.push(burger);
            stage.addChild(burger);
        }
        return burgers;
    }
};