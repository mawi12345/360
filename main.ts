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
const manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(manager);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const urlParams = new URLSearchParams(window.location.search);
const sceneType =
  (urlParams.get("type") || "cube").toLowerCase() === "cube"
    ? "cube"
    : "sphere";
const source = `img/${urlParams.get("scene") || "example"}`;
const autoRotationSpeed = parseInt(urlParams.get("speed") || "3") / 100;

if (sceneType === "sphere") {
  scene.add(createPanoramaSphere(source));
} else {
  scene.add(createPanoramaCube(source));
}

const controls = new PanoramaControls(camera, renderer.domElement);
controls.autoRotationSpeed = autoRotationSpeed;

function animate() {
  requestAnimationFrame(animate);
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}

clock.start();
requestAnimationFrame(animate);

manager.onLoad = () => {
  const loadingEls = document.getElementsByClassName("loading");
  for (let i = 0; i < loadingEls.length; i++) {
    document.body.removeChild(loadingEls[i]);
  }
};

addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

function createPanoramaSphere(url: string) {
  const file =
    new URLSearchParams(window.location.search).get("scene") || "default";
  const texture = textureLoader.load(`${url}.jpg`);
  const geometry = new THREE.SphereGeometry(500, 64, 32);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide, // Texture is on the inside
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.scale.x = -1; // Invert the sphere to fix the texture orientation
  return sphere;
}

function createPanoramaCubePlane(url: string) {
  const texture = textureLoader.load(url);
  const geometry = new THREE.PlaneGeometry(400, 400);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * Cube faces can be generated with https://jaxry.github.io/panorama-to-cubemap/
 */
function createPanoramaCube(url: string) {
  const cube = new THREE.Object3D();

  const px = createPanoramaCubePlane(`${url}/px.jpg`);
  cube.add(px);
  px.position.set(200, 0, 0);
  px.rotateY(-Math.PI / 2);

  const py = createPanoramaCubePlane(`${url}/py.jpg`);
  cube.add(py);
  py.position.set(0, 200, 0);
  py.rotateX(Math.PI / 2);

  const pz = createPanoramaCubePlane(`${url}/pz.jpg`);
  cube.add(pz);
  pz.position.set(0, 0, -200);

  const nx = createPanoramaCubePlane(`${url}/nx.jpg`);
  cube.add(nx);
  nx.position.set(-200, 0, 0);
  nx.rotateY(Math.PI / 2);

  const ny = createPanoramaCubePlane(`${url}/ny.jpg`);
  cube.add(ny);
  ny.position.set(0, -200, 0);
  ny.rotateX(-Math.PI / 2);

  const nz = createPanoramaCubePlane(`${url}/nz.jpg`);
  cube.add(nz);
  nz.position.set(0, 0, 200);
  nz.rotateY(Math.PI);

  return cube;
}
