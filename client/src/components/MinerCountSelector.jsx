import React, { Component } from "react"

import "./NeonText.css"

class MinerCountSelector extends Component {
  minerButton = number => {
    return (
      <span
        className="neonButton"
        style={{ marginRight: 8 }}
        onClick={() => {
          const { minersToSend, setMiners } = this.props
          if (minersToSend + number > 0) {
            setMiners(minersToSend + number)
          }
        }}
      >
        {number > 0 ? "+" : "-"}
      </span>
    )
  }

  render() {
    const { minersToSend } = this.props
    return (
      <div className="neon" style={{ fontSize: "2em", textAlign: "right" }}>
        <div>
          {this.minerButton(-1)}
          <span style={{ marginRight: 24, marginLeft: 24 }}>
            {minersToSend}
          </span>
          {this.minerButton(1)}
        </div>
      </div>
    )
  }
}

export default MinerCountSelector
