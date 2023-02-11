let credits = document.querySelectorAll('.credits')
let container = document.querySelector('.container')
let click = document.getElementById('click')
click.style=`top:${window.innerHeight/2-click.offsetHeight/2}px; left:${window.innerWidth/2-click.offsetWidth/2}px;`
let counter = 0
let yes = true
container.style = "display: flex"



window.addEventListener('click', () => {
    if (yes) {
        yes = false

        click.style="display:none;"
        let animation = setInterval(() => {
            credits[counter].classList.add('show')
            counter += 1
            if (counter >= credits.length) {
                clearInterval(animation)
            }
        }, 2000)
        let ending = new Audio(`Sounds/ending.wav`)
        ending.currentTime = 0
        ending.play()
    }
})
