import React, { Component } from "react"
import NeonText from "./NeonText.jsx"

class Error extends Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: "black",
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute" }}>
          <NeonText
            title={"ERROR"}
            subtitle={`Unable to connect to the blockchain`}
          />
        </div>
        <img
          src="./images/vhs-background.gif"
          alt="ERROR"
          style={{ minWidth: "100%", height: "100%" }}
        />
      </div>
    )
  }
}

export default Error
