import React, { Component } from "react"
import Spacecraft from "./Spacecraft.jsx"

class SpacecraftLauncher extends Component {
  render() {
    const { finished, numCraft } = this.props
    const crafts = []
    for (let i = 0; i < numCraft; i++) {
      crafts.push(i)
    }
    const finishedCrafts = [...crafts]
    const onArrival = craftId => {
      const index = finishedCrafts.indexOf(craftId)
      finishedCrafts.splice(index, 1)
      if (!finishedCrafts.length) {
        finished()
      }
    }
    return (
      <div>
        {crafts.map(id => (
          <Spacecraft key={id} craftId={id} arrived={onArrival} />
        ))}
      </div>
    )
  }
}

export default SpacecraftLauncher
