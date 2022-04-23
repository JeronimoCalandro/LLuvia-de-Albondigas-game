
class Button extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture)
        scene.add.existing(this)

        this.onClick = config.onClick,
        this.startScale = config.scale || 1
        this.scale = this.startScale
        this.baseTexture = texture
        this.alternateTexture = config.alternateTexture || texture
        this.isActive = true

        this.setScrollFactor(0, 0)
        this.setInteractive()

        this.on("pointerdown", ()=> {
            this.scale = this.startScale * 0.85
        })
        this.on("pointerout", ()=> {
            this.scale = this.startScale
        })
        this.on("pointerup", ()=> {
            this.scale = this.startScale
            setTimeout(()=> this.onClick(), 50)
        })

        this.depth = 1000
    }

    alternate() {
        this.isActive = !this.isActive        
        this.setTexture(this.isActive ? this.baseTexture : this.alternateTexture)
    }
}

class FillBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, startPercent) {
        super(scene, x, y)
        scene.add.existing(this)

        this.backBar = scene.add.graphics()
        this.topBar = scene.add.graphics()
        this.radius = 16
        this.border = 14
        this.width = width
        this.height = height

        this.backBar.fillStyle(0xffffff, 1)
        this.backBar.fillRoundedRect(0, 0, width, height, this.radius*0.75)
        this.backBar.fillStyle(0xff600f, 1)
        this.backBar.fillRoundedRect(this.border, this.border, width - 2*this.border, height - 2*this.border, this.radius)
        this.backBar.fillStyle(0xBE4100, 1)
        this.backBar.fillRoundedRect(2*this.border, 2*this.border, width - 4*this.border, height - 4*this.border, this.radius)
        this.backBar.x = - width/2
        this.backBar.y = - height/2


        this.topBar.fillStyle(0xFFE800, 1)
        this.topBar.fillRoundedRect(2*this.border, 2*this.border, startPercent*(width - 4*this.border), height - 4*this.border, this.radius)
        this.topBar.x = - width/2
        this.topBar.y = - height/2

        this.add(this.backBar)
        this.add(this.topBar)
    }

    update(percent) {
        this.topBar.clear()
        this.topBar.fillStyle(0xFFE800, 1)
        this.topBar.fillRoundedRect(2*this.border, 2*this.border, percent*(this.width - 4*this.border), this.height - 4*this.border, this.radius)
    }
}

function createStars(scene, x, y, separation, startingStars = 0) {
    let star1Amount = startingStars > 0 ? "on" : "off"
    let star2Amount = startingStars > 1 ? "on" : "off"
    let star3Amount = startingStars > 2 ? "on" : "off"

    let star1 = scene.add.image(-separation, 0, "ui-star-" + star1Amount)
    let star2 = scene.add.image(0, 0, "ui-star-" + star2Amount)
    let star3 = scene.add.image(+separation, 0, "ui-star-" + star3Amount)
    
    let list = [star1, star2, star3]
    let cont = scene.add.container(x, y)
    for (let s of list) {
        cont.add(s)
    }
    cont.list = list
    cont.currentStars = startingStars

    cont.update = (amount)=> {
        let star1Amount = amount > 0 ? "on" : "off"
        let star2Amount = amount > 1 ? "on" : "off"
        let star3Amount = amount > 2 ? "on" : "off"

        cont.list[0].setTexture("ui-star-" + star1Amount)
        cont.list[1].setTexture("ui-star-" + star2Amount)
        cont.list[2].setTexture("ui-star-" + star3Amount)

        cont.currentStars = amount
    }

    cont.getStars = ()=> {
        return cont.list
    }

    return cont
}

function createOrderContainer(scene, x0, y0, order) {
    let ings = Object.keys(order.ingredients)
    let cont = scene.add.container(x0, y0)
    cont.texts = {}
    cont.icons = {}

    let av = scene.add.image(0, 0, "ui-character-" + order.character)
    cont.add(av)

    let width = av.displayWidth
    let radius = width * 0.2

    
    for (let j = 0; j <= 2; j++) 
    {
        let x = (j - 1) * 120
        let y = (j % 2 == 0 ? 105 : 160)

        let neg = order.ingredients[ings[j]] < 0

        let iconsScale = 0.85
        let ext = scene.add.circle(x, y, radius, !neg ? 0xff600f : 0x444444, 1)
        let int = scene.add.circle(x, y, radius * 0.81, 0xffffff, 1)
        let icon = scene.add.image(x, y, "game-sprite-" + ings[j])
        icon.setScale(iconsScale)
        ext.setScale(iconsScale)
        int.setScale(iconsScale)

        let text = scene.add.text(x, y + radius*0.75, "", {
            fontFamily:'PatrickHand',
            align: 'center',
            fontSize: 75,
            color:'#ffffff',
            strokeThickness: 13,
            stroke: '#000000'
        })
        text.setOrigin(0.5)

        cont.texts[ings[j]] = text
        cont.icons[ings[j]] = icon

        if (!neg) {
            text.setText("x" + order.ingredients[ings[j]])
        }
        cont.add(ext)
        cont.add(int)
        cont.add(icon)
        cont.add(text)

        if (neg) {
            let negRect = scene.add.rectangle(x, y, radius*2, radius/3, 0xBE4100, 1)
            negRect.angle = -45
            negRect.setScale(iconsScale)
            cont.add(negRect)
        }
    }

    //cont.baseScale = 0.55
    //cont.setScale(cont.baseScale)

    order.cont = cont

    return cont
}

class Ingredient extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, type, pos) {
        super(scene, x, y, "game-sprite-" + type )
        this.type = type
        this.pos = pos

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale({
            tomato: 1.45,
            meatball: 0.6,
            albahaca: 1,
            noodles: 1.3
        }[type])

        scene.tweens.add({
            targets: this,
            angle: (1 - 2 * rnd(0, 1)) * 360,
            repeat: -1,
            duration: rnd(1000, 2000)
        })
    }
}