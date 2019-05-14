pragma solidity ^0.5.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SpaceMiners.sol";
import "../contracts/Kerium.sol";

contract TestSpaceMiners {

  SpaceMiners public spaceMiners;
  Kerium public kerium;
  uint public initialBalance = 1000 finney;

  function beforeAll() public {
    spaceMiners = new SpaceMiners();
    kerium = new Kerium();
    kerium.addMinter(address(spaceMiners));
    spaceMiners.setKeriumAddress(address(kerium));
  }

  function testItStartsFresh() public {
    uint planetPopulation = spaceMiners.getPlanetPopulation();
    Assert.equal(planetPopulation, 0, "Starts with 0 population");
  }

  function testItAllowsOneMiner() public {
    uint planetCapacity = spaceMiners.getPlanetCapacity();
    uint cost = spaceMiners.getPriceToMine();
    uint numMiners = planetCapacity - 3;
    spaceMiners.sendMinersToPlanet.value(cost * numMiners)(numMiners);
    uint planetPopulation = spaceMiners.getPlanetPopulation();
    Assert.equal(planetPopulation, numMiners, "Mining increases population");
  }

  function testItEndsGameOnceFull() public {
    uint cost = spaceMiners.getPriceToMine();
    uint numMiners = 3;
    spaceMiners.sendMinersToPlanet.value(cost * numMiners)(numMiners);
    uint planetPopulation = spaceMiners.getPlanetPopulation();
    Assert.equal(planetPopulation, 0, "Mining to capacity clears population");
    uint keriumAmount = spaceMiners.getKeriumHoldings();
    uint planetCapacity = spaceMiners.getPlanetCapacity();
    uint expectedAmount = (95 * cost * planetCapacity) / 100;
    Assert.equal(keriumAmount, expectedAmount, "It gives out the right amount of Kerium");
  }

  function testOnePlayerCanSendOverCapacity() public {
    uint cost = spaceMiners.getPriceToMine();
    uint planetCapacity = spaceMiners.getPlanetCapacity();
    uint numMiners = planetCapacity * 2;
    spaceMiners.sendMinersToPlanet.value(cost * numMiners)(numMiners);
  }

  // function testTheOwnerCanCashOut() public {
  //   uint balBefore = address(this).balance;
  //   spaceMiners.cashOutOwnerFee.value(0);
  //   uint balAfter = address(this).balance;
  //   Assert.isTrue(balBefore > balAfter, "It pays out the owner");
  // }

  function() external payable {}

}
