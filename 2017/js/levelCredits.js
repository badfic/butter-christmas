Levels.levelCredits = {
    background: undefined,
    hero: undefined,
    laser: undefined,
    lineup: undefined,
    setup: function(setupObj) {
        console.log("Loading credits");

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
        background.scale.set(0.24, 0.24);
        background.interactive = true;
        background.buttonMode = true;

        var help = new PIXI.Text("Credits\nArt: Desdemona\nMusic: Santiago\nCode: Santiago\nFlavorTown: DatChive", {fontFamily : "Courier, monospace", fontSize: 90, fill : 0xffffff, align : "center"});
        help.x = 98;
        help.y = 5;
        hero = Utils.createAndInitShootingHero("images/josh-sprite.png", function(mouseData) {
            var projectile = new PIXI.Graphics();

            projectile.beginFill(0x00FF00, 1);
            projectile.drawRect(hero.x + 41, hero.y + 25, 10, 3);
            projectile.endFill();

            stage.addChild(projectile);
            laser.play();

            new TWEEN.Tween(projectile)
                .to({x: 1281, y: 0}, 2000)
                .onUpdate(function() {
                    // do nothing
                })
                .onComplete(function() {
                    stage.removeChild(projectile);
                    projectile.destroy();
                    this.stop();
                })
                .start();
        });

        hero.textName = new PIXI.Text(" Josh", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"})
        hero.textName.x = hero.x;
        hero.textName.y = hero.y - 20;

        lineup = [
            {
                sprite: new PIXI.Sprite(PIXI.loader.resources["images/ariel-sprite.png"].texture),
                text: new PIXI.Text("Ariel", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"}),
                location: 150
            },
            {
                sprite: new PIXI.Sprite(PIXI.loader.resources["images/bee-sprite.png"].texture),
                text: new PIXI.Text("   Bee", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"}),
                location: 300
            },
            {
                sprite: new PIXI.Sprite(PIXI.loader.resources["images/caitlyn-sprite.png"].texture),
                text: new PIXI.Text("Caitlyn", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"}),
                location: 450                
            },
            {
                sprite: new PIXI.Sprite(PIXI.loader.resources["images/chelsea-sprite.png"].texture),
                text: new PIXI.Text("Chelsea", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"}),
                location: 600                
            },
            {
                sprite: new PIXI.Sprite(PIXI.loader.resources["images/desdemona-sprite.png"].texture),
                text: new PIXI.Text("Desdemona", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"}),
                location: 750
            },
            {
                sprite: new PIXI.Sprite(PIXI.loader.resources["images/finn-sprite.png"].texture),
                text: new PIXI.Text("   Finn", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"}),
                location: 900
            },
            {
                sprite: new PIXI.Sprite(PIXI.loader.resources["images/james-sprite.png"].texture),
                text: new PIXI.Text("Santiago", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"}),
                location: 1050
            },
            {
                sprite: new PIXI.Sprite(PIXI.loader.resources["images/padme-sprite.png"].texture),
                text: new PIXI.Text(" Erin", {fontFamily : "Courier, monospace", fontSize: 18, fill : 0xffffff, align : "center"}),
                location: 1190
            },
        ]

        stage.addChild(background);

        for (var index = 0; index < lineup.length; index++) {
            var element = lineup[index];
            
            element.sprite.scale.set(0.1, 0.1);
            element.sprite.x = element.location;
            element.sprite.y = 450;

            element.text.x = element.location;
            element.text.y = 430;

            stage.addChild(element.sprite);
            stage.addChild(element.text);
        }

        stage.addChild(help);
        stage.addChild(hero);
        stage.addChild(hero.textName);
    },
    state: function() {
        Utils.containObject(hero);

        if (hero.vy !== 0) {
            if (hero.y <= 350) {
                hero.vy = 4;
            }
        }

        hero.x += hero.vx;
        hero.y += hero.vy;
        hero.textName.x = hero.x;
        hero.textName.y = hero.y - 20;
        
        if (hero.y >= 450) {
            hero.vy = 0;
            hero.y = 450;
        }
    },
    destroy: function() {

    }
}
