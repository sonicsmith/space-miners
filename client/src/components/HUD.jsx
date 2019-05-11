import React, { Component } from "react"
import NeonText from "./NeonText.jsx"
import Header from "./Header.jsx"
import MinerCountSelector from "./MinerCountSelector.jsx"

class HUD extends Component {
  render() {
    const {
      completion,
      keriumUnclaimed,
      keriumClaimed,
      usersMinersOnPlanet,
      numMinersToSend,
      costToSend,
      setMinersToSend,
      sendMinersToPlanet,
      claimKerium
    } = this.props

    return (
      <Header>
        <div>
          <NeonText
            title={"MINING COMPLETION"}
            subtitle={`${completion}%`}
            textAlign={"left"}
          />
          <NeonText
            title={"MINERS ON PLANET"}
            subtitle={usersMinersOnPlanet}
            textAlign={"left"}
          />
          <NeonText
            title={"KERIUM CLAIMED"}
            subtitle={`${keriumClaimed} µg`}
            textAlign={"left"}
          />
          <NeonText
            title={"KERIUM UNCLAIMED"}
            subtitle={`${keriumUnclaimed} µg`}
            textAlign={"left"}
          />
        </div>
        <div>
          <NeonText
            title={"DASHBOARD"}
            subtitle={"number of miners"}
            textAlign={"right"}
          />
          <MinerCountSelector
            numMinersToSend={numMinersToSend}
            setMiners={newNum => {
              setMinersToSend(newNum)
            }}
          />
          <NeonText
            title={"COST"}
            subtitle={`${costToSend} ETH`}
            textAlign={"right"}
          />
          <NeonText
            title={"SEND MINERS"}
            textAlign={"right"}
            onClick={sendMinersToPlanet}
          />
          <NeonText
            title={"CLAIM KERIUM"}
            textAlign={"left"}
            onClick={claimKerium}
          />
        </div>
      </Header>
    )
  }
}

export default HUD
