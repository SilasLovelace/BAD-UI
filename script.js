let letterDiv = document.getElementById('letter')
let targetAreaDiv = document.querySelector('.hitcontainer')
let inputformDiv = document.getElementById("inputform")
let emailInput = document.getElementById("floatingInput")
let passwordInput = document.getElementById("floatingPassword")
let signInButton = document.getElementById("signinbutton")
let formBodyDiv = document.getElementById('formbody')
let healthbarcontDiv = document.querySelector('.healthbarcontainer')
let healthbarDiv = document.querySelector('#healthbar')
let healthDiv = document.querySelector('#health')
let commfieldDiv = document.querySelector('#commfield')
let modalDiv = document.getElementById("myModal")
let modal2Div = document.getElementById("myModal2")
let gamestuffDiv = document.getElementById('gamestuff')
let gameAreaDiv = document.querySelector('.gamearea')
let reloadButton = document.querySelector('.reload')
let gunDiv = document.querySelector('#gun')
let ammoDiv = document.querySelector('#ammo')
let shootModeSelect = document.querySelector('#shootmodes')
let shotcounterDiV = document.getElementById('shotcounter')
let gunstuff = document.querySelector('#gunstuff')
let emptyDiv = document.querySelector('.emptyclip')
let emailinfo = document.getElementById('email')
let passwordinfo = document.getElementById('password')

// toggles and conditionals for events
let gameon = true
let finalbattle = false
let endbossmode = false
let level = true
let gunToggle = false
let fire = true
let gunmove = true
let endingclear = false
let hitable = true
let canshoot = false
let toggleallowed = true
let canreload = false
let canlose = false

// counter
let shotcounter = 1
let health = 100

// dynamic variables for targets and event triggers 
let ammo = []
let email = []
let password = []
let emailString = 0
let pwString = 0

// text can be dropped
let text = ''

// global timer
let jump

// final level "ammo"
let lorem = 'Lorem ipsum dolor sit amet. Qui autem quisquam est atque nesciunt et cumque odit ut aliquam blanditiis aut dolorem quia. Eum eaque enim a consequatur expedita non aspernatur dicta. A sint eaque est ducimus expedita aut aliquam enim. Hic aliquam natus vel laboriosam quis cum ipsum placeat. 33 consequatur ratione qui sunt quas et quibusdam itaque ut sapiente odit et vero aliquid ex accusamus fugit et perferendis nisi. Et neque harum in voluptas similique rem nihil doloribus est voluptatibus beatae'
console.log(lorem.length)

// gun and animation variables
let movespeed = 400
let jumptimer = 1000
let damage = 5
let angle = 0
let gamemode = 'gun'
let spread = 20
let velocityShot = 25
let cursorX = 0
let cursorY = 0

// Sound initiallizers
let reloadSound = new Audio(`Sounds/reload.wav`)
let bellSound = new Audio(`Sounds/bell.mp3`)
let blipSound = new Audio(`Sounds/blip.wav`)

resetTarget()
function resetTarget() {
    targetAreaDiv.style = `top: ${window.innerHeight / 2 - targetAreaDiv.offsetHeight / 2}px; left: ${window.innerWidth / 2 - targetAreaDiv.offsetWidth / 2}px;`
}

// soundeffects
function playShot() {
    let gunshotSound = new Audio(`Sounds/${gamemode}.wav`)
    gunshotSound.currentTime = 0
    gunshotSound.play()
}

function playreload() {
    reloadSound.currentTime = 0
    reloadSound.play()
}

function playbell() {
    bellSound.currentTime = 0
    bellSound.play()
}

function playblip() {
    blipSound.currentTime = 0
    blipSound.play()
}

function playcharge() {
    let chargeSound = new Audio(`Sounds/charge.wav`)
    chargeSound.currentTime = 0
    chargeSound.play()
    return chargeSound
}

function playtype() {
    typeSound.pause()
    let typeSound = new Audio(`Sounds/typing.wav`)
    typeSound.currentTime = 0
    typeSound.play()
    return typeSound
}

// types  text of  a string into the inner HTML of element 1000/intervall times per second
function typetext(element, text, intervall) {
    array = text.split('')
    let typeTime = setInterval(function () {
        if (array.length > 0) element.innerHTML += array.shift()
        if (array.length <= 0) {
            clearInterval(typeTime)
        }
    }, intervall)
}

