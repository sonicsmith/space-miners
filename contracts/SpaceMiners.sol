pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SpaceMiners is Ownable {

  using SafeMath for uint;

  uint public PRICE_TO_MINE = 20 finney;
  uint PLANET_CAPACITY = 10;
  uint OWNER_FEE_PERCENT = 5;
  uint planetPopulation = 0;
  bool planetMinable = true;
  mapping(address => uint) public keriumHoldings;

  address[] miners = new address[](PLANET_CAPACITY);

  ERC20Mintable public ERC20Interface;

  function setKeriumAddress(address tokenAddress) public onlyOwner {
    ERC20Interface = ERC20Mintable(tokenAddress);
  }

  function setPlanetMinable(bool isMinable) public onlyOwner {
    planetMinable = isMinable;
  }

  function getPriceToMine() public view returns (uint) {
    return PRICE_TO_MINE;
  }

  function getPlanetCapacity() public view returns (uint) {
    return PLANET_CAPACITY;
  }

  function getPlanetPopulation() public view returns (uint) {
    return planetPopulation;
  }

  function getNumUsersMinersOnPlanet() public view returns (uint) {
    uint count = 0;
    for (uint i = 0; i < planetPopulation; i++) {
      if (miners[i] == msg.sender) {
        count++;
      }
    }
    return count;
  }

  function getKeriumHoldings() public payable returns (uint) {
    return keriumHoldings[msg.sender];
  }

  function collectKeriumHoldings() public payable {
    require(keriumHoldings[msg.sender] > 0, "No Kerium holdings found");
    uint total = keriumHoldings[msg.sender];
    keriumHoldings[msg.sender] = 0;
    ERC20Interface.mint(msg.sender, total);
  }

  function sendSingleMinerToPlanet(address miner) internal {
    miners[planetPopulation] = miner;
    planetPopulation = planetPopulation.add(1);
    if (planetPopulation == PLANET_CAPACITY) {
      planetMinable = false;
      rewardMiners();
      planetMinable = true;
    }
  }

  function sendMinersToPlanet(uint numMiners) public payable {
    require(planetMinable, "Planet is closed");
    require(msg.value >= numMiners * PRICE_TO_MINE, "Not enough paid for mining");
    require(planetPopulation < PLANET_CAPACITY, "Planet is full");
    for (uint i = 0; i < numMiners; i++) {
      sendSingleMinerToPlanet(msg.sender);
    }
  }

  function getRandomisedMinerList() view internal returns (address[] memory) {
    // TODO: Use random engine to generate indices
    // Then use that list to return miners
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
    keriumHoldings[recipient] = keriumHoldings[recipient].add(keriumAmount);
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
      if (i < PLANET_CAPACITY - 1) {
        giveMinerReward(recipients[i], rewardAmount);
        roundEarnings = roundEarnings.sub(rewardAmount);
      } else {
        // Last miner gets rounding error extra
        giveMinerReward(recipients[i], roundEarnings);
      }
    }
    planetPopulation = 0;
  }

  function() external payable {}

}