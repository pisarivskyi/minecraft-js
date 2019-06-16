import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import Cube from './Cube';

/**
 * Main app class
 */
export default class App {
  constructor() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.container = document.querySelector('#canvas-container');
  }

  /**
   * Init scene
   */
  init() {
    this.clock = new THREE.Clock();
    this.deltaTime = 0;
    const aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 10000000);
    this.camera.position.z = 10;

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);

    const light = new THREE.HemisphereLight(0xeeeeee, 0x888888, 0.5);
    light.position.set(0, 20, 0);
    this.scene.add(light);

    const cube = new Cube({
      material: new THREE.MeshBasicMaterial({
        color: 0xff0000,
      }),
    });
    this.scene.add(cube);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(0xFFFFFF));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.render();
  }

  /**
   * Render level
   */
  render() {
    window.requestAnimationFrame(this.render.bind(this));
    this.deltaTime = this.clock.getDelta();

    this.animate(this.deltaTime);

    this.controls.update(this.deltaTime);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Animate objects, update their positions, etc.
   *
   * @param {number} deltaTime - seconds passed since last draw call
   */
  animate(deltaTime) {

  }

  /**
   * Window resize handler
   */
  onWindowResize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Mouse movement handler
   *
   * @private
   * @param {MouseEvent} e - mouse event
   */
  onDocumentMouseMove(e) {
    this.mouseX = (e.clientX - this.windowHalfX) / 2;
    this.mouseY = (e.clientY - this.windowHalfY) / 2;
  }
}
