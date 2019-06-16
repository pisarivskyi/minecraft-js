import * as THREE from 'three';

const PI_2 = Math.PI / 2;

/**
 * First person controls class
 */
export default class Controls {
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;

    this.viewHalfX = this.canvas.offsetWidth / 2;
    this.viewHalfY = this.canvas.offsetHeight / 2;

    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');

    this.forward = 0;
    this.left = 0;
    this.motionSpeed = 5;

    this.canvas.onclick = () => {
      this.canvas.requestPointerLock();
    };
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onKeyUp.bind(this), false);
  }

  mouseMove(event) {
    this.movementX = event.movementX;
    this.movementY = event.movementY;
    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= this.movementX * this.deltaTime * 0.05;
    this.euler.x -= this.movementY * this.deltaTime * 0.05;

    this.euler.x = Math.max(-PI_2, Math.min(PI_2, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  }

  onKeyDown(event) {
    console.log(event);
    if (event.key === 'w') {
      this.forward = -1;
    }

    if (event.key === 's') {
      this.forward = 1;
    }

    if (event.key === 'a') {
      this.left = -1;
    }


    if (event.key === 'd') {
      this.left = 1;
    }
  }

  onKeyUp(event) {
    console.log(event);
    if (event.key === 'w' || event.key === 's') {
      this.forward = 0;
    }

    if (event.key === 'a' || event.key === 'd') {
      this.left = 0;
    }
  }

  update(deltaTime) {
    this.deltaTime = deltaTime;
    const v = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z,
      );

    // v.applyQuaternion(this.camera.quaternion);
    this.camera.position.set(
      v.x + this.left * deltaTime * this.motionSpeed,
      v.y,
      v.z + this.forward * deltaTime * this.motionSpeed,
    );
  }
}
