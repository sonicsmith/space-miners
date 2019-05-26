import React, { Component } from "react"
import SpaceMinersContract from "./contracts/SpaceMiners.json"
import getWeb3 from "./utils/getWeb3"
import Background from "./components/Background.jsx"
import HUD from "./components/HUD"
import LoadingScreen from "./components/LoadingScreen.jsx"
import SpacecraftLauncher from "./components/SpacecraftLauncher.jsx"

const CONTRACT_ADDRESSES = {
  1: "0x7945C93926BDDCF450a450cC1Fc1ABe7184e6e2D",
  3: "0x4be86c75faeec10c329d6a00a11519b775976a89"
}

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
    keriumReserves: 0,
    //
    processingTransaction: false
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId()
      const network = SpaceMinersContract.networks[networkId]
      const contractAddress = CONTRACT_ADDRESSES[networkId]
      const contract = new web3.eth.Contract(
        SpaceMinersContract.abi,
        contractAddress || (network && network.address)
      )

      console.log("Successfully connected to web3")

      window.ethereum.on("accountsChanged", newAccounts => {
        this.setState({
          accounts: newAccounts
        })
        this.refresh()
      })
      this.setState(
        {
          web3,
          accounts,
          contract
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
    const { contract, accounts } = this.state
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
      this.setState({ processingTransaction: "Charging mining vehicles..." })
      methods
        .sendMinersToPlanet(numMinersToSend)
        .send({ from, value, gas: 300000 })
        .then(() => {
          this.setState({ processingTransaction: false })
          this.setState({ numMinersInFlight: Math.min(5, numMinersToSend) })
        })
        .catch(e => {
          this.setState({ processingTransaction: false })
          alert("Error, please try again.")
        })
    }
  }

  sellKerium = () => {
    const { accounts, contract, keriumHoldings } = this.state
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      this.setState({
        processingTransaction: "Attempting to trade crystals for Ether..."
      })
      methods
        .burn(keriumHoldings)
        .send({ from, value: 0, gas: 300000 })
        .then(() => {
          this.setState({ processingTransaction: false })
          alert("All Crystals have been sold")
        })
        .catch(e => {
          this.setState({ processingTransaction: false })
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
      numMinersInFlight,
      processingTransaction
    } = this.state

    if (!web3) {
      return <LoadingScreen />
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
          {gotData && (
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
              processingTransaction={processingTransaction}
            />
          )}
        </Background>
      </div>
    )
  }
}

export default App