// calculates total acceleration on element center based on array of elements center
function attraction(element, attractorArray, multiplier) {
    let elementBounding = element.getBoundingClientRect()
    let elementCenterX = elementBounding.left + element.offsetWidth / 2
    let elementCenterY = elementBounding.top + element.offsetHeight / 2
    let totalAccelertationX = 0
    let totalAccelertationY = 0

    attractorArray.forEach((attractor) => {
        let attractorBounding = attractor.getBoundingClientRect()
        let attractorCenterX = attractorBounding.left + attractor.offsetWidth / 2
        let attractorCenterY = attractorBounding.top + attractor.offsetHeight / 2
        let vectorX = attractorCenterX - elementCenterX
        let vectorY = attractorCenterY - elementCenterY
        let distance = Math.sqrt((vectorX) ** 2 + (vectorY) ** 2)
        totalAccelertationX += vectorX / distance * (multiplier / (distance ** 2))
        totalAccelertationY += vectorY / distance * (multiplier / (distance ** 2))
    })

    let totalAcceleration = Math.sqrt((totalAccelertationX) ** 2 + (totalAccelertationY) ** 2)

    return [totalAccelertationX, totalAccelertationY, totalAcceleration]
}

// returns Div with innerHTML=letter
function characterShot(letter) {
    return `<div id="character${shotcounter}" class="shot invisible">${letter}</div>`
}
// creates an attractor for the accelerations array
function createAttractor() {
    gameAreaDiv.insertAdjacentHTML('beforeend', `<div class='attractor' style='top:${200 + Math.floor(Math.random() * (window.innerHeight - 400))}px; left:${200 + Math.floor(Math.random() * (window.innerWidth - 400))}px'></div>`)
}

// updates ammo array with remaining content of email or password array
function newAmmo() {
    let characters = level ? email : password
    characters.forEach(e => ammo.push(e))
    updateAmmo()
}

// updaters for all the dynamic elements
function updateAmmo() {
    if (ammo[0]) { letterDiv.innerHTML = ammo[0] } else {
        letterDiv.innerHTML = ''
    }

    ammoDiv.innerHTML = 'AMMO: '
    ammo.forEach((char) => { if (ammoDiv.innerHTML.length < 40) { ammoDiv.innerHTML += char } })
}
function updateShotcounter() {
    if (!endbossmode) { shotcounterDiV.innerHTML = `LETTERS SHOT: ${shotcounter}` }
    else if (endbossmode) { shotcounterDiV.innerHTML = `REMAINING AMMO: ${ammo.length}` }

}
function updateHealth() {
    healthbarDiv.style = `width: ${health}%;`
    healthDiv.innerHTML = `${health}/100`
}
// moves element to random location on screen every 1000/jumptimer seconds, returns jumper timer
let targetJumper = function (element) {
    let possibleTop = window.innerHeight - element.offsetHeight
    let possibleLeft = window.innerWidth - element.offsetWidth
    let interval = setInterval(() => { element.style = `top: ${Math.floor(Math.random() * possibleTop)}px; left:${Math.floor(Math.random() * possibleLeft)}px` }, jumptimer)
    return interval
}

// moves a div in a random starting direction and bounces it off screen sides
function targetmover(element) {
    let boundingElement = element.getBoundingClientRect()
    let angle = Math.random() * 360
    let cosRad = Math.cos(angle / 180 * Math.PI)
    let sinRad = Math.sin(angle / 180 * Math.PI)
    let starPosX = boundingElement.left
    let startPosY = boundingElement.top
    let momentaryPosX = starPosX
    let momentaryPosY = startPosY
    let startVelocityX = sinRad * movespeed
    let startVvelocityY = -cosRad * movespeed
    let momentaryVelocityX = startVelocityX
    let momentaryVelocityY = startVvelocityY
    let lastX
    let lastY

    let targetmover = setInterval(() => {
        let bounding = element.getBoundingClientRect()
        if (bounding.left < -300 || bounding.right > window.innerWidth + 300) {
            momentaryPosX = lastX
            momentaryVelocityX = momentaryVelocityX * -1
        }
        if (bounding.top < 0 || bounding.bottom > window.innerHeight) {
            momentaryPosY = lastY
            momentaryVelocityY = momentaryVelocityY * -1
        }
        momentaryPosX = momentaryPosX + momentaryVelocityX / 100
        momentaryPosY = momentaryPosY + momentaryVelocityY / 100
        lastX = momentaryPosX
        lastY = momentaryPosY
        element.style = `position:fixed; top:${(momentaryPosY)}px; left:${momentaryPosX}px`

    }, 10)
    return targetmover
}

