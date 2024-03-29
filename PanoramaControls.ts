import {
  EventDispatcher,
  MathUtils,
  Vector2,
  type PerspectiveCamera,
} from "three";

class PanoramaControls extends EventDispatcher {
  private camera: PerspectiveCamera;
  private domElement: HTMLElement;

  private preFrameMouse: Vector2 | undefined;
  private currentMouse = new Vector2();
  private down = false;
  private rotationFactor = 0.66;

  public autoRotationSpeed = 0.05;
  public minFov = 20;
  public maxFov = 90;
  public zoomFactor = 0.1;

  constructor(camera: PerspectiveCamera, domElement: HTMLElement) {
    super();
    this.camera = camera;
    this.domElement = domElement;
    this.domElement.style.touchAction = "none"; // disable touch scroll

    domElement.addEventListener(
      "mousedown",
      this.onMouseStart.bind(this),
      false
    );
    domElement.addEventListener(
      "touchstart",
      this.onTouchStart.bind(this),
      false
    );

    const end = this.onEnd.bind(this);
    domElement.addEventListener("mouseup", end, false);
    domElement.addEventListener("mouseleave", end, false);
    domElement.addEventListener("touchend", end, false);

    domElement.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
    domElement.addEventListener(
      "touchmove",
      this.onTouchMove.bind(this),
      false
    );

    domElement.addEventListener("wheel", this.onMouseWheel.bind(this), false);
  }

  onMouseStart(ev: MouseEvent) {
    this.onStart(ev.clientX, ev.clientY);
  }

  onTouchStart(ev: TouchEvent) {
    if (ev.touches.length) {
      const touch = ev.touches[0];
      this.onStart(touch.clientX, touch.clientY);
    }
  }

  onMouseMove(ev: MouseEvent) {
    this.onMove(ev.clientX, ev.clientY);
  }

  onTouchMove(ev: TouchEvent) {
    if (ev.touches.length) {
      const touch = ev.touches[0];
      this.onMove(touch.clientX, touch.clientY);
    }
  }

  onMouseWheel(ev: WheelEvent): any {
    ev.preventDefault();
    this.camera.fov = MathUtils.clamp(
      this.camera.fov + ev.deltaY * this.zoomFactor,
      this.minFov,
      this.maxFov
    );
    this.camera.updateProjectionMatrix();
  }

  onEnd(): any {
    this.down = false;
    this.preFrameMouse = undefined;
  }

  onStart(x: number, y: number) {
    this.down = true;
    this.currentMouse.set(x, y);
  }

  onMove(x: number, y: number) {
    this.currentMouse.set(x, y);
  }

  update(delta: number) {
    if (this.down) {
      if (this.preFrameMouse) {
        const diff = this.currentMouse.clone().sub(this.preFrameMouse);
        if (diff.x !== 0 || diff.y !== 0) {
          const max = Math.max(window.innerWidth, window.innerHeight);
          const x = (diff.x / max) * 2;
          const y = (diff.y / max) * 2;
          const fovFactor = this.camera.fov / 50;
          this.camera.rotateOnWorldAxis(
            this.camera.up,
            x * fovFactor * this.rotationFactor
          );
          this.camera.rotateX(y * fovFactor * this.rotationFactor);
        }
      }
      this.preFrameMouse = this.currentMouse.clone();
    } else if (this.autoRotationSpeed !== 0) {
      this.camera.rotateOnWorldAxis(
        this.camera.up,
        -this.autoRotationSpeed * delta
      );
    }
  }
}

export { PanoramaControls };
