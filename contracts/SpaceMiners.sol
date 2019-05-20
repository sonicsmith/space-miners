pragma solidity ^0.5.2;

// GAME
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

// TOKEN
import "./ContinuousToken.sol";

contract SpaceMiners is Ownable, ContinuousToken {

  using SafeMath for uint;

  uint public PRICE_TO_MINE = 20 finney;
  uint public PLANET_CAPACITY = 10;
  uint public NUM_WINNERS = 3;
  uint OWNER_FEE_PERCENT = 5;
  address[] miners = new address[](PLANET_CAPACITY);
  uint public planetPopulation = 0;

  string public constant name = "Kerium Crystals";
  string public constant symbol = "KMC";
  uint8 public constant decimals = 18;

  function getNumUsersMinersOnPlanet() public view returns (uint) {
    uint count = 0;
    for (uint i = 0; i < planetPopulation; i++) {
      if (miners[i] == msg.sender) {
        count++;
      }
    }
    return count;
  }

  function sendSingleMinerToPlanet(address miner) internal {
    miners[planetPopulation] = miner;
    planetPopulation = planetPopulation.add(1);
    if (planetPopulation == PLANET_CAPACITY) {
      rewardMiners();
      planetPopulation = 0;
    }
  }

  function sendMinersToPlanet(uint numMiners) public payable {
    require(msg.value >= numMiners * PRICE_TO_MINE, "Not enough paid for mining");
    require(planetPopulation < PLANET_CAPACITY, "Planet is full");
    mint(msg.sender, numMiners);
    for (uint i = 0; i < numMiners; i++) {
      sendSingleMinerToPlanet(msg.sender);
    }
  }

  function percentOfValue(uint percent, uint value) pure internal returns (uint) {
    return (value.mul(percent)).div(100);
  }

  function getRandom(uint cap) view internal returns (uint) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % cap;
  }

  function rewardMiners() internal {
    // First take OWNER_FEE_PERCENT
    uint roundEarnings = PRICE_TO_MINE * PLANET_CAPACITY;
    uint ownerFee = percentOfValue(OWNER_FEE_PERCENT, roundEarnings);
    roundEarnings = roundEarnings.sub(ownerFee);
    uint totalTokens = calculateContinuousMintReturn(roundEarnings);
    uint rewardAmount = totalTokens.div(NUM_WINNERS);
    for (uint i = 0; i < NUM_WINNERS; i++) {
      uint rnd = getRandom(PLANET_CAPACITY);
      mint(miners[rnd], rewardAmount);
    }
  }

  function cashOutOwnerFee() public payable onlyOwner {
    uint ownerHoldings = address(this).balance - (planetPopulation * PRICE_TO_MINE);
    msg.sender.transfer(ownerHoldings);
  }

  function() external payable {}

}