// checks if an elements center is inside targets bounding rect
function hitCheck(target, element) {
    let targetHitBox = target.getBoundingClientRect()
    let elementHitBox = element.getBoundingClientRect()
    let elementXcenter = parseInt(elementHitBox.left + element.offsetWidth / 2)
    let elementYcenter = parseInt(elementHitBox.top + element.offsetHeight / 2)
    if ((elementXcenter < targetHitBox.right && elementXcenter > targetHitBox.left) && (elementYcenter > targetHitBox.top && elementYcenter < targetHitBox.bottom)) {
        return true
    }
}


function signhit(element) {
    element.classList.add('vibrate')
    element.classList.add('btn-danger')
    element.classList.remove('btn-primary')
    setTimeout(() => {
        element.classList.remove('vibrate')
        element.classList.remove('btn-danger')
        element.classList.add('btn-primary')
    }, 400)
}

// dynamic functions with critical functionality:
// core functionality of game
// moves element in direction of current angle stops it on screen border
// checks for varying hit conditions
// triggers events and changes conditional toggles
function shooter(element, currentY, currentX, currentAngle, starttime) {
    updateAmmo()
    updateShotcounter()
    if (endbossmode && ammo.length < 100) {
        shotcounterDiV.style = "color:red; font-weight:bold;"
        canlose = true
    }
    if (document.getElementById(`character${shotcounter - 30}`)) { document.getElementById(`character${shotcounter - 30}`).remove() }
    element.classList.remove('invisible')
    let cosRad = Math.cos(currentAngle / 180 * Math.PI)
    let sinRad = Math.sin(currentAngle / 180 * Math.PI)
    let starPosX = currentX + 10 - (gunDiv.offsetWidth / 2) * cosRad
    let startPosY = currentY - 13 - (gunDiv.offsetHeight / 2) * sinRad
    let momentaryPosX = starPosX
    let momentaryPosY = startPosY
    let startVelocityX = - cosRad * velocityShot
    let startVvelocityY = - sinRad * velocityShot
    let momentaryVelocityX = startVelocityX
    let momentaryVelocityY = startVvelocityY

    let shootTime = setInterval(() => {
        let attractorsArray = document.querySelectorAll('.attractor')
        if (attractorsArray.length > 0) {
            let momentaryAttraction = attraction(element, attractorsArray, 10000)
            momentaryVelocityX += (momentaryAttraction[0])
            momentaryVelocityY += (momentaryAttraction[1])
        }

        momentaryPosX = momentaryPosX + momentaryVelocityX
        momentaryPosY = momentaryPosY + momentaryVelocityY
        element.style = `position:fixed; top:${(momentaryPosY)}px; left:${momentaryPosX}px`
        // hit conditions according to level toggles
        if (!endbossmode) {
            let target = level ? emailInput : passwordInput
            let currentChar = level ? email : password
            if (hitCheck(target, element) && element.innerHTML === currentChar[0]) {
                target.value += element.innerHTML
                text = target.value
                target.classList.add('green')
                setTimeout(() => { target.classList.remove('green') }, 100)
                element.remove()
                if (level) {
                    email.shift()
                } else if (!level) {
                    password.shift()
                }
                if (text === emailString && level) {
                    level = false
                    levelchangeEvent()
                } else if (text === pwString) {
                    endbossmode = true
                    endbossEvent()
                }
            }
        }
        if (endbossmode) {
            let target = signInButton
            if (hitCheck(target, element)) {
                if (hitable) {
                    signhit(target)
                    updateHealth()
                    element.remove()
                    if (health > 0) { health -= damage }
                    if (health % 10 === 0) {
                        playblip()
                        createAttractor()
                    }
                    if (health < 5 && (!finalbattle)) {
                        hitable = false
                        lastEvent()
                    } else if (health <= 0 && finalbattle) {
                        hitable = false
                        ending()
                    }
                }
            }
        }

        if ((momentaryPosX < 15 || momentaryPosX > window.innerWidth - 15) || (momentaryPosY < 15 || momentaryPosY > window.innerHeight - 15)) {
            clearInterval(shootTime)
            if (canlose && endbossmode && ammo.length === 0) { loseEvent() }
        }
    }, 5)

}

