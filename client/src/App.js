import React, { Component } from "react"
import SpaceMinersContract from "./contracts/SpaceMiners.json"
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
    amountInEth: null,
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

      console.log("spaceMinersInstance", spaceMinersInstance)

      window.ethereum.on("accountsChanged", newAccounts => {
        this.setState({
          accounts: newAccounts
        })
        this.refresh()
      })

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          contract: spaceMinersInstance
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
    const { contract, accounts, web3 } = this.state
    if (contract) {
      const { methods } = contract
      const keriumHoldings = await methods.balanceOf(accounts[0]).call()
      const priceToMine = await methods.PRICE_TO_MINE().call()
      const planetCapacity = await methods.PLANET_CAPACITY().call()
      const planetPopulation = await methods.planetPopulation().call()
      const amountInEth = await methods
        .calculateContinuousBurnReturn(keriumHoldings)
        .call()
      const usersMinersOnPlanet = await methods
        .getNumUsersMinersOnPlanet(accounts[0])
        .call()
      this.setState({
        priceToMine,
        planetCapacity,
        planetPopulation,
        amountInEth,
        usersMinersOnPlanet,
        keriumHoldings
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
        .then(() => {
          this.setState({ numMinersInFlight: Math.min(5, numMinersToSend) })
        })
        .catch(e => {
          alert("Error, please try again.")
        })
    }
  }

  sellKerium = () => {
    const { accounts, contract, keriumHoldings } = this.state
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      methods
        .burn(keriumHoldings)
        .send({ from, value: 0, gas: 300000 })
        .then(() => {
          alert("All Crystals have been sold")
        })
        .catch(e => {
          alert("Error, please try again.")
        })
    }
  }

  convertFromWeiUints = amount => {
    return this.state.web3.utils.fromWei(amount, "ether")
  }

  render() {
    const {
      web3,
      numMinersToSend,
      priceToMine,
      planetCapacity,
      planetPopulation,
      amountInEth,
      usersMinersOnPlanet,
      keriumHoldings,
      numMinersInFlight
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
      keriumHoldings &&
      amountInEth

    return (
      <div>
        <Background>
          {numMinersInFlight && (
            <SpacecraftLauncher
              numCraft={numMinersInFlight}
              finished={() => {
                this.setState({ numMinersInFlight: 0 })
              }}
            />
          )}
          {gotData ? (
            <HUD
              planetPopulation={planetPopulation}
              planetCapacity={planetCapacity}
              keriumHoldings={this.convertFromWeiUints(keriumHoldings)}
              usersMinersOnPlanet={usersMinersOnPlanet}
              costToSend={costToSend}
              numMinersToSend={numMinersToSend}
              amountInEth={this.convertFromWeiUints(amountInEth)}
              setMinersToSend={num => this.setState({ numMinersToSend: num })}
              sendMinersToPlanet={this.sendMinersToPlanet}
              sellKerium={this.sellKerium}
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
