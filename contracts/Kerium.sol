pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract Kerium is ERC20Burnable, ERC20Mintable {
  string public name = "Kerium";
  string public symbol = "KRM";
  uint8 public decimals = 18;
}
