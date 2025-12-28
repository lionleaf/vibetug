import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { createWater } from './objects/water.js';
import { createBoat } from './objects/boat.js';
import { createEnvironment } from './objects/environment.js';
import { BoatControls } from './utils/boatControls.js';
import { createBargeWithGorillas } from './objects/barge.js';
import { TowRope } from './objects/towRope.js';

// Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x5a6a7a, 20, 150); // Larger fog distance for bigger map

// Camera setup
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(8, 5, 12);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
  stencil: false,
  depth: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Use full device pixel ratio for crisp rendering
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting - darker, more dramatic for storm
const ambientLight = new THREE.AmbientLight(0x6a7a8a, 0.5); // Dimmer, grey ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x8a9aaa, 0.4); // Dimmer, cooler light
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const fillLight = new THREE.DirectionalLight(0x4a5a6a, 0.3); // Dark blue-grey fill
fillLight.position.set(-5, 3, -5);
scene.add(fillLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2.2;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Hide overlay on interaction
let interacted = false;
controls.addEventListener('start', () => {
  if (!interacted) {
    document.querySelector('.overlay').classList.add('hidden');
    interacted = true;
  }
});

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.6,  // strength
  0.4,  // radius
  0.85  // threshold
);
composer.addPass(bloomPass);

// Create scene objects
const water = createWater();
scene.add(water);

const boat = createBoat();
boat.position.set(0, 0.5, 0);
scene.add(boat);

// Add powerful spotlights to the tugboat - pointing forward
const leftSpotLight = new THREE.SpotLight(0xffffcc, 5, 80, Math.PI / 5, 0.5, 2);
leftSpotLight.position.set(-0.75, 2.1, 0.3);
leftSpotLight.target.position.set(-5, 0, -30); // Point forward (negative Z)
leftSpotLight.castShadow = true;
boat.add(leftSpotLight);
boat.add(leftSpotLight.target);

const rightSpotLight = new THREE.SpotLight(0xffffcc, 5, 80, Math.PI / 5, 0.5, 2);
rightSpotLight.position.set(0.75, 2.1, 0.3);
rightSpotLight.target.position.set(5, 0, -30); // Point forward (negative Z)
rightSpotLight.castShadow = true;
boat.add(rightSpotLight);
boat.add(rightSpotLight.target);

// Store spotlight references
boat.userData.spotLights = {
  left: leftSpotLight,
  right: rightSpotLight
};

// Add fill lights to illuminate the tugboat itself
const boatFillLight = new THREE.PointLight(0xffffff, 1.5, 15);
boatFillLight.position.set(0, 4, 0);
boat.add(boatFillLight);

// Add accent light to highlight the tugboat from above
const boatAccentLight = new THREE.SpotLight(0xffffdd, 2, 20, Math.PI / 4, 0.8, 1);
boatAccentLight.position.set(0, 8, 5);
boatAccentLight.target.position.set(0, 0, 0);
boat.add(boatAccentLight);
boat.add(boatAccentLight.target);

// Create barge with gorillas - positioned behind the boat
const bargeWithGorillas = createBargeWithGorillas();
bargeWithGorillas.position.set(0, 0.5, 15); // Start 15 units behind boat
scene.add(bargeWithGorillas);

// Add lights to illuminate the barge
const bargeTopLight = new THREE.PointLight(0xffffff, 4, 25);
bargeTopLight.position.set(0, 6, 0);
bargeWithGorillas.add(bargeTopLight);

// Add spotlights from tugboat pointing back at the barge
const backSpotLight1 = new THREE.SpotLight(0xffffcc, 4, 50, Math.PI / 4, 0.5, 1);
backSpotLight1.position.set(-0.5, 3, 2.5);
backSpotLight1.target.position.set(0, 0, 15);
boat.add(backSpotLight1);
boat.add(backSpotLight1.target);

const backSpotLight2 = new THREE.SpotLight(0xffffcc, 4, 50, Math.PI / 4, 0.5, 1);
backSpotLight2.position.set(0.5, 3, 2.5);
backSpotLight2.target.position.set(0, 0, 15);
boat.add(backSpotLight2);
boat.add(backSpotLight2.target);

// Create tow rope
const towRope = new TowRope(boat, bargeWithGorillas);
scene.add(towRope.getRope());

const environment = createEnvironment();
scene.add(environment);

// Boat controls
const boatControls = new BoatControls(boat);

// Barge physics state
const bargeVelocity = new THREE.Vector3();
let ropeLength = 12; // Desired rope length (adjustable with R/F keys)
const minRopeLength = 5;
const maxRopeLength = 30;
const ropeLengthChangeSpeed = 2; // units per second

