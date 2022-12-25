import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"
import "./style.css"

import stars1 from "./src/stars1.jpg"
import stars2 from "./src/stars2.jpg"
import stars3 from "./src/stars3.jpg"



const canvas = document.querySelector(".webGL")
let sizes = {
  width : window.innerWidth,
  height : window.innerHeight,
}


//creating a scene, renderer, camera, mesh(geometry and material)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 18
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( sizes.width, sizes.height ); 
const textureLoader = new THREE.TextureLoader()
scene.background = textureLoader.load(stars1)

const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: "white",
  roughness: 0.1
})
const sphere = new THREE.Mesh(geometry, material)

const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(1, 1, 20)

scene.add(sphere)
scene.add(light)
renderer.render(scene, camera)

let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 5

window.addEventListener("resize", ()=> {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)

})

let loop = () => {
  // sphere.position.x +=0.1
  // sphere.position.y +=0.1
  // sphere.position.z +=0.1
  controls.update()
  renderer.render(scene, camera)
  renderer.setPixelRatio(2)
  window.requestAnimationFrame(loop)
}
loop()

const animations = gsap.timeline({defaults: { duration: 1}})
animations.fromTo(sphere.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
animations.fromTo(".title", {opacity: 0}, {opacity: 1})

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

