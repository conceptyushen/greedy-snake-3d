import 'ress'
import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import Snake from './model/snake'

export class Main {
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public controls: OrbitControls
  public renderer: THREE.WebGLRenderer
  private stats: Stats

  private snake: Snake

  constructor() {
    this.scene = new THREE.Scene()
    this.initCamera()
    this.initRenderer()
    this.initControls()
    this.initLight()
    this.initStats()
    this.createPlane()


    this.snake = new Snake(this)
    this.snake.addEventListener()
    this.render()
  }

  createPlane() {
    let threePlaneGeometry = new THREE.PlaneGeometry(200, 200, 200)
    let threePlaneMaterial = new THREE.MeshLambertMaterial({
      color: 0xa5a5a5,
      side: THREE.DoubleSide,
    })
    let threePlaneMesh = new THREE.Mesh(
      threePlaneGeometry,
      threePlaneMaterial
    )
    threePlaneMesh.rotation.x = -Math.PI / 2
    threePlaneMesh.receiveShadow = true
    threePlaneMesh.position.set(0, 0, 0)
    threePlaneMesh.scale.set(2, 2, 2)
    this.scene.add(threePlaneMesh)
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000)
    this.camera.position.set(0, 30, 40)
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.camera)

    document.body.appendChild(this.renderer.domElement)

    window.onresize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
    }
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 50
    this.controls.maxDistance = 50
    this.controls.maxPolarAngle = Math.PI * 3 / 4
  }

  initLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.0)
    light.position.set(0, 2000, 0)
    const lightHelper = new THREE.DirectionalLightHelper(light, 10)

    this.scene.add(light)
    this.scene.add(lightHelper)
  }

  initStats() {
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  }

  render() {
    this.snake.render()
    this.stats.update()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }
}

new Main()