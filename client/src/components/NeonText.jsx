import React, { Component } from "react"

import "./NeonText.css"

class NeonText extends Component {
  render() {
    const { title, subtitle, textAlign, onClick } = this.props

    return (
      <div className={`${onClick ? "neonButton" : "neon"}`}>
        <div
          style={{
            textAlign,
            fontSize: "2em",
            padding: "8px 8px 0px 8px"
          }}
          onClick={onClick && onClick}
        >
          {title}
        </div>
        <div
          style={{
            textAlign,
            fontSize: "1.3em",
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
