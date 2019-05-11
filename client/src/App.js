import React, { Component } from "react"
import SpaceMinersContract from "./contracts/SpaceMiners.json"
import KeriumContract from "./contracts/Kerium.json"
import getWeb3 from "./utils/getWeb3"
import Background from "./components/Background.jsx"
import HUD from "./components/HUD"

import SpacecraftLauncher from "./components/SpacecraftLauncher.jsx"

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    token: null,
    //
    priceToMine: null,
    planetCapacity: null,
    planetPopulation: null,
    numMinersToSend: 1,
    numMinersInFlight: 0,
    usersMinersOnPlanet: 0,
    keriumReserves: 0
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
      const networkId = await web3.eth.net.getId()
      // Get Contract Instance
      const spaceMinersNetwork = SpaceMinersContract.networks[networkId]
      const spaceMinersInstance = new web3.eth.Contract(
        SpaceMinersContract.abi,
        spaceMinersNetwork && spaceMinersNetwork.address
      )

      const keriumNetwork = KeriumContract.networks[networkId]
      const keriumInstance = new web3.eth.Contract(
        KeriumContract.abi,
        keriumNetwork && keriumNetwork.address
      )

      console.log("spaceMinersInstance", spaceMinersInstance)
      console.log("keriumInstance", keriumInstance)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          contract: spaceMinersInstance,
          token: keriumInstance
        },
        this.refresh
      )
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
    const { contract, token, accounts } = this.state
    if (contract && token) {
      const { methods } = contract
      const keriumUnclaimed = await methods.getKeriumHoldings().call()
      const keriumClaimed = await token.methods.balanceOf(accounts[0]).call()
      const priceToMine = await methods.getPriceToMine().call()
      const planetCapacity = await methods.getPlanetCapacity().call()
      const planetPopulation = await methods.getPlanetPopulation().call()
      const usersMinersOnPlanet = await methods
        .getNumUsersMinersOnPlanet()
        .call()
      this.setState({
        priceToMine,
        planetCapacity,
        planetPopulation,
        usersMinersOnPlanet,
        keriumUnclaimed,
        keriumClaimed
      })
    }
    setTimeout(this.refresh, 5000)
  }

  sendMinersToPlanet = () => {
    const { accounts, contract, numMinersToSend, priceToMine } = this.state
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      const value = numMinersToSend * priceToMine
      methods
        .sendMinersToPlanet(numMinersToSend)
        .send({ from, value, gas: 300000 })
        .then(console.log) // TODO: Display spacecraft
        .catch(e => {
          alert("Error, please try again.")
        })
    }
  }

  claimKerium = () => {
    const { accounts, contract, keriumUnclaimed } = this.state
    if (keriumUnclaimed <= 0) {
      alert("You have no Kerium to claim")
      return
    }
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      methods
        .collectKeriumHoldings()
        .send({ from, value: 0, gas: 300000 })
        .then(() => {
          alert("Your Kerium has been added to your holdings.")
        })
        .catch(e => {
          alert("Error, please try again.")
        })
    }
  }

  render() {
    const {
      web3,
      numMinersToSend,
      priceToMine,
      planetCapacity,
      planetPopulation,
      usersMinersOnPlanet,
      keriumUnclaimed,
      keriumClaimed
    } = this.state

    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }

    const costToSend = web3.utils.fromWei(
      (numMinersToSend * priceToMine).toString(),
      "ether"
    )

    const gotData =
      web3 &&
      numMinersToSend &&
      priceToMine &&
      planetCapacity &&
      planetPopulation &&
      usersMinersOnPlanet &&
      keriumUnclaimed &&
      keriumClaimed
    const gotData = true
    const costToSend = 0
    return (
      <div>
        <Background>
          <SpacecraftLauncher numCraft={numMinersInFlight} />
          {gotData ? (
            <HUD
              completion={(planetPopulation / planetCapacity) * 100}
              keriumUnclaimed={keriumUnclaimed}
              keriumClaimed={keriumClaimed}
              usersMinersOnPlanet={usersMinersOnPlanet}
              costToSend={costToSend}
              numMinersToSend={numMinersToSend}
              setMinersToSend={num => this.setState({ numMinersToSend: num })}
              sendMinersToPlanet={this.sendMinersToPlanet}
              claimKerium={this.claimKerium}
            />
          ) : (
            <h1>LOADING</h1>
          )}
        </Background>
      </div>
    )
  }
}

export default App
