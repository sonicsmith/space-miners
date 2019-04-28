import React, { Component } from "react"

// import "./NeonButton.css"

class NeonButton extends Component {
  render() {
    const { size, label } = this.props
    return (
      <div id="container">
        <span style={{ fontSize: `${size || 5}em`, padding: 12 }}>
          {label || "play now"}
        </span>
      </div>
    )
  }
}

export default NeonButton
