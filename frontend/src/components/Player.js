import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Config from "./Config";
import { Vector3, Raycaster, Ray, AnimationMixer } from "three";
export default class Player {
  constructor() {
    this.loader = new GLTFLoader();
    this.raycaster = new Raycaster();
    this.canMove = true;
  }

  updateData() {
    const { x, y, z } = this.object.position;
    const data = { x: x, y: y, z: z, lookAt: this.lookPos, animation: this.animName };
    socket.emit("changePlayerData", data);
  }

  moving(camera) {
    if (this.object) {
      const camVect = new Vector3(0, 4, 1);
      this.camPos = camVect.applyMatrix4(this.object.matrixWorld);
      camera.position.x = this.camPos.x;
      camera.position.y = this.camPos.y;
      camera.position.z = this.camPos.z;

      // POINT WHERE CAM LOOKS ALWAYS BY Z-AXIS
      const lookVect = new Vector3(0, this.camPos.y, -200);
      this.lookPos = lookVect.applyMatrix4(camera.matrixWorld);
      this.object.lookAt(this.lookPos.x, 40, this.lookPos.z);
      this.object.position.y = 0;

      if (!Config.locked) {
        if (Config.moveForward && this.canMove) {
          this.animate("Armature|Run");
          this.object.translateZ(1);
        } else {
          this.stopAnimate(this.animName);
          this.animate("Armature|Idle");
        }
      }
    }
  }

  loadModel(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (model) => {
          this.object = model.scene;
          this.object.animations = model.animations;
          this.mixer = new AnimationMixer(this.object);
          this.object.scale.set(10, 10, 10);

          resolve(this.object);
        },
        () => { },
        () => {
          reject(new Error("Error while loading model 1"));
        }
      );
    });
  }

  updateIntersects(obstacles, table) {
    const ray = new Ray(this.object.position, this.object.getWorldDirection(new Vector3()));
    this.raycaster.ray = ray;

    // WALL COLLISION
    const toCheck = [...obstacles.children, table].filter((item) => item != undefined);

    this.intersects = this.raycaster.intersectObjects(toCheck);
    const walls = this.intersects.filter((item) => item.object.gameType == "wall");
    const nearby = walls.filter((item) => item.distance < 3);
    if (nearby.length) this.canMove = false;
    else this.canMove = true;
  }

  animate(animName) {
    this.animName = animName;
    this.mixer.clipAction(animName).play();
  }

  stopAnimate(animName) {
    this.mixer.clipAction(animName).stop();
  }

  update(delta) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}