// attracts all elements (missed shots) to loginDiv
function loginShot(element) {
    let bounding = element.getBoundingClientRect()
    let boundingSign = signInButton.getBoundingClientRect()
    let startPosX = bounding.left + element.offsetWidth / 2
    let startPosY = bounding.top + element.offsetHeight / 2
    let posXSign = boundingSign.left + signInButton.offsetWidth / 2
    let posYSign = boundingSign.top + signInButton.offsetHeight / 2
    let momentaryPosX = startPosX
    let momentaryPosY = startPosY
    let momentaryVelocityX = (posXSign - startPosX) / 50
    let momentaryVelocityY = (posYSign - startPosY) / 50

    let shootTime = setInterval(() => {
        momentaryPosX = momentaryPosX + momentaryVelocityX
        momentaryPosY = momentaryPosY + momentaryVelocityY
        element.style = `position:fixed; top:${(momentaryPosY - element.offsetHeight / 2)}px; left:${momentaryPosX - element.offsetWidth / 2}px`
        if ((momentaryPosX > boundingSign.left && momentaryPosX < boundingSign.right) && (momentaryPosY < boundingSign.bottom && momentaryPosY > boundingSign.top)) {
            clearInterval(shootTime)
            element.remove()
            if (health < 100) { health += 4 }
            updateHealth()
        }
    }, 20)

}

// toggle functions
function toggleGun(e) {
    if (gunToggle) {
        e.preventDefault();
        gunToggle = false
        if (gunmove) { canshoot = false }
        gunDiv.classList.remove('nocursor')
    }
    else if (e.target.id === 'gun' && !gunToggle && toggleallowed) {
        e.preventDefault();
        letterDiv.classList.remove('invisible')
        gunToggle = true
        canshoot = true
        gunDiv.classList.add('nocursor')
    }
    if (!gunmove) {
        e.preventDefault()
    }
}

function changeShootMode() {
    gamemode = shootModeSelect.value
    gunDiv.setAttribute('src', `graphic/${gamemode}.png`)
}

// this is just a disabler for machingun mode
function fireToggle() {
    fire = false
}

// browser event handlers
function wheelHandler(e) {
    if (gunToggle) {
        angle -= e.deltaY / 102 * 3
        { gunDiv.style = `top:${e.pageY - gunDiv.offsetHeight / 2}px;left:${e.pageX - gunDiv.offsetWidth / 2}px;transform: rotate(${angle}deg)` }
    }
    if (!gunmove) {
        angle -= e.deltaY / 102 * 3
        { gunDiv.style = `top:${e.pageY - gunDiv.offsetHeight / 2}px;left:${window.innerWidth - 25 - gunDiv.offsetWidth}px; transform: rotate(${angle}deg)` }
    }

}

function trackmouse(e) {
    if (gunmove) {
        cursorX = e.pageX
        cursorY = e.pageY
    }
    if (gunToggle && gunmove) {
        letterDiv.style = `top:${e.pageY - 130}px;left:${e.pageX - 30}px;)`
        gunDiv.style = `top:${e.pageY - gunDiv.offsetHeight / 2}px;left:${e.pageX - gunDiv.offsetWidth / 2}px;transform: rotate(${angle}deg)`
    }
    if (!gunmove) {
        cursorX = window.innerWidth - 25
        cursorY = e.pageY
        letterDiv.style = `top:${e.pageY - 130}px;left:${window.innerWidth - 55 - gunDiv.offsetWidth / 2}px;)`
        gunDiv.style = `top:${e.pageY - gunDiv.offsetHeight / 2}px;left:${window.innerWidth - 25 - gunDiv.offsetWidth}px; transform: rotate(${angle}deg)`
    }
}

