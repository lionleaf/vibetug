import * as THREE from 'three';

export class TowRope {
  constructor(boat, barge) {
    this.boat = boat;
    this.barge = barge;

    // Create rope visual using a tube
    const numSegments = 20;
    this.segments = numSegments;

    // Create line geometry
    const points = [];
    for (let i = 0; i <= numSegments; i++) {
      points.push(new THREE.Vector3(0, 0, i));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeometry = new THREE.TubeGeometry(curve, numSegments, 0.05, 8, false);

    const ropeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3a2a,
      roughness: 0.95
    });

    this.rope = new THREE.Mesh(tubeGeometry, ropeMaterial);
    this.curve = curve;
  }

  update() {
    // Calculate positions
    const boatBackPosition = new THREE.Vector3();
    const bargeBackPosition = new THREE.Vector3();

    // Get boat's back position (stern)
    boatBackPosition.copy(this.boat.position);
    const boatBack = new THREE.Vector3(0, 0, 2.5); // Offset to back of boat
    boatBack.applyEuler(new THREE.Euler(0, this.boat.rotation.y, 0));
    boatBackPosition.add(boatBack);
    boatBackPosition.y += 0.8; // Height of tow point

    // Get barge's front position
    bargeBackPosition.copy(this.barge.position);
    const bargeFront = new THREE.Vector3(0, 0, -3.2); // Offset to front of barge
    bargeFront.applyEuler(new THREE.Euler(0, this.barge.rotation.y, 0));
    bargeBackPosition.add(bargeFront);
    bargeBackPosition.y += 0.6; // Height of hook

    // Create catenary curve (rope sag)
    const distance = boatBackPosition.distanceTo(bargeBackPosition);
    const midPoint = new THREE.Vector3().lerpVectors(boatBackPosition, bargeBackPosition, 0.5);

    // Add sag based on distance
    const sag = Math.min(distance * 0.15, 1.5);
    midPoint.y -= sag;

    // Update curve points
    const points = [];
    for (let i = 0; i <= this.segments; i++) {
      const t = i / this.segments;

      // Quadratic bezier curve for catenary effect
      const point = new THREE.Vector3();
      point.lerpVectors(boatBackPosition, midPoint, t * 2);

      if (t > 0.5) {
        const t2 = (t - 0.5) * 2;
        point.lerpVectors(midPoint, bargeBackPosition, t2);
      }

      points.push(point);
    }

    // Update the rope geometry
    this.curve.points = points;
    const newGeometry = new THREE.TubeGeometry(this.curve, this.segments, 0.05, 8, false);

    this.rope.geometry.dispose();
    this.rope.geometry = newGeometry;
  }

  getRope() {
    return this.rope;
  }
}
