import * as THREE from 'three';

export function createBoat() {
  const boat = new THREE.Group();

  // Tugboat color palette - soft, muted tones
  const hullColor = 0xd46a6a;      // Soft red
  const cabinColor = 0xf5f5f0;     // Off-white
  const trimColor = 0x5a7a8a;      // Muted blue-grey
  const stackColor = 0x3a3a3a;     // Dark grey

  // Hull (boat body) - wider and more robust for tugboat
  const hullGeometry = new THREE.BoxGeometry(2.5, 0.8, 5);
  const hullPositions = hullGeometry.attributes.position;
  for (let i = 0; i < hullPositions.count; i++) {
    const y = hullPositions.getY(i);
    const z = hullPositions.getZ(i);

    // Taper the front (bow) more sharply
    if (z < -1.8) {
      const factor = (Math.abs(z) - 1.8) / 0.7;
      hullPositions.setX(i, hullPositions.getX(i) * (1 - factor * 0.8));
    }

    // Slight taper at the back (stern)
    if (z > 1.8) {
      const factor = (z - 1.8) / 0.7;
      hullPositions.setX(i, hullPositions.getX(i) * (1 - factor * 0.3));
    }

    // Curve the bottom
    if (y < 0) {
      hullPositions.setY(i, y * 0.9);
    }
  }
  hullGeometry.computeVertexNormals();

  const hullMaterial = new THREE.MeshStandardMaterial({
    color: hullColor,
    roughness: 0.7,
    metalness: 0.2
  });
  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  boat.add(hull);

  // Deck
  const deckGeometry = new THREE.BoxGeometry(2.3, 0.15, 4.5);
  const deckMaterial = new THREE.MeshStandardMaterial({
    color: 0xa68a5c,
    roughness: 0.9
  });
  const deck = new THREE.Mesh(deckGeometry, deckMaterial);
  deck.position.y = 0.475;
  boat.add(deck);

  // Cabin (wheelhouse) - positioned towards the back
  const cabinGeometry = new THREE.BoxGeometry(1.8, 1.2, 2);
  const cabinMaterial = new THREE.MeshStandardMaterial({
    color: cabinColor,
    roughness: 0.6
  });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.set(0, 1.15, 0.5);
  boat.add(cabin);

  // Cabin roof
  const roofGeometry = new THREE.BoxGeometry(2, 0.2, 2.2);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: trimColor,
    roughness: 0.7
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 1.85, 0.5);
  boat.add(roof);

  // Smokestack (iconic tugboat feature)
  const stackGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.5, 16);
  const stackMaterial = new THREE.MeshStandardMaterial({
    color: stackColor,
    roughness: 0.8,
    metalness: 0.3
  });
  const stack = new THREE.Mesh(stackGeometry, stackMaterial);
  stack.position.set(0, 2.7, -0.3);
  boat.add(stack);

  // Smokestack top band (colored stripe)
  const bandGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.3, 16);
  const bandMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5d742, // Yellow band
    roughness: 0.6,
    emissive: 0xf5d742,
    emissiveIntensity: 0.1
  });
  const band = new THREE.Mesh(bandGeometry, bandMaterial);
  band.position.set(0, 3.2, -0.3);
  boat.add(band);

  // Windows on cabin
  const windowGeometry = new THREE.BoxGeometry(0.4, 0.35, 0.05);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x6ab3d4,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x6ab3d4,
    emissiveIntensity: 0.15
  });

  // Front windows
  const windowPositions = [
    { x: -0.5, y: 1.3, z: -0.5 },
    { x: 0, y: 1.3, z: -0.5 },
    { x: 0.5, y: 1.3, z: -0.5 }
  ];

  windowPositions.forEach(pos => {
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(pos.x, pos.y, pos.z);
    boat.add(window);
  });

  // Railing around deck
  const railingMaterial = new THREE.MeshStandardMaterial({
    color: trimColor,
    roughness: 0.5,
    metalness: 0.6
  });

  // Front railing posts
  for (let i = -1; i <= 1; i += 0.5) {
    const postGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
    const post = new THREE.Mesh(postGeometry, railingMaterial);
    post.position.set(i, 0.75, -1.8);
    boat.add(post);
  }

  // Bow (front) detail - tire bumper
  const bumperGeometry = new THREE.TorusGeometry(0.25, 0.08, 12, 16);
  const bumperMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.9
  });
  const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
  bumper.position.set(0, 0.3, -2.3);
  bumper.rotation.y = Math.PI / 2;
  boat.add(bumper);

  // Side bumpers (tires)
  const sideBumper1 = new THREE.Mesh(bumperGeometry, bumperMaterial);
  sideBumper1.position.set(-1.2, 0.3, 0);
  sideBumper1.rotation.z = Math.PI / 2;
  boat.add(sideBumper1);

  const sideBumper2 = new THREE.Mesh(bumperGeometry, bumperMaterial);
  sideBumper2.position.set(1.2, 0.3, 0);
  sideBumper2.rotation.z = Math.PI / 2;
  boat.add(sideBumper2);

  // Searchlights on top of cabin
  const lightHousingGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.3, 16);
  const lightHousingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5d742,
    roughness: 0.4,
    metalness: 0.6,
    emissive: 0xf5d742,
    emissiveIntensity: 0.3
  });

  // Left searchlight
  const leftLight = new THREE.Mesh(lightHousingGeometry, lightHousingMaterial);
  leftLight.position.set(-0.6, 2.1, 0.3);
  leftLight.rotation.z = Math.PI / 2;
  boat.add(leftLight);

  // Left light beam (glowing front)
  const beamGeometry = new THREE.CircleGeometry(0.2, 16);
  const beamMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffaa,
    emissive: 0xffffaa,
    emissiveIntensity: 1,
    side: THREE.DoubleSide
  });
  const leftBeam = new THREE.Mesh(beamGeometry, beamMaterial);
  leftBeam.position.set(-0.75, 2.1, 0.3);
  leftBeam.rotation.y = -Math.PI / 2;
  boat.add(leftBeam);

  // Right searchlight
  const rightLight = new THREE.Mesh(lightHousingGeometry, lightHousingMaterial);
  rightLight.position.set(0.6, 2.1, 0.3);
  rightLight.rotation.z = Math.PI / 2;
  boat.add(rightLight);

  // Right light beam (glowing front)
  const rightBeam = new THREE.Mesh(beamGeometry, beamMaterial);
  rightBeam.position.set(0.75, 2.1, 0.3);
  rightBeam.rotation.y = -Math.PI / 2;
  boat.add(rightBeam);

  // Store light references for animation
  boat.userData.lights = {
    leftBeam,
    rightBeam
  };

  return boat;
}
