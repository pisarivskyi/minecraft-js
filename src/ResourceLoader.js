import * as THREE from 'three';

/**
 * Resource loader class
 * It loads all neccesary resources
 */
export default class ResourceLoader {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
  }

  /**
   * Loads resources
   *
   * @async
   * @param {object} resources - resources
   * @param {object} resources.textures - textures resources
   * @returns {Promise<object>}
   */
  load(resources) {
    const promises = [];

    promises.push(this.loadTextures(resources.textures));

    return Promise.all(promises)
      .then((loadedResources) => {
        const textures = loadedResources[0];

        return {
          textures,
        };
      });
  }

  /**
   * Load textures
   *
   * @async
   * @param {object} textures - object that contains texture urls
   * @returns {Promise<object>}
   */
  loadTextures(textures) {
    const keys = Object.keys(textures);
    const promises = [];

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const textureUrl = textures[key];
      promises.push(this.loadTexture(textureUrl));
    }

    return Promise.all(promises)
      .then((result) => {
        const resultObj = {};

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          resultObj[key] = result[i];
        }

        return resultObj;
      });
  }

  /**
   * Load texture file
   *
   * @param {string} textureUrl - texture url
   */
  loadTexture(textureUrl) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();

      return loader.load(textureUrl, texture => resolve(texture), null, err => reject(err));
    });
  }
}
