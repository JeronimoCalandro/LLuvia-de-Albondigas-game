let rnd = Phaser.Math.Between
class OrdersManager {
    constructor(config) {
        this.scene = config.scene
        this.orders = config.orders
        this.isCreating = false

        this.currentOrders = []
        for (let ord of this.orders) {
            this.currentOrders.push(this.convertToCurrent(ord))
        }

        this.eventEmitter = new Phaser.Events.EventEmitter()
        
        this.currentOrder = this.currentOrders[0]
        this.currentIndex = 0
        this.ordersAmount = config.orders.length

        this.currentIngredients = []
        //Object.keys(this.currentOrder.ingredients)
        //console.log(this.currentIngredients)
        /*for (let order of this.orders) 
        {
            let currentOrder = this.convertToCurrent(order)
            this.currentOrders.push(currentOrder)
        }*/
    }

    advance() {
        this.currentIndex++
        if (this.currentIndex >= this.ordersAmount) {
            // finished
            console.log("===== FINISHED =====")
            return "finished"
        }

        this.currentOrder = this.currentOrders[this.currentIndex]

        let newOrder = null

        if (this.currentIndex + 2 >= this.ordersAmount) return null

        newOrder = this.currentOrders[this.currentIndex + 2]
            newOrder.cont = createOrderContainer(
                this.scene, 
                this.scene.orderPos[2].x + gWidth * this.scene.orderPos.separation, 
                this.scene.orderPos[2].y, 
                this.currentOrders[this.currentIndex + 2])

        return newOrder
    }

    convertToCurrent(order) {
        let currentOrder = {
            ingredients: {}, 
            character: order.character,
            cont: {}
        }
            
        for (let ing of DATA.ingredients) 
        {
            if (order[ing] == 0) continue
            currentOrder.ingredients[ing] = order[ing]
        }

        return currentOrder
    }

    startCreating(intervalTime, gravity) {
        this.isCreating = true
        this.createOne(intervalTime, gravity)
    }
    stopCreating() {
        this.isCreating = false
        console.log("-- STOPED --")
    }
    createOne(intervalTime, gravity) {
        if (this.isCreating) {
            this.scene.time.delayedCall(intervalTime, ()=> {
                this.getIngredient(gravity)
                this.createOne(intervalTime, gravity)
            })
        }
    }

    checkIfCompleted() {
        let order = this.currentOrder
        let completed = true

        for (let ing in order.ingredients) 
        {
            completed = completed && !(order.ingredients[ing] > 0)
        }
        
        if (completed) this.eventEmitter.emit("ordercompleted", order)

        return completed
    }

    getIngredient(gravity) {
        if (!this.isCreating) return
        let pos = rnd (0, 2)

        let type = (DATA.ingredients)[rnd(0, 3)]

        let ing = new Ingredient(this.scene, gWidth*0.15 + gWidth * 0.35 * pos, -100, type, pos, gravity)
        ing.setVelocityY(gravity)

        this.currentIngredients.push(ing)
        ing.ordersManager = this
        return ing
    }

    collect(ing) {
        let order = this.currentOrder

        if (order.destroyed) return
        let currentAmount = order.ingredients[ing.type]
        
        let gotForbidden = false
        let gotCollected = false
        let gotMoreThanNeed = false

        /*if (currentAmount === undefined) {
            gotForbidden = true
            continue
        }*/

        if (currentAmount == -1) {
            gotForbidden = true
        }

        /*if (currentAmount === 0) {
            //gotMoreThanNeed = true
            continue
        }*/

        if (currentAmount > 0) {
            gotForbidden = false
            gotMoreThanNeed = false
            gotCollected = true
            
            order.ingredients[ing.type]--
            order.cont.texts[ing.type].setText("x" + order.ingredients[ing.type])

            this.scene.tweens.add({
                targets: [
                    order.cont.texts[ing.type], 
                    order.cont.icons[ing.type]
                ],
                duration: 200,
                scale: 1.5,
                yoyo: true,
                ease: "Circ"
            })

            if (order.ingredients[ing.type] == 0) 
                order.cont.texts[ing.type].setText("-")
            //break
        }

        /*for (let order of this.currentOrders) {
            i++
            let currentAmount = order.ingredients[ing.type]

            if (order.destroyed) continue

            if (currentAmount === undefined) {
                gotForbidden = true
                continue
            }

            if (currentAmount == -1) {
                gotForbidden = true
                continue
            }

            if (currentAmount === 0) {
                //gotMoreThanNeed = true
                continue
            }

            if (currentAmount > 0) {
                gotForbidden = false
                gotMoreThanNeed = false
                gotCollected = true
                
                order.ingredients[ing.type]--
                order.cont.texts[ing.type].setText("x" + order.ingredients[ing.type])

                this.scene.tweens.add({
                    targets: [
                        order.cont.texts[ing.type], 
                        order.cont.icons[ing.type]
                    ],
                    duration: 200,
                    scale: 1.5,
                    yoyo: true,
                    ease: "Circ"
                })

                if (order.ingredients[ing.type] == 0) order.cont.texts[ing.type].setText("-")
                break
            }
        }*/

        if (!gotCollected && (gotForbidden || gotMoreThanNeed)) {
            this.scene.getDamage(ing)
        }

        if (gotCollected) {
            this.scene.showSparkle()
        }

        this.remove(ing)
        /*if (this.ordersAreCompleted()) {
            this.scene.endScene("win")
        }*/

        this.checkIfCompleted()
    }

    ordersAreCompleted() {
        /*let win = true
        for (let ing in order.ingredients) {
            if (order.ingredients[ing] > 0) {
                win = win && false
            }
        }
        return win*/
        return this.currentIndex == this.ordersAmount
    }

    remove(ing) {
        this.currentIngredients = removeFromArray(this.currentIngredients, ing)
        ing.destroy()
    }
}