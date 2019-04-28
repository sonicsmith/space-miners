pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract SpaceMiners {

  using SafeMath for uint;

  uint public PRICE_TO_MINE = 20 finney;
  uint PLANET_CAPACITY = 10;
  uint OWNER_FEE_PERCENT = 5;
  uint planetPopulation = 0;
  bool planetMinable = true;

  address[] miners = new address[](PLANET_CAPACITY);

  function getPriceToMine() public view returns (uint) {
    return PRICE_TO_MINE;
  }

  function getPlanetCapacity() public view returns (uint) {
    return PLANET_CAPACITY;
  }

  function getPlanetPopulation() public view returns (uint) {
    return planetPopulation;
  }

  function getIsMinerOnPlanet() public view returns (bool) {
    for (uint i = 0; i < PLANET_CAPACITY; i++) {
      if (miners[i] == msg.sender) {
        return true;
      }
    }
    return false;
  }

  function sendMinersToPlanet(uint numMiners) public payable {
    require(planetMinable);
    require(msg.value >= numMiners * PRICE_TO_MINE);
    require(planetPopulation < PLANET_CAPACITY);
    miners[planetPopulation] = msg.sender;
    planetPopulation = planetPopulation.add(1);
    if (planetPopulation == PLANET_CAPACITY) {
      planetMinable = false;
      rewardMiners();
      planetMinable = true;
    }
  }

  function getRandomisedMinerList() view internal returns (address[] memory) {
    // TODO: Use random engine
    return miners;
  }

  function percentOfValue(uint percent, uint value) pure internal returns (uint) {
    return (value.mul(percent)).div(100);
  }

  function getEthToKeriumRatio() pure public returns (uint) {
    // TODO: Get price from Bancor
    return 1;
  }

  function giveMinerReward(address recipient, uint rewardAmount) internal {
    uint keriumAmount = rewardAmount.mul(getEthToKeriumRatio());
    // TODO: Transfer Token instead
    address payable temp = address(uint160(recipient));
    temp.transfer(keriumAmount);
  }

  function rewardMiners() internal {
    // First take OWNER_FEE_PERCENT
    uint roundEarnings = PRICE_TO_MINE * PLANET_CAPACITY;
    uint ownerFee = percentOfValue(OWNER_FEE_PERCENT, roundEarnings);
    roundEarnings = roundEarnings.sub(ownerFee);
    // Then go through each miner
    address[] memory recipients = getRandomisedMinerList();
    for (uint i = 0; i < PLANET_CAPACITY; i++) {
      uint rewardAmount = percentOfValue(50, roundEarnings);
      giveMinerReward(recipients[i], rewardAmount);
      roundEarnings = roundEarnings.sub(rewardAmount);
      // Remove miner once rewarded
      recipients[i] = address(0);
    }
  }

}