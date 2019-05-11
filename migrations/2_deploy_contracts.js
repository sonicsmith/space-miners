var Kerium = artifacts.require("./Kerium.sol")
var SpaceMiners = artifacts.require("./SpaceMiners.sol")

module.exports = async function(deployer) {
  await deployer.deploy(Kerium)
  await deployer.deploy(SpaceMiners)

  const instances = await Promise.all([
    Kerium.deployed(),
    SpaceMiners.deployed()
  ])

  const kerium = instances[0]
  const spaceMiners = instances[1]

  await Promise.all([
    kerium.addMinter(spaceMiners.address),
    spaceMiners.setKeriumAddress(kerium.address)
  ])
}
