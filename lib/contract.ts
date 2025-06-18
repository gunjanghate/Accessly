import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x41F0680d3c0eD80e88d8340BA03807F6Ed8B65e8";

import TicketNFTAbi from "./TicketNFT_ABI.json";

export function getTicketContract(signerOrProvider: ethers.Signer | ethers.Provider) {
    return new ethers.Contract(CONTRACT_ADDRESS, TicketNFTAbi.abi, signerOrProvider);
}
