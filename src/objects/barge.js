import * as THREE from 'three';

export function createBarge() {
  const barge = new THREE.Group();

  // Barge hull - flat, wide platform
  const hullGeometry = new THREE.BoxGeometry(4, 0.8, 6);
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b7355, // Rusty brown
    roughness: 0.9,
    metalness: 0.2
  });
  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  hull.position.y = 0;
  barge.add(hull);

  // Deck
  const deckGeometry = new THREE.BoxGeometry(3.8, 0.2, 5.8);
  const deckMaterial = new THREE.MeshStandardMaterial({
    color: 0xa68a5c,
    roughness: 0.95
  });
  const deck = new THREE.Mesh(deckGeometry, deckMaterial);
  deck.position.y = 0.5;
  barge.add(deck);

  // Side rails
  const railGeometry = new THREE.BoxGeometry(0.1, 0.4, 5.8);
  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4a3a,
    roughness: 0.8
  });

  const leftRail = new THREE.Mesh(railGeometry, railMaterial);
  leftRail.position.set(-1.95, 0.8, 0);
  barge.add(leftRail);

  const rightRail = new THREE.Mesh(railGeometry, railMaterial);
  rightRail.position.set(1.95, 0.8, 0);
  barge.add(rightRail);

  // Front and back rails
  const frontBackRailGeometry = new THREE.BoxGeometry(4, 0.4, 0.1);
  const frontRail = new THREE.Mesh(frontBackRailGeometry, railMaterial);
  frontRail.position.set(0, 0.8, -2.95);
  barge.add(frontRail);

  const backRail = new THREE.Mesh(frontBackRailGeometry, railMaterial);
  backRail.position.set(0, 0.8, 2.95);
  barge.add(backRail);

  // Tow hook at the front
  const hookGeometry = new THREE.TorusGeometry(0.2, 0.08, 12, 16);
  const hookMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    roughness: 0.6,
    metalness: 0.7
  });
  const hook = new THREE.Mesh(hookGeometry, hookMaterial);
  hook.position.set(0, 0.6, -3.2);
  hook.rotation.x = Math.PI / 2;
  barge.add(hook);

  return barge;
}

export function createChicken() {
  const chicken = new THREE.Group();

  // Body - plump and round
  const bodyGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const featherMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f0, // White feathers
    roughness: 0.9
  });
  const body = new THREE.Mesh(bodyGeometry, featherMaterial);
  body.position.y = 0.3;
  body.scale.set(1, 1.2, 0.9);
  chicken.add(body);

  // Head - small and round
  const headGeometry = new THREE.SphereGeometry(0.12, 16, 16);
  const head = new THREE.Mesh(headGeometry, featherMaterial);
  head.position.y = 0.55;
  chicken.add(head);

  // Beak - orange cone
  const beakGeometry = new THREE.ConeGeometry(0.04, 0.1, 8);
  const beakMaterial = new THREE.MeshStandardMaterial({
    color: 0xff8800,
    roughness: 0.7
  });
  const beak = new THREE.Mesh(beakGeometry, beakMaterial);
  beak.position.set(0, 0.55, 0.12);
  beak.rotation.x = Math.PI / 2;
  chicken.add(beak);

  // Eyes - small black dots
  const eyeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000
  });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.05, 0.58, 0.08);
  chicken.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.05, 0.58, 0.08);
  chicken.add(rightEye);

  // Red comb on top of head
  const combGeometry = new THREE.SphereGeometry(0.06, 8, 8);
  const combMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.8
  });
  const comb = new THREE.Mesh(combGeometry, combMaterial);
  comb.position.set(0, 0.63, 0);
  comb.scale.set(0.6, 1, 0.4);
  chicken.add(comb);

  // Wings - small triangular shapes
  const wingGeometry = new THREE.ConeGeometry(0.15, 0.25, 8);
  const leftWing = new THREE.Mesh(wingGeometry, featherMaterial);
  leftWing.position.set(-0.22, 0.35, 0);
  leftWing.rotation.z = Math.PI / 3;
  chicken.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeometry, featherMaterial);
  rightWing.position.set(0.22, 0.35, 0);
  rightWing.rotation.z = -Math.PI / 3;
  chicken.add(rightWing);

  // Legs - thin orange sticks
  const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0xff8800,
    roughness: 0.8
  });

  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.08, 0.05, 0);
  chicken.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.08, 0.05, 0);
  chicken.add(rightLeg);

  // Feet - small orange cones
  const footGeometry = new THREE.ConeGeometry(0.05, 0.02, 6);
  const leftFoot = new THREE.Mesh(footGeometry, legMaterial);
  leftFoot.position.set(-0.08, 0, 0);
  leftFoot.rotation.x = Math.PI;
  chicken.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeometry, legMaterial);
  rightFoot.position.set(0.08, 0, 0);
  rightFoot.rotation.x = Math.PI;
  chicken.add(rightFoot);

  return chicken;
}

export function createBargeWithGorillas() {
  const bargeGroup = new THREE.Group();

  const barge = createBarge();
  bargeGroup.add(barge);

  // Add multiple chickens on the barge
  const chickenPositions = [
    { x: -1.2, z: -1.5 },
    { x: 0.5, z: -1.8 },
    { x: 1.0, z: -0.5 },
    { x: -0.8, z: 0.3 },
    { x: 0.2, z: 1.2 },
    { x: 1.3, z: 1.8 },
    { x: -1.5, z: 1.5 },
    { x: -0.2, z: -0.5 },
    { x: 0.8, z: 0.8 },
    { x: -1.0, z: -0.8 },
    { x: 1.5, z: -1.2 },
    { x: -0.5, z: 2.0 }
  ];

  chickenPositions.forEach((pos, index) => {
    const chicken = createChicken();
    chicken.position.set(pos.x, 0.6, pos.z);
    chicken.rotation.y = Math.random() * Math.PI * 2; // Random facing direction

    // Add slight random scale for variety
    const scale = 0.8 + Math.random() * 0.4;
    chicken.scale.set(scale, scale, scale);

    // Random color variations
    const colors = [0xf5f5f0, 0xf5e5d0, 0xe5d5c0, 0xd5c5b0];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    chicken.children[0].material = chicken.children[0].material.clone();
    chicken.children[0].material.color.setHex(randomColor);

    // Store index for animation
    chicken.userData.index = index;

    bargeGroup.add(chicken);
  });

  return bargeGroup;
}
