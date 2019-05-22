const path = require("path")
var HDWalletProvider = require("truffle-hdwallet-provider")
var secrets = require("./secrets")
var mnemonic = secrets.mnemonic
var infuraProjectId = secrets.infuraProjectId

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "0.5.2"
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/v3/" + infuraProjectId
        )
      },
      network_id: 3,
      gas: 4000000
    },
    live: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://mainnet.infura.io/v3/" + infuraProjectId
        )
      },
      network_id: 1,
      gas: 4000000
    }
  }
}
