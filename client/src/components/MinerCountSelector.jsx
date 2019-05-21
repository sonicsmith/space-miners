import React, { Component } from "react"

import "./NeonText.css"

class MinerCountSelector extends Component {
  minerButton = number => {
    return (
      <span
        className="neonButton"
        style={{ marginRight: 8 }}
        onClick={() => {
          const { numMinersToSend, setMiners } = this.props
          if (numMinersToSend + number > 0) {
            setMiners(numMinersToSend + number)
          }
        }}
      >
        {number > 0 ? "+" : "-"}
      </span>
    )
  }

  render() {
    const { numMinersToSend } = this.props
    return (
      <div className="neon" style={{ fontSize: "5vh", textAlign: "right" }}>
        <div>
          {this.minerButton(-1)}
          <span style={{ marginRight: 24, marginLeft: 24 }}>
            {numMinersToSend}
          </span>
          {this.minerButton(1)}
        </div>
      </div>
    )
  }
}

export default MinerCountSelector
