import React, { Component } from "react"

import "./LoadingSpinner.css"

class LoadingSpinner extends Component {
  render() {
    return (
      <div
        className="lds-dual-ring"
        style={{
          position: "absolute",
          left: "46vw",
          top: "45%",
          zIndex: 150
        }}
      />
    )
  }
}

export default LoadingSpinner
