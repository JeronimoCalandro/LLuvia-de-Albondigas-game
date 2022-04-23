class FinishScene extends Phaser.Scene {
    constructor() {
        super("FinishScene")
    }

    create(data) 
    {
        Audio.stopAll()
        this.result = data.result
        this.level = data.level
        this.stars = data.stars

        if (this.result == "win") {
            dataLayer.push({
                'event':'ga_event',
                'category':'Games',
                'action':'DKW - Successful - Level {{Level}}',
                'label':'{{title game}}',
                'GameCategory':'{{gameCategory}}',
                'Show':'{{showTitle}}'
            })

            Audio.sounds["music-win"].volume = 0.17
            Audio.play("music-win")

            if (this.stars > DATA.stars["level-" + this.level])
            {
                DATA.stars["level-" + this.level] = this.stars
                localStorage.setItem("stars-level-" + this.level, this.stars)
            }
        }
        else {
            dataLayer.push({'event':'ga_event','category':'Games','action':'DKW - Time Out  - Level {{Level}}','label':'{{title game}}','GameCategory':'{{gameCategory}}','Show':'{{showTitle}}'})

            Audio.sounds["music-lose"].volume = 0.17
            Audio.play("music-lose")
        }

        // --- elements ---
        this.add.rectangle(0, 0, gWidth, gHeight, 0x000000, 0.7).setOrigin(0)
        
        let resultTexture = (this.result == "win" ? "win" : "lose")
        let bg = this.add.image(gWidth/2, gHeight, "finish-scene-" + resultTexture)
        bg.setOrigin(0.5, 1)
        ScaleImageToWidth(bg, gWidth)

        let flash = this.add.rectangle(0, 0, gWidth, gHeight, 0xffffff, 1)
        .setOrigin(0, 0)
        this.tweens.add({
            targets: flash,
            duration: 1000,
            alpha: 0,
            ease: "Quad"
        })

        let title = this.add.image(gWidth*0.5, gHeight*0.15, "finish-scene-" + this.result + "-title")
        .setScale(0)
        .setAngle(-30)
        this.tweens.add({
            targets: title,
            duration: 300,
            angle: 0,
            scale: 0.7,
            ease: "Back"
        })


        // --- buttons ---
        this.btnBack = new Button(this, gWidth*0.12, gHeight*0.055, "ui-btn-back", {
            scale: 0.7,
            onClick: ()=> {
                this.scene.stop("GameScene")
                this.scene.start("LevelSelectionScene")
            }
        })




        // --- popup ---
        let popup = this.add.container(gWidth/2, gHeight*0.85)
        let popupBack = this.add.image(0, 0, "finish-scene-popup")
        popup.add(popupBack)
        popup.setScale(0)


        let text = DATA.texts["finish-scene"][this.result + "-panel"]
        let popupText = this.add.text(-gWidth*0.15, 0, text, {
            fontFamily:'PatrickHand',
            align: 'center',
            fontSize: 50,
            color:'#ff600f',
            strokeThickness: 1,
            stroke: '#ff600f'
        })
        .setOrigin(0.5, 0.5)


        let texture = "ui-" + (this.result == "win" ? "btn-play": "btn-restart")
        let popupButton = new Button(this, gWidth*0.38, 0, texture, {
            scale: 0.9,
            onClick: ()=> {
                if (this.result == "lose") 
                {
                    dataLayer.push({'event':'ga_event','category':'Games','action':'DKW - Start Over','label':'{{title game}}','GameCategory':'{{gameCategory}}','Show':'{{showTitle}}'})
                    
                    this.scene.start("GameScene", {currentLevel: this.level})
                    return
                }
                
                if (this.level == 3) {
                    this.scene.stop()
                    this.scene.stop("GameScene")
                    this.scene.start("LevelSelectionScene")
                    return
                }
                this.scene.stop()
                this.scene.start("GameScene", {currentLevel: this.level + 1})
            }
        })

        let stars = createStars(this, 0, -gHeight*0.1, gWidth*0.15, this.stars)
        stars.setScale(1.3)

        popup.add(stars)
        popup.add(popupText)
        popup.add(popupButton)
        

        this.tweens.add({
            targets: popup,
            scaleX: {value: 0.85, duration: 400, ease: "Back"},
            scaleY:{value: 0.85, duration: 500, ease: "Back"},
            onStart: ()=> {
                Audio.play("locution-" + this.result)
            },
            
        })

        if (debugMode) UTILS.showDesignLines(this)
    }
}