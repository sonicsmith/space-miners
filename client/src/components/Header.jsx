import React, { Component } from "react"

class Header extends Component {
  render() {
    const { children } = this.props
    return (
      <div
        style={{
          position: "absolute",
          left: "1%",
          top: "4%",
          width: "98%",
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
