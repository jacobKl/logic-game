import { Group } from "three";
import Wall from "./Wall";

export default class Room {
  constructor(scene) {
    this.scene = scene;
    this.group = new Group();

    new Wall(this.group, 0, -100, false);
    new Wall(this.group, 0, 100, false);
    new Wall(this.group, 100, 0, false);
    new Wall(this.group, -100, 0, false);
    new Wall(this.group, 0, 0, true);

    this.group.position.y = 37.5;

    this.scene.add(this.group);
  }

  getRoomObstacles() {
    return this.group;
  }
}
