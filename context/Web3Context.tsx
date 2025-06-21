'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Web3ContextType = {
    address: string;
    isConnected: boolean;
    isAdmin: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
};

const ADMIN_WALLETS = (process.env.NEXT_PUBLIC_ADMIN_WALLETS ?? '').toLowerCase();


const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    const [address, setAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask not detected");
            return;
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[] | undefined;
        if (!accounts || accounts.length === 0) {
            alert("No accounts found. Please connect your wallet.");
            return;
        }
        const addr = accounts[0];
        setAddress(addr);
        setIsConnected(true);
    };
    const disconnectWallet = () => {
        setAddress('');
        setIsConnected(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('wallet_address');
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
                const accs = accounts as string[] | undefined;
                if (accs && accs.length > 0) {
                    setAddress(accs[0]);
                    setIsConnected(true);
                }
            });
        }
    }, []);

    const isAdmin = ADMIN_WALLETS.includes(address.toLowerCase());

    return (
        <Web3Context.Provider value={{ address, isConnected, isAdmin, connectWallet, disconnectWallet }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => {
    const ctx = useContext(Web3Context);
    if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
    return ctx;
};
