import React, { Component } from "react"
import SpaceMinersContract from "./contracts/SpaceMiners.json"
import getWeb3 from "./utils/getWeb3"
import Background from "./components/Background.jsx"
import NeonButton from "./components/NeonButton.jsx"
import Header from "./components/Header.jsx"

class App extends Component {
  state = {
    priceToMine: null,
    planetCapacity: null,
    planetPopulation: null,
    web3: null,
    accounts: null,
    contract: null
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
      console.log(
        `priceToMine: ${priceToMine}, planetCapacity: ${planetCapacity}, planetPopulation: ${planetPopulation}`
      )
      this.setState({ priceToMine, planetCapacity, planetPopulation })
    }
  }

  sendMinersToPlanet = async numMiners => {
    const { accounts, contract } = this.state
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      await methods.sendMinersToPlanet(numMiners).send({ from })
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    console.log("test")
    return (
      <div>
        <Background>
          <Header>
            <NeonButton label={"Kerium Supply"} size={2} />
            <NeonButton label={"Space Miners"} size={4} />
            <NeonButton label={"Send Miners"} size={2} />
          </Header>
        </Background>
      </div>
    )
  }
}

export default App
