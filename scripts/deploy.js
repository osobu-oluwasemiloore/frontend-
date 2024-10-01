const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to network:", hre.network.name);

  // Deploy the TriviaGame contract
  const TriviaGame = await hre.ethers.getContractFactory("contracts/Trivia.sol:TriviaGame");
  const triviaGame = await TriviaGame.deploy();  // No need to pass token address anymore

  // Wait for the TriviaGame contract to be mined
//   const deployedKahoot = await triviaGame.deployed();
  console.log("TriviaGame deployed to:", triviaGame.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });