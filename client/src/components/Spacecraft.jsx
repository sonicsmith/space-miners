import React, { Component } from "react"

import { Tick, GLTFModel, AmbientLight } from "./../3d/main"

const path = "./minerModel/"
const modelName = "minerDrone.gltf"

class Spacecraft extends Component {
  constructor() {
    super()
    this.randomX = Math.random() > 0.5 ? 1 : -1
    this.state = {
      width: 0,
      height: 0,
      position: { x: this.randomX, y: 1, z: 0 },
      rotation: { x: 0, y: -1, z: this.randomX * 0.6 },
      scale: { x: 1, y: 1, z: 1 }
    }
  }

  componentWillMount() {
    this.setState({
      width: window.innerWidth, // * 0.8,
      height: window.innerHeight // * 0.8
    })
  }

  launchMiner() {
    setTimeout(() => {
      this.tick = Tick(() => {
        const { position, rotation, scale } = this.state
        const yAmount = (4 + position.y) / 100
        const xAmount = (1 + position.x) / 100
        if (this.randomX > 0) {
          position.x -= xAmount
          rotation.z -= 0.002
        } else {
          position.x += xAmount
          rotation.z += 0.002
        }
        position.y -= yAmount
        position.z -= 0.035
        scale.x -= 0.001
        scale.y -= 0.001
        scale.z -= 0.001
        this.setState({ position, rotation, scale })
        if (position.z < -20) {
          this.props.arrived(this.props.craftId)
          this.tick.animate = false
        }
      })
    }, (this.props.craftId + 1) * 1000)
  }

  render() {
    const { position } = this.state
    const spacecraftFade =
      position.z > -9 ? 1 : Math.min(1, 10 + position.z / 2)
    return (
      <div
        style={{
          position: "absolute",
          // left: "10%",
          zIndex: 1,
          opacity: spacecraftFade
        }}
      >
        <GLTFModel
          width={this.state.width}
          height={this.state.height}
          transparent={true}
          background={0x00ffff}
          src={`${path}${modelName}`}
          onLoad={() => {
            this.launchMiner()
          }}
          position={this.state.position}
          rotation={this.state.rotation}
          scale={this.state.scale}
        >
          <AmbientLight color={0xffaaaa} />
        </GLTFModel>
      </div>
    )
  }
}

export default Spacecraft
