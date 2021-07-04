import { expect } from "chai";
import { prepare, deploy, getBigNumber, createSLP } from "./utilities"

describe("SelMaker", function () {
  before(async function () {
    await prepare(this, ["SelMaker", "SelBar", "SushiMakerExploitMock", "ERC20Mock", "UniswapV2Factory", "UniswapV2Pair"])
  })

  beforeEach(async function () {
    await deploy(this, [
      ["sel", this.ERC20Mock, ["SEL", "SEL", getBigNumber("10000000")]],
      ["dai", this.ERC20Mock, ["DAI", "DAI", getBigNumber("10000000")]],
      ["mic", this.ERC20Mock, ["MIC", "MIC", getBigNumber("10000000")]],
      ["usdc", this.ERC20Mock, ["USDC", "USDC", getBigNumber("10000000")]],
      ["weth", this.ERC20Mock, ["WETH", "ETH", getBigNumber("10000000")]],
      ["strudel", this.ERC20Mock, ["$TRDL", "$TRDL", getBigNumber("10000000")]],
      ["factory", this.UniswapV2Factory, [this.alice.address]],
    ])
    await deploy(this, [["bar", this.SelBar, [this.sel.address]]])
    await deploy(this, [["selMaker", this.SelMaker, [this.factory.address, this.bar.address, this.sel.address, this.weth.address]]])
    await deploy(this, [["exploiter", this.SushiMakerExploitMock, [this.selMaker.address]]])
    await createSLP(this, "selEth", this.sel, this.weth, getBigNumber(10))
    await createSLP(this, "strudelEth", this.strudel, this.weth, getBigNumber(10))
    await createSLP(this, "daiEth", this.dai, this.weth, getBigNumber(10))
    await createSLP(this, "usdcEth", this.usdc, this.weth, getBigNumber(10))
    await createSLP(this, "micUSDC", this.mic, this.usdc, getBigNumber(10))
    await createSLP(this, "selUSDC", this.sel, this.usdc, getBigNumber(10))
    await createSLP(this, "daiUSDC", this.dai, this.usdc, getBigNumber(10))
    await createSLP(this, "daiMIC", this.dai, this.mic, getBigNumber(10))
  })
  describe("setBridge", function () {
    it("does not allow to set bridge for Sel", async function () {
      await expect(this.selMaker.setBridge(this.sel.address, this.weth.address)).to.be.revertedWith("SelMaker: Invalid bridge")
    })

    it("does not allow to set bridge for WETH", async function () {
      await expect(this.selMaker.setBridge(this.weth.address, this.sel.address)).to.be.revertedWith("SelMaker: Invalid bridge")
    })

    it("does not allow to set bridge to itself", async function () {
      await expect(this.selMaker.setBridge(this.dai.address, this.dai.address)).to.be.revertedWith("SelMaker: Invalid bridge")
    })

    it("emits correct event on bridge", async function () {
      await expect(this.selMaker.setBridge(this.dai.address, this.sel.address))
        .to.emit(this.selMaker, "LogBridgeSet")
        .withArgs(this.dai.address, this.sel.address)
    })
  })
  describe("convert", function () {
    it("should convert SEL - ETH", async function () {
      await this.selEth.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.convert(this.sel.address, this.weth.address)
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.selEth.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("1897569270781234370")
    })

    it("should convert USDC - ETH", async function () {
      await this.usdcEth.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.convert(this.usdc.address, this.weth.address)
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.usdcEth.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("should convert $TRDL - ETH", async function () {
      await this.strudelEth.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.convert(this.strudel.address, this.weth.address)
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.strudelEth.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("should convert USDC - SEL", async function () {
      await this.selUSDC.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.convert(this.usdc.address, this.sel.address)
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.selUSDC.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("1897569270781234370")
    })

    it("should convert using standard ETH path", async function () {
      await this.daiEth.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.convert(this.dai.address, this.weth.address)
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.daiEth.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts MIC/USDC using more complex path", async function () {
      await this.micUSDC.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.setBridge(this.usdc.address, this.sel.address)
      await this.selMaker.setBridge(this.mic.address, this.usdc.address)
      await this.selMaker.convert(this.mic.address, this.usdc.address)
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.micUSDC.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts DAI/USDC using more complex path", async function () {
      await this.daiUSDC.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.setBridge(this.usdc.address, this.sel.address)
      await this.selMaker.setBridge(this.dai.address, this.usdc.address)
      await this.selMaker.convert(this.dai.address, this.usdc.address)
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.daiUSDC.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts DAI/MIC using two step path", async function () {
      await this.daiMIC.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.setBridge(this.dai.address, this.usdc.address)
      await this.selMaker.setBridge(this.mic.address, this.dai.address)
      await this.selMaker.convert(this.dai.address, this.mic.address)
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.daiMIC.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("1200963016721363748")
    })

    it("reverts if it loops back", async function () {
      await this.daiMIC.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.setBridge(this.dai.address, this.mic.address)
      await this.selMaker.setBridge(this.mic.address, this.dai.address)
      await expect(this.selMaker.convert(this.dai.address, this.mic.address)).to.be.reverted
    })

    it("reverts if caller is not EOA", async function () {
      await this.selEth.transfer(this.selMaker.address, getBigNumber(1))
      await expect(this.exploiter.convert(this.sel.address, this.weth.address)).to.be.revertedWith("SelMaker: must use EOA")
    })

    it("reverts if pair does not exist", async function () {
      await expect(this.selMaker.convert(this.mic.address, this.micUSDC.address)).to.be.revertedWith("SelMaker: Invalid pair")
    })

    it("reverts if no path is available", async function () {
      await this.micUSDC.transfer(this.selMaker.address, getBigNumber(1))
      await expect(this.selMaker.convert(this.mic.address, this.usdc.address)).to.be.revertedWith("SelMaker: Cannot convert")
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.micUSDC.balanceOf(this.selMaker.address)).to.equal(getBigNumber(1))
      expect(await this.sel.balanceOf(this.bar.address)).to.equal(0)
    })
  })

  describe("convertMultiple", function () {
    it("should allow to convert multiple", async function () {
      await this.daiEth.transfer(this.selMaker.address, getBigNumber(1))
      await this.selEth.transfer(this.selMaker.address, getBigNumber(1))
      await this.selMaker.convertMultiple([this.dai.address, this.sel.address], [this.weth.address, this.weth.address])
      expect(await this.sel.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.daiEth.balanceOf(this.selMaker.address)).to.equal(0)
      expect(await this.sel.balanceOf(this.bar.address)).to.equal("3186583558687783097")
    })
  })
})
