import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * Base
 */
// variables
var previousTime = 0;
// Models refs
var galaxyModel = null;
var earthModel = null;
var ailenPlanetModel = null;
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  currentSection = Math.round(scrollY / sizes.height);
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
// camera.position.x = 1.5;
camera.position.y = 1.5;
camera.position.z = -20;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Gltf Models

const galaxy = new GLTFLoader().setPath("../need_some_space/");
const earth = new GLTFLoader().setPath("../earth/");
const ailenPlanet = new GLTFLoader().setPath("../purple_planet/");

galaxy.load("scene.gltf", function (galaxyMod) {
  scene.add(galaxyMod.scene);
  galaxyModel = galaxyMod.scene;
});

earth.load("scene.gltf", function (earthMod) {
  earthModel = earthMod.scene;
  earthModel.position.z = -5;
  earthModel.position.y = 1.5;
  earthModel.position.x = 4;
  earthModel.visible = false;
  scene.add(earthModel);
});

ailenPlanet.load("scene.gltf", function (ailenPlanetMod) {
  ailenPlanetModel = ailenPlanetMod.scene;
  ailenPlanetModel.position.z = -5;
  ailenPlanetModel.position.y = 1.5;
  ailenPlanetModel.position.x = -4;
  ailenPlanetModel.visible = false;
  scene.add(ailenPlanetModel);
});

/**
 * light
 */

const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

/**
 * Animate
 */
const clock = new THREE.Clock();
var startPosition;
var endPosition = new THREE.Vector3(0, 1.5, -1);
var earthStartPos;
var earthEndPos;
const duration = 8000; // 2 seconds
let currentTime = 0;
const earthDuration = 4000;
let earthCurTime = 0;

function Animate() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (galaxyModel) galaxyModel.rotation.y += ((Math.PI / 2) * deltaTime) / 10;


  if (ailenPlanetModel) {
    ailenPlanetModel.rotation.y += ((Math.PI / 2) * deltaTime) / 10;
    ailenPlanetModel.rotation.x += ((Math.PI / 2) * deltaTime) / 30;
    ailenPlanetModel.rotation.z += ((Math.PI / 2) * deltaTime) / 50;
  }

  if (currentSection < 2) {
    if (scrollY == 0) camera.position.z = -2;
    else camera.position.z = scrollY / 450;

    startPosition = new THREE.Vector3(0, 1.5, scrollY / 450);
  } else if (currentSection == 2) {
    currentTime = 0;
  } else if (currentSection == 3) {
    galaxyModel.visible = true;
    earthModel.visible = false;
    ailenPlanetModel.visible = false;
    camera.position.z = -1;
    updateCameraPosition();
  } else if (currentSection == 4) {
    earthStartPos = endPosition;
    earthEndPos = new THREE.Vector3(3, 1.5, 0);
    scrollInEarth();
    if (earthModel) {
      earthModel.rotation.y += ((Math.PI / 2) * deltaTime) / 10;
      earthModel.rotation.x += ((Math.PI / 2) * deltaTime) / 30;
    }
  } else if (currentSection == 5) { 
    scrollInAilenPlanet();
  } else {
    updateAilenPos('out')
  }
  requestAnimationFrame(Animate);
  renderer.render(scene, camera);
}

function updateCameraPosition() {
  if (currentTime < duration) {
    const t = currentTime / duration;
    camera.position.lerpVectors(startPosition, endPosition, t);
    currentTime += 6;
    requestAnimationFrame(updateCameraPosition);
  }
}

function scrollInEarth() {
  // galaxyModel.visible = false;
    earthModel.visible = true;
    updateAilenPos('out');
    updateEarthPos();
}

function updateEarthPos(dir = 'in') {
  if(dir == 'in' && earthModel.position.x >= 1) {
    earthModel.position.x -= 0.02
  } 
  if(dir == 'out' && earthModel.position.x <= 4) {
    earthModel.position.x += 0.03
  }
  requestAnimationFrame(updateEarthPos)
}

function scrollInAilenPlanet() {
  ailenPlanetModel.visible = true;
  updateEarthPos('out');
  updateAilenPos('in');
}

function updateAilenPos(dir = 'in') {
  console.log('ailen',ailenPlanetModel.position)
  if(dir == 'in' && ailenPlanetModel.position.x <= -1) {
    ailenPlanetModel.position.x += 0.02
  } 
  if(dir == 'out' && ailenPlanetModel.position.x >= -4) {
    ailenPlanetModel.position.x -= 0.03
  }
  requestAnimationFrame(updateAilenPos)
}

Animate();
