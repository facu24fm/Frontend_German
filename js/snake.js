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
let velocidadJuego = 110; 

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
    viboraInitX = Math.floor(Math.random() * 30 ) + 1;
    viboraInitY = Math.floor(Math.random() * 30 ) + 1;
};

const posicionesComida = () => {
    foodX = Math.floor(Math.random() * 30 ) + 1;
    foodY = Math.floor(Math.random() * 30 ) + 1;
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
        htmlMarkup += `<div class="cuerpo" style="grid-area: ${viboraInitY} / ${viboraInitX}"></div>`;
    }

    if (viboraInitX <= 0 || viboraInitX > 30 || viboraInitY <= 0 || viboraInitY > 30) {
        estadoJuego = true;
    }

    for(let i = snakeCuerpo.length - 1; i > 0; i--) {
        snakeCuerpo[i] = snakeCuerpo[i - 1];
    }

    snakeCuerpo[0] = [viboraInitX, viboraInitY];
    viboraInitX += velocidadX ;
    viboraInitY += velocidadY ;

    for(let i = 0; i < snakeCuerpo.length; i++) {
        let partecuerpo = 'cuerpo';

        if (i === 0) {
            partecuerpo = 'cabeza';
            directionClass = velocidadX === 1 ? 'right' : velocidadX === -1 ? 'left' : velocidadY === -1 ? 'up' : 'down';
        } else if (i === snakeCuerpo.length - 1) {
            partecuerpo = 'cola';
        }else {
            partecuerpo = 'cuerpo';
        }
        htmlMarkup += `<div class="${partecuerpo} ${directionClass}" style="grid-area: ${snakeCuerpo[i][1]} / ${snakeCuerpo[i][0]}" ></div>`;

    }

    playBoard.innerHTML = htmlMarkup;
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
