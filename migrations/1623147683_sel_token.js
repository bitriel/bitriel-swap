const SelToken = artifacts.require("SELToken");
module.exports = function (deployer) {
	// Use deployer to state migration tasks.
	deployer.deploy(SelToken)
};
