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
      isConnectedToTheRight: false,
      isConnectedToTheLeft: false,
      isConnectedToTheFront: false,
      isConnectedToTheBack: false,
      isConnectedToTheTop: false,
      isConnectedToTheBottom: true,

      isEdgeConnectedBack: false,

      ...options,
    };

    this.geometry = new THREE.BoxGeometry(
      this.defaults.width,
      this.defaults.height,
      this.defaults.depth,
    );
    // 0, 1 - right
    // 2, 3 - left
    // 4, 5 - top
    // 6, 7 - bottom
    // 8, 9 - front
    // 10, 11 - back
    const filtredFaces = [];
    for (let i = 0; i < this.geometry.faces.length; i += 1) {
      const face = this.geometry.faces[i];
      face.materialIndex = 0;
      if ((i === 0 || i === 1) && !this.defaults.isConnectedToTheRight
        && !this.defaults.isEdgeConnectedRight) {
        filtredFaces.push(face);
      } else if ((i === 2 || i === 3) && !this.defaults.isConnectedToTheLeft
        && !this.defaults.isEdgeConnectedLeft) {
        filtredFaces.push(face);
      } else if ((i === 8 || i === 9) && !this.defaults.isConnectedToTheFront
        && !this.defaults.isEdgeConnectedFront) {
        filtredFaces.push(face);
      } else if ((i === 10 || i === 11) && !this.defaults.isConnectedToTheBack
        && !this.defaults.isEdgeConnectedBack) {
        filtredFaces.push(face);
      } else if ((i === 4 || i === 5) && !this.defaults.isConnectedToTheTop) {
        if (this.defaults.topMaterial) {
          face.materialIndex = 1;
        }
        filtredFaces.push(face);
      } else if ((i === 6 || i === 7) && !this.defaults.isConnectedToTheBottom) {
        filtredFaces.push(face);
      }
    }
    this.geometry.faces = filtredFaces;

    const { material, topMaterial } = this.defaults;
    this.material = [material, topMaterial];

    this.position.set(
      this.defaults.position.x,
      this.defaults.position.y,
      this.defaults.position.z,
    );
    this.name = `cube_${uid}`;
    uid += 1;
  }
}
