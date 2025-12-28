import * as THREE from 'three';

export function createEnvironment() {
  const environment = new THREE.Group();

  // Gradient sky background
  const skyGradient = createSkyGradient();
  environment.add(skyGradient);

  // Create many islands scattered across the large map
  const islandCount = 25; // Many islands to explore
  const mapSize = 200; // Distribute within a 200x200 area

  for (let i = 0; i < islandCount; i++) {
    const island = createIsland();

    // Random position within the map
    const x = (Math.random() - 0.5) * mapSize;
    const z = (Math.random() - 0.5) * mapSize;

    // Keep islands away from the center spawn area
    if (Math.abs(x) < 20 && Math.abs(z) < 20) {
      continue; // Skip if too close to center
    }

    island.position.set(x, 0, z);

    // Random scale for variety
    const scale = 0.6 + Math.random() * 1.2;
    island.scale.set(scale, scale, scale);

    // Random rotation
    island.rotation.y = Math.random() * Math.PI * 2;

    environment.add(island);
  }

  // Floating particles (subtle atmospheric effect)
  const particles = createParticles();
  environment.add(particles);

  return environment;
}

function createSkyGradient() {
  const skyGeometry = new THREE.SphereGeometry(80, 64, 64); // Higher resolution sky
  const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x4a5a6a) },      // Dark stormy grey
      bottomColor: { value: new THREE.Color(0x6a7a8a) },   // Lighter grey at horizon
      offset: { value: 20 },
      exponent: { value: 0.6 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;

      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide
  });

  return new THREE.Mesh(skyGeometry, skyMaterial);
}

function createIsland() {
  const island = new THREE.Group();

  // Small land mass
  const landGeometry = new THREE.CylinderGeometry(3, 2.5, 0.5, 16); // Smoother geometry
  const landMaterial = new THREE.MeshStandardMaterial({
    color: 0xa8c5a8,
    roughness: 0.9,
    flatShading: false // Smooth shading for better quality
  });
  const land = new THREE.Mesh(landGeometry, landMaterial);
  land.position.y = -0.25;
  island.add(land);

  // Abstract trees
  const treeCount = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < treeCount; i++) {
    const tree = createTree();
    const angle = (i / treeCount) * Math.PI * 2;
    const radius = 1 + Math.random() * 1.5;
    tree.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    tree.scale.set(
      0.8 + Math.random() * 0.4,
      0.8 + Math.random() * 0.6,
      0.8 + Math.random() * 0.4
    );
    island.add(tree);
  }

  return island;
}

function createTree() {
  const tree = new THREE.Group();

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 2, 12); // Smoother trunk
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b6f47,
    roughness: 0.9,
    flatShading: false
  });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 1;
  tree.add(trunk);

  // Foliage - abstract cone shape
  const foliageGeometry = new THREE.ConeGeometry(1.2, 3, 12); // Smoother foliage
  const foliageColors = [0x9dc49d, 0xb8d4b8, 0xa8c5a8];
  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: foliageColors[Math.floor(Math.random() * foliageColors.length)],
    roughness: 0.8,
    flatShading: false, // Smooth shading
    emissive: 0x9dc49d,
    emissiveIntensity: 0.05
  });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.y = 3;
  tree.add(foliage);

  return tree;
}

function createParticles() {
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 100;

  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true
  });

  return new THREE.Points(particlesGeometry, particlesMaterial);
}
