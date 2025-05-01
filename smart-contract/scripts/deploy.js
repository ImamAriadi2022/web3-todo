const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  if (!deployer) {
    console.error("Deployer is undefined, check the configuration and network.");
    return;
  }

  const Todo = await ethers.getContractFactory("Todo");
  const todo = await Todo.deploy();
  console.log("Todo contract deployed at:", todo.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
