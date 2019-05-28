pragma solidity ^0.5.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SpaceMiners.sol";

contract TestSpaceMiners {

  SpaceMiners public spaceMiners;
  uint public initialBalance = 1000 finney;

  function beforeAll() public {
    spaceMiners = new SpaceMiners();
  }

  function testItStartsFresh() public {
    uint planetPopulation = spaceMiners.planetPopulation();
    Assert.equal(planetPopulation, 0, "Starts with 0 population");
  }

  function testItAllowsOneMiner() public {
    uint planetCapacity = spaceMiners.PLANET_CAPACITY();
    uint cost = spaceMiners.PRICE_TO_MINE();
    uint numMiners = planetCapacity - 3;
    spaceMiners.sendMinersToPlanet.value(cost * numMiners)(numMiners);
    uint planetPopulation = spaceMiners.planetPopulation();
    Assert.equal(planetPopulation, numMiners, "Mining increases population");
  }

  function testItEndsGameOnceFull() public {
    uint cost = spaceMiners.PRICE_TO_MINE();
    uint numMiners = 3;
    spaceMiners.sendMinersToPlanet.value(cost * numMiners)(numMiners);
    uint planetPopulation = spaceMiners.planetPopulation();
    Assert.equal(planetPopulation, 0, "Mining to capacity clears population");
    uint keriumAmount = spaceMiners.balanceOf(address(this));
    uint expectedAmount = 1005683846941970127; // This is plus starting amount
    Assert.equal(keriumAmount, expectedAmount, "It gives out the right amount of Kerium");
  }

  function testItPaysBackUserInEth() public {
    uint balanceBefore = address(this).balance;
    spaceMiners.burn(5683846941970127);
    Assert.isTrue(balanceBefore < address(this).balance, "It pays out the right amount of Eth");
  }

  function testOnePlayerCanSendOverCapacity() public {
    uint cost = spaceMiners.PRICE_TO_MINE();
    uint planetCapacity = spaceMiners.PLANET_CAPACITY();
    uint numMiners = planetCapacity * 2;
    spaceMiners.sendMinersToPlanet.value(cost * numMiners)(numMiners);
  }

  function testAHackerCantMint() public {
    spaceMiners.mint(address(this), 1);
  }

  // function testTheOwnerCanCashOut() public {
  //   uint balBefore = address(this).balance;
  //   spaceMiners.cashOutOwnerFee.value(0);
  //   uint balAfter = address(this).balance;
  //   Assert.equal(balBefore, balAfter, "It pays out the owner");
  // }

  function() external payable {}

}
