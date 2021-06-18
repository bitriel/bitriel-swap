const Factory = artifacts.require("UniswapV2Factory"); 
const SEL  = artifacts.require("SEL");
const KUM = artifacts.require("KUM");
module.exports = async function (deployer, network, addresses) {

		let token1address, token2address;
		await deployer.deploy(Factory, addresses[0]);
		const factory = await Factory.deployed();
		if(network === 'mainnet'){
		token1address = '';	
		token2address = '';	

		}else {

		await deployer.deploy(SEL);
		await deployer.deploy(KUM);
		const token1 = await SEL.deployed();
		const token2 = await KUM.deployed();
		token1address = token1.address;
		token2address = token2.address;	

		} 
		await factory.createPair(token1address, token2address);
};
