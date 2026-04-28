const cards = document.querySelectorAll(".card");

let primeiraCarta = null;
let segundaCarta = null;
let travado = false;

let tentativas = 0;
let pontos = 0;

const tentativasSpan = document.getElementById("tentativas");
const scoreSpan = document.getElementById("score");


cards.forEach((card) => {
    card.addEventListener("click", () => virarCarta(card));
});

function virarCarta(card) {
    if (travado) return;
    if (card === primeiraCarta) return;

    
    card.classList.add("flip");

    if (!primeiraCarta) {
        primeiraCarta = card;
        return;
    }

    segundaCarta = card;

    verificarPar();
}

function verificarPar() {
    travado = true;
    tentativas++;

    tentativasSpan.textContent = tentativas;

    const planeta1 = primeiraCarta.querySelector("img").src;
    const planeta2 = segundaCarta.querySelector("img").src;

    if (planeta1 === planeta2) {
        pontos++;
        scoreSpan.textContent = pontos;

        resetarJogada();
    } else {
        setTimeout(() => {
            primeiraCarta.classList.remove("flip");
            segundaCarta.classList.remove("flip");

            resetarJogada();
        }, 1000);
    }
}

function resetarJogada() {
    primeiraCarta = null;
    segundaCarta = null;
    travado = false;
}