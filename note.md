## Step of Forking Uniswap 
1. <b>Copy past orginal code</b>
2. <b>Customize code</b>
3. <b>Deploy smart contract + frontend</b>
4. <b> Bootstrap liquidity </b>
***
## Problem with forking Uniswap Dex
1. <b>It doesn't have a deploy configuration </b>
1. <b>It split project into two parts with different solidity verison</b>

***
## Smart Contract

* <b>Factory Contract</b> 
	* this is used to create markets for different pairs
	* like DAI/Ether, USDC/Ether
	* This smart contract located in the uniswap-v2-core repo
	* use truffle framework for managing and deployment of the smart contract
	* copy `cp -r ../uniswap-v2-core/contracts/* contracts`
	* create a migration file to tell truffle of how to deploy uniswap smart contract

	```	
	 const Factory = artifacts.require("UniswapV2Factory.sol");
	 const Token1 = artifacts.require('Token1.sol');
	 const token2 = artifacts.require('Token2.sol');
	 module.experts = function (deployer, networks, adddresses) {
	 	// By default the first one is used for deployment
	 	await deployer.deploy(Factoryុ, adddresses[0]);
		const factory = await Factory.deployed();
		let token1Address, token2Address;
		// addresses in mainnet depend on which market you want to create	
		if (network === 'mainnet')  {
			token1Address = '';
			token2Address = '';
		// if we not deploy to mainnet exmaple ganache or kovan testnet in this case we are going to deploy ourself to ES20-token 
	for this market for that we will need to create our own ERC20 token
		}else {
			await deployer.deploy();
			await deployer.deploy();
			const token1 = await Token1.deployed();
			const token2 = await Token2.deployed();
			token1Address = token1.address;
			token2Address = token2.address;

		}
		await factory.createPair(token1Address, token2Address);
	 }
	 ```

	* Next we are going to deploy the market in which the user can trade the token 





## Router Smart Contract

* We need to create WETH smart contract, why do we need this ?
* because in uniswap when we create a market uniswap doesn't use ether but it uses wrap ether which is an ES-20 token version of ether to deply factory or pair contract you don't need about this wrap ether token however for Router contract it make use of this wrap ether So we need it .
* `vim /contracts/WETH.sol`
* Go to EtherScan search for wrap ether
* change version of solidty in wrapped ether to match with Router Sodlity version 
* Next we have to write a migration file for WETH






















[my github repo link](https://www.github.com/veasnama)

![my github repo image](https://avatars.githubusercontent.com/u/47025775?s=400&u=108ab5536444ad04990ea587cbee8927f63c13fd&v=4 "My github account image")



```
#[derive(Debug, Default)]
struct User {
	id: usize,
	name: String,
	sex: M,
	profile: Profile,
	createdAt: Datetime
}

let user = User::default();

```

There are more people in here....
---

Hyphens
***
<a href="https://www.youtube.com/watch?v=22JAs0kNA9k&t=374s" target="_blank"><img src=" https://avatars.githubusercontent.com/u/47025775?s=400&u=108ab5536444ad04990ea587cbee8927f63c13fd&v=4 " 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>
	