function mousedown(e) {
    if (e.button === 0) {
        if (e.target.classList.contains('reload')) {
            newAmmo()
            playreload()
        }

        if (e.target.classList.contains('emptyclip')) {
            ammo = []
            newAmmo()
            updateAmmo()
        }

        if ((gunToggle || (!gunmove)) && ammo.length > 0 && canshoot && (e.target.id != "shootmodes")) {
            if (gamemode === 'gun') {
                playShot()
                let char = ammo.shift()
                document.querySelector('.gamearea').insertAdjacentHTML('beforeend', characterShot(char))
                shooter(document.querySelector(`#character${shotcounter}`), cursorY, cursorX, angle, Date.now())
                shotcounter += 1
            }

            if (gamemode === 'shotgun') {
                playShot()
                let clipsize = 0
                if (ammo.length < 7) {
                    clipsize = ammo.length
                } else {
                    clipsize = 7
                }
                for (let i = 1; i <= clipsize; i++) {
                    let char = ammo.shift()
                    document.querySelector('.gamearea').insertAdjacentHTML('beforeend', characterShot(char))
                    shooter(document.querySelector(`#character${shotcounter}`), cursorY, cursorX, angle + spread * Math.random() * (Math.round(Math.random()) ? 1 : -1), Date.now())
                    shotcounter += 1
                }
            }

            if (gamemode === 'machinegun') {
                fire = true
                let machineshot = setInterval(() => {
                    if (ammo.length > 0 && fire) {
                        playShot()
                        let char = ammo.shift()
                        document.querySelector('.gamearea').insertAdjacentHTML('beforeend', characterShot(char))
                        shooter(document.querySelector(`#character${shotcounter}`), cursorY, cursorX, angle, Date.now())
                        shotcounter += 1
                    }
                    if (!fire) {
                        clearInterval(machineshot)
                    }
                }, 100)
            }

        }
        if (e.target.id === 'confirm') {
            playbell()
            modalDiv.style = "display:none;"
            gamestuffDiv.classList.remove('invisible')
            alert('Welcome to \"another shooting game\"! READ these instructions carefully!!!!\n\nInstructions: Shoot LETTERS into the EMAIL INPUT to enter them!\nONLY CORRECT letters are LOGGED into the Form.\n\nRIGHT-CLICK (NOT DRAG!!!) the GUN to SELECT/UNSELECT it\n\nWhen the GUN is SELECTED you can ROTATE it with the MOUSEWHEEL\n\nRELOAD with (R) or reload Button\nRESIZE loads only the remaining needed Characters into your Form\n\nYour current AMMO and the desired INPUT are displayed at the BOTTOM\nYou can CHANGE SHOOTMODES there!\n\nLog the CORRECT COMPLETE EMAIL to progress!')
            canreload = true
            move = targetmover(targetAreaDiv)
            newAmmo()
            playreload()
        }
        if (e.target.id === 'confirm2') {
            playbell()
            modal2Div.style = "display:none;"
            lorem.split('').forEach(e => ammo.push(e))
            alert('Google fonts saved you!\n\nBut 500 Character/bullets is all you have now!\n\nIf you run out you will NEVER be able to login!!!\n\nNo need to grab your gun anymore!\n\nShoot the Login Button Quick!')
            updateAmmo()
            shotcounterDiV.innerHTML = `REMAINING AMMO: ${ammo.length}`
        }
        if (e.target.id === 'signinbutton' && gameon && emailInput.value.length !== 0 && passwordInput.value.length !== 0) {
            enterEvent()
        }
        if (e.target.id === 'signinbutton' && endingclear && emailInput.value === emailString && passwordInput.value === pwString) {
            credits()
        }

    }
}

function keyhandler(e) {

    if (e.key === 'Enter' && gameon && emailInput.value.length !== 0 && passwordInput.value.length !== 0) {
        enterEvent()
    }
    if (e.key === 'Enter' && endingclear && emailInput.value === emailString && passwordInput.value === pwString) {
        credits()
    }
    if (e.key === 'r' && canreload) {
        newAmmo()
        playreload()
    }
}

//  all these are triggered events
function enterEvent() {
    playbell()
    gameon = false
    emailString = emailInput.value
    pwString = passwordInput.value
    emailinfo.innerHTML += emailString
    passwordinfo.innerHTML += pwString
    email = []
    password = []
    emailInput.value.split('').forEach(e => email.push(e))
    passwordInput.value.split('').forEach(e => password.push(e))
    inputformDiv.reset()
    emailInput.setAttribute('onkeydown', "return false")
    passwordInput.setAttribute('onkeydown', "return false")
    alert('Oh no! We accidentaly saved your password into a shooting game!')
    setTimeout(() => {
        modalDiv.style = "display:block;"
    }, 2000)
}

