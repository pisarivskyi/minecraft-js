import * as THREE from 'three';

let uid = 0;

/**
 * Base Cube object class
 */
export default class Cube extends THREE.Mesh {
  constructor(options) {
    super();

    this.defaults = {
      width: 1,
      height: 1,
      depth: 1,
      position: new THREE.Vector3(0, 0, 0),
      material: new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      }),

      ...options,
    };

    this.geometry = new THREE.BoxGeometry(
      this.defaults.width,
      this.defaults.height,
      this.defaults.depth,
    );

    const { material } = this.defaults;
    this.material = material;

    this.position.set(
      this.defaults.position.x,
      this.defaults.position.y,
      this.defaults.position.z,
    );
    this.name = `cube_${uid}`;
    uid += 1;
  }
}
