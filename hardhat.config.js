require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    base: {
        url: 'https://sepolia.base.org', // Base network URL
        accounts: ["7f2c2228c51315c9bd4276ee0d61fd466214f1ad82213443b4c6f2a446d43715"], // Add your wallet private key
    },
},
};
