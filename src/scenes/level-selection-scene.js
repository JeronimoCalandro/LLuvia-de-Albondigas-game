class LevelSelectionScene extends Phaser.Scene {
    constructor() {
        super("LevelSelectionScene")
    }
    
    create()
    {
        Audio.stopAll()
        Audio.sounds["music-splash"].setLoop(true)
        Audio.play("music-splash")
        let candidateOrders = DATA.levelData.map(order => order.orders)

        this.add.image(gWidth/2, gHeight/2, "level-selection-scene-bg").setScale(1.05)
        this.btnBack = new Button(this, gWidth*0.12, gHeight*0.055, "ui-btn-back", {
            scale: 0.6,
            onClick: ()=> {
                this.scene.start("SplashScene")

                dataLayer.push({
                    'event':'ga_event',
                    'category':'Games',
                    'action':'DKW - To Return',
                    'label':'{{title game}}',
                    'GameCategory':'{{gameCategory}}',
                    'Show':'{{showTitle}}'
                })
            }
        })
        this.btnHelp = new Button(this, gWidth*0.88, gHeight*0.055, "ui-btn-help", {
            scale: 0.85,
            onClick: ()=> {
                this.scene.pause()
                this.scene.launch("HelpScene", {parent: this})
            }
        })

        let pos = [
            {
                x: gWidth * 0.5,
                y: gHeight * 0.30
            },
            {
                x: gWidth * 0.5,
                y: gHeight * 0.56
            },
            {
                x: gWidth * 0.5,
                y: gHeight * 0.83
            }
        ]
        let panelScale = 0.71

        this.add.image(gWidth*0.5, gHeight* 0.1, "level-selection-scene-title").setScale(panelScale)


        // for each level
        for (let i = 0; i <= 2; i++) 
        {
            // panel
            let firstLevel = i == 0
            
            let panel = this.add.image(pos[i].x, pos[i].y, "level-selection-scene-panel" + (i + 1))
            this["panel_" + (i + 1)] = panel
            
            panel.setScale(panelScale)
            .setInteractive()
            .on("pointerdown", ()=> {
                panel.scale = 0.9 * panelScale
            })
            .on("pointerout", ()=> {
                panel.scale = 1 * panelScale
            })
            .on("pointerup", ()=> {
                dataLayer.push({
                    'event': 'ga_event',
                    'category': 'Games',
                    'action': 'DKW - option selec - {{Level - Character (Position)}} ',
                    'label': '{{title game}}',
                    'GameCategory': '{{gameCategory}}',
                    'Show': '{{showTitle}}'
                })
                
                panel.scale = 1 * panelScale
                
                
                setTimeout(()=> {
                    this.scene.start("GameScene", {
                        currentLevel: i + 1,
                        firstLevel: firstLevel,
                        
                    })
                }, 100)

                
            })

            
            // --- stars ---
            let count = localStorage.getItem("stars-level-" + (i + 1)) || 0
            let bottom = this["panel_" + (i + 1)].getBottomCenter().y - this["panel_" + (i + 1)].y
            
            let stars = createStars(this, pos[i].x, pos[i].y + bottom - 50, gWidth*0.15, count)
            this["stars_" + (i + 1)] = stars
            if (i == 1) stars.y +=25
            stars.setScale(0.85)

            this.ordersManager = new OrdersManager({
                scene: this,
                orders: candidateOrders[i]
            })
            let orders = this.ordersManager.currentOrders
            
            // --- orders ---
            let len = i + 1
            for (let j = 0; j < len; j++) 
            {
                let xpos = gWidth * ([0.5, 0.33, 0.25][len-1] + [0, 0.37, 0.25][len-1] * j)
                
                let order = orders[j]
                order.char = candidateOrders[i][j].character
                //let cont = createOrderContainer(this, xpos, pos[i].y, order)
                console.log(order.char)
                this.add.image(xpos, pos[i].y, "ui-character-" + order.char)
                .setScale(0.7 - (i*0.06))
                //cont.setScale(0.7 - (i*0.06))
            }
        
        if (debugMode) UTILS.showDesignLines(this)
        }
    }
}