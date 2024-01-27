var BABYLON = window['BABYLON'];
var GSAP = window["gsap"];
var assetPath = document.location.href == "https://faber-smythe.github.io/morsing/" ? "https://raw.githubusercontent.com/Faber-smythe/morsing/master" : "";
// const assetPath = "https://raw.githubusercontent.com/Faber-smythe/morsing/master"
// const assetPath = "https://media.githubusercontent.com/media/Faber-smythe/morsing/master"
// const assetPath = "https://github.com/Faber-smythe/morsing/raw/master"
console.log(assetPath);
var BabylonController = /** @class */ (function () {
    function BabylonController(canvas) {
        this.cameraInitialAlpha = Math.PI / 12;
        this.cameraInitialBeta = Math.PI / 2.5;
        this.cameraInitialRadius = .55;
        this.postLights = [];
        this.scrollBounce = 0;
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(this.canvas);
        this.scene = new BABYLON.Scene(this.engine);
    }
    BabylonController.prototype.setUp = function () {
        var _this = this;
        this.setUpCamera();
        this.skydome = new BABYLON.PhotoDome("skymap", assetPath + "/assets/3Dscene/skybox.jpg", {
            resolution: 32,
            size: 1000
        }, this.scene);
        this.skydome.rotation.y = -Math.PI / 2;
        // GROUND
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, this.scene); //scene is optional and defaults to the current scene
        this.ground.position.y = -1;
        this.ground.receiveShadows = true;
        this.ground.material = new BABYLON.StandardMaterial("groundmaterial", this.scene);
        this.ground.material.specularColor = BABYLON.Color3.Black();
        var groundText = new BABYLON.Texture(assetPath + "/assets/3Dscene/grass.jpg", this.scene);
        groundText.uScale = groundText.vScale = 5;
        this.ground.material.diffuseTexture = groundText;
        // Append glTF model to scene.
        console.log("plop0");
        BABYLON.SceneLoader.ImportMesh("", assetPath + "/assets/3Dscene/", "morsing.glb", this.scene, function (meshes) {
            _this.camera.setTarget(meshes.find(function (mesh) { return mesh.name == "kob-group"; }));
            _this.camera.alpha = _this.cameraInitialAlpha;
            _this.camera.beta = _this.cameraInitialBeta;
            console.log("plop1");
            meshes.forEach(function (mesh) {
                switch (mesh.name) {
                    case "window":
                    case "windowhandle  ":
                        mesh.material = new BABYLON.StandardMaterial(mesh.name + "_mat", _this.scene);
                        mesh.material.diffuseTexture = new BABYLON.Texture(assetPath + "/assets/3Dscene/peinture-fenetre.jpg", _this.scene);
                        break;
                    case "wall-group":
                        mesh.material = new BABYLON.StandardMaterial(mesh.name + "_mat", _this.scene);
                        var wallText = new BABYLON.Texture(assetPath + "/assets/3Dscene/wallpaper2.jpg", _this.scene);
                        wallText.wAng = Math.PI;
                        wallText.uScale = 2.5;
                        wallText.vScale = 2.5;
                        wallText.uAng = BabylonController.degToRad(20);
                        wallText.vAng = BabylonController.degToRad(20);
                        mesh.material.diffuseTexture = wallText;
                        mesh.material.specularColor = BABYLON.Color3.Black();
                        break;
                    case "windowframe":
                        mesh.material = new BABYLON.StandardMaterial(mesh.name + "_mat", _this.scene);
                        mesh.material.diffuseTexture = new BABYLON.Texture(assetPath + "/assets/3Dscene/windowframe.jpg", _this.scene);
                        mesh.material.specularColor = BABYLON.Color3.Black();
                    default:
                        break;
                }
                if (mesh.name.includes("LineHolder")) {
                    try {
                        _this.postLights.push(mesh);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            });
            console.log("plop2");
            _this.setUpLightsAndEffect();
            console.log(_this.engine);
            console.log(_this.scene);
            GSAP.to(_this.camera, { radius: _this.cameraInitialRadius, duration: 1 });
            console.log("plop3");
        });
        var pipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", // The name of the pipeline
        true, // Do you want the pipeline to use HDR texture?
        this.scene, // The scene instance
        [this.camera] // The list of cameras to be attached to
        );
        pipeline.samples = 15;
        pipeline.fxaaEnabled = true;
    };
    BabylonController.prototype.setUpCamera = function () {
        // This creates and positions a free camera (non-mesh)
        this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, this.cameraInitialRadius, new BABYLON.Vector3(0, .1, 0));
        this.camera.attachControl(this.canvas, true);
        this.camera.minZ = .10;
        this.camera.lowerRadiusLimit = .3;
        this.camera.upperRadiusLimit = .95;
        this.camera.upperBetaLimit = 1.52;
        this.camera.lowerAlphaLimit = this.cameraInitialAlpha - (Math.PI / 9);
        this.camera.upperAlphaLimit = this.cameraInitialAlpha + (Math.PI / 9);
        this.camera.wheelDeltaPercentage = 0.01;
        this.camera.wheelDeltaPercentage = 0.005;
        this.camera.inertia = .98;
        if ("ontouchstart" in document.documentElement) {
            document.write("Mouse sway is disabled for touch screen device ");
        }
        else {
            // this.canvas.addEventListener("mousemove", (e) => {
            //   const widthTravelRatio = (e.x - window.innerWidth / 2) / (window.innerWidth / 2)
            //   const heighTravelRatio = (e.y - window.innerHeight / 2) / (window.innerHeight / 2)
            //   GSAP.to(this.camera, { alpha: this.cameraInitialAlpha + (Math.PI / 9) * widthTravelRatio, beta: this.cameraInitialBeta + (Math.PI / 7.5) * heighTravelRatio, duration: 1 });
            // })
            // let zoomResetTimeout;
            // this.canvas.addEventListener("wheel", (e) => {
            //   if (zoomResetTimeout) clearTimeout(zoomResetTimeout)
            //   zoomResetTimeout = setTimeout(() => {
            //     GSAP.to(this.camera, { radius: this.cameraInitialRadius, duration: 1 })
            //   }, 1000)
            // })
        }
    };
    BabylonController.prototype.setUpLightsAndEffect = function () {
        var _this = this;
        // Lights
        this.roomLight = new BABYLON.PointLight("roomLight", new BABYLON.Vector3(1.18, .64, -0.56), this.scene);
        this.roomLight.intensity = 0;
        this.roomLight.diffuse = new BABYLON.Color3(241 / 255, 1, 1);
        console.log(this.roomLight.excludedMeshes);
        // this.roomLight.excludedMeshes.push(this.scene.getMeshByName("skymap_mesh"));
        this.candleLight = new BABYLON.PointLight("candleLight", new BABYLON.Vector3(0, 0, 0), this.scene);
        this.candleLight.diffuse = new BABYLON.Color3(1, 191 / 255, 93 / 255);
        this.candleLight.position = new BABYLON.Vector3(.31, .35, .56);
        this.candleLight.intensity = 1.5;
        var flickerEase = "rough({template: none.out,strength: 1, points: 10, taper: none, randomize: true, clamp: false})";
        var flickerTimeline = GSAP.timeline({ repeat: -1 });
        flickerTimeline.to(this.candleLight, { intensity: 1.2, duration: 1, ease: flickerEase });
        flickerTimeline.to(this.candleLight, { intensity: 1.4, duration: 1, ease: flickerEase });
        flickerTimeline.to(this.candleLight, { intensity: 1.3, duration: 1, ease: flickerEase });
        flickerTimeline.to(this.candleLight, { intensity: 1.5, duration: 1, ease: flickerEase });
        this.worldLight = new BABYLON.HemisphericLight("worldLight", new BABYLON.Vector3(-6, 5, 0), this.scene);
        this.worldLight.intensity = .4;
        // this.worldLight.excludedMeshes.push(this.scene.getMeshByName("skymap_mesh"));
        var sunlight = new BABYLON.PointLight('sunlight', new BABYLON.Vector3(-125.3, 9, -21.35), this.scene);
        sunlight.intensity = 1;
        // sunlight.excludedMeshs.push(this.scene.getMeshByName("skymap_mesh"));
        // Shadows
        var roomlightShadowGenerator = new BABYLON.ShadowGenerator(1024, this.roomLight);
        roomlightShadowGenerator.addShadowCaster(this.scene.getMeshByName('desk'), true);
        var worldlightShadowGenerator = new BABYLON.ShadowGenerator(1024, sunlight);
        this.scene.meshes.filter(function (mesh) { return mesh.name.includes("post."); }).forEach(function (postMesh) {
            worldlightShadowGenerator.addShadowCaster(postMesh, true);
        });
        /**
         * POSTLIGHTS EFFECTS
         */
        // glow
        this.postlightGlowLayer = new BABYLON.GlowLayer("glow", this.scene);
        this.postlightGlowLayer.intensity = .8;
        this.postLights.forEach(function (lightMesh) {
            _this.postlightGlowLayer.addIncludedOnlyMesh(lightMesh);
        });
        this.postlightGlowLayer.isEnabled = false;
        var lineHolder = this.scene.meshes.find(function (mesh) { return mesh.name == "LineHolder.006"; });
        console.log(lineHolder.position);
        console.log(lineHolder.getAbsolutePosition());
        // // sparks
        // BABYLON.ParticleHelper.ParseFromSnippetAsync("NZKTPH#4", this.scene).then((system) => {
        //   system.particleTexture = new BABYLON.Texture("https://www.babylonjs.com/assets/Flare.png", this.scene)
        //   this.sparkEmitter = system
        //   this.sparkEmitter.worldOffset = lineHolder.getAbsolutePosition()
        //   this.sparkEmitter.uScale = this.sparkEmitter.vScale = .1
        //   this.sparkEmitter.stop()
        // })
        // // smoke
        // BABYLON.ParticleHelper.ParseFromSnippetAsync("27BEGD#1", this.scene).then((system) => {
        //   system.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/particles/textures/smoke/Smoke_SpriteSheet_8x8.png", this.scene)
        //   this.smokeEmitter = system
        // })
    };
    BabylonController.prototype.start = function () {
        var _this = this;
        // this.scene.debugLayer.show();
        this.engine.runRenderLoop(function () {
            _this.scene.render();
        });
        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
    };
    BabylonController.prototype.switchOffPostLights = function () {
        this.postlightGlowLayer.isEnabled = false;
        this.postLights.forEach(function (mesh) {
            mesh.material.emissiveColor = BABYLON.Color3.Black();
        });
    };
    BabylonController.prototype.switchOnPostLights = function () {
        this.postlightGlowLayer.isEnabled = true;
        this.postLights.forEach(function (mesh) {
            mesh.material.emissiveColor = new BABYLON.Color3(.7, 0, 0);
        });
    };
    BabylonController.prototype.triggerPostlightSpark = function () {
    };
    BabylonController.prototype.triggerPostlightSmoke = function () {
    };
    BabylonController.radToDeg = function (angle) {
        return angle * (180 / Math.PI);
    };
    BabylonController.degToRad = function (angle) {
        return angle / (180 / Math.PI);
    };
    return BabylonController;
}());
