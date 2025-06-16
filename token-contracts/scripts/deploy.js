const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners(); // get deployer address
  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
  const contract = await TicketNFT.deploy(deployer.address);

  await contract.waitForDeployment(); // This is the missing piece

  const address = await contract.getAddress(); // Correct way to fetch address in ethers v6

  console.log(`✅ TicketNFT deployed to: ${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
