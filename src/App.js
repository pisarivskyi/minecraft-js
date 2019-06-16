import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import ResourceLoader from './ResourceLoader';
import Level from './Level';

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
    this.resourceLoader = new ResourceLoader();

    this.clock = new THREE.Clock();
    this.deltaTime = 0;

    // define scene object
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x31a8f7, 100, 200);

    // setup camera
    const aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 10000000);
    this.camera.position.z = 10;
    this.scene.add(this.camera);

    // set up lightning
    const light = new THREE.HemisphereLight(0xeeeeee, 0x888888, 0.5);
    light.position.set(0, 20, 0);
    this.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 20, 0);
    this.scene.add(directionalLight);

    // set up renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(0x31a8f7));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild(this.renderer.domElement);

    // setup controls
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

  loadLevel() {
    this.resourceLoader.load({
      textures: {
        dirtTexture: require('../assets/textures/grass_side.png'),
        dirtTop: require('../assets/textures/grass_top.png'),
      },
    })
      .then((resources) => {
        const level = new Level('my first seed', resources);
        const objects = level.generate();
        this.scene.add(objects);
      })
      .catch(err => console.log(err));
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
