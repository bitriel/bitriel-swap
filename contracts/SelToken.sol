// SPDX-License-Identifier: MIT
// ----------------------------------------------------------------------------
// "SELToken" token contract
//
// Symbol      : SEL
// Name        : SELToken
// Total supply: 100000000
// Decimals    : 18
//
// ----------------------------------------------------------------------------

import "./SafeMath.sol";
import "./ERC20I.sol";
pragma solidity ^0.8.0;
contract Owner {
	address public owner;
	address public  newOwner;	
	event OwnershipTransferred(address indexed _from, address indexed _to);
	constructor() {
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

contract SELToken is ERC20I{
	using SafeMath for uint256;

	string public symbols;
	string public name;
	uint8 public decimals;
	uint public totalSupply_;
    /* define an associative array whose keys are of type "address" to denote account number 
	 and whose value are used to store token balances	*/
	mapping(address => uint) balances;
	/*
		the second mapping object, allowed , will include all of the accounts approved to withdraw from a given
		account together with the withdrawal sum allowed for each As you can see , the value field of allowed mapping is by itself
		a mapping plotting account adddress to its approved withdrawal sum.		
	*/
	mapping(address => mapping(address => uint)) allowed;

	constructor(uint total)  {
		symbols = "SEL";
		name = "SELToken";
		decimals = 18;
		totalSupply_ = total * (10 ** decimals);
		balances[msg.sender] = totalSupply_;
		emit Transfer(address(0), msg.sender, totalSupply_);
	}
	function totalSupply() virtual public view override  returns (uint) {
			return totalSupply_;
	}
	function balanceOf(address tokenOwner) virtual public view override  returns (uint balance) {

			return balances[tokenOwner];
	}	
	function allowance(address tokenOwner, address spender) virtual public view override returns (uint remaining) {

		return allowed[tokenOwner][spender];	
	}
	function transfer(address to, uint tokens) virtual public override returns (bool success) {
			require(tokens <=balances[msg.sender], "Insuffient token to be sent");
			balances[msg.sender] = balances[msg.sender].sub(tokens);
			balances[to] = balances[to].add(tokens);
			emit Transfer(msg.sender, to,  tokens);
			return true;
	}
	/* 
	In short, delegated transaction, or "meta transaction" 
	in blockchain is the type of transaction which performs 
	an intended action on one account's behalf, while it is 
	conducted (published) by another account (delegate), who actually pays fees for the transaction.

	*/
	function approve(address spender, uint tokens) virtual public override returns (bool success)
	{
			allowed[msg.sender][spender] = tokens;
			emit Approval(msg.sender, spender, tokens);
			return true;
	}
	function transferFrom(address from, address to, uint tokens) virtual public override returns (bool success){
			require(tokens <=balances[from]);
			require(tokens <= allowed[from][to]);
			balances[from] = balances[from].sub(tokens);
			allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
			balances[to] = balances[to].add(tokens);
			emit Transfer(from, to, tokens);
			return true;
	}
}


