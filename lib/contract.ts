import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x8Bd3b651f7cc7E5A13483247205d61d55724Daed";

import TicketNFTAbi from "./TicketNFT_ABI.json";

export function getTicketContract(signerOrProvider: ethers.Signer | ethers.Provider) {
    return new ethers.Contract(CONTRACT_ADDRESS, TicketNFTAbi.abi, signerOrProvider);
}
