pragma solidity ^0.5.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SpaceMiners.sol";

contract TestSpaceMiners {

  SpaceMiners public spaceMiners;
  uint public initialBalance = 1000 finney;

  // function beforeEach() public {
  //   spaceMiners = SpaceMiners(DeployedAddresses.SpaceMiners());
  // }

  function testItStartsFresh() public {
    spaceMiners = SpaceMiners(DeployedAddresses.SpaceMiners());
    Assert.equal(spaceMiners.getNumPlanetVacancies(), 10, "getNumPlanetVacancies(), 10");
  }

}
