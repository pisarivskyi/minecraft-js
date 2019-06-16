import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import Cube from './Cube';

export default class Level {
  constructor(seed, resources) {
    this.simplex = new SimplexNoise(seed);
    this.resources = resources;
    this.scale = 100;
  }

  normalize(val, max, min) {
    return (val - (-1)) * (max - min) / (1 - (-1)) + min;
  }

  generate() {
    const objects = new THREE.Object3D();

    for (let x = 0; x < 10; x += 1) {
      for (let z = 0; z < 10; z += 1) {
        const y = Math.round(this.normalize(this.simplex.noise2D(x / this.scale, z / this.scale), -10, 10));

        const cube = new Cube({
          material: new THREE.MeshStandardMaterial({
            map: this.resources.textures.dirtTexture,
          }),
          position: new THREE.Vector3(x, y, z),
        });
        objects.add(cube);
      }
    }

    const cube = new Cube({
      material: new THREE.MeshStandardMaterial({
        map: this.resources.textures.dirtTexture,
      }),
      position: new THREE.Vector3(5, 3, 3),
    });
    objects.add(cube);

    return objects;
  }
}
