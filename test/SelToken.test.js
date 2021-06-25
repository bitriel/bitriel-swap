const { expectRevert } = require("@openzeppelin/test-helpers");
const SelToken = artifacts.require("SelToken");

contract("SelToken", ([alice, bob, carol]) => {
  beforeEach(async () => {
    this.sel = await SelToken.new({ from: alice });
  });

  it("should have correct name and symbol and decimal", async () => {
    const name = await this.sel.name();
    const symbol = await this.sel.symbol();
    const decimals = await this.sel.decimals();
    assert.equal(name.valueOf(), "SELENDRA");
    assert.equal(symbol.valueOf(), "SEL");
    assert.equal(decimals.valueOf(), "18");
  });

  it("should only allow owner to mint token", async () => {
    await this.sel.mint(alice, "100", { from: alice });
    await this.sel.mint(bob, "1000", { from: alice });
    await expectRevert(
      this.sel.mint(carol, "1000", { from: bob }),
      "Ownable: caller is not the owner"
    );
    const totalSupply = await this.sel.totalSupply();
    const aliceBal = await this.sel.balanceOf(alice);
    const bobBal = await this.sel.balanceOf(bob);
    const carolBal = await this.sel.balanceOf(carol);
    assert.equal(totalSupply.valueOf(), "1100");
    assert.equal(aliceBal.valueOf(), "100");
    assert.equal(bobBal.valueOf(), "1000");
    assert.equal(carolBal.valueOf(), "0");
  });

  it("should supply token transfers properly", async () => {
    await this.sel.mint(alice, "100", { from: alice });
    await this.sel.mint(bob, "1000", { from: alice });
    await this.sel.transfer(carol, "10", { from: alice });
    await this.sel.transfer(carol, "100", { from: bob });
    const totalSupply = await this.sel.totalSupply();
    const aliceBal = await this.sel.balanceOf(alice);
    const bobBal = await this.sel.balanceOf(bob);
    const carolBal = await this.sel.balanceOf(carol);
    assert.equal(totalSupply.valueOf(), "1100");
    assert.equal(aliceBal.valueOf(), "90");
    assert.equal(bobBal.valueOf(), "900");
    assert.equal(carolBal.valueOf(), "110");
  });

  it("should fail if you try to do bad transfers", async () => {
    await this.sel.mint(alice, "100", { from: alice });
    await expectRevert(
      this.sel.transfer(carol, "110", { from: alice }),
      "ERC20: transfer amount exceeds balance"
    );
    await expectRevert(
      this.sel.transfer(carol, "1", { from: bob }),
      "ERC20: transfer amount exceeds balance"
    );
  });
});
