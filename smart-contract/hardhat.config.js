// require("@nomiclabs/hardhat-ethers");
// require("dotenv").config();

// module.exports = {
//   solidity: "0.8.0",
//   networks: {
//     sepolia: {
//       url: `https://eth-sepolia.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
//       accounts: [`0x${process.env.PRIVATE_KEY}`], // Gunakan private key untuk wallet
//     },
//   },
// };

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [/* private key account */]
    }
  }
};


