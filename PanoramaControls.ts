import {
  EventDispatcher,
  MathUtils,
  Vector2,
  Vector3,
  type PerspectiveCamera,
} from "three";

const up = new Vector3(0, 1, 0);

class PanoramaControls extends EventDispatcher {
  private camera: PerspectiveCamera;
  private domElement: HTMLElement;

  private moveStart: Vector2 | undefined;

  private target: Vector3 = new Vector3(1, 0, 0);

  public autoRotationSpeed = 0.03;
  public minFov = 20;
  public maxFov = 90;

  public rotationFactor = 0.0012;
  public zoomFactor = 0.02;

  constructor(object: PerspectiveCamera, domElement: HTMLElement) {
    super();
    this.camera = object;
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

  onMouseStart(ev: MouseEvent): any {
    this.moveStart = new Vector2(ev.clientX, ev.clientY);
  }

  onTouchStart(ev: TouchEvent): any {
    if (ev.touches.length) {
      const touch = ev.touches[0];
      this.moveStart = new Vector2(touch.clientX, touch.clientY);
    }
  }

  onEnd(ev: Event): any {
    this.moveStart = undefined;
  }

  onMouseMove(ev: MouseEvent): any {
    if (this.moveStart) {
      this.onMove(ev.clientX, ev.clientY);
    }
  }

  onTouchMove(ev: TouchEvent): any {
    if (this.moveStart) {
      if (ev.touches.length) {
        const touch = ev.touches[0];
        this.onMove(touch.clientX, touch.clientY);
      }
    }
  }

  onMove(x: number, y: number): any {
    if (this.moveStart) {
      let dx = x - this.moveStart.x;
      let dy = y - this.moveStart.y;
      this.target.applyAxisAngle(up, dx * this.rotationFactor);
      this.target.applyAxisAngle(
        this.target.clone().applyAxisAngle(up, Math.PI / 2),
        -dy * this.rotationFactor
      );
      this.moveStart = new Vector2(x, y);
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

  update(delta: number) {
    if (!this.moveStart && this.autoRotationSpeed !== 0) {
      this.target.applyAxisAngle(up, delta * -this.autoRotationSpeed);
    }
    this.camera.lookAt(this.target);
  }
}

export { PanoramaControls };
