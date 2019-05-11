pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract Kerium is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {

  constructor()
    ERC20Burnable()
    ERC20Mintable()
    ERC20Detailed("Kerium", "KRM", 18)
    ERC20()
    public {}

}
