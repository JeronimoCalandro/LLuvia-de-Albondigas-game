let DATA = {}
DATA.isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

DATA.ingredients = [
    "noodles",
    "tomato",
    "albahaca",
    "meatball"
]

DATA.levelData = [
    {
        orders: [
            {
                character: "pilou",
                noodles: 1,
                meatball: 1,
                albahaca: 1,
                tomato: 0
            },
            {
                character: "milady",
                noodles: 3,
                meatball: -1,
                albahaca: 1,
                tomato: 0
            }
        ]
    },
    {
        orders: [
            //TEST
            /*{
                character: "milady",
                noodles: 1,
                meatball: -1,
                albahaca: -1,
                tomato: 0
            },*/
            {
                character: "milady",
                noodles: 2,
                meatball: 2,
                albahaca: 2,
                tomato: 0
            },
            {
                character: "meatball",
                noodles: 1,
                meatball: -1,
                albahaca: -1,
                tomato: 0
            },
            {
                character: "pilou",
                noodles: 0,
                meatball: 2,
                albahaca: 3,
                tomato: 1
            },
            {
                character: "lampo",
                noodles: 1,
                meatball: 0,
                albahaca: -1,
                tomato: 4
            }
        ]
    },
    {
        orders: [
            {
                character: "pilou",
                noodles: 3,
                meatball: 2,
                albahaca: -1,
                tomato: 0
            },
            {
                character: "milady",
                noodles: 0,
                meatball: 2,
                albahaca: 3,
                tomato: 4
            },
            {
                character: "lampo",
                noodles: 6,
                meatball: -1,
                albahaca: -1,
                tomato: 0
            },
            {
                character: "milady",
                noodles: 0,
                meatball: 6,
                albahaca: 1,
                tomato: 1
            },
            {
                character: "milady",
                noodles: 3,
                meatball: 0,
                albahaca: 3,
                tomato: 3
            },
            {
                character: "milady",
                noodles: 0,
                meatball: -1,
                albahaca: 4,
                tomato: 4
            }
        ]
    }
]

DATA.stars = {}
for (let i = 1; i<=3; i++) 
{
    let stars = parseInt(localStorage.getItem("stars-level-" + i))

    if (isNaN(stars)) {
        stars = 0
        localStorage.setItem("stars-level-" + i, stars)
    }

    DATA.stars["level-" + i] = stars
}

DATA.texts = {
    "help-scene": 
    {
        "page1": "Muévete de lado a lado para\nrecoletar alimentos",
        "page2": "Más puntos sumas, más\ngatitos alimentas. ¡Vamos!"
    },
    "pause-scene": 
    {
        "level": "Nivel",
        "current-score": "Puntaje actual",
        "continue": "Continuar",
        "restart": "Reiniciar\nNivel"
    },
    "finish-scene": 
    {
        "win-panel": "¡Eso es! Abuela Pinna tiene\npasta para toda la pandilla",
        "lose-panel": "¡Ups! Alimento insuficiente.\nJuega de nuevo para hacerlo mejor"
    }
}

DATA.starsPercentage = [
    0, // 0 stars
    0.33, // 1 stars
    0.67, // 2 stars
    1, // 3 stars
]

DATA.baseGravity = 800


// --- gameplay ---
DATA.gravityPerLevel = [
    700,
    1000,
    1200
]
DATA.frequencyGenerationPerLevel = [
    2000,
    1100,
    800
]

DATA.life = 4
DATA.damage = 1

DATA.debugMode = false