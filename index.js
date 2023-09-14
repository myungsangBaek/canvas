const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");
console.log(window.devicePixelRatio); //dpr
const dpr = window.devicePixelRatio;

// canvas 크기 변경하게 기본 = 300, 150

const canvasWidth = innerWidth;
const canvasHeight = innerHeight;

canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";

canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;
ctx.scale(dpr, dpr);

//사각형 만들기
// ctx.fillRect(10, 10, 50, 50); //x좌표, y좌표, 가로, 세로

class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy;
  }
  update() {
    this.y += this.vy;
  }
  draw() {
    ctx.beginPath(); // path 시작을 알림
    //원 그리기 - arc 중심에서 떨어져 호를 그리는 메서드
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360); // x좌표, y좌표, 반지름, 시작각도, 끝나는각도, 시계방향 or 반시계방향
    // Math.PI 를 180으로 나누면 1
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath(); // path 그리기 끝
  }
}

const x = 100;
const y = 100;
const radius = 50;
const particle = new Particle(x, y, radius);
const TOTAL = 20;
const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

let particles = [];

for (let i = 0; i < TOTAL; i++) {
  const x = randomNumBetween(0, canvasWidth);
  const y = randomNumBetween(0, canvasHeight);
  const radius = randomNumBetween(50, 100);
  const vy = randomNumBetween(1, 5);
  const particle = new Particle(x, y, radius, vy);
  particles.push(particle);
}

console.log(particles);

let interval = 1000 / 60; //60fps 타겟
let now, delta;
let then = Date.now();

function animate() {
  window.requestAnimationFrame(animate); //매 프레임마다 무한으로 실행되는 함수, 1초에 모니터 주사율에 따라 횟수가 찍힌다.  게임용 140Hz, 사무용 60Hz

  now = Date.now();
  delta = now - then;

  if (delta < interval) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 매 프레임마다 전체화면을 지우고 다음 프레임에서 particle을 드로우한다.

  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius;
      particle.x = randomNumBetween(0, canvasWidth);
      particle.radius = randomNumBetween(50, 100);
      particle.vy = randomNumBetween(1, 5);
    }
  });

  then = now - (delta % interval);
}
animate();
