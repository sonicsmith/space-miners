pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./BancorBondingCurve.sol";

contract ContinuousToken is BancorBondingCurve, Ownable, ERC20 {
    
    using SafeMath for uint256;

    uint256 public scale = 10**18;
    uint256 public reserveBalance = 10*scale;
    uint256 public reserveRatio = 500000;

    constructor() public {
        _mint(msg.sender, 1*scale);
    }

    function mint(address reciever, uint value) public payable {
        require(value > 0, "Must send ether to buy tokens.");
        _continuousMint(reciever, value);
    }

    function burn(uint256 _amount) public {
        uint256 returnAmount = _continuousBurn(_amount);
        msg.sender.transfer(returnAmount);
    }

    function calculateContinuousMintReturn(uint256 _amount)
        public view returns (uint256 mintAmount)
    {
        return calculatePurchaseReturn(totalSupply(), reserveBalance, uint32(reserveRatio), _amount);
    }

    function calculateContinuousBurnReturn(uint256 _amount)
        public view returns (uint256 burnAmount)
    {
        return calculateSaleReturn(totalSupply(), reserveBalance, uint32(reserveRatio), _amount);
    }

    function _continuousMint(address reciever, uint value)
        internal returns (uint256)
    {
        require(value > 0, "Deposit must be non-zero.");

        uint256 amount = calculateContinuousMintReturn(value);
        _mint(reciever, amount);
        reserveBalance = reserveBalance.add(value);
        return amount;
    }

    function _continuousBurn(uint256 _amount)
        internal returns (uint256)
    {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint256 reimburseAmount = calculateContinuousBurnReturn(_amount);
        reserveBalance = reserveBalance.sub(reimburseAmount);
        _burn(msg.sender, _amount);
        return reimburseAmount;
    }
}