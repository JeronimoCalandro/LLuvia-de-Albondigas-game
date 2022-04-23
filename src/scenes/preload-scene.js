class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene")
    }
    preload() {
        this.load.image("preload-scene-bg", "assets/preload-scene/bg.png")
    }
    create() {
        this.scene.start("PreloadScene")
    }
}

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene')
    }

    preload() {
        let bg = this.add.image(gWidth/2, gHeight, "preload-scene-bg")
        bg.setOrigin(0.5, 1)
        ScaleImageToWidth(bg, gWidth)

        // --- load bar ---
        let bar = new FillBar(this, gWidth/2, gHeight*0.6, gWidth*0.6, 160, 0)

        this.load.on("progress", (p) => {
            bar.update(p)
        })
        this.load.on("complete", ()=> {
            this.time.delayedCall(200, ()=> {
                this.scene.start("SplashScene")
                //this.scene.start("LevelSelectionScene")
                //this.scene.start("GameScene", {currentLevel: 1})
            })
        })



        // === DEBUG ===
        this.load.image("200x200", gameConfig.assetsPath + "200x200.png")

        // === UI ===
        this.loadElements([
            "character-lampo",
            "character-meatball",
            "character-milady",
            "character-pilou",

            "btn-play",
            "btn-back",
            "btn-pause",
            "btn-arrow",
            "btn-restart",
            "btn-music",
            "btn-close",
            "btn-help",
            "yellow-panel",
            
            "star-off",
            "star-on"
        ], "ui", "image")

        // === SPLASH SCENE ===
        this.loadElements([
            "bg",
            "logo",
            "cats",
            "granny",
            "food"
        ], "splash-scene", "image")

        // === HELP SCENE ===
        this.loadElements([
            "title",
            "illustration",
            "hand"
        ], "help-scene", "image")

        // === LEVEL SELECTION SCENE ===
        this.loadElements([
            "bg",
            "panel1",
            "panel2",
            "panel3",
            "title"
        ], "level-selection-scene", "image")

        // === GAME SCENE ===
        this.loadElements([
            "sprite-albahaca",
            "sprite-meatball",
            "sprite-noodles",
            "sprite-tomato",
            "forbidden",
            "glow",
            "sparkles1",
            "orders-panel",

            "granny-side",
            "granny-mid",

            "background"
        ], "game", "image")

        this.load.spritesheet("game-granny-damage", 
            gameConfig.assetsPath + "game/granny-damage.png",
            {
                frameWidth: 771,
                frameHeight: 1000
            })
        
        // === SPLASH SCENE ===
        this.loadElements([
            "title"
        ], "pause-scene", "image")

        // === FINISH SCENE ===
        this.loadElements([
            "win",
            "lose",
            "popup",
            "win-title",
            "lose-title"
        ], "finish-scene", "image")


        // === SOUND ===
        this.soundNames = [
            "get-albahaca",
            "get-meatball",
            "get-noodles",
            "get-tomato",
            "order-completed",
            "music-win",
            "music-lose",
            "music-splash",
            "music-ingame",
            "locution-level1",
            "locution-level2",
            "locution-level3",
            "locution-win",
            "locution-lose",
            "locution-help-page1",
            "locution-help-page2",
            "locution-splash"
        ]
        this.loadElements(this.soundNames, "", "sound")
    }

    create() {
        this.anims.create({
            key: "game-granny-damage",
            frames: this.anims.generateFrameNumbers("game-granny-damage", {
                start: 0,
                end: 3
            }),
            frameRate: 5,
            repeat: 0
        })
        
        this.soundNames.forEach(s => {
            Audio.sounds[s] = this.sound.add(s)
        })
        Audio.setVolume(Audio.volume)

        dataLayer.push({
            'event':'ga_event',
            'category':'Games',
            'action':'DKW - Start Game',
            'label':'{{title game}}',
            'GameCategory':'{{gameCategory}}',
            'Show':'{{showTitle}}'
        })
    }

    loadElements(array, folder, type) {
        for (let elem of array) {
            switch(type) {
                case "image": {
                    this.load.image(folder + "-" + elem, gameConfig.assetsPath + folder + "/" + elem + ".png")
                    break
                }
                case "sound": {
                    this.load.audio(elem, gameConfig.assetsPath + "sound" + "/" + elem + ".mp3")
                    break
                }
            }
        }
    }
}