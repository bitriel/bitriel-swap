module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const sel = await ethers.getContract("SelToken")
  
  const { address } = await deploy("SelMaster", {
    from: deployer,
    args: [sel.address, dev, "1000000000000000000000", "0", "1000000000000000000000"],
    log: true,
    deterministicDeployment: false
  })

  if (await sel.owner() !== address) {
    // Transfer sel Ownership to Chef
    console.log("Transfer sel Ownership to Chef")
    await (await sel.transferOwnership(address)).wait()
  }

  const master = await ethers.getContract("SelMaster")
  if (await master.owner() !== dev) {
    // Transfer ownership of SelMaster to dev
    console.log("Transfer ownership of SelMaster to dev")
    await (await master.transferOwnership(dev)).wait()
  }
}

module.exports.tags = ["SelMaster"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "SelToken"]
