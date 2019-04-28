import React, { Component } from "react"

import "./NeonButton.css"

class Header extends Component {
  render() {
    const { children } = this.props
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          zIndex: 1000,
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-between"
        }}
      >
        {children}
      </div>
    )
  }
}

export default Header
