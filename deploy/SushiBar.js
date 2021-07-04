module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const sushi = await deployments.get("SelToken")

  await deploy("SelBar", {
    from: deployer,
    args: [sushi.address],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["SelBar"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "SelToken"]
