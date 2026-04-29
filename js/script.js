// Seleciona todas as cartas do jogo.
// Isso vira uma "lista" (NodeList) com todas as cartas que existem na tela.
// A gente vai percorrer essa lista para configurar cada carta individualmente.
const cartas = document.querySelectorAll(".card")

// Aqui pegamos os elementos do HTML onde vamos mostrar informações do jogo.
// Esses spans são atualizados em tempo real conforme o jogador joga.
const pontuacaoSpan = document.getElementById("score")
const tentativasSpan = document.getElementById("attempts")
const botaoReset = document.getElementById("reset")
const tempoSpan = document.getElementById("time")

// Quando o botão de reset for clicado, chamamos a função que reinicia o jogo.
// Isso conecta o HTML com a lógica do JavaScript.
botaoReset.addEventListener("click", reiniciarJogo)


// ===================== CONTROLE DE ESTADO =====================

// Essas variáveis controlam o "estado" do jogo.
// Elas guardam informações importantes enquanto o jogador interage.

let primeiraCarta = null      // guarda a primeira carta clicada
let segundaCarta = null       // guarda a segunda carta clicada
let travado = false           // bloqueia ações enquanto o jogo está verificando cartas
let pontuacao = 0             // quantidade de pares encontrados
let tentativas = 0            // quantas vezes o jogador tentou acertar pares

// Controle do tempo (cronômetro)
let tempo = 0                 // tempo total em segundos
let cronometro = null         // guarda o setInterval para poder parar depois


// Inicializa os valores na tela.
// Isso garante que o jogo sempre começa zerado visualmente.
pontuacaoSpan.textContent = pontuacao
tentativasSpan.textContent = tentativas
tempoSpan.textContent = "00:00"


// ===================== CRIAÇÃO DOS PARES =====================

// Lista base de planetas.
// Cada planeta vai aparecer duas vezes no jogo (formando pares).
const planetas = [
  "mars", "jupiter", "saturn", "venus",
  "earth", "neptune", "uranus", "mercury"
]

// Aqui duplicamos o array.
// Isso transforma 8 planetas em 16 posições (pares).
let planetasJogo = [...planetas, ...planetas]

// Embaralhamos o array.
// Isso é importante para que o jogo não fique previsível.
planetasJogo.sort(() => Math.random() - 0.5)


// ===================== DISTRIBUIÇÃO NAS CARTAS =====================

// Aqui percorremos cada carta e damos um planeta para ela.
// É nesse momento que o jogo realmente "monta" o tabuleiro.
cartas.forEach((carta, index) => {
  const planeta = planetasJogo[index]

  // Pegamos os elementos internos da carta (imagem e texto)
  const img = carta.querySelector(".image")
  const titulo = carta.querySelector(".card-title")

  // Esse é o ponto mais importante da lógica:
  // estamos guardando um identificador invisível na carta.
  // Esse "dataset" é o que permite comparar cartas depois.
  carta.dataset.planeta = planeta

  // Define a imagem que aparece quando a carta for revelada
  img.src = `./assets/images/card-type/${planeta}.png`

  // Define o nome do planeta (com a primeira letra maiúscula)
  titulo.textContent = planeta.charAt(0).toUpperCase() + planeta.slice(1)

  // Cada carta recebe um evento de clique.
  // Quando clicada, ela chama a função principal do jogo.
  carta.addEventListener("click", () => lidarClique(carta))
})


// ===================== FUNÇÃO PRINCIPAL DO JOGO =====================

function lidarClique(carta) {

  // Essas verificações existem para evitar comportamentos errados.

  // Se o jogo estiver "travado", não permite clicar.
  // Isso acontece enquanto duas cartas estão sendo comparadas.
  if (travado) return

  // Impede o jogador de clicar duas vezes na mesma carta.
  if (carta === primeiraCarta) return

  // Impede clicar em uma carta que já está virada.
  if (carta.classList.contains("face-up")) return

  // O cronômetro só começa no primeiro clique do jogador.
  // Isso evita contar tempo antes do jogo começar de verdade.
  if (!cronometro) iniciarTempo()

  // Vira visualmente a carta
  virarCarta(carta)

  // Se ainda não existe uma primeira carta, armazenamos essa.
  // E paramos aqui, esperando o segundo clique.
  if (!primeiraCarta) {
    primeiraCarta = carta
    return
  }

  // Se já existe primeira carta, essa vira a segunda.
  segundaCarta = carta

  // Incrementa o número de tentativas.
  // Cada par de cartas escolhidas conta como uma tentativa.
  tentativas++
  tentativasSpan.textContent = tentativas

  // Agora que temos duas cartas, podemos comparar.
  verificarPar()
}