function updateBargePhysics(deltaTime) {
  // Adjust rope length based on R/F keys
  if (boatControls.isPayingOut()) {
    ropeLength = Math.min(ropeLength + ropeLengthChangeSpeed * deltaTime, maxRopeLength);
  }
  if (boatControls.isHaulingIn()) {
    ropeLength = Math.max(ropeLength - ropeLengthChangeSpeed * deltaTime, minRopeLength);
  }

  // Get boat's back position
  const boatBack = new THREE.Vector3(0, 0, 2.5);
  boatBack.applyEuler(new THREE.Euler(0, boat.rotation.y, 0));
  const boatBackPos = boat.position.clone().add(boatBack);

  // Get barge's front position
  const bargeFront = new THREE.Vector3(0, 0, -3.2);
  bargeFront.applyEuler(new THREE.Euler(0, bargeWithGorillas.rotation.y, 0));
  const bargeFrontPos = bargeWithGorillas.position.clone().add(bargeFront);

  // Calculate rope vector
  const ropeVector = new THREE.Vector3().subVectors(boatBackPos, bargeFrontPos);
  const currentDistance = ropeVector.length();

  // Apply rope constraint if stretched
  if (currentDistance > ropeLength) {
    const pullStrength = (currentDistance - ropeLength) * 0.5;
    const pullDirection = ropeVector.normalize();

    // Pull barge towards boat
    bargeVelocity.add(pullDirection.multiplyScalar(pullStrength * deltaTime));
  }

  // Apply drag/friction
  bargeVelocity.multiplyScalar(0.95);

  // Update barge position
  bargeWithGorillas.position.add(bargeVelocity);

  // Gradually rotate barge to face away from boat
  const targetAngle = Math.atan2(ropeVector.x, ropeVector.z);
  let angleDiff = targetAngle - bargeWithGorillas.rotation.y;

  // Normalize angle difference to [-PI, PI]
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

  bargeWithGorillas.rotation.y += angleDiff * 0.05;

  // Wave motion for barge
  const waveOffset = Math.sin(Date.now() * 0.001) * 0.3 + Math.sin(Date.now() * 0.0015) * 0.2;
  bargeWithGorillas.position.y = 0.5 + waveOffset;

  // Rock the barge
  bargeWithGorillas.rotation.z = Math.sin(Date.now() * 0.0012) * 0.1;
  bargeWithGorillas.rotation.x = Math.cos(Date.now() * 0.0015) * 0.08;
}

function animateGorillas(time) {
  // Animate each gorilla
  bargeWithGorillas.children.forEach((child) => {
    if (child.userData.index !== undefined) {
      const index = child.userData.index;
      const offset = index * 0.5;

      // Make gorillas bounce and wave
      child.position.y = 0.6 + Math.sin(time * 2 + offset) * 0.1;

      // Occasional arm wave
      if (child.children.length > 10) {
        const leftArm = child.children[9];
        const rightArm = child.children[10];

        if (leftArm) {
          leftArm.rotation.z = Math.PI / 6 + Math.sin(time * 3 + offset) * 0.3;
        }
        if (rightArm) {
          rightArm.rotation.z = -Math.PI / 6 + Math.sin(time * 3 + offset + 1) * 0.3;
        }
      }

      // Head rotation
      if (child.children.length > 1) {
        const head = child.children[1];
        if (head) {
          head.rotation.y = Math.sin(time + offset * 2) * 0.4;
        }
      }
    }
  });
}

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Update water animation
  if (water.material.uniforms) {
    water.material.uniforms.uTime.value = elapsedTime;
  }

  // Update boat controls (player input and physics)
  boatControls.update(deltaTime);

  // Update barge physics - follows boat with rope constraint
  updateBargePhysics(deltaTime);

  // Update tow rope visual
  towRope.update();

  // Animate gorillas
  animateGorillas(elapsedTime);

  // Make camera follow the boat
  const cameraOffset = new THREE.Vector3(0, 5, 12);
  const cameraTarget = new THREE.Vector3();

  // Rotate offset based on boat rotation
  cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), boat.rotation.y);
  cameraTarget.copy(boat.position).add(cameraOffset);

  // Smoothly move camera
  camera.position.lerp(cameraTarget, 0.05);

  // Look at boat
  const lookAtTarget = new THREE.Vector3(
    boat.position.x,
    boat.position.y + 1,
    boat.position.z
  );
  controls.target.lerp(lookAtTarget, 0.05);

  controls.update();
  composer.render();
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
