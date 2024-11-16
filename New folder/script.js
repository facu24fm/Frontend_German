const playBoard = document.querySelector(".play--board");
const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const difficultyButtons = document.querySelectorAll(".difficulty-button");
const settingsButton = document.getElementById("settingsButton");
const settingsMenu = document.getElementById("settingsMenu");
const score = document.getElementById("caja--puntos");
const backButton = document.getElementById("backButton");
const viboraCaja = document.querySelector(".vibora")
const logoSnake = document.getElementById("Logo");


let foodX, foodY;
let snakeCuerpo = [];
let viboraInitX, viboraInitY;
let velocidadX = 0, velocidadY = 0;
let estadoJuego = false;
let setIntervalId;
let velocidadJuego = 125; 

difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
        velocidadJuego = parseInt(button.getAttribute("data-speed"));
    });
});

difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
        difficultyButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
            
        });
    });

function iniciarJuego() {
    menu.style.display = "none";
    playBoard.style.display = "grid"; 


    posicionInitVibora();
    posicionesComida();
    setIntervalId = setInterval(comida, velocidadJuego);
}

// Funciones para la inicialización del juego
const posicionInitVibora = () => {
    viboraInitX = Math.floor(Math.random() * 20 ) + 1;
    viboraInitY = Math.floor(Math.random() * 20 ) + 1;
};

const posicionesComida = () => {
    foodX = Math.floor(Math.random() * 20 ) + 1;
    foodY = Math.floor(Math.random() * 20 ) + 1;
};

const JuegoGameOver = () => {
    clearInterval(setIntervalId);
    estadoJuego = false;
    location.reload(); // Recarga la página
};


const comida = () => {
    if(estadoJuego) return JuegoGameOver();

    let htmlMarkup = `<div class="comida" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (viboraInitX === foodX && viboraInitY === foodY) {
        posicionesComida();
        snakeCuerpo.push([foodX, foodY]);
    }

    if (viboraInitX <= 0 || viboraInitX > 20 || viboraInitY <= 0 || viboraInitY > 20) {
        estadoJuego = true;
    }

    for(let i = snakeCuerpo.length - 1; i > 0; i--) {
        snakeCuerpo[i] = snakeCuerpo[i - 1];
    }

    snakeCuerpo[0] = [viboraInitX, viboraInitY];
    viboraInitX += velocidadX;
    viboraInitY += velocidadY;

    for(let i = 0; i < snakeCuerpo.length; i++) {
        let partecuerpo = 'cuerpo';
        let imgSrc = 'img/cuerpo.png';

        if (i === 0) {
            partecuerpo = 'cabeza';
            imgSrc = 'img/cabeza.png';
            directionClass = velocidadX === 1 ? 'right' : velocidadX === -1 ? 'left' : velocidadY === -1 ? 'up' : 'down';

        } else if (i === snakeCuerpo.length - 1) {
            partecuerpo = 'cola';
            imgSrc = 'img/cola.png';
        } else if (esGiro(i)) { 
            partecuerpo = 'giro';
        }
        htmlMarkup += `<img src="${imgSrc}" class="${partecuerpo} ${directionClass}" style="grid-area: ${Math.round(snakeCuerpo[i][1])} / ${Math.round(snakeCuerpo[i][0])}" />`;
    }

    playBoard.innerHTML = htmlMarkup;
};

const esGiro = (index) => {
    const [posActualX, posActualY] = snakeCuerpo[index];
    const [posAnteriorX, posAnteriorY] = snakeCuerpo[index - 1] || [];
    const [posSiguienteX, posSiguienteY] = snakeCuerpo[index + 1] || [];

    return (posActualX !== posAnteriorX && posActualY !== posSiguienteY) || (posActualY  !== posAnteriorY && posActualX !== posSiguienteX);
};



const moveVibora = (event) => {
    switch (event.key) {
        case "ArrowLeft":
            if (velocidadX !== 1) {
                velocidadX = -1;
                velocidadY = 0;
            }
            break;
        case "ArrowRight":
            if (velocidadX !== -1) {
                velocidadX = 1;
                velocidadY = 0;
            }
            break;
        case "ArrowUp":
            if (velocidadY !== 1) {
                velocidadY = -1;
                velocidadX = 0;
            }
            break;
        case "ArrowDown":
            if (velocidadY !== -1) {
                velocidadY = 1;
                velocidadX = 0;
            }
            break;
    }
};


startButton.addEventListener("click", () => {
    iniciarJuego(); 
    score.classList.add("visible"); 
});

// Seccion de eventos

document.addEventListener("keydown", moveVibora);

settingsButton.addEventListener("click", () => {
    settingsMenu.classList.add("visible");
    startButton.classList.add("hidden");
    settingsButton.classList.add("hidden");
    logoSnake.classList.add("hidden");
    
});

backButton.addEventListener("click", () => {
    settingsMenu.classList.remove("visible");
    startButton.classList.remove("hidden");
    settingsButton.classList.remove("hidden");
    logoSnake.classList.remove("hidden");
});
