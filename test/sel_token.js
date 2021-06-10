const SELToken = artifacts.require("SELToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('SELToken', accounts => {
	let token =null;
	beforeEach(async () => {
		token = await SELToken.new();
	});
	const [admin, _] = accounts;
	const TOTAL_SUPPLY = web3.utils.toWei('1000000');
	describe('token attributes', () => {
		it('has the correct name', async () => {
			const name = await token.name();
			assert(name === "SELToken");
		});
		it('has the correct symbols', async () => {
			const symbols = await token.symbol();
			assert(symbols.toString() === "SEL");
		});

		it('has the correct decimals', async () => {
			const decimals = await token.decimals();
			assert(decimals.toNumber() === 18);
		});
		
		it('admin should have total supply', async () => {	
				const balanceAdmin = await token.balanceOf(admin);
				const totalSupply = await token.totalSupply();
				assert(balanceAdmin.toString() === TOTAL_SUPPLY);
				assert(totalSupply.toString() === TOTAL_SUPPLY);
		});
	})
})
