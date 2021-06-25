const SelToken = artifacts.require("SelToken");
const SelMaker = artifacts.require("SelMaker");
const MockERC20 = artifacts.require("MockERC20");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");

contract("SelMaker", ([alice, bar, minter]) => {
  beforeEach(async () => {
    this.factory = await UniswapV2Factory.new(alice, { from: alice });
    this.sel = await SelToken.new({ from: alice });
    await this.sel.mint(minter, "100000000", { from: alice });
    this.weth = await MockERC20.new("WETH", "WETH", "100000000", {
      from: minter,
    });
    this.token1 = await MockERC20.new("TOKEN1", "TOKEN", "100000000", {
      from: minter,
    });
    this.token2 = await MockERC20.new("TOKEN2", "TOKEN2", "100000000", {
      from: minter,
    });
    this.maker = await SelMaker.new(
      this.factory.address,
      bar,
      this.sel.address,
      this.weth.address
    );
    this.selWETH = await UniswapV2Pair.at(
      (
        await this.factory.createPair(this.weth.address, this.sel.address)
      ).logs[0].args.pair
    );
    this.wethToken1 = await UniswapV2Pair.at(
      (
        await this.factory.createPair(this.weth.address, this.token1.address)
      ).logs[0].args.pair
    );
    this.wethToken2 = await UniswapV2Pair.at(
      (
        await this.factory.createPair(this.weth.address, this.token2.address)
      ).logs[0].args.pair
    );
    this.token1Token2 = await UniswapV2Pair.at(
      (
        await this.factory.createPair(this.token1.address, this.token2.address)
      ).logs[0].args.pair
    );
  });

  it("should make SUSHIs successfully", async () => {
    await this.factory.setFeeTo(this.maker.address, { from: alice });
    await this.weth.transfer(this.selWETH.address, "10000000", {
      from: minter,
    });
    await this.sel.transfer(this.selWETH.address, "10000000", {
      from: minter,
    });
    await this.selWETH.mint(minter);
    await this.weth.transfer(this.wethToken1.address, "10000000", {
      from: minter,
    });
    await this.token1.transfer(this.wethToken1.address, "10000000", {
      from: minter,
    });
    await this.wethToken1.mint(minter);
    await this.weth.transfer(this.wethToken2.address, "10000000", {
      from: minter,
    });
    await this.token2.transfer(this.wethToken2.address, "10000000", {
      from: minter,
    });
    await this.wethToken2.mint(minter);
    await this.token1.transfer(this.token1Token2.address, "10000000", {
      from: minter,
    });
    await this.token2.transfer(this.token1Token2.address, "10000000", {
      from: minter,
    });
    await this.token1Token2.mint(minter);
    // Fake some revenue
    await this.token1.transfer(this.token1Token2.address, "100000", {
      from: minter,
    });
    await this.token2.transfer(this.token1Token2.address, "100000", {
      from: minter,
    });
    await this.token1Token2.sync();
    await this.token1.transfer(this.token1Token2.address, "10000000", {
      from: minter,
    });
    await this.token2.transfer(this.token1Token2.address, "10000000", {
      from: minter,
    });
    await this.token1Token2.mint(minter);
    // Maker should have the LP now
    assert.equal(
      (await this.token1Token2.balanceOf(this.maker.address)).valueOf(),
      "16528"
    );
    // After calling convert, bar should have SUSHI value at ~1/6 of revenue
    await this.maker.convert(this.token1.address, this.token2.address);
    assert.equal((await this.sel.balanceOf(bar)).valueOf(), "32965");
    assert.equal(
      (await this.token1Token2.balanceOf(this.maker.address)).valueOf(),
      "0"
    );
    // Should also work for SUSHI-ETH pair
    await this.sel.transfer(this.selWETH.address, "100000", {
      from: minter,
    });
    await this.weth.transfer(this.selWETH.address, "100000", {
      from: minter,
    });
    await this.selWETH.sync();
    await this.sel.transfer(this.selWETH.address, "10000000", {
      from: minter,
    });
    await this.weth.transfer(this.selWETH.address, "10000000", {
      from: minter,
    });
    await this.selWETH.mint(minter);
    assert.equal(
      (await this.selWETH.balanceOf(this.maker.address)).valueOf(),
      "16537"
    );
    await this.maker.convert(this.sel.address, this.weth.address);
    assert.equal((await this.sel.balanceOf(bar)).valueOf(), "66249");
    assert.equal(
      (await this.selWETH.balanceOf(this.maker.address)).valueOf(),
      "0"
    );
  });
});
