const cartas = document.querySelectorAll(".card")
const pontuacaoSpan = document.getElementById("score")
const tentativasSpan = document.getElementById("attempts")
const botaoReset = document.getElementById("reset")
const tempoSpan = document.getElementById("time")

botaoReset.addEventListener("click", reiniciarJogo)

let primeiraCarta = null
let segundaCarta = null
let travado = false
let pontuacao = 0
let tentativas = 0

let tempo = 0
let cronometro = null

pontuacaoSpan.textContent = pontuacao
tentativasSpan.textContent = tentativas
tempoSpan.textContent = "00:00"

const planetas = [
  "mars", "jupiter", "saturn", "venus",
  "earth", "neptune", "uranus", "mercury"
]

let planetasJogo = [...planetas, ...planetas]
planetasJogo.sort(() => Math.random() - 0.5)

cartas.forEach((carta, index) => {
  const planeta = planetasJogo[index

  const img = carta.querySelector(".image")
  const titulo = carta.querySelector(".card-title")

  carta.dataset.planeta = planeta

  img.src = `./assets/images/card-type/${planeta}.png`
  titulo.textContent = planeta.charAt(0).toUpperCase() + planeta.slice(1)

  carta.addEventListener("click", () => lidarClique(carta))
})

function lidarClique(carta) {
  if (travado) return
  if (carta === primeiraCarta) return
  if (carta.classList.contains("face-up")) return

  if (!cronometro) iniciarTempo()

  virarCarta(carta)

  if (!primeiraCarta) {
    primeiraCarta = carta
    return
  }

  segundaCarta = carta
  tentativas++
  tentativasSpan.textContent = tentativas

  verificarPar()
}

function virarCarta(carta) {
  const conteudo = carta.querySelector(".card-contain")

  carta.classList.add("face-up")
  conteudo.classList.remove("hidden")
}

function desvirarCartas() {
  travado = true

  setTimeout(() => {
    [primeiraCarta, segundaCarta].forEach(carta => {
      const conteudo = carta.querySelector(".card-contain")

      carta.classList.remove("face-up")
      conteudo.classList.add("hidden")
    })

    resetarJogada()
  }, 700) 
}

function verificarPar() {
  const acertou =
    primeiraCarta.dataset.planeta === segundaCarta.dataset.planeta

  if (acertou) {
    pontuacao++
    pontuacaoSpan.textContent = pontuacao

    primeiraCarta.style.pointerEvents = "none"
    segundaCarta.style.pointerEvents = "none"

    if (pontuacao === 8) {
      pararTempo()
    }

    resetarJogada()
  } else {
    desvirarCartas()
  }
}

function resetarJogada() {
  primeiraCarta = null
  segundaCarta = null
  travado = false
}

function iniciarTempo() {
  cronometro = setInterval(() => {
    tempo++

    const min = Math.floor(tempo / 60)
    const seg = tempo % 60

    tempoSpan.textContent =
      String(min).padStart(2, "0") + ":" +
      String(seg).padStart(2, "0")
  }, 1000)
}

function pararTempo() {
  clearInterval(cronometro)
  cronometro = null
}

function reiniciarJogo() {
  primeiraCarta = null
  segundaCarta = null
  travado = false
  pontuacao = 0
  tentativas = 0

  pontuacaoSpan.textContent = pontuacao
  tentativasSpan.textContent = tentativas

  pararTempo()
  tempo = 0
  tempoSpan.textContent = "00:00"

  planetasJogo = [...planetas, ...planetas]
  planetasJogo.sort(() => Math.random() - 0.5)

  cartas.forEach((carta, index) => {
    const planeta = planetasJogo[index]

    const img = carta.querySelector(".image")
    const titulo = carta.querySelector(".card-title")
    const conteudo = carta.querySelector(".card-contain")

    carta.classList.remove("face-up")
    conteudo.classList.add("hidden")

    carta.style.pointerEvents = "auto"

    carta.dataset.planeta = planeta
    img.src = `./assets/images/card-type/${planeta}.png`
    titulo.textContent =
      planeta.charAt(0).toUpperCase() + planeta.slice(1)
  })
}