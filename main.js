import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"
import "./style.css"

import stars1 from "./src/stars1.jpg"
import stars2 from "./src/stars2.jpg"
import stars3 from "./src/stars3.jpg"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
const gltfloader = new GLTFLoader()
gltfloader.load('./src/assets/black_character/scene.gltf', (gltfScene) => {
  // gltfScene.scene.rotate.y = Math.PI/8
  gltfScene.scene.position.x = 9
  gltfScene.scene.position.y = -1

  gltfScene.scene.scale.set(2,2,2)
  scene.add(gltfScene.scene)
})
let loader = document.getElementById("pre-loader")
const canvas = document.querySelector(".webGL")
let sizes = {
  width : window.innerWidth,
  height : window.innerHeight,
}

window.addEventListener("load", function(){
    loader.style.display = "none"
})

//creating a scene, renderer, camera, mesh(geometry and material)
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 18

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( sizes.width, sizes.height );


const textureLoader = new THREE.TextureLoader()
scene.background = textureLoader.load(stars2)

const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: "white",
  roughness: 0.1,
  map : textureLoader.load(stars1)
})
const sphere = new THREE.Mesh(geometry, material)

function addStar () {
  const geometry = new THREE.SphereGeometry(0.07)
  const material = new THREE.MeshStandardMaterial({
    color : 0xffffff,
  })
  const stars = new THREE.Mesh(geometry, material)

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ))

  stars.position.set(x, y, z)
  scene.add(stars)

}
Array(2500).fill().forEach(addStar)

//adding light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(10, 10, 10)
const ambient = new THREE.AmbientLight(0xffffff)

scene.add(sphere)
scene.add(light, ambient)
renderer.render(scene, camera)


//allowing mouse controls on page
let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 2

window.addEventListener("resize", ()=> {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)

})

let loop = () => {
  controls.update()
  renderer.render(scene, camera)
  renderer.setPixelRatio(2)
  window.requestAnimationFrame(loop)
}
loop()

const animations = gsap.timeline({defaults: { duration: 1}})
animations.fromTo(sphere.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
animations.fromTo(".intro-outline", {opacity: 0}, {opacity: 0.7})
animations.fromTo(".greet", {opacity: 1}, {opacity: 0})

animations.fromTo(".message", {visibility: 'hidden'}, {duration:9 ,visibility: 'visible'})
animations.fromTo('.info',{opacity: 0}, {opacity: 0.8})
animations.to(".message", {duration:9, visibility: 'hidden'})



let mouseDown = false
let rgb = []
window.addEventListener('mousedown', ()=> (mouseDown=true))
window.addEventListener('mouseup', ()=> (mouseDown=false))
light.intensity = 1.25
window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]

    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(sphere.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    })
  }
})



// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( './src/assets/cinematic.mp3', function( buffer ) {
	sound.setBuffer( buffer );
  // sound.autoplay({true})
	sound.setLoop( true );
	sound.setVolume( 0.4 );
	sound.play();
});