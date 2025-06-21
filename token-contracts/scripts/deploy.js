const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners(); 
  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
  const contract = await TicketNFT.deploy(deployer.address);

  await contract.waitForDeployment();

  const address = await contract.getAddress(); 

  console.log(`✅ TicketNFT deployed to: ${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
