import React, { Component } from "react"
import { Tick, GLTFModel, AmbientLight } from "react-3d-viewer"

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
      rotation: { x: this.randomX * 0.7, y: -1, z: 0 }
    }
  }

  componentWillMount() {
    console.log(window.innerWidth)
    this.setState({
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.tick = Tick(() => {
        const { position, rotation } = this.state
        const yAmount = (4 + position.y) / 100
        const xAmount = (1 + position.x) / 100
        if (this.randomX > 0) {
          position.x -= xAmount
          rotation.x -= 0.002
        } else {
          position.x += xAmount
          rotation.x += 0.002
        }

        position.y -= yAmount
        position.z -= 0.035
        if (position.z > 10) {
          Tick(() => {})
          this.props.arrived(this.props.craftId)
        }
        this.setState({ position, rotation })
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
          left: "10%",
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
          position={this.state.position}
          rotation={this.state.rotation}
        >
          <AmbientLight color={0xffaaaa} />
        </GLTFModel>
      </div>
    )
  }
}

export default Spacecraft
