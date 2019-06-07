import React, { Component } from "react"

class Header extends Component {
  render() {
    const { children } = this.props
    return (
      <div
        style={{
          position: "absolute",
          left: "1%",
          top: "3%",
          width: "98%",
          zIndex: 100,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >
        {children}
      </div>
    )
  }
}

export default Header
