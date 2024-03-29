import * as THREE from "three";
import { PanoramaControls } from "./PanoramaControls.js";

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
const geometry = new THREE.SphereGeometry(500, 64, 32);
const material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.BackSide, // Texture is on the inside
});
const sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);
camera.position.set(0, 0, 0);
sphere.position.set(0, 0, 0);

const controls = new PanoramaControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update(clock.getDelta());
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
