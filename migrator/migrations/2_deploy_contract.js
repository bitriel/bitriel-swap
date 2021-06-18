const BonusToken = artifacts.require("BonusToken");
const LiquidityMigrator = artifacts.require("LiquidityMigrator");

module.exports = async function (deployer) {
	await deployer.deploy(BonusToken);
		const bonusToken = await BonusToken.deployed();
	const routerAddress = '0x11d4183458879151eb5a9Bb157D1A50bD7d3DceE';
	const pairAddress = '0x416b07B06e53B0C1048043caB5a65561f298AF2f';
	const routerForkAddress = '0x11d4183458879151eb5a9Bb157D1A50bD7d3DceE';
	const pairForkAddress = '0x416b07B06e53B0C1048043caB5a65561f298AF2f';
	
		await deployer.deploy(
				LiquidityMigrator,
				routerAddress,
				pairAddress,
				routerForkAddress,
				pairForkAddress,
				bonusToken.address
		);
	const liquidityMigrator = await LiquidityMigrator.deployed();
	await bonusToken.setLiquidator(liquidityMigrator.address);
};
