class HelpScene extends Phaser.Scene {
    constructor() {
        super("HelpScene")
    }
    
    create(data)
    {
        this.parentScene = data.parent

        this.add.rectangle(0, 0, gWidth, gHeight, 0x000000, 0.7).setOrigin(0)
        this.add.image(gWidth/2, gHeight/2, "ui-yellow-panel").setScale(0.7)
        this.add.image(gWidth/2, gHeight * 0.16, "help-scene-title").setScale(0.55)

        let textFormat = {
            fontFamily:'PatrickHand',
            align: 'center',
            fontSize: 50,
            color:'#ff600f',
            strokeThickness: 1,
            stroke: '#ff600f'
        }

        this.add.image(gWidth/2, gHeight*0.41, "help-scene-illustration")
        .setScale(0.67)

        let hand = this.add.image(gWidth*0.4, gHeight*0.45, "help-scene-hand")
        .setAlpha(0)
        .setScale(0.6)

        this.tweens.timeline({
            targets: hand,
            loop: -1,
            tweens: [
                {
                    duration: 300,
                    alpha: 1
                },
                {
                    delay: 300,
                    duration: 700,
                    x: "+= 200",
                    y: "+= -60",
                    ease: "Quad",
                },
                {
                    duration: 300,
                    alpha: 0,
                },
                {
                    delay: 700,
                    duration: 700,
                    x: gWidth*0.4,
                    y: gHeight*0.45,
                    ease: "Quad",
                }
            ]
        })

        // --- buttons ---
        this.btnBack = new Button(this, gWidth*0.12, gHeight*0.16, "ui-btn-close", {
            scale: 0.7,
            onClick: ()=> {
                this.scene.stop()
                this.scene.resume(this.parentScene.scene.key)
                //this.scene.resume("GameScene")
            }
        })
        this.btnAudio = new Button(this, gWidth*0.88, gHeight*0.055, "ui-btn-music", {
            scale: 0.7,
            onClick: ()=> {
                Audio.switchVolume()
            }
        })





        // --- carousel ---
        this.carouselStatus = 0
        this.carouselElements = [
            this.add.container(gWidth/2, gHeight/2),
            this.add.container(gWidth/2, gHeight/2)
        ]
        this.pageIndicators = [
            this.add.container(gWidth*0.46, gHeight*0.77, [
                this.add.circle(gWidth*0.005, gWidth*0.005, gWidth*0.017, 0x000000, 0.5),
                this.add.circle(0, 0, gWidth*0.017, 0xffffff)
            ]),
            this.add.container(gWidth*0.54, gHeight*0.77, [
                this.add.circle(gWidth*0.005, gWidth*0.005, gWidth*0.017, 0x000000, 0.5),
                this.add.circle(0, 0, gWidth*0.017, 0xffffff)
            ]),
            
        ]

        // page 1
        let text1 = DATA.texts["help-scene"].page1
        let textPage1 = this.add.text(0, gHeight*0.17, text1, textFormat)
        .setOrigin(0.5, 0.5)
        .setDepth(10)
        this.carouselElements[0].add(textPage1)

        // page 2
        let text2 = DATA.texts["help-scene"].page2
        let textPage2 = this.add.text(0, gHeight*0.17, text2, textFormat)
        .setOrigin(0.5, 0.5)
        .setDepth(10)
        this.carouselElements[1].add(textPage2)



        
        for (let i = 0; i < this.carouselElements.length; i++) 
        {
            this.pageIndicators[i].setScale(1)
            this.carouselElements[i].alpha = 0
        }
        let locutions = [
            Audio.sounds["locution-help-page1"],
            Audio.sounds["locution-help-page2"]
        ]
        this.carouselElements[0].alpha = 1
        this.pageIndicators[0].setScale(1.6)
        let max = this.carouselElements.length - 1
        locutions[0].play()


        this.btnLeft = new Button(this, gWidth*0.3, gHeight*0.82, "ui-btn-arrow", {
            scale: 0.9,
            onClick: ()=> {
                this.carouselStatus--
                if (this.carouselStatus < 0) this.carouselStatus = max

                this.carouselElements.forEach(e => e.alpha = 0)
                this.carouselElements[this.carouselStatus].alpha = 1

                this.pageIndicators.forEach(e => e.scale = 1)
                this.tweens.add({
                    targets: this.pageIndicators[this.carouselStatus],
                    duration: 100,
                    scale: 1.6
                })
                
                Audio.stopAll()
                locutions[this.carouselStatus].play()
            }
        })

        this.btnRight = new Button(this, gWidth*0.7, gHeight*0.82, "ui-btn-arrow", {
            scale: 0.9,
            onClick: ()=> {
                this.carouselStatus++
                if (this.carouselStatus > max) this.carouselStatus = 0

                this.carouselElements.forEach(e => e.alpha = 0)
                this.carouselElements[this.carouselStatus].alpha = 1

                this.pageIndicators.forEach(e => e.scale = 1)
                this.tweens.add({
                    targets: this.pageIndicators[this.carouselStatus],
                    duration: 100,
                    scale: 1.6
                })
                
                Audio.stopAll()
                locutions[this.carouselStatus].play()
            }
        })
        this.btnRight.setFlipX(true)


        if (debugMode) UTILS.showDesignLines(this)
    }
}