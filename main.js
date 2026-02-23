import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const finalLength = document.getElementById("finalLength");
const restartBtn= document.querySelector(".restart");
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const scoreBoard=document.getElementById('scoreBoard');
const highScoreBoard=document.getElementById('highScoreBoard');


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enableDamping = true;
const planeGeometry = new THREE.PlaneGeometry(14, 14);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);
const gridSize = 14;
const grid = new THREE.GridHelper(gridSize, gridSize);
scene.add(grid);
const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

let gameStarted = false;
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameStarted = true;
});
let food = { x: 0, z: 0 };
let foodMesh;

export function foodLogic() {
  food.x = Math.floor(Math.random() * gridSize- gridSize/2);
  food.z = Math.floor(Math.random() * gridSize - gridSize/2);
if (!foodMesh) {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 'red', transparent: true});
    foodMesh = new THREE.Mesh(geometry, material);
    scene.add(foodMesh);
  }
  foodMesh.position.set(food.x, 0.4, food.z);
}

let snake = [
  { x: -1, z: 0 }
];
let snakeMeshes = [];
const snakeGeometry = new THREE.BoxGeometry(1, 0.5, 1);
const snakeMaterial = new THREE.MeshStandardMaterial({ color: 'darkGrey' });

export function createSnake() {
  snake.forEach(item => {
  const cube = new THREE.Mesh(snakeGeometry, snakeMaterial);
  cube.position.set(item.x, 0.4, item.z);
  scene.add(cube);
  snakeMeshes.push(cube);
  });
  }
  createSnake();
  let direction = {
    x: 1,
    z: 0
    };
let lastMoveTime = 0;
let speed = 300;
let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScore = Number(highScore);
highScoreBoard.innerText = highScore;

export function moveSnake() {
  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    z: head.z + direction.z
  };
  // Boundary checking Condition
  if (newHead.x < -gridSize/2 || newHead.x > gridSize/2 || newHead.z < -gridSize/2 || newHead.z > gridSize/2) {
    gameOver();
    return;
  }
  //Self Attack
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newHead.x && snake[i].z === newHead.z) {
      gameOver();
      return;
    }
  }

  // Snake Size Growth
  if (newHead.x === food.x && newHead.z === food.z) {
    snake.unshift(newHead);
    const cube = new THREE.Mesh(snakeGeometry, snakeMaterial);
    scene.add(cube);
    snakeMeshes.push(cube);
    score += 10;
    scoreBoard.innerText = score;


    foodLogic();
  } else {
    snake.unshift(newHead);
    snake.pop();
  }
  updateSnake();
}


export function updateSnake() {
  snake.forEach((item, index) => {
    snakeMeshes[index].position.set(item.x, 0.4, item.z);
  });
}

export function gameOver() {
  isGameOver = true;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  highScoreBoard.innerText = highScore;
  finalScore.innerText = "Final Score: " + score;
  finalLength.innerText = "Snake Length: " + snake.length;
  gameOverScreen.style.display = "flex";
}

//restart game
export function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  snake = [
    { x: -1, z: 0 },
  ];
  direction = { x: 1, z: 0 };
  isGameOver = false;

  snakeMeshes.forEach(mesh => scene.remove(mesh));
  snakeMeshes = [];
  score = 0;
  scoreBoard.innerText = 0;
  createSnake();
  foodLogic();
}

restartBtn.addEventListener("click", () => {
  restartGame();
});

if(snake.length === (gridSize*gridSize)){
  alert("Congratulations, You won the Game!!!!!")
  restartGame();
}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (e.key === "ArrowUp" || key === 'w' && direction.z !== 1)
    direction = { x: 0, z: -1 };


  if (e.key === "ArrowDown" || key === 's' && direction.z !== -1)
    direction = { x: 0, z: 1 };


  if (e.key === "ArrowLeft" || key === 'a' && direction.x !== 1)
    direction = { x: -1, z: 0 };


  if (e.key === "ArrowRight" || key === 'd' && direction.x !== -1)
    direction = { x: 1, z: 0 };
});

function animate(time = 0) {
  window.requestAnimationFrame(animate);
  if (gameStarted && !isGameOver && time - lastMoveTime > speed) {
    moveSnake();
    lastMoveTime = time;
  }
  renderer.render(scene, camera);
}
foodLogic();
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});  
