const SELToken = artifacts.require("SELToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('SELToken', accounts => {
	beforeEach(async () => {
		this.token = await SELToken.new(100000);
	});
	describe('token attributes', () => {
		it('has the correct name', async () => {
			const name = await this.token.name();
			assert(name === "SELToken");
		});
		it('has the correct symbols', async () => {
			const symbols = await this.token.symbols();
			assert(symbols === "SEL");
		});

		it('has the correct decimals', async () => {
			const decimals = await this.token.decimals();
			assert(decimals.toNumber() === 18);
		});
		it('has the correct balance', async () => {
			const total = await this.token.balanceOf(accounts[0]);
			assert.equal(total, 100000000000000000000000, "Both number equal");
		});
	})
})
