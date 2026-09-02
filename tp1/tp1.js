let contador;//variable para contar los frames

// DIBUJOS-FONDOS 
let sid;
let tabla;
let imagenCartel;
let imagenStart;

// PERSONAJE WOODY 
let spriteCaminata = [];//arreglo que va a hacer que woody camine
let spriteAgachado = [];//arreglo que va a hacer que woody se agache

let woodyX, woodyY;// variable que nos va a situar a woody en la pantalla
let woodyAncho, woodyAlto;// variable que nos va a ayudar a aumentar el tamaño del woody
let velWoody;// variable que nos va a darle mas velocidad a woody
let animar;//variable que nos va a decir que fotograma tiene que mostrar, en este caso seria corriendo,tanto fotograma,como cuantos
let animarAgachado; // variable para la animación de agacharse

// CARTELES-BOTONES
let cartelX, cartelY;//variable que nos ayuda a ubicar el cartel de TOY STORY
let cartelAncho, cartelAlto;//variable que nos ayuda a modificar el tamaño de dicho boton
let startX, startY;//variable que nos ayuda a ubicar el boton de start
let startAncho, startAlto;//variable que nos ayuda a modificar el tamaño del boton de start

// CARGA DE IMAGENES
function preload() {
sid = loadImage("data/sid0.png");
tabla = loadImage("data/tabla0.png");
imagenCartel = loadImage("data/cartel0.png");
imagenStart = loadImage("data/start0.png");

// CICLO FOR CON ARREGLO CON CONSTRUCCION DE ARRAYS
for (let i = 0; i < 27; i++) {
spriteCaminata[i] = loadImage("data/" + i + ".png");//bucle que repite las 27 fotos en bucle generando la animacion de correr
}
for (let i = 0; i < 6; i++) {
spriteAgachado[i] = loadImage("data/agachado" + i + ".png");//bucle que repite las 6 fotos en bucle haciendo que woody se agache
}
}

function setup() {
createCanvas(800, 600);//RESOLUCION
iniciarVariables();//funcion propia que va a servir para volver a los valores iniciales, permitiendo que se pueda reproducir una y otra vez la animacion
}

function draw() {
background(0);
contador++;//suma "+1" al cronometro en cada fotograma
image(sid, 0, 0, width, height);//imagen del cuarto de sid
image(tabla, 0, 520, width, 80);//imagen de la tabla (tiene esos parametros porque es mas chica que el tamaño del lienzo y tuve que adaptarlo)

if (contador < 90) {//durante los primeros 90 frames
if (woodyX < 350) {//woody va a correr hasta un poco mas adelante de la mitad de la pantalla,y ahi para
woodyX += velWoody;
}
if (frameCount % 4 === 0){//cada dos cuadros,cambia al siguiente fotograma,y al llegar a 26,vuelve a 0 y se reinicia,haciendo animacion de carrera
animar++;
if (animar >= 27) { // Si llega a 27 (o lo supera)lo reinicia al primer fotograma
animar = 0;      
}
}
animarWoody(woodyX, woodyY, woodyAncho, woodyAlto);//funcion propia para dibujar a woody


} else if (contador >= 90 && contador < 220) {//se ejecuta entre el cuadro 90 y 220 frames
if (frameCount % 4 === 0 && animarAgachado < 5) {//cada cuadros,cambia de fotograma,asi hasta llegar a 5,dando animacion de woody agachado
animarAgachado++;
}
// Dibuja la secuencia de agachado
if (spriteAgachado[animarAgachado]) {//dibuja la imagen del arreglo de woody agachado
image(spriteAgachado[animarAgachado], woodyX, woodyY, woodyAncho, woodyAlto);
}

if (cartelY < 150) {//posicion que le vamos a dar al cartel de TOY STORY
cartelY += 20;//velocidad
if (cartelY > 150) cartelY = 150;// limite de 150 para bajar
}
if (imagenCartel) {//dibuja el cartel
image(imagenCartel, cartelX, cartelY, cartelAncho, cartelAlto);
}

} else if (contador >= 220 && contador < 380) {//se ejecuta entre los 220 y 380 frames
if (contador === 220) {//en el frame 220 se ejecuta lo siguiente
animar = 0; // Reset del fotograma de carrera para que inicie suave desde el paso 0
}
if (imagenCartel) {
image(imagenCartel, cartelX, 150, cartelAncho, cartelAlto);//mantiene el cartel fijo
}
woodyX += velWoody + 3;//mueve a woody en una velocidad mas rapida cuando se levanta
if (frameCount % 4 === 0){//cada cuatro cuadros pasa fotograma 
animar++;
if (animar >= 27) { // Si llega a 27 (o lo supera)
animar = 0;// Lo reinicia al primer fotograma
}
}
animarWoody(woodyX, woodyY, woodyAncho, woodyAlto);//dibuja a woody

} else if (contador >= 380) {//del cuadro 380 en adelante
if (imagenCartel) {
image(imagenCartel, cartelX, 150, cartelAncho, cartelAlto);//mantiene el cartel en la imagen
}

// Cae la imagen del botón Start
if (startY < 380) {//pasando los 380 frames
startY += 8;//el boton start se mueve hasta la posicion de 330
}
if (imagenStart) {
image(imagenStart, startX, startY, startAncho, startAlto);//dibuja el boton
}
}
}

//Pulsar para reiniciar variables
function mousePressed(){
if (contador >= 380 && startY >= 330) {
if (detectarBotondeReinicio(startX, startY, startAncho, startAlto)) {//función propia para saber si el clic cayó adentro del área del botón
iniciarVariables();
}
}
}

// Retorna true si el mouse está dentro de los límites del rectángulo de Start
function detectarBotondeReinicio(x, y, ancho, alto) {//funcion propia que recibe la posición y tamaño de un área rectangular
return mouseX > x && mouseX < x + ancho && mouseY > y && mouseY < y + alto;
}

// opción para reiniciar toda la escena apretando R
function keyPressed() {
if (key === 'r' || key === 'R') {
iniciarVariables();
}
}

//funcion propia para dibujar la corrida de Woody usando parámetros
function animarWoody(x, y, ancho, alto) {
if (spriteCaminata[animar]) {
image(spriteCaminata[animar], x, y, ancho, alto);//si la imagen del fotograma actual existe en el arreglo, la dibuja con las coordenadas recibidas
}
}

// Resetea todas las variables al estado inicial
function iniciarVariables() {
contador = 0;
woodyX = -100;
woodyY = 350;
woodyAncho = 140;
woodyAlto = 200;
velWoody = 5;
animar = 0;
animarAgachado = 0;// Resetea la animación del agachado

cartelX = 200;
cartelY = -200;
cartelAncho = 400;
cartelAlto = 200;

startX = 300;
startY = -200;
startAncho = 200;
startAlto = 80;
}
