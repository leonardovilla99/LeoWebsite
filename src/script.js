import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import { Vector3 } from 'three'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Mouse looking
 */
 var target = new THREE.Vector3();

 var mouseX = 0, mouseY = 0;
 
 var windowHalfX = window.innerWidth / 2;
 var windowHalfY = window.innerHeight / 2;

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

const memoji = new THREE.Group()

gltfLoader.load(
    '/models/leo-memoji.glb',
    (gltf) =>
    {
        const children = [...gltf.scene.children]

        for(const child of children){
            memoji.add(child)
        }
    }
)
memoji.position.set(0,-.5,0)
scene.add(memoji)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// Rectangular light 

const width = 10;
const height = 10;
const intensity = 0;
const rectLight1 = new THREE.RectAreaLight( 0x00d7b4, intensity,  width, height );
rectLight1.position.set( 5, 0, 0 );
rectLight1.lookAt( 0, 0, 0 );
scene.add(rectLight1)

const rectLight2 = new THREE.RectAreaLight( 0x00d7b4, intensity,  width, height );
rectLight2.position.set( -5, 0, 0 );
rectLight2.lookAt( 0, 0, 0 );
scene.add(rectLight2)

const rectLight3 = new THREE.RectAreaLight( 0x00d7b4, intensity,  width, height );
rectLight3.position.set( 0, -5, 0 );
rectLight3.lookAt( 0, 0, 0 );
scene.add(rectLight3)


// Light on

let portfolio = document.getElementById("portfolio");
portfolio.addEventListener("mouseenter", function( event ) {
    rectLight1.intensity = 1
}, false);
portfolio.addEventListener("mouseleave", function( event ) {
    rectLight1.intensity = 0
}, false);

let about = document.getElementById("about");
about.addEventListener("mouseenter", function( event ) {
    rectLight2.intensity = 1
}, false);
about.addEventListener("mouseleave", function( event ) {
    rectLight2.intensity = 0
}, false);

let contact = document.getElementById("contact");
contact.addEventListener("mouseenter", function( event ) {
    rectLight3.intensity = 1
}, false);
contact.addEventListener("mouseleave", function( event ) {
    rectLight3.intensity = 0
}, false);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(10, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 70)
scene.add(camera)

/**
 * Menu control
 */
const page = document.getElementById("pagina-iniziale")

portfolio.addEventListener('click', event => {
    page.style.display = "none";
});

about.addEventListener('click', event => {
    page.style.display = "none";
});

contact.addEventListener('click', event => {
    page.style.display = "none";
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x172b4f );

// Mouse position
window.addEventListener("mousemove", onmousemove, false);

function onmousemove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 6;
    mouseY = ( event.clientY - windowHalfY ) / 6;
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    target.x += ( mouseX - target.x ) * .04
    target.y += ( - mouseY - target.y ) * .04
    target.z = camera.position.z

    memoji.lookAt( target )


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()