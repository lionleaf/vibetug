import * as THREE from 'three';

export function createWater() {
  const geometry = new THREE.PlaneGeometry(500, 500, 128, 128); // Much larger map for exploration

  // Custom shader for stormy water
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorShallow: { value: new THREE.Color(0x4a6b7c) }, // Darker stormy blue-grey
      uColorDeep: { value: new THREE.Color(0x2a3f4f) },    // Deep dark blue
      uColorFoam: { value: new THREE.Color(0xb8c9d4) }     // White foam caps
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vUv = uv;

        vec3 pos = position;

        // Create stormy, turbulent waves
        float wave1 = sin(pos.x * 0.8 + uTime * 1.2) * 0.6;      // Larger, faster waves
        float wave2 = sin(pos.y * 0.6 + uTime * 0.9) * 0.5;      // More amplitude
        float wave3 = sin((pos.x + pos.y) * 0.4 + uTime * 1.5) * 0.45;  // Chaotic diagonal waves
        float wave4 = sin(pos.x * 1.2 - pos.y * 0.8 + uTime * 1.8) * 0.35;  // Counter waves
        float wave5 = sin((pos.x * pos.y) * 0.05 + uTime * 0.7) * 0.3;  // Turbulence

        // Add choppy detail
        float chop = sin(pos.x * 3.0 + uTime * 2.0) * 0.15;
        chop += sin(pos.y * 3.5 + uTime * 2.5) * 0.12;

        pos.z = wave1 + wave2 + wave3 + wave4 + wave5 + chop;
        vElevation = pos.z;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColorShallow;
      uniform vec3 uColorDeep;
      uniform vec3 uColorFoam;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        // Mix colors based on elevation - peaks get foam
        float mixStrength = (vElevation + 1.0) * 0.5;
        vec3 color = mix(uColorDeep, uColorShallow, mixStrength);

        // Add white foam to wave crests
        if (vElevation > 0.8) {
          float foamStrength = (vElevation - 0.8) / 0.8;
          color = mix(color, uColorFoam, foamStrength * 0.7);
        }

        // Add turbulent shimmer
        float shimmer = sin(vUv.x * 40.0 + vUv.y * 30.0) * 0.04;
        color += shimmer;

        gl_FragColor = vec4(color, 0.98);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });

  const water = new THREE.Mesh(geometry, material);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0;

  return water;
}
