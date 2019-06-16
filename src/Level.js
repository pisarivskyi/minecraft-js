import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import Cube from './Cube';

export default class Level {
  constructor(seed, resources) {
    this.simplex = new SimplexNoise(seed);
    this.resources = resources;
    this.scale = 100;
    this.gridSize = 30;
    this.geometryOptimization = true;
  }

  normalize(val, max, min) {
    return (val - (-1)) * (max - min) / (1 - (-1)) + min;
  }

  generate() {
    const objects = new THREE.Object3D();

    for (let x = 0; x < this.gridSize; x += 1) {
      for (let z = 0; z < this.gridSize; z += 1) {
        const y = Math.round(this.normalize(this.simplex.noise2D(x / this.scale, z / this.scale), -10, 10));

        let otherOptions = {};

        if (this.geometryOptimization) {
          const isConnectedToTheRight = y === Math.round(
            this.normalize(
              this.simplex.noise2D((x + 1) / this.scale, z / this.scale), -10, 10,
            ),
          );

          const isConnectedToTheLeft = y === Math.round(
            this.normalize(
              this.simplex.noise2D((x - 1) / this.scale, z / this.scale), -10, 10,
            ),
          );

          const isConnectedToTheFront = y === Math.round(
            this.normalize(
              this.simplex.noise2D(x / this.scale, (z + 1) / this.scale), -10, 10,
            ),
          );

          const isConnectedToTheBack = y === Math.round(
            this.normalize(
              this.simplex.noise2D(x / this.scale, (z - 1) / this.scale), -10, 10,
            ),
          );

          // edge connected
          const isEdgeConnectedRight = y + 1 === Math.round(
            this.normalize(
              this.simplex.noise2D((x + 1) / this.scale, z / this.scale), -10, 10,
            ),
          );

          const isEdgeConnectedLeft = y + 1 === Math.round(
            this.normalize(
              this.simplex.noise2D((x - 1) / this.scale, z / this.scale), -10, 10,
            ),
          );

          const isEdgeConnectedFront = y + 1 === Math.round(
            this.normalize(
              this.simplex.noise2D(x / this.scale, (z + 1) / this.scale), -10, 10,
            ),
          );

          const isEdgeConnectedBack = y + 1 === Math.round(
            this.normalize(
              this.simplex.noise2D(x / this.scale, (z - 1) / this.scale), -10, 10,
            ),
          );

          otherOptions = {
            isConnectedToTheRight,
            isConnectedToTheLeft,
            isConnectedToTheFront,
            isConnectedToTheBack,

            isEdgeConnectedRight,
            isEdgeConnectedLeft,
            isEdgeConnectedFront,
            isEdgeConnectedBack,
          };
        }
        const cube = new Cube({
          material: new THREE.MeshStandardMaterial({
            map: this.resources.textures.dirtTexture,
            side: THREE.FrontSide,
            // wireframe: true,
          }),
          topMaterial: new THREE.MeshStandardMaterial({
            map: this.resources.textures.dirtTop,
            side: THREE.FrontSide,
          }),
          position: new THREE.Vector3(x, y, z),
          ...otherOptions,
        });
        objects.add(cube);
      }
    }

    const cube = new Cube({
      material: new THREE.MeshStandardMaterial({
        map: this.resources.textures.dirtTexture,
      }),
      position: new THREE.Vector3(3, 3, 3),
    });
    objects.add(cube);

    return objects;
  }
}
