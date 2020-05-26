const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
  // Deploy token
  await deployer.deploy(Token);
  const token = await Token.deployed();
  
  // Deploy exchange liquidity pool
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed();
  
  // Transfer all tokens to EthSwap pool
  const totalSupply = await token.totalSupply();
  await token.transfer(ethSwap.address, totalSupply);
};
