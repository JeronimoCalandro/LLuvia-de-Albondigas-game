class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene")
    }
    
    create(data)
    {
        /*dataLayer.push({
            'event':'ga_event',
            'category':'Games',
            'action':'DKW - Pause',
            'label':'{{title game}}',
            'GameCategory':'{{gameCategory}}',
            'Show':'{{showTitle}}'
        })
        */
        this.level = data.level
        this.orders = data.orders
        this.currentStars = data.stars

        let texts = DATA.texts["pause-scene"]

        this.add.rectangle(0, 0, gWidth, gHeight, 0x000000, 0.7).setOrigin(0)
        this.add.image(gWidth/2, gHeight/2, "ui-yellow-panel").setScale(0.7)
        this.add.image(gWidth/2, gHeight * 0.16, "pause-scene-title").setScale(0.55)

        
        let textFormat = {
            fontFamily:'PatrickHand',
            align: 'center',
            fontSize: 75,
            color:'#ff600f',
            strokeThickness: 4,
            stroke: '#ff600f'
        }

        this.add.text(gWidth/2, gHeight*0.21, texts.level + " " + this.level, textFormat)
        .setOrigin(0.5, 0)
        textFormat.fontSize = 42
        textFormat.strokeThickness = 1

        // --- buttons ---
        this.btnBack = new Button(this, gWidth*0.12, gHeight*0.055, "ui-btn-back", {
            scale: 0.6,
            onClick: ()=> {
                this.scene.stop()
                this.scene.stop("GameScene")
                this.scene.start("LevelSelectionScene")
            }
        })
        this.btnAudio = new Button(this, gWidth*0.88, gHeight*0.055, "ui-btn-music", {
            scale: 0.6,
            onClick: ()=> {
                Audio.switchVolume()

                dataLayer.push({'event':'ga_event','category':'Games','action':'DKW - Sound [Activate - Desactivate]','label':'{{title game}}','GameCategory':'{{gameCategory}}','Show':'{{showTitle}}'})
            }
        })


        this.btnContinue = new Button(this, gWidth*0.3, gHeight*0.7, "ui-btn-play", {
            scale: 0.75,
            onClick: ()=> {
                this.scene.stop()
                this.scene.resume("GameScene")
            }
        })

        this.btnRestart = new Button(this, gWidth*0.7, gHeight*0.7, "ui-btn-restart", {
            scale: 0.75,
            onClick: ()=> {
                dataLayer.push({'event':'ga_event','category':'Games','action':'DKW - Start Over','label':'{{title game}}','GameCategory':'{{gameCategory}}','Show':'{{showTitle}}'})

                this.scene.stop()
                this.scene.start("GameScene", {currentLevel: this.level})
            }
        })

        
        this.add.text(gWidth*0.3, gHeight*0.76, texts.continue, textFormat)
        .setOrigin(0.5, 0)

        this.add.text(gWidth*0.7, gHeight*0.76, texts.restart, textFormat)
        .setOrigin(0.5, 0)



        // --- stars ---
        let stars = createStars(this, gWidth/2, gHeight*0.57, gWidth*0.15, this.currentStars)

        this.add.text(gWidth*0.5, gHeight*0.61, texts["current-score"], textFormat)
        .setOrigin(0.5, 0)


        // --- carousel ---

        //this.currentLevel = levelConfig.currentLevel || 0

        let i
        let aux
        if(gLevel==1){
            i = 0
            aux=2
        }
        if(gLevel==2){
            i = 1
            aux=4
        }
        if(gLevel==3){
            i = 2
            aux=6
        }

        this.carouselStatus = 0
        this.carouselElements = []

        let candidateOrders = DATA.levelData.map(order => order.orders)

        this.ordersManager = new OrdersManager({
            scene: this,
            orders: candidateOrders[i]
        })
        let orders = this.ordersManager.currentOrders
        //let order of this.orders
        
        for (let j = 0; j < aux; j++) 
        {
            let order = orders[j]
            console.log(this.orders, order)
            let cont = createOrderContainer(this, gWidth/2, gHeight*0.38, order)
            this.carouselElements.push(cont)

            cont.alpha = 0
        }
        this.carouselElements[0].alpha = 1
        let max = this.carouselElements.length-1


        this.btnLeft = new Button(this, gWidth*0.15, gHeight*0.38, "ui-btn-arrow", {
            scale: 1,
            onClick: ()=> {
                this.carouselStatus--
                if (this.carouselStatus < 0) this.carouselStatus = max

                this.carouselElements.forEach(e => e.alpha = 0)
                this.carouselElements[this.carouselStatus].alpha = 1
            }
        })

        this.btnRight = new Button(this, gWidth*0.85, gHeight*0.38, "ui-btn-arrow", {
            scale: 1,
            onClick: ()=> {
                this.carouselStatus++
                if (this.carouselStatus > max) this.carouselStatus = 0

                this.carouselElements.forEach(e => e.alpha = 0)
                this.carouselElements[this.carouselStatus].alpha = 1
            }
        })
        this.btnRight.setFlipX(true)
/*

        if (debugMode) UTILS.showDesignLines(this)*/
    }
}