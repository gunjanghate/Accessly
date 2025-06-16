
import { ethers } from 'ethers';
import type { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed!');
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum); // ethers v6
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { provider, signer, address };
  } catch (error) {
    console.error('Wallet connection failed:', error);
    return null;
  }
}

export async function getBalance(address: string) {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed!');
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    // Convert balance from wei to ether
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Failed to get balance:', error);
    return null;
  }
}
