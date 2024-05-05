import * as Three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

const container = document.getElementById("dog");
if (!container) throw "no dog!!!";

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new Three.WebGLRenderer();
renderer.domElement.classList.add("dog");

const composer = new EffectComposer(renderer);

renderer.setSize(window.innerWidth, window.innerHeight);
container.replaceWith(renderer.domElement);

camera.position.z = 5;

const loader = new GLTFLoader();

let model;

loader.load('/assets/buel.glb', (gltf) => {
    scene.add(gltf.scene);
    model = gltf;
}, undefined, function (error) {
    console.error(error);
});

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();

const ambient = new Three.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const light = new Three.DirectionalLight(0xffffff, 2);
light.position.set(0, 5, 0);
light.target.position.set(5, 0, 10);
scene.add(light);
scene.add(light.target);

function animate() {
    requestAnimationFrame(animate);
    renderer.setClearColor(0xffffff, 0);
    composer.render(scene, camera);
    if (model) {
        model.scene.rotation.y += 0.01;
    }
}
animate();