function levelchangeEvent() {
    document.querySelectorAll('.shot').forEach(e => e.remove())
    gamestuffDiv.classList.add('invisible')
    gunDiv.classList.add('invisible')
    // newline
    gameAreaDiv.classList.add('nocursor')

    ammo = []
    updateAmmo()
    gunToggle = false
    canshoot = false
    fire = false
    canreload = false

    let line = 0
    let lines = ['Ow!', 'That kind of hurt!', 'I am a login Form you know?', 'I dont really like getting shot', 'So... just stop Ok?']
    clearInterval(move)
    resetTarget()
    setTimeout(function () { commfieldDiv.innerHTML = '' }, 100)
    let speech = setInterval(function () {
        commfieldDiv.innerHTML = ''
        typetext(commfieldDiv, lines[line], 50)
        line += 1
        if (line >= lines.length) {
            clearInterval(speech)
            setTimeout(() => {
                gunDiv.classList.remove('invisible')
                movespeed = 700
                move = targetmover(targetAreaDiv)
                gamestuffDiv.classList.remove('invisible')
                playbell()
                alert('Now Shoot the Password Input!')
                canshoot = true
                canreload = true
                newAmmo()
                playreload()
                // newline
                  gameAreaDiv.classList.remove('nocursor')

            }, 2000)
        }
    }, 3000)

}

function endbossEvent() {
    document.querySelectorAll('.shot').forEach(e => e.remove())
    gunstuff.classList.add('invisible')
    gunDiv.classList.add('invisible')
    reloadButton.classList.add('invisible')
    emptyDiv.classList.add('invisible')
    gameAreaDiv.classList.add('nocursor')
    ammo = []
    updateAmmo()
    canshoot = false
    gunToggle = false
    toggleallowed = false
    fire = false
    canreload = false

    let line = 0
    let lines = ['You know what?', 'I\'ve had enough of this!', 'You want to play a game?', 'Fine . . .', 'Go stand in the corner!', 'I hope you know physics!', 'Also...', 'You don\'t need to reload right?', 'Try shooting me now... haha']
    clearInterval(move)
    resetTarget()
    setTimeout(function () { commfieldDiv.innerHTML = '' }, 1000)
    let speech = setInterval(function () {
        commfieldDiv.innerHTML = ''
        typetext(commfieldDiv, lines[line], 50)
        if (line === 3) {
            setTimeout(() => {
                signInButton.style = "width:100px;"
            }, 1500)
        }
        if (lines[line] === 'Go stand in the corner!') {
            setTimeout(() => {
                angle = 0
                gunDiv.classList.remove('invisible')
                gunDiv.style = `top:${window.innerHeight / 2 - gunDiv.offsetHeight / 2}px; left:${window.innerWidth - gunDiv.offsetWidth - 50}px;`
            }, 1000)
            setTimeout(() => {
                gunDiv.style = `top:${window.innerHeight - 25 - gunDiv.offsetHeight}px;left:${window.innerWidth - 25 - gunDiv.offsetWidth}px;`
                cursorX = window.innerWidth - 25 - gunDiv.offsetWidth / 2
                cursorY = window.innerHeight - 25 - gunDiv.offsetHeight / 2
            }, 2000)
        }
        if (line === lines.length - 1) {
            gunmove = false
            clearInterval(speech)
            jump = targetJumper(targetAreaDiv)
            gunstuff.classList.remove('invisible')
            healthbarcontDiv.classList.remove('invisible')
            gameAreaDiv.classList.remove('nocursor')
            canshoot = true
            playbell()
            alert('Guntoggle disabled!')
            alert('The Input Form took all your ammo!')
            setTimeout(() => { modal2Div.style = "display:block;" }, 5000)
        }
        line += 1
    }, 3000
    )
}

