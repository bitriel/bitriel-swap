const { ChainId } = require("@sushiswap/sdk")


// const SUSHI = {
//   [ChainId.MATIC]: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a'
// }

const SEL = {
  [ChainId.BSC_TESTNET]: '0x933008C63a7158e6F405085976D400735ad17A89'
}
module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  let selAddress;

  if (chainId === '31337') {
    selAddress = (await deployments.get("SelToken")).address
  } else if (chainId in SEL) {
    selAddress = SEL[chainId]
  } else {
    throw Error("No SEL!")
  }

  await deploy("SelMiniV2", {
    from: deployer,
    args: [selAddress],
    log: true,
    deterministicDeployment: false
  })

  const miniChefV2 = await ethers.getContract("SelMiniV2")
  if (await miniChefV2.owner() !== dev) {
    console.log("Transfer ownership of MiniChef to dev")
    await (await miniChefV2.transferOwnership(dev, true, false)).wait()
  }
}

module.exports.tags = ["SelMiniV2"]
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
