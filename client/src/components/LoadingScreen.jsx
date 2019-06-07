import React, { Component } from "react"

import Background from "./Background.jsx"
import NeonText from "./NeonText.jsx"

class LoadingScreen extends Component {
  render() {
    return (
      <Background>
        <div
          style={{
            position: "absolute",
            left: "1%",
            top: "3%",
            width: "98%",
            zIndex: 100
          }}
        >
          <div>
            <NeonText title={"Attempting to load Web3"} />
          </div>
          <div>
            <NeonText title={"Don't have a web3 provider?"} />
          </div>
          <div>
            <NeonText title={"We recommend Metamask"} />
          </div>
          <div>
            <a
              style={{
                color: "white",
                fontSize: "1.5vw",
                fontFamily: "Audiowide",
                margin: 10
              }}
              href={"https://metamask.io/"}
            >
              DOWNLOAD NOW
            </a>
          </div>
        </div>
      </Background>
    )
  }
}

export default LoadingScreen
