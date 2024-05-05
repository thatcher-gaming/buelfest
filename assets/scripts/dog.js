import * as Three from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { get_colours } from './colour.js';

const [bg, fg] = get_colours();
const container = document.getElementById("dog");
if (!container) throw "no dog!!!";

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new Three.WebGLRenderer();
renderer.domElement.classList.add("dog");

const composer = new EffectComposer(renderer);

container.replaceWith(renderer.domElement);

camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 22;

const loader = new GLTFLoader();

let model;

loader.load('/assets/buel.glb', (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.rotation.x = 0.5
    // gltf.scene.rotation.z = .2
    model = gltf;
}, undefined, function (error) {
    console.error(error);
});


const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const ambient = new Three.AmbientLight(bg, 5);
scene.add(ambient);

const light = new Three.DirectionalLight(fg, 10);
light.position.set(20, 10, 10);
light.target.position.set(20, 0, -10);
scene.add(light);
scene.add(light.target);

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

renderer.domElement.ariaHidden = true;
renderer.domElement.style.pointerEvents = "none";

let reduced_motion = window.matchMedia("(prefers-reduced-motion)");

function animate() {
    requestAnimationFrame(animate);
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.setClearColor("#ffffff", 0);
    composer.render(scene, camera);
    if (model && !reduced_motion.matches) {
        model.scene.rotation.y += 0.01;
        model.scene.rotation.x -= 0.0001;
    }
}
animate();