function lastEvent() {
    gamestuffDiv.classList.add('invisible')
    gameAreaDiv.classList.add('nocursor')
    finalbattle = true
    gunToggle = false
    canshoot = false
    fire = false

    document.querySelectorAll('.attractor').forEach(e => e.remove())
    clearInterval(jump)
    resetTarget()
    let line = 0
    let lines = ['OK, now you\'ve done it!', 'Should have aimed better!']

    let shots = document.querySelectorAll('.shot')
    let timeframe = (shots.length * 65) + 4500

    setTimeout(() => {
        commfieldDiv.innerHTML = ''
        typetext(commfieldDiv, lines[line], 50)
        line += 1

        setTimeout(() => {
            commfieldDiv.innerHTML = ''
            typetext(commfieldDiv, lines[line], 50)
        }, 2000)

        setTimeout(() => {
            let i = 0
            let int = setInterval(() => {
                if (i < shots.length) {
                    signInButton.classList.add('vibrate')
                    loginShot(shots[i])
                    i++
                }
                if (i >= shots.length) {
                    clearInterval(int)
                }
            }, 20)
        }, 3000)

        setTimeout(() => {

            signInButton.classList.remove('vibrate')
            gamestuffDiv.classList.remove('invisible')
            gameAreaDiv.classList.remove('nocursor')
            jump = targetJumper(targetAreaDiv)
            canshoot = true
            hitable = true
            if (health < 100) {
                health += 10 - (health % 10)
                updateHealth()
            }
            document.querySelectorAll('.shot').forEach(e => e.remove())
            playbell()
            alert('Finish Him!')
        }, timeframe)
    }, 2000)
}

function loseEvent() {
    gamestuffDiv.classList.add('invisible')
    healthbarcontDiv.classList.add('invisible')
    gameAreaDiv.classList.add('nocursor')
    document.querySelectorAll('.shot').forEach(e => e.remove())
    document.querySelectorAll('.attractor').forEach(e => e.remove())
    clearInterval(jump)
    gunToggle = false
    canshoot = false
    fire = false

    setTimeout(() => {
        resetTarget()
        signInButton.style = "width: 100%;"
    }, 1000)
    setTimeout(() => {
        commfieldDiv.innerHTML = ''
        typetext(commfieldDiv, 'HA!', 50)
    }, 2000)
    setTimeout(() => {
        commfieldDiv.innerHTML = ''
        typetext(commfieldDiv, 'I WIN!', 50)
    }, 4000)
    setTimeout(() => {
        commfieldDiv.innerHTML = ''
        typetext(commfieldDiv, 'GAME OVER', 50)
    }, 6000)

}

function ending() {
    gamestuffDiv.classList.add('invisible')
    healthbarcontDiv.classList.add('invisible')
    gameAreaDiv.classList.add('nocursor')
    document.querySelectorAll('.shot').forEach(e => e.remove())
    document.querySelectorAll('.attractor').forEach(e => e.remove())
    clearInterval(jump)
    gunToggle = false
    canshoot = false
    fire = false

    setTimeout(() => {
        document.querySelectorAll('.shot').forEach(e => e.remove())
        resetTarget()
        emailInput.value = emailString
        passwordInput.value = pwString
    }, 1000)

    setTimeout(() => {
        signInButton.style = "width: 100%;"
    }, 2000)

    let line = 0
    let lines = ['Ooof!', 'I\'m done!', 'No more shooting please!', 'You won!', 'Congratulations I guess', 'I\'m sorry to have kept you', 'It\'s not easy being an input form you know?',
        'Nobody every really notices you', '.   .   .', 'But for a short time you noticed me', 'It was fun', 'I was fun . . .', '.    .    .', 'I\'ll let you login now', '.    .    .',
        'Goodbye . . .', 'and . . .', 'Thank you . . .', 'Register']
    setTimeout(() => {
        let speech = setInterval(function () {
            if (line < lines.length) {
                commfieldDiv.innerHTML = ''
                typetext(commfieldDiv, lines[line], 50)
                line += 1
            }
            if (line === lines.length) {
                clearInterval(speech)
                gameAreaDiv.classList.remove('nocursor')
                endingclear = true
                emailInput.value = emailString
                passwordInput.value = pwString
                emailInput.removeAttribute('onkeydown')
                passwordInput.removeAttribute('onkeydown')
            }
        }, 3000)
    }, 4000)
}

function credits() {
    location.href = "creditspage.html"
}

window.addEventListener('wheel', wheelHandler)
window.addEventListener('mousemove', trackmouse)
window.addEventListener('contextmenu', toggleGun)
window.addEventListener('keydown', keyhandler)
shootModeSelect.addEventListener('change', changeShootMode)
window.addEventListener('mouseup', fireToggle)
window.addEventListener('mousedown', mousedown)
inputformDiv.addEventListener('submit', function (event) {
    event.preventDefault();
})
gunDiv.addEventListener("dragstart", (event) => {
    event.preventDefault();
})