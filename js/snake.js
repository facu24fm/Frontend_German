const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

// Clase para representar la manzana
class apple {
    constructor(posicion, radio, color, contexto) {
        this.posicion = posicion;
        this.radio = radio;
        this.color = color;
        this.contexto = contexto;
    }

    dibujo() {
        this.contexto.beginPath();
        this.contexto.arc(this.posicion.x, this.posicion.y, this.radio, 0, 2 * Math.PI);
        this.contexto.fillStyle = this.color;
        this.contexto.fill();
        this.contexto.closePath();
    }

    colision(snake) {
        let distancia = Math.hypot(this.posicion.x - snake.posicion.x, this.posicion.y - snake.posicion.y);

        if (distancia < snake.radio + this.radio) {
            this.generarNuevaPosicion(snake);
            snake.agregarCabeza();
        }
    }

    generarNuevaPosicion(snake) {
        let isValidPosition = false;
        while (!isValidPosition) {
            let nuevaPosicion = {
                x: Math.floor(Math.random() * (canvas.width - this.radio * 2) + this.radio),
                y: Math.floor(Math.random() * (canvas.height - this.radio * 2) + this.radio)
            };

            // Verificar que no colisione con el cuerpo de la serpiente
            isValidPosition = snake.body.every(segmento => {
                let distancia = Math.hypot(nuevaPosicion.x - segmento.path[0].x, nuevaPosicion.y - segmento.path[0].y);
                return distancia > this.radio + snake.radio;
            });

            if (isValidPosition) {
                this.posicion = nuevaPosicion;
            }
        }
    }
}

// Clase para representar los segmentos del cuerpo de la serpiente
class CuerpoSnake {
    constructor(radio, color, contexto, path) {
        this.radio = radio;
        this.color = color;
        this.contexto = contexto;
        this.path = path;
    }

    dibujoCirculo(x, y, radio, color) {
        this.contexto.beginPath();
        this.contexto.arc(x, y, radio, 0, 2 * Math.PI);
        this.contexto.fillStyle = color;
        this.contexto.fill();
        this.contexto.closePath();
    }

    dibujo() {
        for (let i = 0; i < this.path.length; i++) {
            this.dibujoCirculo(this.path[i].x, this.path[i].y, this.radio, this.color);
        }
    }
}

// Clase para representar la serpiente
class snake {
    constructor(posicion, radio, velocidad, color, contexto) {
        this.posicion = posicion;
        this.radio = radio;
        this.velocidad = velocidad;
        this.color = color;
        this.contexto = contexto;
        this.rotacion = 0;
        this.body = [];
        this.teclas = { A: false, D: false };
        this.tecladoPulse();
    }

    InicioJuego() {

        this.body = [];

        for (let i = 0; i < 5; i++) { // Crear 20 segmentos iniciales
            let path = [];
            for (let j = 0; j < 13; j++) { // Cada segmento tendrá 20 posiciones
                path.push({
                    x: this.posicion.x - j * this.radio * 2 - i * this.radio * 2, // Ajustamos la posición inicial
                    y: this.posicion.y
                });
            }
            this.body.push(new CuerpoSnake(this.radio, this.color, this.contexto, path));
        }
        this.dibujoCuerpo();
    }
    

    dibujoCirculo(x, y, radio, color) {
        this.contexto.beginPath();
        this.contexto.arc(x, y, radio, 0, 2 * Math.PI);
        this.contexto.fillStyle = color;
        this.contexto.fill();
        this.contexto.closePath();
    }

    agregarCabeza() {
        let path = [];
        for (let j = 0; j < 5; j++) {
            path.push({
                x: this.body.slice(-1)[0].path.slice(-1)[0].x,
                y: this.body.slice(-1)[0].path.slice(-1)[0].y
            });
        }
        this.body.push(new CuerpoSnake(this.radio, this.color, this.contexto, path));
    }

