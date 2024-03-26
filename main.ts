import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const file =
  new URLSearchParams(window.location.search).get("scene") || "default";
const texture = new THREE.TextureLoader().load(`img/${file}.jpg`, () => {
  document.body.removeChild(
    document.getElementsByClassName("lds-hourglass")[0]
  );
});

const geometry = new THREE.SphereGeometry(500, 60, 40);
const material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 0.1;

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.minDistance = 0.001;
controls.maxDistance = 0.001;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.listenToKeyEvents(window); // optional

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

clock.start();
requestAnimationFrame(animate);

addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

// Add logo in js to make it harder to remove
const logo = document.createElement("img");
logo.src = "img/logo.png";
logo.style.position = "absolute";
logo.style.bottom = "15px";
logo.style.right = "15px";
logo.style.width = "200px";
logo.style.pointerEvents = "none";

document.body.appendChild(logo);