// ===================== VIRAR CARTA =====================

function virarCarta(carta) {
  const conteudo = carta.querySelector(".card-contain")

  // Adiciona uma classe que muda o visual da carta (CSS).
  carta.classList.add("face-up")

  // Remove a classe que escondia o conteúdo.
  // Isso faz a imagem e o nome aparecerem.
  conteudo.classList.remove("hidden")
}


// ===================== DESVIRAR CARTAS =====================

function desvirarCartas() {

  // Travamos o jogo para evitar que o jogador clique enquanto as cartas voltam.
  travado = true

  // Usamos um tempo para o jogador conseguir ver o erro antes de sumir.
  setTimeout(() => {

    // Percorre as duas cartas selecionadas
    [primeiraCarta, segundaCarta].forEach(carta => {
      const conteudo = carta.querySelector(".card-contain")

      // Remove o estado de "virada"
      carta.classList.remove("face-up")

      // Esconde novamente o conteúdo
      conteudo.classList.add("hidden")
    })

    // Depois disso, liberamos o jogo novamente
    resetarJogada()

  }, 700)
}


// ===================== COMPARAÇÃO DE CARTAS =====================

function verificarPar() {

  // Aqui acontece a lógica principal do jogo.
  // A comparação é feita usando o "dataset", que guarda o planeta da carta.
  const acertou =
    primeiraCarta.dataset.planeta === segundaCarta.dataset.planeta

  if (acertou) {

    // Se for um par, aumentamos a pontuação
    pontuacao++
    pontuacaoSpan.textContent = pontuacao

    // Impedimos que essas cartas sejam clicadas novamente
    primeiraCarta.style.pointerEvents = "none"
    segundaCarta.style.pointerEvents = "none"

    // Se todos os pares forem encontrados, o jogo termina
    if (pontuacao === 8) {
      pararTempo()
    }

    // Reseta o turno para permitir novas jogadas
    resetarJogada()

  } else {

    // Se não for par, as cartas voltam
    desvirarCartas()
  }
}


// ===================== RESET DO TURNO =====================

function resetarJogada() {

  // Limpa as cartas armazenadas
  // Isso permite começar uma nova tentativa do zero
  primeiraCarta = null
  segundaCarta = null

  // Libera o jogo para novos cliques
  travado = false
}


// ===================== CRONÔMETRO =====================

function iniciarTempo() {

  // O setInterval executa uma função a cada 1 segundo
  cronometro = setInterval(() => {

    tempo++

    // Converte segundos em minutos e segundos
    const min = Math.floor(tempo / 60)
    const seg = tempo % 60

    // Atualiza o tempo formatado (00:00)
    tempoSpan.textContent =
      String(min).padStart(2, "0") + ":" +
      String(seg).padStart(2, "0")

  }, 1000)
}


// Para o cronômetro quando o jogo termina
function pararTempo() {
  clearInterval(cronometro)
  cronometro = null
}


// ===================== RESET COMPLETO DO JOGO =====================

function reiniciarJogo() {

  // Reseta todas as variáveis do jogo
  primeiraCarta = null
  segundaCarta = null
  travado = false
  pontuacao = 0
  tentativas = 0

  // Atualiza a interface
  pontuacaoSpan.textContent = pontuacao
  tentativasSpan.textContent = tentativas

  // Reseta o tempo
  pararTempo()
  tempo = 0
  tempoSpan.textContent = "00:00"

  // Recria e embaralha os planetas
  planetasJogo = [...planetas, ...planetas]
  planetasJogo.sort(() => Math.random() - 0.5)

  // Reconfigura cada carta
  cartas.forEach((carta, index) => {
    const planeta = planetasJogo[index]

    const img = carta.querySelector(".image")
    const titulo = carta.querySelector(".card-title")
    const conteudo = carta.querySelector(".card-contain")

    // Volta a carta para o estado inicial
    carta.classList.remove("face-up")
    conteudo.classList.add("hidden")

    // Permite clicar novamente
    carta.style.pointerEvents = "auto"

    // Atualiza os dados da carta
    carta.dataset.planeta = planeta
    img.src = `./assets/images/card-type/${planeta}.png`
    titulo.textContent =
      planeta.charAt(0).toUpperCase() + planeta.slice(1)
  })
}