    dibujoCabeza() {
        this.dibujoCirculo(this.posicion.x, this.posicion.y, this.radio, this.color);

        // Dibujar ojos
        this.dibujoCirculo(this.posicion.x, this.posicion.y - 9, this.radio - 5, "#fff");
        this.dibujoCirculo(this.posicion.x + 1, this.posicion.y - 9, this.radio - 7, "#000");
        this.dibujoCirculo(this.posicion.x + 5, this.posicion.y - 8, this.radio - 11, "#fff");

        this.dibujoCirculo(this.posicion.x, this.posicion.y + 9, this.radio - 5, "#fff");
        this.dibujoCirculo(this.posicion.x + 1, this.posicion.y + 9, this.radio - 7, "#000");
        this.dibujoCirculo(this.posicion.x + 5, this.posicion.y + 8, this.radio - 11, "#fff");
    }

    actualizar() {
        
        this.dibujoCuerpo();
        this.dibujo();
        if (this.teclas.A) this.rotacion -= 0.04;
        if (this.teclas.D) this.rotacion += 0.04;

        this.posicion.x += Math.cos(this.rotacion) * this.velocidad;
        this.posicion.y += Math.sin(this.rotacion) * this.velocidad;

        this.colision();
    }

    dibujoCuerpo() {
        this.body[0].path.unshift({ x: this.posicion.x, y: this.posicion.y });
        if (this.body[0].path.length > 20) this.body[0].path.pop();

        this.body[0].dibujo();

        for (let i = 1; i < this.body.length; i++) {
            this.body[i].path.unshift(this.body[i - 1].path.pop());
            if (this.body[i].path.length > 20) this.body[i].path.pop();
            this.body[i].dibujo();
        }
    }

    dibujo() {
        this.contexto.save();
        this.contexto.translate(this.posicion.x, this.posicion.y);
        this.contexto.rotate(30 * Math.PI / 180);
        this.contexto.translate(-this.posicion.x, -this.posicion.y);
        this.dibujoCabeza();
        this.contexto.restore();
    }

    tecladoPulse() {
        document.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') this.teclas.A = true;
            if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') this.teclas.D = true;
        });

        document.addEventListener("keyup", (e) => {
            if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') this.teclas.A = false;
            if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') this.teclas.D = false;
        });
    }

    colision() {
        for (let i = 1; i < this.body.length; i++) {
            if (
                Math.hypot(
                    this.posicion.x - this.body[i].path[0].x,
                    this.posicion.y - this.body[i].path[0].y
                ) < this.radio * 2
            ) {
                this.reiniciarJuego();
                return;
            }
        }

        if (this.posicion.x + this.radio > canvas.width) this.posicion.x = this.radio;
        if (this.posicion.x - this.radio < 0) this.posicion.x = canvas.width - this.radio;
        if (this.posicion.y + this.radio > canvas.height) this.posicion.y = this.radio;
        if (this.posicion.y - this.radio < 0) this.posicion.y = canvas.height - this.radio;
    }


    // utilizamos reiniciarJuego para cuando colisione, reubicando el snake en las posiciones dadas
    //  posicion en x: 15, y: 80, direccion yendo a la derecha, cuerpo vacio --body-- y llamando a InicioJuego
    reiniciarJuego() {
        this.posicion = { x: 15, y: 80 }; 
        this.direccion = { x: 1, y: 0 }; 
        this.body = []; 
        this.InicioJuego();
    }
}

// Instancia de la serpiente y la manzana
const SnakeFrost = new snake({ x: 10, y: 40 }, 11, 2, "#ff0094", ctx);
SnakeFrost.InicioJuego();
const manzanaFood = new apple({ x: 200, y: 200 }, 8, "red", ctx);

// Fondo del juego
function fondoSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1B1C30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < canvas.height; i += 90) {
        for (let j = 0; j < canvas.width; j += 90) {
            ctx.fillStyle = "#23253C";
            ctx.fillRect(j, i, 70, 70);
        }
    }
}

// Lógica principal del juego
function InitGame() {
    fondoSnake();
    SnakeFrost.actualizar();
    manzanaFood.dibujo();
    manzanaFood.colision(SnakeFrost);
    requestAnimationFrame(InitGame);
}

InitGame();
