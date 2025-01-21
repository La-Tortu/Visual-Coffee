let song;
let fft;
let numCircles = 60; // Número de círculos
let circles = [];
let highlightedCircle = null; // Variable para el círculo destacado
let playButton; // Botón de reproducción

function preload() {
  // Carga el archivo de audio
  song = loadSound("beethoven.mp3"); // Asegúrate de que el archivo esté en la carpeta
}

function setup() {
  createCanvas(1080, 1920); // Tamaño del canvas para móvil
  background(0); // Fondo negro

  fft = new p5.FFT(); // Inicializa la FFT para análisis de audio
  
  // Crea el botón de reproducción
  playButton = createButton('Reproducir');
  playButton.position(10, 10); // Posición inicial del botón
  playButton.mousePressed(togglePlay); // Asocia la función de reproducción
  playButton.size(200, 100); // Tamaño del botón más grande
  playButton.style('font-size', '24px'); // Texto del botón más grande
  
  // Crea los círculos con posiciones iniciales cerca del centro
  for (let i = 0; i < numCircles; i++) {
    let radius = random(20, 50); // Tamaño inicial
    let x = width / 2; // Línea vertical
    let y = random(-200, 0); // Posición inicial fuera de la pantalla
    circles.push(new Circle(x, y, radius));
  }
}

function draw() {
  background(0, 80); // Fondo con transparencia leve para rastro sutil

  if (song.isPlaying()) {
    let spectrum = fft.analyze(); // Analiza el espectro de audio
    
    highlightedCircle = null; // Resetea el círculo destacado en cada frame
        
    // Actualiza y dibuja los círculos
    for (let i = 0; i < numCircles; i++) {
      let bandValue = spectrum[i % spectrum.length]; // Asocia cada círculo con una banda
      circles[i].update(bandValue);

      // Si la intensidad de la banda es alta, destaca el círculo
      if (bandValue > 200 && (highlightedCircle === null || bandValue > highlightedCircle.intensity)) {
        highlightedCircle = circles[i]; // Selecciona el círculo más intenso
        highlightedCircle.intensity = bandValue; // Guarda la intensidad
      }

      circles[i].display();
    }

    // Destaca el círculo con mayor intensidad
    if (highlightedCircle) {
      highlightedCircle.highlight();
    }
  }
}

function togglePlay() {
  if (song.isPlaying()) {
    song.pause();
    playButton.html('Reproducir');
  } else {
    song.play();
    playButton.html('Pausar'); 
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speedY = random(1, 4); // Velocidad de movimiento
    this.intensity = 0; // Intensidad asociada al círculo
  }

  update(audioValue) {
    // Ajusta el tamaño según la intensidad del audio
    this.r = map(audioValue, 0, 255, 10, 100);
    
    // Mueve el círculo hacia abajo
    this.y += this.speedY + map(audioValue, 0, 255, 1, 5);

    // Si el círculo sale de la pantalla, reinícialo
    if (this.y > height) {
      this.y = random(-200, 0);
      this.x = width / 2; // Mantén la línea vertical por defecto
    }
  }

  display() {
    noStroke();
    fill(255, 200); // Blanco con transparencia
    ellipse(this.x, this.y, this.r, this.r); // Dibuja el círculo
  }

  highlight() {
    // Separación horizontal para destacar
    this.x += random(-50, 50); // Mueve el círculo destacado a los lados
    fill(255); // Color blanco sólido
    ellipse(this.x, this.y, this.r * 1.5, this.r * 1.5); // Aumenta el tamaño
  }
}

