const { ethers } = require("ethers");

async function main() {
  // 1. Connect to Ethereum network (via Infura, Alchemy, or your own node)
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");

  // 2. Set up a wallet (use your private key here)
  const privateKey = "7f2c2228c51315c9bd4276ee0d61fd466214f1ad82213443b4c6f2a446d43715"; // Replace with your private key
  const wallet = new ethers.Wallet(privateKey, provider);

  // 3. Define the deployed contract address and ABI (replace with your contract's address and ABI)
  const contractAddress = "0x5Be964a4585497b28cDb8FE4491b2cE899431b95";
  const contractABI = [
    "function createGame(bool _isStaked) payable",
    "function participateInGame(uint256 _gameId)",
    "function setWinners(uint256 _gameId, address _first, address _second, address _third)",
    "function getGameDetails(uint256 _gameId) view returns (address, uint256, bool, bool, address[3], uint256)",
  ];

  // 4. Connect to the deployed contract
  const triviaGameContract = new ethers.Contract(contractAddress, contractABI, wallet);

  // 5. Example: Create a new staked game with 1 ETH prize pool
  const gameCreationTx = await triviaGameContract.createGame(true, {
    value: ethers.parseEther("0.005"), // Sending 1 ETH to the contract
  });
  await gameCreationTx.wait();
  console.log("Game created!");

  // 6. Example: Participate in a game (assuming gameId is 0)
  const participateTx = await triviaGameContract.participateInGame(0);
  await participateTx.wait();
  console.log("Participated in the game!");

  // 7. Example: Set winners for the game (replace with actual addresses)
  const setWinnersTx = await triviaGameContract.setWinners(
    0,
    "0x76Df48120B8F7546607D9eB2630A45aE936bbeDF", // First place
    "0xeDFF0f1c46471E833abD635B464d2992e147EadA", // Second place
    "0x27f2B90e2Df355eCb474C87825593ea30D5A47B0"  // Third place
  );
  await setWinnersTx.wait();
  console.log("Winners set and prizes distributed!");

  // 8. Example: Get game details (assuming gameId is 0)
  const gameDetails = await triviaGameContract.getGameDetails(0);
  console.log("Game Details: ", gameDetails);
}

main().catch((error) => {
  console.error("Error:", error);
});
