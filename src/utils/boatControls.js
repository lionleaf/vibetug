import * as THREE from 'three';

export class BoatControls {
  constructor(boat) {
    this.boat = boat;

    // Boat physics properties
    this.speed = 0;
    this.maxSpeed = 0.15;
    this.acceleration = 0.002;
    this.deceleration = 0.001;
    this.turnSpeed = 0.02;
    this.currentTurn = 0;
    this.maxTurnSpeed = 0.03;

    // Wave motion
    this.waveTime = 0;

    // Input state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      payOut: false,
      haulIn: false
    };

    // Setup keyboard listeners
    this.setupKeyboardControls();
  }

  setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.forward = true;
          break;
        case 's':
        case 'arrowdown':
          this.keys.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = true;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = true;
          break;
        case 'r':
          this.keys.payOut = true;
          break;
        case 'f':
          this.keys.haulIn = true;
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.forward = false;
          break;
        case 's':
        case 'arrowdown':
          this.keys.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = false;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = false;
          break;
        case 'r':
          this.keys.payOut = false;
          break;
        case 'f':
          this.keys.haulIn = false;
          break;
      }
    });
  }

  update(deltaTime) {
    // Acceleration/Deceleration
    if (this.keys.forward) {
      this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    } else if (this.keys.backward) {
      this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed * 0.5);
    } else {
      // Natural deceleration
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.deceleration);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.deceleration);
      }
    }

    // Turning - simplified to only turn when pressing W (forward)
    if (this.keys.forward && this.speed > 0.001) {
      if (this.keys.left) {
        // Turn left while moving forward
        this.boat.rotation.y += this.turnSpeed * 2; // Increased turn speed for easier control
      } else if (this.keys.right) {
        // Turn right while moving forward
        this.boat.rotation.y -= this.turnSpeed * 2; // Increased turn speed for easier control
      }
    }

    // Move boat forward in the direction it's facing
    // Boat's front is at negative Z, so we need to move in -Z when going "forward"
    const moveX = -Math.sin(this.boat.rotation.y) * this.speed;
    const moveZ = -Math.cos(this.boat.rotation.y) * this.speed;

    this.boat.position.x += moveX;
    this.boat.position.z += moveZ;

    // Wave motion for realism (bob and rock based on movement)
    this.waveTime += deltaTime;
    const waveIntensity = Math.abs(this.speed) / this.maxSpeed;

    // Base wave motion
    const baseWave = Math.sin(this.waveTime * 1.2) * 0.4 + Math.sin(this.waveTime * 2.1) * 0.2;

    // Additional pitching when moving
    const pitchMotion = Math.cos(this.waveTime * 1.3) * 0.12 * waveIntensity +
                       Math.sin(this.waveTime * 1.9) * 0.06;

    // Roll based on turning
    const rollMotion = this.currentTurn * 3; // Lean into turns

    this.boat.position.y = 0.5 + baseWave;
    this.boat.rotation.x = pitchMotion + this.speed * 0.3; // Nose dips when accelerating
    this.boat.rotation.z = rollMotion + Math.sin(this.waveTime * 1.5) * 0.08;
  }

  getSpeed() {
    return this.speed;
  }

  isPayingOut() {
    return this.keys.payOut;
  }

  isHaulingIn() {
    return this.keys.haulIn;
  }
}
