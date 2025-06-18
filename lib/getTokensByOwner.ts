import { getTicketContract } from "./contract";
import { ethers } from "ethers";

export async function getTokensByOwner(address: string, provider: ethers.Provider) {
  const contract = getTicketContract(provider);
  const tokens: any[] = [];
  const nextId = await contract.nextTokenId();

  for (let i = 0; i < nextId; i++) {
    const owner = await contract.ownerOf(i).catch(() => null);
    if (owner?.toLowerCase() === address.toLowerCase()) {
      const tokenURI = await contract.tokenURI(i);
      tokens.push({ tokenId: i, tokenURI });
    }
  }

  return tokens;
}



export async function getAllMintedTickets(provider: ethers.Provider) {
  const contract = getTicketContract(provider);
  const tokens: any[] = [];
  const nextId = await contract.nextTokenId();

  for (let i = 0; i < nextId; i++) {
    try {
      const owner = await contract.ownerOf(i);
      const tokenURI = await contract.tokenURI(i);

      tokens.push({ tokenId: i, owner, tokenURI });
    } catch (err) {
      console.warn(`Skipping tokenId ${i}:`, err);
    }
  }

  return tokens;
}
