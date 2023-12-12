const BABYLON = window['BABYLON']
console.log(BABYLON)

class BabylonController {
  canvas: HTMLCanvasElement
  engine: any
  scene: any

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(this.canvas)
    this.scene = new BABYLON.Scene(this.engine)
  }

  setUp() {

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 6, Math.PI / 2.5, 6, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(this.canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.9;

    // Append glTF model to scene.
    BABYLON.SceneLoader.Append("/assets/3D/", "morse.glb", this.scene, (scene) => {
      // Create a default arc rotate camera and light.
      // scene.createDefaultCameraOrLight(true, true, true);

      // The default camera looks at the back of the asset.
      // Rotate the camera by 180 degrees to the front of the asset.
      // scene.activeCamera.alpha += Math.PI;
    });

    // Our built-in 'ground' shape.
    // const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, this.scene);



  }

  start() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }


}