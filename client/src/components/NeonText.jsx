import React, { Component } from "react"

import "./NeonText.css"

class NeonText extends Component {
  render() {
    const { title, subtitle, textAlign, onClick, flashing } = this.props

    return (
      <div className={`${onClick ? "neonButton" : "neon"}`}>
        <div
          style={{
            textAlign,
            fontSize: "5vh",
            padding: "8px 8px 0px 8px"
          }}
          onClick={onClick && onClick}
        >
          {title}
        </div>
        <div
          className={`${flashing ? " flashing-text" : ""}`}
          style={{
            textAlign,
            fontSize: "3vh",
            padding: "5px 8px 8px 8px"
          }}
          onClick={onClick && onClick}
        >
          {subtitle}
        </div>
      </div>
    )
  }
}

export default NeonText
