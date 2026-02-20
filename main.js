import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls= new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 'darkGray', side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.z = -Math.PI / 2;
plane.rotation.x = -Math.PI / 4;
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 2);
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let snake = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
];

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'green' });

let snakeMeshes = [];

snake.forEach(index => {
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(index.x, index.y, 0);
  scene.add(cube);
  snakeMeshes.push(cube);
});


let direction = {
   x: 1,
   y: 0
};


let lastMoveTime = 0;
let speed = 300;

function moveSnake() {
  const head = snake[0];

  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  };

  snake.unshift(newHead);//one item is added in the beginning
  snake.pop();//one item is removed from the end

  updateSnake();
}

function updateSnake() {
  snake.forEach((item, index) => {
    snakeMeshes[index].position.set(item.x, item.y, 0);
  });
}

function animate(time = 0) {
  window.requestAnimationFrame(animate);
  // Move the snake at a fixed interval
  if (time - lastMoveTime > speed) {
    moveSnake();
    lastMoveTime = time;
  }
  renderer.render(scene, camera);
}
animate();

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp"  && direction.y !== -1){
    direction = { x: 0, y: 1 };
  }

  if (event.key === "ArrowDown" && direction.y !== 1){
    direction = { x: 0, y: -1 };
  }

  if (event.key === "ArrowLeft" && direction.x !== 1){
    direction = { x: -1, y: 0 };
  }

  if (event.key === "ArrowRight" && direction.x !== -1){
    direction = { x: 1, y: 0 };
  }
});


window.addEventListener("resize", () => {
  camera.left = -window.innerWidth / 20;
  camera.right = window.innerWidth / 20;
  camera.top = window.innerHeight / 20;
  camera.bottom = -window.innerHeight / 20;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});




