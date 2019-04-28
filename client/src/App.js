import React, { Component } from "react"
import SpaceMinersContract from "./contracts/SpaceMiners.json"
import getWeb3 from "./utils/getWeb3"
import Background from "./components/Background.jsx"
import NeonText from "./components/NeonText.jsx"
import Header from "./components/Header.jsx"
import MinerCountSelector from "./components/MinerCountSelector.jsx"

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    //
    priceToMine: null,
    planetCapacity: null,
    planetPopulation: null,
    minersToSend: 1,
    usersMinersOnPlanet: 0
  }

  componentDidMount = async () => {
    console.log("componentDidMount")
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()
      console.log("web3", web3)
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
      console.log("accounts", accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = SpaceMinersContract.networks[networkId]
      const address = (deployedNetwork && deployedNetwork.address) || "0x0"
      const instance = new web3.eth.Contract(SpaceMinersContract.abi, address)
      console.log("instance", instance)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.refresh)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  refresh = async () => {
    console.log("refresh")
    const { contract } = this.state
    if (contract) {
      const { methods } = contract
      const priceToMine = await methods.getPriceToMine().call()
      const planetCapacity = await methods.getPlanetCapacity().call()
      const planetPopulation = await methods.getPlanetPopulation().call()
      const usersMinersOnPlanet = await methods
        .getNumUsersMinersOnPlanet()
        .call()
      console.log(
        `priceToMine: ${priceToMine}, planetCapacity: ${planetCapacity}, planetPopulation: ${planetPopulation}`
      )
      this.setState({
        priceToMine,
        planetCapacity,
        planetPopulation,
        usersMinersOnPlanet
      })
    }
  }

  sendMinersToPlanet = async () => {
    const { accounts, contract, minersToSend } = this.state
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      await methods.sendMinersToPlanet(minersToSend).send({ from })
    }
  }

  render() {
    const {
      web3,
      minersToSend,
      priceToMine,
      planetCapacity,
      planetPopulation,
      usersMinersOnPlanet
    } = this.state
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    const totalEth = web3.utils.fromWei(
      (minersToSend * priceToMine).toString(),
      "ether"
    )
    const completion = planetPopulation / planetCapacity
    return (
      <div>
        <Background>
          <Header>
            <div>
              <NeonText
                title={"MINING COMPLETION"}
                subtitle={`${completion}%`}
                textAlign={"left"}
              />
              <NeonText
                title={"KERIUM CRYSTALS"}
                subtitle={"45.7657 kg"}
                textAlign={"left"}
              />
              <NeonText
                title={"MINERS ON PLANET"}
                subtitle={usersMinersOnPlanet}
                textAlign={"left"}
              />
            </div>
            <div>
              <NeonText
                title={"SEND MINERS"}
                subtitle={"number of miners"}
                textAlign={"right"}
              />
              <MinerCountSelector
                minersToSend={minersToSend}
                setMiners={newNum => {
                  this.setState({ minersToSend: newNum })
                }}
              />
              <NeonText
                title={"COST"}
                subtitle={`${totalEth} ETH`}
                textAlign={"right"}
              />
              <NeonText
                title={"SEND"}
                textAlign={"right"}
                onClick={this.sendMinersToPlanet}
              />
            </div>
          </Header>
        </Background>
      </div>
    )
  }
}

export default App
