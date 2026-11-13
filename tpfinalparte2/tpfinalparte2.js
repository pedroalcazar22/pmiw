//Pedro Alcazar - Salvador Sualgaray
//Cuento: La insolacion - Horacio Quiroga
//Link del Video:https://youtu.be/YrLAtbq4nwM?si=ayEHzzIdzLvr9aFi

//variables globales
let ambiente;
let imagenes = [];
let click;
let musica;

//cargar imagenes y sonidos
function preload() {
  for (let i = 0; i < 4; i++) {
    imagenes[i] = loadImage("data/imagen" + i + ".png");
  }
  click = loadSound("data/click.mp3");
  musica = loadSound("data/ambiente.mp3");
}
function setup() {
createCanvas(640, 480);
ambiente = new Ambiente(imagenes, click, musica);
}
function draw() {
  ambiente.actualizar();
}
function mousePressed() {
  ambiente.clic();
}
function keyPressed() {
  ambiente.tecla();
}
