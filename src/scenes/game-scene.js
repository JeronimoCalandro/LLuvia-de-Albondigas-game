class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    create(levelConfig) {
        this.time.delayedCall(100, ()=> {
            Audio.stopAll()
            Audio.play("locution-level" + levelConfig.currentLevel)
            Audio.sounds["music-ingame"].setLoop(true)
            Audio.play("music-ingame")
        })
        this.currentGrannyPosition = 1
        this.currentPosition = 1
        this.currentStars = 3
        this.receivingDamage = false
        this.life = DATA.life
        this.currentLevel = levelConfig.currentLevel || 0
        this.orders = DATA.levelData[levelConfig.currentLevel - 1].orders
        this.collecting = false

        console.log(this.currentLevel)

        if(this.currentLevel==1){
            gLevel=1
        }
        if(this.currentLevel==2){
            gLevel=2
        }
        if(this.currentLevel==3){
            gLevel=3
        }

        console.log(gLevel)

        //this.extraOrders = DATA.levelData[levelConfig.currentLevel - 1].extraOrders
        //this.extraOrdersCount = this.extraOrders.length
        
        //this.ordersUI = []
        this.currentOrderContainer = {}
        this.otherOrderContainers = []
        
        this.createSceneElements()
        this.createZones()
        this.createOrders()
        this.initializeCreator()
        this.generateSound()

        let firstTime = localStorage.getItem("firsttime")
        if (firstTime == null) {
            localStorage.setItem("firsttime", "false")
        }
        if (levelConfig.firstLevel && firstTime != "false") {
            this.scene.pause()
            this.scene.launch("HelpScene", {parent: this})
        }

        if (debugMode) UTILS.showDesignLines(this)
    }

    generateSound() {
        this.ingredientSounds = {
            "tomato": Audio.sounds["get-tomato"],
            "albahaca": Audio.sounds["get-albahaca"],
            "noodles": Audio.sounds["get-noodles"],
            "meatball": Audio.sounds["get-meatball"]
        } 
    }

    getDamage(ingredient) {
        this.life -= DATA.damage

        let percent = this.life/DATA.life
        this.bar.update(percent)

        /*let forbid = this.add.container(gWidth/2, gHeight/2)
        let f1 = this.add.circle(0, 0, 120, 0x000000, 0.3)
        let f2 = this.add.image(0, 0, "game-sprite-" + ingredient.type).setScale(1.3)
        let f3 = this.add.image(0, 0, "game-forbidden").setScale(0.5)
        forbid.add(f1)
        forbid.add(f2)
        forbid.add(f3)
        forbid.alpha = 0
        forbid.scale = 3

        this.tweens.add({
            targets: forbid,
            scale: 1.2,
            alpha: 1,
            duration: 400,
            ease: Phaser.Math.Easing.Bounce.Out
        })
        this.time.delayedCall(1400, ()=> {
            forbid.destroy()
        })*/

        let imax = 1000
        while (DATA.starsPercentage[this.currentStars] > percent)
        {
            this.currentStars--
            this.stars.update(this.currentStars)

            imax--
            if (imax == 0) {
                console.log("GOT INFINITE")
                break
            }
        }

        /*this.receivingDamage = true
        this.grannies.forEach(gr => gr.alpha = 0)
        this.damageGranny.alpha = 1
        this.damageGranny.anims.play("game-granny-damage")
        
        let initialScale = this.damageGranny.scale
        this.tweens.add({
            targets: this.damageGranny,
            duration: 200,
            scaleY: initialScale * 1.2,
            ease: "Back"
        })
        this.tweens.add({
            targets: this.damageGranny,
            duration: 100,
            delay: 200,
            scaleY: initialScale
        })

        this.time.delayedCall(1400, ()=> {
            
            this.receivingDamage = false
            this.damageGranny.alpha = 0
            this.grannies[this.currentPosition].alpha = 1
        })*/


        if (this.life <= 0) {
            this.endScene("lose")
        }
    }

    endScene(result) {
        this.scene.pause()
        this.scene.launch("FinishScene", {
            result: result,
            level: this.currentLevel,
            stars: this.currentStars
        })
    }

    //#region ///////////////////////////////////// Create Scene Elements /////////////////////////////////////
    createSceneElements() {
        let bg = this.add.image(gWidth*0.5, gHeight, "game-background")
        bg.setOrigin(0.5, 1)
        bg.setDepth(-1000)
        ScaleImageToWidth(bg, gWidth)

        this.createGrannies()
        
        this.bar = new FillBar(this, gWidth/2, gHeight*0.1, gWidth*0.6, 160, 1)

        this.pauseButton = this.add.image(gWidth*0.9, gHeight*0.1, "ui-btn-pause")

        this.pauseButton.setScrollFactor(0)
        this.pauseButton.setInteractive()

        this.pauseButton.on("pointerdown", ()=> {
            this.scene.launch("PauseScene", {
                level: this.currentLevel,
                orders: this.ordersManager.currentOrders,
                stars: this.currentStars
            })
            this.scene.pause()
        })

        this.stars = createStars(this, gWidth/2, gHeight*0.06, gWidth*0.15, 3)
    }
    //#endregion

    //#region ///////////////////////////////////// Create Grannies /////////////////////////////////////
    createGrannies() {
        // --- grannies ---
        this.damageGranny = this.add.sprite(gWidth/2, gHeight*0.5 + 750, "game-granny-damage", 1)
        this.damageGranny.alpha = 0
        this.damageGranny.scale = 0.75
        this.damageGranny.setOrigin(0.5, 1)

        this.grannies = [
            this.add.image(gWidth*0.2, gHeight*0.5 + 750, "game-granny-side").setFlipX(true).setAlpha(0),
            this.add.image(gWidth*0.5, gHeight*0.5 + 750, "game-granny-mid"),
            this.add.image(gWidth*0.8, gHeight*0.5 + 750, "game-granny-side").setAlpha(0)
        ]
        for (let gr of this.grannies) {
            gr.setOrigin(0.5, 1)
            gr.setScale(0.75)
            gr.setDepth(-21)

            this.tweens.add({
                targets: gr,
                yoyo: 1,
                repeat: -1,
                scaleY: 0.76,
                duration: 240
            })
        }
        this.grannies.setCurrentSide = (i)=> {
            this.grannies.forEach(gr => gr.alpha = 0)

            this.grannies[i].alpha = 1
            this.currentPosition = i
        }

        // --- clickzones ---
        this._clickZones = [
            this.add.rectangle(gWidth*0.25, gHeight*0.59, gWidth*0.5, gHeight*0.65, 0xff0000, debugMode ? 0.3 : 0),
            this.add.rectangle(gWidth*0.75, gHeight*0.59, gWidth*0.5, gHeight*0.65, 0xffff00, debugMode ? 0.3 : 0),
        ]

        this._clickZones[0].setInteractive().on("pointerdown", ()=> {
            if (this.receivingDamage) return

            let side = this.currentPosition - 1
            if (side < 0) side = 0
            this.grannies.setCurrentSide(side)
        })
        this._clickZones[1].setInteractive().on("pointerdown", ()=> {
            if (this.receivingDamage) return

            let side = this.currentPosition + 1
            if (side > 2) side = 2
            this.grannies.setCurrentSide(side)
        })

        this.input.keyboard.on("keydown-LEFT", ()=> {
            if (this.receivingDamage) return

            let side = this.currentPosition - 1
            if (side < 0) side = 0
            this.grannies.setCurrentSide(side)
        })
        this.input.keyboard.on("keydown-RIGHT", ()=> {
            if (this.receivingDamage) return

            let side = this.currentPosition + 1
            if (side > 2) side = 2
            this.grannies.setCurrentSide(side)
        })
    }
    //#endregion

    //#region ///////////////////////////////////// Create Catch Zones /////////////////////////////////////
    createZones() {
        this.catchZone = this.add.rectangle(
            gWidth*0.5, 
            gHeight*0.65, 
            gWidth, 
            150,
            0x00ffff, debugMode ? 0.3 : 0)
        this.catchZone.setOrigin(0.5, 0)
    }
    //#endregion 

    //#region ///////////////////////////////////// Create Orders /////////////////////////////////////
    createOrders()
    {
        this.add.image(gWidth/2, gHeight * 0.83, "game-orders-panel")
        .setDepth(-20)
        this.ordersManager = new OrdersManager({
            scene: this,
            orders: this.orders
            //extraOrders: this.extraOrders 
        })
        let separation = 0.32
        this.orderPos = [
            {x: gWidth * (0.5 - separation), y: gHeight* 0.83},
            {x: gWidth * 0.5, y: gHeight* 0.83},
            {x: gWidth * (0.5 + separation), y: gHeight* 0.83},
        ]
        this.orderPos.separation = separation

        //let order = this.ordersManager.currentOrder
        //let otherOrders = this.ordersManager.

        //for (let ord in this.ordersManager)
        let i = 0
        while (i < 3 && i < this.ordersManager.orders.length) {
            let ord = createOrderContainer(
                this,
                this.orderPos[i].x,
                this.orderPos[i].y,
                this.ordersManager.currentOrders[i])

            if (i == 0) {
                this.currentOrderContainer = ord
                ord.setScale(0.8)
            }
            else {
                this.otherOrderContainers.push(ord)
                ord.setScale(0.55)
            }
            i++
        }

        //let cont = this.currentOrderContainer
        /*for (let ord in this.ordersManager.currentOrders) {

        }*/
        /*for (let ord in this.ordersManager.orders) {
            this.otherOrderContainers.push(
                createOrderContainer(this, gWidth)
            )

            i++
            if (i >= 3) break
        }*/
        
        /*let len = orders.length
        for (let i = 0; i < len; i++) 
        {
            let order = orders[i]
            let xpos = gWidth * ([0.5, 0.3, 0.2][len-1] + [0, 0.4, 0.3][len-1] * i)
            let ypos = gHeight * 0.87

            order.char = this.orders[i].character
            let cont = createOrderContainer(this, xpos, ypos, order)

            cont.setScale(0.67)
            cont.depth = 1000
            
            orders[i].cont = cont
            this.ordersUI.push(cont)
        }*/

        this.ordersManager.eventEmitter.on("ordercompleted", (index)=> {
            Audio.play("order-completed")

            //if (this.ordersManager.currentOrders[index].destroyed) index++
            //if (this.ordersManager.currentOrders[index].destroyed) index++


            let order = this.currentOrderContainer
            let glow = this.add.image(order.x, order.y-20, "game-glow")
            glow.setScale(0.8)
            glow.setAlpha(0.5)
            glow.setDepth(-19)

            this.ordersManager.currentOrder.destroyed = true

            this.tweens.add({
                targets: glow,
                scale: glow.scale - 0.1,
                alpha: 1,
                duration: 200,
                yoyo: true,
                repeat: 3,
                onComplete: ()=> {
                    glow.destroy()
                    //this.addExtraOrder(index)

                    order.destroy()
                    let newOrder = this.ordersManager.advance()

                    if (newOrder && newOrder != "finished") {
                        this.otherOrderContainers.push(newOrder.cont)
                        newOrder.cont.setScale(0.55)
                    }
                    let d = 100

                    for (let ordCont of this.otherOrderContainers) {
                        let amount = ordCont.x - this.orderPos.separation*gWidth
                        this.tweens.add({
                            targets: ordCont,
                            x: amount,
                            duration: d,
                            ease: "Ease.Quad"
                        })
                    }
                    this.currentOrderContainer = this.otherOrderContainers[0]
                    this.otherOrderContainers.shift()

                    this.time.delayedCall(d, ()=> {
                        this.currentOrderContainer.scale = 0.8
                    })

                    if (this.ordersManager.ordersAreCompleted()) {
                        this.endScene("win")
                        return
                    }
                }
            })
        })
    }

    showSparkle() {
        let sparkles = this.add.image(gWidth/2 + gWidth * (this.currentPosition - 1) * 0.4, gHeight*0.65, "game-sparkles1")
        let sparkles2 = this.add.image(gWidth/2 + gWidth * (this.currentPosition - 1) * 0.4, gHeight*0.65, "game-sparkles1")
        let sparkles3 = this.add.image(gWidth/2 + gWidth * (this.currentPosition - 1) * 0.4, gHeight*0.65, "game-sparkles1")
        sparkles.scale = 0
        sparkles2.scale = 0
        sparkles3.scale = 0
        sparkles2.angle = 100
        sparkles3.angle = 200

        this.tweens.add({
            targets: [sparkles, sparkles2, sparkles3],
            duration: 600,
            scale: 3,
            alpha: 0.2,
            onComplete: ()=> {
                sparkles.destroy()
                sparkles2.destroy()
                sparkles3.destroy()
            }
        })
    }

    /*addExtraOrder(index) 
    {
        this.extraOrdersCount--
        
        if (this.extraOrdersCount < 0) {
            let oldOrder = this.ordersUI[index]
            this.tweens.add({
                targets: oldOrder,
                scale: 1.5,
                alpha: 0,
                duration: 200,
                onComplete: ()=> {
                    oldOrder.destroy()
                }
            })
            this.ordersManager.currentOrders[index].destroyed = true
            return
        }
        let orders = this.ordersManager.currentOrders
        let len = orders.length
        let oldOrder = this.ordersUI[index]
        this.tweens.add({
            targets: oldOrder,
            scale: 1.5,
            alpha: 0,
            duration: 200,
            onComplete: ()=> {
                oldOrder.destroy()
            }
        })

        let newOrder = this.extraOrders[this.extraOrdersCount]

        let order = this.ordersManager.convertToCurrent(newOrder)
        let xpos = gWidth * ([0.5, 0.3, 0.2][len-1] + [0, 0.4, 0.3][len-1] * index)
        let ypos = gHeight * 0.87
        order.char = this.extraOrders[this.extraOrdersCount].character

        let cont = createOrderContainer(this, xpos, ypos, order)
        cont.setScale(0.67)
        cont.depth = 1000
        
        orders[index] = order
        orders[index].cont = cont
        this.ordersUI[index] = cont

        console.log(index, this.ordersManager)
    }*/
    //#endregion

    //#region ///////////////////////////////////// Initialize Creator /////////////////////////////////////
    initializeCreator() {
        this.ordersManager.startCreating(
            DATA.frequencyGenerationPerLevel[this.currentLevel - 1], 
            DATA.gravityPerLevel[this.currentLevel - 1])
    }  
    //#endregion

    //#region UPDATE
    update() {
        for (let ing of this.ordersManager.currentIngredients) 
        {
            if (ing.y >= this.catchZone.getTopCenter().y &&
                ing.y <= this.catchZone.getBottomCenter().y &&
                ing.pos == this.currentPosition &&
                !this.receivingDamage)
            {
                this.ordersManager.collect(ing)
                this.ingredientSounds[ing.type].play()
            }

            if (ing.y > gHeight + 200) {
                this.ordersManager.remove(ing)
            }
        }
    }
    //#endregion 
}
