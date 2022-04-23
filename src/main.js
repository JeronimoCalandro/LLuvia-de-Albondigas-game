var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var mobile =  /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
var ios = /iPhone|Ipad/i.test(navigator.userAgent)
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
               navigator.userAgent &&
               navigator.userAgent.indexOf('CriOS') == -1 &&
               navigator.userAgent.indexOf('FxiOS') == -1;




//let gameOrientation = "portrait"
var gWidth  = 810 // 1080
var gHeight = 1785 // 2380
var debugMode = DATA.debugMode
var game = null
var gLevel = 0
var gameConfig = {
    //type: Phaser.AUTO,
    type: (mobile && !isFirefox && !isSafari) || isChrome ? Phaser.CANVAS : Phaser.AUTO,
    parent: 'gamediv',
    scale: {
        width: gWidth,
        height: gHeight,
        mode: DATA.isMobile ? Phaser.Scale.AUTO : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: debugMode,
            gravity: { y: 0 }
        }
    },
    scene: [BootScene, PreloadScene, SplashScene, LevelSelectionScene, GameScene, HelpScene, PauseScene, FinishScene],
    assetsPath: "./assets/"
}

game = new Phaser.Game(gameConfig)


/*function checkOrientation() {
    orientationChangeDiv.style.display = "flex"
    gamediv.style.display = "none"
    let currentOrientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait"
    let orientationIsCorrect = currentOrientation == gameOrientation
    let baseDimension = 1080

    orientationIsCorrect = true

    if (orientationIsCorrect) {
        orientationChangeDiv.style.display = "none"
        gamediv.style.display = "block"
        
        if (game) return
        let ratio = gameOrientation == "landscape" ? window.innerWidth / window.innerHeight : window.innerHeight / window.innerWidth
        //gWidth = currentOrientation == "landscape" ? Math.ceil(baseDimension * ratio) : baseDimension
        //gHeight = currentOrientation == "landscape" ? baseDimension : Math.ceil(baseDimension * ratio)

        gameConfig.scale.width = gWidth
        gameConfig.scale.height = gHeight
        game = new Phaser.Game(gameConfig)

        if (!debugMode) return
        let dataFormat = "font-weight:bold; font-size: 14px; color:red;"
        let normalFormat = "font-weight:bold; font-size: 14px; color:black;"
        console.log("%c===> Game Started as " + "%c" + currentOrientation + "%c: %c" + gWidth + "%c x %c" + gHeight + "%c <===",
        normalFormat, dataFormat, normalFormat, dataFormat, normalFormat, dataFormat, normalFormat)
    }
    else {
        showChangeOrientation()
        if (!debugMode) return
        let dataFormat = "font-weight:bold; font-size: 14px; color:red;"
        let normalFormat = "font-weight:bold; font-size: 14px; color:black;"
        console.log("%c===> Game didn't start because device is %c" + currentOrientation + "%c mode <===",
        normalFormat, dataFormat, normalFormat)
    }
}

checkOrientation()
window.onresize = checkOrientation*/

/*orientationChangeDiv.style.display = "none"
gamediv.style.display = "block"*/

let getOrientation = ()=> window.innerWidth > window.innerHeight ? "landscape" : "portrait"
let currentOrientation = getOrientation()

let checkOrientation = ()=> {
    currentOrientation = getOrientation()
    let correct = currentOrientation == DATA.gameOrientation

    orientationChangeDiv.style.display = correct ? "block" : "none"
    gamediv.style.display = correct ? "none" : "block"
}

checkOrientation()
window.onresize = checkOrientation