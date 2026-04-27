const cards = document.querySelectorAll(".card")
const scoreSpan = document.getElementById("score")
const attemptsSpan = document.getElementById("attempts")

let firstCard = null
let secondCard = null
let lock = false
let score = 0
let attempts = 0

scoreSpan.textContent = score
attemptsSpan.textContent = attempts


const planets = [
  "mars", "jupiter", "saturn", "venus",
  "earth", "neptune", "uranus", "mercury"
]


let gamePlanets = [...planets, ...planets]
gamePlanets.sort(() => Math.random() - 0.5)


cards.forEach((card, index) => {
  const planet = gamePlanets[index]

  const img = card.querySelector(".image")
  const title = card.querySelector(".card-title")

  card.dataset.planet = planet

  img.src = `./assets/images/card-type/${planet}.png`
  title.textContent = planet.charAt(0).toUpperCase() + planet.slice(1)

  card.addEventListener("click", () => handleClick(card))
})


function handleClick(card) {
  if (lock) return
  if (card === firstCard) return
  if (card.classList.contains("face-up")) return

  flipCard(card)

  if (!firstCard) {
    firstCard = card
    return
  }

  secondCard = card
  attempts++
  attemptsSpan.textContent = attempts

  checkMatch()
}


function flipCard(card) {
  const contain = card.querySelector(".card-contain")

  card.classList.add("face-up")
  contain.classList.remove("hidden")
}


function unflipCards() {
  lock = true

  setTimeout(() => {
    [firstCard, secondCard].forEach(card => {
      const contain = card.querySelector(".card-contain")

      card.classList.remove("face-up")
      contain.classList.add("hidden")
    })

    resetTurn()
  }, 1000)
}


function checkMatch() {
  const isMatch =
    firstCard.dataset.planet === secondCard.dataset.planet

  if (isMatch) {
    score++
    scoreSpan.textContent = score

    
    firstCard.style.pointerEvents = "none"
    secondCard.style.pointerEvents = "none"

    resetTurn()
  } else {
    unflipCards()
  }
}


function resetTurn() {
  firstCard = null
  secondCard = null
  lock = false
}