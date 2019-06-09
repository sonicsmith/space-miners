import React, { Component } from "react"
import NeonText from "./NeonText.jsx"
import Header from "./Header.jsx"
import MinerCountSelector from "./MinerCountSelector.jsx"

class HUD extends Component {
  render() {
    const {
      planetPopulation,
      planetCapacity,
      keriumHoldings,
      usersMinersOnPlanet,
      numMinersToSend,
      costToSend,
      amountInEth,
      setMinersToSend,
      sendMinersToPlanet,
      sellKerium,
      processingTransaction,
      demoMode
    } = this.props
    let status = processingTransaction
    if (!processingTransaction) {
      status =
        usersMinersOnPlanet > 0
          ? `${usersMinersOnPlanet} craft mining`
          : "ready"
    }
    return (
      <Header>
        <div>
          <NeonText
            title={"PLANET POPULATION"}
            subtitle={`${planetPopulation}/${planetCapacity}`}
            textAlign={"left"}
          />
          <NeonText
            title={"STATUS"}
            subtitle={status}
            textAlign={"left"}
            flashing={processingTransaction}
          />
          <NeonText
            title={"AMOUNT MINED"}
            subtitle={`${keriumHoldings} KMC`}
            textAlign={"left"}
          />
          <NeonText
            title={"VALUE IN ETH"}
            subtitle={`${amountInEth} ETH`}
            textAlign={"left"}
          />
        </div>
        <div>
          <NeonText
            title={demoMode ? "DEMO MODE" : "DASHBOARD"}
            subtitle={"number of miners"}
            textAlign={"right"}
            flashingTitle={demoMode}
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
            title={"SELL KERIUM"}
            textAlign={"right"}
            onClick={sellKerium}
          />
        </div>
      </Header>
    )
  }
}

export default HUD
