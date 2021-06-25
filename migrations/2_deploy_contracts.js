const Factory = artifacts.require("uniswapv2/UniswapV2Factory.sol");
const Router = artifacts.require("uniswapv2/UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");
const MockERC20 = artifacts.require("MockERC20.sol");
const SelToken = artifacts.require("SelToken.sol");
const SelMaster = artifacts.require("SelMaster.sol");
const SelBar = artifacts.require("SelBar.sol");
const SelMaker = artifacts.require("SelMaker.sol");
const Migrator = artifacts.require("Migrator.sol");

module.exports = async function (deployer, _network, addresses) {
  const [admin, _] = addresses;

  await deployer.deploy(WETH);
  const weth = await WETH.deployed();
  const tokenA = await MockERC20.new(
    "Token A",
    "TKA",
    web3.utils.toWei("1000")
  );
  const tokenB = await MockERC20.new(
    "Token B",
    "TKB",
    web3.utils.toWei("1000")
  );

  await deployer.deploy(Factory, admin);
  const factory = await Factory.deployed();
  await factory.createPair(weth.address, tokenA.address);
  await factory.createPair(weth.address, tokenB.address);
  await deployer.deploy(Router, factory.address, weth.address);
  const router = await Router.deployed();

  await deployer.deploy(SelToken);
  const selToken = await SelToken.deployed();

  await deployer.deploy(
    SelMaster,
    selToken.address,
    admin,
    web3.utils.toWei("100"),
    1,
    1
  );
  const selMaster = await SelMaster.deployed();
  await selToken.transferOwnership(selMaster.address);

  await deployer.deploy(SelBar, selToken.address);
  const selBar = await SelBar.deployed();

  await deployer.deploy(
    SelMaker,
    factory.address,
    selBar.address,
    selToken.address,
    weth.address
  );
  const selMaker = await SelMaker.deployed();
  await factory.setFeeTo(selMaker.address);

  await deployer.deploy(
    Migrator,
    selMaster.address,
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    factory.address,
    1
  );
};
