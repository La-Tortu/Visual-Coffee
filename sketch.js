let circles = [];
let numCircles = 60; // Número de círculos
let song;
let fft;

function preload() {
  song = loadSound('beethoven.mp3'); // Asegúrate de que el archivo de audio esté en el mismo directorio
}

function setup() {
  createCanvas(800, 800);
  background(0); // Fondo negro

  fft = new p5.FFT();
  song.setVolume(0.8);

  // Crear los círculos iniciales
  for (let i = 0; i < numCircles; i++) {
    let x = width / 2;
    let y = random(-200, 0);
    let r = random(15, 30);
    circles.push(new Circle(x, y, r));
  }

  // Crear botón de audio
  let playButton = createButton('Play Audio');
  playButton.position(20, 20);
  playButton.mousePressed(() => {
    if (song.isPlaying()) {
      song.pause();
      playButton.html('Play Audio');
    } else {
      song.play();
      playButton.html('Pause Audio');
    }
  });
}

function draw() {
  background(0, 50); // Hacer el rastro más sutil
  fft.analyze();

  for (let i = 0; i < circles.length; i++) {
    let energy = fft.getEnergy("bass") + fft.getEnergy("treble");
    circles[i].update(energy);
    circles[i].display();
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = random(1, 3);
  }

  update(audioValue) {
    this.r = map(audioValue, 0, 255, 15, 60); // Tamaños grandes basados en audio
    this.y += this.speed + map(audioValue, 0, 255, 0.5, 3);

    if (this.y > height) {
      this.y = random(-200, 0);
    }
  }

  display() {
    noStroke();
    fill(255, 150); // Color blanco con transparencia
    ellipse(this.x, this.y, this.r, this.r);
  }
}




