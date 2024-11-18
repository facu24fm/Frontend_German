const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


canvas.width = 600;
canvas.height = 600;

// clase para hacer que el cuerpo siga a la cabeza

class CuerpoSnake {
    constructor(radio,color,contexto,path) {
        this.radio = radio;
        this.color = color;
        this.contexto = contexto;
        this.path = path;
    }

    dibujoCirculo(x, y, radio, color) {
        this.contexto.beginPath();
        this.contexto.arc(x, y,radio, 0, 2 * Math.PI);
        this.contexto.fillStyle = color;
        this.contexto.fill();
        this.contexto.closePath();
}

dibujo() {
    this.dibujoCirculo(this.path[0].x, this.path[0].y, this.radio, this.color);
  }
}


class snake {

    constructor(posicion, radio, velocidad, color, contexto) {
        this.posicion = posicion;
        this.radio = radio;
        this.velocidad = velocidad;
        this.color = color;
        this.contexto = contexto;
        this.rotacion = 0;
        this.body = [];
        this.teclas = {
            A: false,
            D: false
        };
        this.tecladoPulse();
        
    }

    InicioJuego() {
        for(let i = 0; i < 3; i++) {
          let path = [];
          for(let j = 0; j < 12; j++) {
            path.push({
              x:this.posicion.x,
              y:this.posicion.y
            })
          }
          this.body.push(new CuerpoSnake(this.radio, this.color, this.contexto, path));
        }
        this.dibujoCuerpo(); // Agregar esta línea
      } 

    dibujoCirculo(x, y, radio, color) {
        this.contexto.beginPath();
        this.contexto.arc(x, y,radio, 0, 2 * Math.PI);
        this.contexto.fillStyle = color;
        this.contexto.fill();
        this.contexto.closePath();

    }

    dibujoCabeza () {
        this.dibujoCirculo(this.posicion.x, this.posicion.y,this.radio, this.color);

        // ojazos nene
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
        if (this.teclas.A) {
            this.rotacion -= 0.06;
        }
        if (this.teclas.D) {
            this.rotacion += 0.06;
        }
        this.posicion.x += Math.cos(this.rotacion) * this.velocidad;
        this.posicion.y += Math.sin(this.rotacion) * this.velocidad;
        
        
    }

    dibujoCuerpo() {

        // con this.body(que es donde se 'guarda; el cuerpo del snake) se agrega un nuevo cuerpo en la primera posicion
        this.body[0].path.unshift({
            x: this.posicion.x,
            y: this.posicion.y
        })
        // llamamos a la fn dibujo para que se dibuje el cuerpo
        this.body[0].dibujo();

        for (let i = 1; i < this.body.length; i++) {
            this.body[i].path.unshift(this.body[i-1].path.pop());
            this.body[i].dibujo();
        }

        this.body[this.body.length - 1].path.pop();
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
            if(e.key == 'a' || e.key == 'A') {
                this.teclas.A = true;
                
            }
            if(e.key == 'd' || e.key == 'D') {
                this.teclas.D = true;
                
            }
        })
        
        document.addEventListener("keyup", (e) => {
            if(e.key == 'a' || e.key == 'A') {
                this.teclas.A = false;
                
            }
            if(e.key == 'd' || e.key == 'D') {
                this.teclas.D = false;
                
            }
        })
    }
}

// creamos una instancia de la mismisima clase snake

const SnakeFrost = new snake({x: 100, y: 100}, 13, 5, "#ff0094", ctx);
SnakeFrost.InicioJuego();



/* ------ solo dibuja el fondo -------
* * * *  columnas en el bucle width
* * * *  filas en el bucle height
*/
function fondoSnake() {
    ctx.fillStyle = "#1B1C30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < canvas.height; i+= 90) {
        for(let j = 0; j < canvas.width; j+= 90) {
            ctx.fillStyle = "#23253C";
            ctx.fillRect(j, i, 70, 70);
        }
    }
}

function InitGame() {
    fondoSnake();
    SnakeFrost.actualizar();
    requestAnimationFrame(InitGame);
}

InitGame(); 