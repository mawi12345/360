# 360° Panorama viewer

360° Panorama viewer build on top of [three.js](https://github.com/mrdoob/three.js/).

This Panorama Viewer is intentionally kept very minimal. Minimal in the sense of complexity and not file size. The three.js build has about 470K but the size of the JavaScript bundle can be neglected as good quality Panormas are about 40M in size. Cubemap Panormas are preferable because the scene is much simpler and the images can be loaded in parallel. Furthermore, the files can be edited more easily and have no distortions at the poles. Spherical panoramas can easily be converted to cubemaps with [jaxry panorama to cubemap](https://jaxry.github.io/panorama-to-cubemap/) converter. If you do not want to convert spherical panoramas, they can also be used directly (URL parameter type=sphere) but cubemaps are preferable.


This repo consists of two very straightforward files:

* [main.ts](main.ts) Configure three.js handle URL parameters and build the scene.
* [PanoramaControls.ts](PanoramaControls.ts) Rotate camera via mouse or touch events.

Features:

* Cubemap panoramas ([example](dist/img/example/nx.jpg))
* Spherical panoramas ([example](dist/img/example.jpg))
* Configuration via URL params
  * `scene` image source (default: `example`)
  * `type` cube or sphere (default: `cube`)
  * `speed` set the auto ration speed (default: `3`, `0` to disable)

## Building

Run `yarn build` and copy your panoramas to `dist/img`.

## Acknowledgments

* [norikdavtian](https://norikdavtian.github.io/ThreeJS-360-Panorama/) ThreeJS-360-Panorama
* [airmode](https://www.airmode.at/) example panorama
* [jaxry](https://jaxry.github.io/panorama-to-cubemap/) panorama to cubemap converter
