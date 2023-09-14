const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;
let canvasWidth;
let canvasHeight;
let particles;

function init() {
  // canvas 크기 변경하게 기본 = 300, 150
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);
  particles = [];
  const TOTAL = canvasWidth / 10;

  for (let i = 0; i < TOTAL; i++) {
    const x = randomNumBetween(0, canvasWidth);
    const y = randomNumBetween(0, canvasHeight);
    const radius = randomNumBetween(50, 100);
    const vy = randomNumBetween(1, 5);
    const particle = new Particle(x, y, radius, vy);
    particles.push(particle);
  }
}

const feGaussianBlur = document.querySelector("feGaussianBlur");
const feColorMatrix = document.querySelector("feColorMatrix");

const controls = new (function () {
  this.blurValue = 40;
  this.alphaChannel = 100;
  this.alphaOffset = -23;
  this.acc = 1.03;
})();

let gui = new dat.GUI();

const f1 = gui.addFolder("Gooey Effect");
f1.open();

f1.add(controls, "blurValue", 0, 100).onChange((value) => {
  feGaussianBlur.setAttribute("stdDeviation", value);
});
f1.add(controls, "alphaChannel", 1, 200).onChange((value) => {
  feColorMatrix.setAttribute(
    "values",
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`
  );
});
f1.add(controls, "alphaOffset", -40, 40).onChange((value) => {
  feColorMatrix.setAttribute(
    "values",
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`
  );
});

const f2 = gui.addFolder("Particle Property");
f2.open();
f2.add(controls, "acc", 1, 1.5, 0.01).onChange((value) => {
  particles.forEach((particle) => (particle.acc = value));
});
//사각형 만들기
// ctx.fillRect(10, 10, 50, 50); //x좌표, y좌표, 가로, 세로

class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy;
    this.acc = 1.03; // 가속도 주기 1보다 작으면 점점 0으로 수렴한다.
  }
  update() {
    this.vy *= this.acc;
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

const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

let interval = 1000 / 60; //60fps 타겟
let now, delta;
let then = Date.now();

function animate() {
  window.requestAnimationFrame(animate); //매 프레임마다 무한으로 실행되는 함수, 1초에 모니터 주사율에 따라 횟수가 찍힌다.  게임용 144Hz, 사무용 60Hz
  now = Date.now();
  delta = now - then;

  if (delta < interval) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 매 프레임마다 전체화면을 지우고 다음 프레임에서 particle을 드로우한다.

  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    if (particle.y - particle.radius > canvasHeight) {
      // 원이 땅에 닿으면 재생성
      particle.y = -particle.radius;
      particle.x = randomNumBetween(0, canvasWidth);
      particle.radius = randomNumBetween(50, 100);
      particle.vy = randomNumBetween(1, 5);
    }
  });

  then = now - (delta % interval);
}

window.addEventListener("load", () => {
  init();
  animate();
});

window.addEventListener("resize", () => {
  init();
});
