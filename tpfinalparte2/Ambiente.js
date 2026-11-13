//Crea y controla a los objetos secundarios (Jones, BarraCalor, Nube y Reloj)
// y decide qué pantalla se muestra según el estado.
class Ambiente {
  //recibe los tres parametros
  constructor(imagenes, click, musica) {
    //guarda lo que recibe en variables propias para usarlo en otros metodos
    this.imagenes = imagenes;
    this.click = click;
    this.musica = musica;
    //donde arranca el piso
    this.pisoY = 380;
    this.estado = "inicio"; // indica el tipo de pantalla:inicio, instrucciones, jugando, perdiste, ganaste, creditos
    this.tiempoFinal = 0;   //guarda momento en que ganaste o perdiste
    this.creditosAlfa = 0;  // transparencia de los créditos copiado del anterior tp

    // medidas y posicion del boton (sirve para JUGAR y para SIGUIENTE)
    this.botonAncho = 220;
    this.botonAlto = 50;
    this.botonX = width / 2 - this.botonAncho / 2;
    this.botonY = 360;
    
// crea los objetos secundarios
    this.crearObjetos();
  }
//metodo que crea a Jones, una barra de calor, una nube y un reloj nuevos (constructor) desde  sus valores iniciales
  crearObjetos() {
    this.jones = new Jones();
    this.barra = new BarraCalor();
    this.nube = new Nube();
    this.reloj = new Reloj();
  }
//metodo que llama al otro, diciendole que pase de estar todo en 0 a pasar al estado "jugando"
  empezarJuego() {
    this.crearObjetos(); // reinicia todo, incluido el reloj
    this.estado = "jugando";
  }

  // revisa el valor del estado y llama a la pantalla correspondiente
  actualizar() {
    if (this.estado === "inicio") {
      this.pantallaInicio();
    } else if (this.estado === "instrucciones") {
      this.pantallaInstrucciones();
    } else if (this.estado === "jugando") {
      this.jugar();
      //salta pantalla de perdiste y al pasar 5 s pasa a la pantalla de creditos
    } else if (this.estado === "perdiste") {
      this.pantallaFinal("PERDISTE", color(150, 0, 0));
      this.pasarACreditos();
            //salta pantalla de ganaste y al pasar 5 s pasa a la pantalla de creditos

    } else if (this.estado === "ganaste") {
      this.pantallaFinal("GANASTE", color(0, 150, 0));
      this.pasarACreditos();
    } else if (this.estado === "creditos") {
      this.pantallaCreditos();
    }
  }

  //pantallas
  //dibuja las imagenes del arreglo y el boton de Jugar
  pantallaInicio() {
    image(this.imagenes[0], 0, 0, width, height);
    this.dibujarBoton("JUGAR");
  }
//dibuja la imagen 1 en especifico y el boton de Siguiente
  pantallaInstrucciones() {
    image(this.imagenes[1], 0, 0, width, height);
    this.dibujarBoton("SIGUIENTE");
  }
//dibuja el juego en si
   jugar() {
     //se reproduce la musica y evita que se reinicie la cancion en cada frame
    if (!this.musica.isPlaying()) {
      this.musica.play();
    }
    //dibuja fondo y piso
    this.dibujarAmbiente();
    
//mueve la nube y la dibuja en su nueva posicion
    this.nube.moverNube();
    this.nube.dibujarNube();
    
//mueve a jones segun las flechas y despues lo dibuja
    this.jones.moverMisterJones();
    this.jones.dibujarMisterJones();
    
//detecta jones esta en la sombra o no, dando como resultado la suma de la barra
    let estaEnSombra = this.nube.detectarJones(this.jones);
    this.barra.dibujarBarra(estaEnSombra);


//dibuja el reloj y el texto de como moverse
    this.reloj.dibujarReloj();
    this.dibujarInstrucciones();

//revisa si termino el juego, si llega a 100 perdes
   if (this.barra.valor >= 100) {
      this.estado = "perdiste";
      
      //guarda cuando perdiste y corta la musica
      this.tiempoFinal = millis();
      this.musica.stop(); 
    } else if (this.reloj.llegoAlFinal()) {
      
      //si pasan los 25 s sin que se llene la barra,ganas
      this.estado = "ganaste";
      this.tiempoFinal = millis();
      this.musica.stop(); // corta la música al ganar
    }
  }
//muestra el texto y el color de fondo
  pantallaFinal(mensaje, colorFondo) {
    background(colorFondo);
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text(mensaje, width / 2, height / 2);
    pop();
  }

  pasarACreditos() {
    // a los 5 segundos pasa a los créditos,hayas ganado o perdido, y parte de esas pantallas
    if (millis() - this.tiempoFinal > 5000) {
      this.estado = "creditos";
      this.creditosAlfa = 0;
    }
  }
//da el fundido o transparencia de los creditos
  pantallaCreditos() {
    background(0);
    if (this.creditosAlfa < 255) {
      this.creditosAlfa += 4; // fundido de entrada
    }
    //caracteristicas del texto de creditos
    push();
    fill(250, this.creditosAlfa);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Basado en: La insolación - Horacio Quiroga", width / 2, 130);
    text("Integrantes: Salvador Sualgaray - Pedro Alcazar", width / 2, 180);
    text("Gracias por jugar", width / 2, 230);
    text("Tocá R para volver al inicio", width / 2, 260);
    pop();
  }

  //pone la imagen 2 y 3 en todo el escenario con su respectivo tamaño
  dibujarAmbiente() {
    image(imagenes[2], 0, 0, 640, 480);
    push();
    fill(222, 184, 110);
    image(imagenes[3], 0, this.pisoY, width, height - this.pisoY);
//rect(0, this.pisoY, width, height - this.pisoY);
    pop();
  }

//calcula el tiempo desde que arranco el reloj y muestrta el texto de instrucciones durante los primeros 4 segundos
  dibujarInstrucciones() {
    let segundos = (millis() - this.reloj.inicio) / 1000;
    if (segundos < 4) {
      push();
      fill(60, 40, 10);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Te movés con las flechas ← →", width / 2, 50);
      pop();
    }
  }

//recibe como parametro el texto, asi usa el mismo metodo para JUGAR y SIGUIENTE
  dibujarBoton(texto) {
    push();
    fill(40);
    stroke(255);
    
    //Como quiero que sea el boton con su respectivo texto
    rect(this.botonX, this.botonY, this.botonAncho, this.botonAlto, 10);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(texto, width / 2, this.botonY + this.botonAlto / 2);
    pop();
  }
//detecta los parametros del boton
  mouseSobreBoton() {
    return mouseX > this.botonX && mouseX < this.botonX + this.botonAncho &&
           mouseY > this.botonY && mouseY < this.botonY + this.botonAlto;
  }

   // se llama desde mousePressed()
 clic() {
   //si esta dentro de los parametros
    if (this.mouseSobreBoton()) {
      this.click.play();
      if (this.estado === "inicio") {
        //desde el inicio pasa a las instrucciones y baja el boton para que SIGUIENTE quede mas abajo
        this.estado = "instrucciones";
        this.botonY = 420; // SIGUIENTE más abajo
      } else if (this.estado === "instrucciones") {
        //arranca el juego desde las instrucciones
        this.empezarJuego();
      }
    }
  }

  // se llama desde keyPressed()
  tecla() {
    //tocando la R reinicia todo
    if (this.estado === "creditos" && (key === 'r' || key === 'R')) {
      this.estado = "inicio"; // vuelve a la pantalla de la imagen
      this.botonY = 360;      // JUGAR vuelve a su lugar
    }
  }
}
