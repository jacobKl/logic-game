import {BoxGeometry, GridHelper, Mesh, MeshBasicMaterial, Scene, LoadingManager, AmbientLight } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Renderer from './Renderer';
import Camera from './Camera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import warrior from './assets/mainArcher.fbx'

export default class Main {
    constructor(container) {
        this.gridHelper = new GridHelper(1000,10)
        this.manager = new LoadingManager();
        this.loader = new FBXLoader();
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75,window.screen.width,window.screen.height);
        this.light = new AmbientLight(0xffffff);
        this.scene.add(this.light)
        new OrbitControls(this.camera,this.container)

        this.scene.add(this.gridHelper)
        this.loader.load(warrior, (model) => {
            this.scene.add(model)
        })
        this.renderer.setClearColor(0x000)
        this.render();
        
    }

    render() {

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }
}