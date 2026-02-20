import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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
// controls.enableRotate = false;
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


let food = { x: 0, z: 0 };
let foodMesh;

function foodLogic() {

  food.x = Math.floor(Math.random() * gridSize- gridSize/2);
  food.z = Math.floor(Math.random() * gridSize - gridSize/2);

  // console.log(food.x, "and", food.z)

if (!foodMesh) {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 'red' });
    foodMesh = new THREE.Mesh(geometry, material);
    scene.add(foodMesh);
  }

  foodMesh.position.set(food.x, 0.4, food.z);
}

let snake = [
  { x: -1, z: 0 },
  { x: -2, z: 0 }
];

let snakeMeshes = [];
const snakeGeometry = new THREE.BoxGeometry(0.8,0.5,0.5);
const snakeMaterial = new THREE.MeshStandardMaterial({ color: 'darkGrey' });

snake.forEach(item => {
  const cube = new THREE.Mesh(snakeGeometry, snakeMaterial);
  cube.position.set(item.x, 0.4, item.z);
  scene.add(cube);
  snakeMeshes.push(cube);
});

let direction = {
   x: 1,
   z: 0
  };

let lastMoveTime = 0;
let speed = 300;

let isGameOver = false;

function moveSnake() {

  const head = snake[0];

  const newHead = {
    x: head.x + direction.x,
    z: head.z + direction.z
  };

  // Boundary checking Condition
  if (
    newHead.x < -gridSize/2 || newHead.x > gridSize/2 || newHead.z < -gridSize/2 || newHead.z > gridSize/2) {
    gameOver();
    return;
  }
  // Snake Size Growth
  if (newHead.x === food.x && newHead.z === food.z) {
    snake.unshift(newHead);
    const cube = new THREE.Mesh(snakeGeometry, snakeMaterial);
    scene.add(cube);
    snakeMeshes.push(cube);

    foodLogic();

  } else {
    snake.unshift(newHead);
    snake.pop();
  }

  updateSnake();
}


function updateSnake() {
  snake.forEach((item, index) => {
    snakeMeshes[index].position.set(item.x, 0.4, item.z);
  });
}

function gameOver() {
  isGameOver = true;
  alert("Game Over!");
}

window.addEventListener("keydown", (e) => {

  if (e.key === "ArrowUp" && direction.z !== 1)
    direction = { x: 0, z: -1 };

  if (e.key === "ArrowDown" && direction.z !== -1)
    direction = { x: 0, z: 1 };

  if (e.key === "ArrowLeft" && direction.x !== 1)
    direction = { x: -1, z: 0 };

  if (e.key === "ArrowRight" && direction.x !== -1)
    direction = { x: 1, z: 0 };

});

// function restartGame(){
//   snakeMeshes=[];

// }



function animate(time = 0) {

  window.requestAnimationFrame(animate);

  if (!isGameOver && time - lastMoveTime > speed) {
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