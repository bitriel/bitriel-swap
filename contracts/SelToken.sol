// SPDX-License-Identifier: MIT
// ----------------------------------------------------------------------------
// "SELToken" token contract
//
// Deployed to : 
// Symbol      : SEL
// Name        : SELToken
// Total supply: 100000000
// Decimals    : 18
//
// ----------------------------------------------------------------------------

import "./SafeMath.sol";
import "./ERC20I.sol";

contract Owner {
	address public owner;
	address public  newOwner;	
	event OwnershipTransferred(address indexed _from, address indexed _to);
	constructor() public{
			owner = msg.sender;
	}

	modifier onlyOnwer() {
			require(owner == msg.sender);
			_;
	}
	function transferOwnership(address _newOwner) public onlyOnwer {
			newOwner = _newOwner;
	}
	function acceptOwnership() public {
		require(newOwner == msg.sender);
		emit OwnershipTransferred(owner, newOwner);
		owner = newOwner;
		newOwner = address(0);
	}
}

contract SELToken is ERC20I, SafeMath{
	string public symbols;
	string public name;
	uint8 public decimals;
	uint public _totalSupply;
    /* define an associative array whose keys are of type "address" to denote account number 
	 and whose value are used to store token balances	*/
	mapping(address => uint) balances;
	/*
		the second mapping object, allowed , will include all of the accounts approved to withdraw from a given
		account together with the withdrawal sum allowed for each As you can see , the value field of allowed mapping is by itself
		a mapping plotting account adddress to its approved withdrawal sum.		
	*/
	mapping(address => mapping(address => uint)) allowed;

	constructor() public {
		symbols = "SEL";
		name = "SELToken";
		decimals = 18;
		_totalSupply = 100000000;
	}

	function totalSupply() virtual public view override  returns (uint) {
	// !implementation	
			return 0;
	}
	function balanceOf(address tokenOwner) virtual public view override  returns (uint balance) {
    // !implementation
			return 100;
	}
	function allowance(address tokenOwner, address spender) virtual public view override returns (uint remaining) {
    // !implementation
			return 10;
	}
	function transfer(address to, uint tokens) virtual public override returns (bool success) {
    // !implementation
			return true;
	}
	function approve(address spender, uint tokens) virtual public override returns (bool success){
    // !implementation
			return true;
	}
	function transferFrom(address from, address to, uint tokens) virtual public override returns (bool success){
    // !implementation
			return true;
	}
}


