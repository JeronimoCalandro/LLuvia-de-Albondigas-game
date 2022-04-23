class SplashScene extends Phaser.Scene {
    constructor() {
        super("SplashScene")
    }

    create()
    {
        Audio.stopAll()
        Audio.sounds["music-splash"].setLoop(true)
        Audio.play("music-splash")
        let bg = this.add.image(gWidth/2, gHeight*0.5, "splash-scene-bg")
        ScaleImageToWidth(bg, gWidth)

        let logo = this.add.image(gWidth/2, gHeight*0.15, "splash-scene-logo")
        .setScale(0)
        .setAngle(-30)

        let granny = this.add.image(gWidth/2, gHeight*0.55 + 100, "splash-scene-granny")
        .setScale(0.8)
        
        let cats = this.add.image(gWidth/2, gHeight, "splash-scene-cats")
        .setOrigin(0.5, 1)
        .setScale(0.7)

        let food = this.add.image(gWidth/2, gHeight*0.20, "splash-scene-food")
        .setScale(0.7)

        let flash = this.add.rectangle(0, 0, gWidth, gHeight, 0xffffff, 1)
        .setOrigin(0, 0)
        
        Audio.play("locution-splash")
        let t1 = 1000
        let d1 = 200
        this.tweens.add({
            targets: flash,
            duration: t1,
            delay: d1,
            alpha: 0,
            ease: "Quad"
        })
        this.tweens.add({
            targets: food,
            duration: t1,
            scale: 1,
            y: "+=200",
            ease: "Circ"
        })
        this.tweens.add({
            targets: cats,
            delay: d1,
            duration: 200,
            scale: 1,
            ease: "Back"
        })
        this.tweens.add({
            targets: granny,
            delay: d1,
            duration: 300,
            y: "-=130",
            scale: 1,
            ease: "Back"
        })

        this.tweens.add({
            targets: logo,
            angle: 0,
            scale: 1,
            delay: t1 + d1,
            duration: 300,
            ease: "Back"
        })




        let startButton = new Button(this, gWidth/2, gHeight*0.87, "ui-btn-play", {
            onClick: ()=> {
                //this.scene.start("GameScene", {currentLevel: 1})
                this.scene.start("LevelSelectionScene")

                //dataLayer.push({'event':'ga_event','category':'Games','action':'DKW - Start Game','label':'{{title game}}','GameCategory':'{{gameCategory}}','Show':'{{showTitle}}','Vertical Traffic':'{{vertical traffic}}'})
            }
        })
        startButton.scale = 0

        this.tweens.add({
            targets: startButton,
            scale: 1,
            delay: t1 + d1*2,
            duration: 300,
            ease: "Back"
        })

        if (debugMode) UTILS.showDesignLines(this)
    }
}