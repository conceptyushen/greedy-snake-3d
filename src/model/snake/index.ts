import Model from '@/model'
import * as THREE from 'three'
import { Main } from '@/main'

// 键盘允许操作的案件
const allowKeyCode = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'KeyJ', 'KeyK', 'KeyQ', 'KeyE']

type Point = {
  x: number
  y: number
  z: number
  radius: number
  mesh?: THREE.Mesh
}

// 变长变短🔒
let lock = false

// mesh 颜色设置
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

export default class Snake implements Model {
  private points: Point[] = []

  constructor(private main: Main) {
    this.points.push({ x: 0, y: 0, z: 0, radius: 1 })
  }

  // 🐍增长
  public increase() {
    const point: Point = {
      x: this.points[this.points.length - 1].x,
      y: this.points[this.points.length - 1].y,
      z: this.points[this.points.length - 1].z,
      radius: 1
    }
    this.points.push(point)
  }

  // 🐍变短
  public decrease() {
    if (this.points.length === 1) {
      return
    }
    const point = this.points[this.points.length - 1]
    this.main.scene.remove(point.mesh)
    this.points.pop()
  }

  // 🐍移动
  public move(vector: THREE.Vector3, rate = 0.5) {
    if (vector.x === 0 && vector.y === 0 && vector.z === 0) {
      return
    }
    const length = this.points.length
    for (let i = length - 1; i > 0; i--) {
      const point = this.points[i]
      const prePoint = this.points[i - 1]
      point.x += (prePoint.x - point.x) * rate
      point.y += (prePoint.y - point.y) * rate
      point.z += (prePoint.z - point.z) * rate
    }

    if (length > 0) {
      const point = this.points[0]
      point.x += vector.x * rate
      point.y += vector.y * rate
      point.z += vector.z * rate
    }
  }

  // 监听鼠标
  private keyStates = {}
  public addEventListener() {
    document.addEventListener('keydown', (event) => {
      if (allowKeyCode.includes(event.code) && this.keyStates[event.code] !== true) {
        this.keyStates[event.code] = true
      }
    })
    document.addEventListener('keyup', (event) => {
      if (allowKeyCode.includes(event.code) && this.keyStates[event.code] === true) {
        this.keyStates[event.code] = false
      }
    })
  }

  // 设置mesh位置
  private setMeshPosition(point: Point) {
    if (!point.mesh) {
      const geometry = new THREE.SphereGeometry(point.radius, 100, 100)
      const mesh = new THREE.Mesh(geometry, material)
      this.main.scene.add(mesh)
      point.mesh = mesh
    }
    point.mesh.position.x = point.x
    point.mesh.position.y = point.y
    point.mesh.position.z = point.z
  }

  // 执行动作以及渲染
  public render() {
    let result: THREE.Vector3 = new THREE.Vector3()
    if (this.keyStates['KeyW']) {
      result = result.add(new THREE.Vector3(0, 1, 0))
    }

    if (this.keyStates['KeyS']) {
      result = result.add(new THREE.Vector3(0, -1, 0))
    }

    if (this.keyStates['KeyQ']) {
      result = result.add(new THREE.Vector3(0, 0, 1))
    }

    if (this.keyStates['KeyE']) {
      result = result.add(new THREE.Vector3(0, 0, -1))
    }

    if (this.keyStates['KeyA']) {
      result = result.add(new THREE.Vector3(-1, 0, 0))
    }

    if (this.keyStates['KeyD']) {
      result = result.add(new THREE.Vector3(1, 0, 0))
    }

    if ((this.keyStates['KeyJ'] || this.keyStates['KeyK']) && !lock) {
      lock = true
      setTimeout(() => {
        lock = false
      }, 1000)
      if (this.keyStates['KeyJ']) {
        this.increase()
      }

      if (this.keyStates['KeyK']) {
        this.decrease()
      }
    }

    this.move(result)
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i]
      this.setMeshPosition(point)
    }
  }
}