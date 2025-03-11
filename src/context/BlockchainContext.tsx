
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

// Add the Contract ABI
const ContractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tutor",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "student",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "bookSession",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "sessionId",
        "type": "uint256"
      }
    ],
    "name": "completeSession",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "sessionId",
        "type": "uint256"
      }
    ],
    "name": "getSessionPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sessionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "sessions",
    "outputs": [
      {
        "internalType": "string",
        "name": "tutor",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "student",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = "0xcf4f8075ee7B8f128fF2BfdF3DcEA82de88DA6AB";
const CHAIN_ID = 656476;
const RPC_URL = "https://rpc.open-campus-codex.gelato.digital";

interface BlockchainContextType {
  isConnected: boolean;
  walletAddress: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  bookSession: (tutorName: string, sessionTime: number, price: number) => Promise<boolean>;
  completeSession: (sessionId: number) => Promise<boolean>;
  isProcessing: boolean;
  contract: ethers.Contract | null;
}

// Create a context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  isConnected: false,
  walletAddress: null,
  balance: '0',
  connectWallet: async () => {},
  disconnectWallet: () => {},
  bookSession: async () => false,
  completeSession: async () => false,
  isProcessing: false,
  contract: null
});

export const useBlockchain = () => useContext(BlockchainContext);

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Check for wallet connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const walletAddr = accounts[0];
            setWalletAddress(walletAddr);
            setIsConnected(true);
            
            // Get balance
            const balanceWei = await provider.getBalance(walletAddr);
            const balanceEth = ethers.formatEther(balanceWei);
            setBalance(parseFloat(balanceEth).toFixed(4) + ' ETH');
            
            // Set up contract
            const signer = await provider.getSigner();
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);
            setContract(contractInstance);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();
    
    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkConnection();
        }
      });
    }
    
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum?.removeAllListeners?.('accountsChanged');
      }
    };
  }, []);

  // Connect wallet function
  const connectWallet = async (): Promise<void> => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('No wallet detected', {
        description: 'Please install MetaMask or another Ethereum wallet to continue.',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check and switch to the correct chain
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId, 16) !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }]
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: 'Educhain',
                nativeCurrency: { name: 'EDUCHAIN', symbol: 'EDU', decimals: 18 },
                rpcUrls: [RPC_URL],
                blockExplorerUrls: ['https://opencampus-codex.blockscout.com/']
              }]
            });
          } else {
            throw switchError;
          }
        }
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const walletAddr = accounts[0];
      
      // Get balance
      const balanceWei = await provider.getBalance(walletAddr);
      const balanceEth = ethers.formatEther(balanceWei);
      
      // Set up contract
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);
      
      // Update state
      setWalletAddress(walletAddr);
      setIsConnected(true);
      setBalance(parseFloat(balanceEth).toFixed(4) + ' ETH');
      setContract(contractInstance);
      
      toast.success('Wallet connected successfully!', {
        description: `Connected to ${walletAddr.substring(0, 6)}...${walletAddr.substring(38)}`,
      });
      
      // Save to local storage for user identification
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.walletAddress = walletAddr;
      localStorage.setItem('user', JSON.stringify(user));
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet', {
        description: 'Please try again or use a different wallet provider.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = (): void => {
    setWalletAddress(null);
    setIsConnected(false);
    setBalance('0');
    setContract(null);
    
    // Also update local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    delete user.walletAddress;
    localStorage.setItem('user', JSON.stringify(user));
    
    toast.info('Wallet disconnected', {
      description: 'Your wallet has been disconnected from the application.',
    });
  };

  // Book a session via smart contract
  const bookSession = async (
    tutorName: string, 
    sessionTime: number, 
    price: number
  ): Promise<boolean> => {
    if (!isConnected || !contract) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to book a session.',
      });
      return false;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentName = user.name || user.email || walletAddress;
    
    if (!studentName) {
      toast.error('User information missing', {
        description: 'Please complete your profile before booking a session.',
      });
      return false;
    }
    
    setIsProcessing(true);
    
    try {
      // Convert price to contract format (cents/hundredths)
      const priceInHundredths = Math.round(price * 100);
      
      // Call the contract method
      const tx = await contract.bookSession(
        tutorName,
        studentName.toString(),
        sessionTime,
        priceInHundredths
      );
      
      // Wait for confirmation
      await tx.wait();
      
      toast.success('Session booked successfully!', {
        description: 'Your tutoring session has been recorded on the blockchain.',
      });
      
      return true;
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Transaction failed', {
        description: 'There was an error creating the session on the blockchain.',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete a session and release payment
  const completeSession = async (sessionId: number): Promise<boolean> => {
    if (!isConnected || !contract) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to complete this session.',
      });
      return false;
    }
    
    setIsProcessing(true);
    
    try {
      // Call the contract method
      const tx = await contract.completeSession(sessionId);
      
      // Wait for confirmation
      await tx.wait();
      
      toast.success('Session completed!', {
        description: 'The session has been marked as completed on the blockchain.',
      });
      
      return true;
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Transaction failed', {
        description: 'There was an error completing the session. Please try again.',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const value = {
    isConnected,
    walletAddress,
    balance,
    connectWallet,
    disconnectWallet,
    bookSession,
    completeSession,
    isProcessing,
    contract
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};
