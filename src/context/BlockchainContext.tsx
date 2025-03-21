import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import ContractABI from '@/utils/ContractABI.json';
import { getPreferredNetwork, isNetworkConfigured } from '@/utils/blockchain';

// Network Configuration
export const NETWORKS = {
  SEPOLIA: {
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/686bc69613964937976d3161281f0157', // Updated with the provided Infura URL
    contractAddress: '0x6C4b713F4fECDf9bFFc6842E8D1feCCB395dAc71', // Updated with the provided contract address
    symbol: 'ETH',
    blockExplorer: 'https://sepolia.etherscan.io/'
  },
  EDUCHAIN: {
    name: 'Educhain',
    chainId: 656476,
    rpcUrl: 'https://rpc.open-campus-codex.gelato.digital',
    contractAddress: '0xcf4f8075ee7B8f128fF2BfdF3DcEA82de88DA6AB',
    symbol: 'EDU',
    blockExplorer: 'https://opencampus-codex.blockscout.com/'
  }
};

interface BlockchainContextType {
  isConnected: boolean;
  walletAddress: string | null;
  balance: string;
  connectWallet: (networkKey?: keyof typeof NETWORKS) => Promise<void>;
  disconnectWallet: () => void;
  bookSession: (tutorName: string, sessionTime: number, price: number) => Promise<boolean>;
  completeSession: (sessionId: number) => Promise<boolean>;
  isProcessing: boolean;
  contract: ethers.Contract | null;
  currentNetwork: keyof typeof NETWORKS;
  switchNetwork: (networkKey: keyof typeof NETWORKS) => Promise<boolean>;
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
  contract: null,
  currentNetwork: getPreferredNetwork(),
  switchNetwork: async () => false
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
  const [currentNetwork, setCurrentNetwork] = useState<keyof typeof NETWORKS>(getPreferredNetwork());

  // Check for wallet connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Get the current chain ID
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chainIdNumber = parseInt(chainId, 16);
            
            // Determine which network we're on
            let network: keyof typeof NETWORKS = 'SEPOLIA';
            if (chainIdNumber === NETWORKS.EDUCHAIN.chainId) {
              network = 'EDUCHAIN';
            }
            setCurrentNetwork(network);
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const walletAddr = accounts[0];
            setWalletAddress(walletAddr);
            setIsConnected(true);
            
            // Get balance
            const balanceWei = await provider.getBalance(walletAddr);
            const balanceEth = ethers.formatEther(balanceWei);
            const symbol = NETWORKS[network].symbol;
            setBalance(parseFloat(balanceEth).toFixed(4) + ` ${symbol}`);
            
            // Set up contract
            const signer = await provider.getSigner();
            const contractInstance = new ethers.Contract(
              NETWORKS[network].contractAddress, 
              ContractABI, 
              signer
            );
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
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        // Reload the page on chain change to refresh all data
        window.location.reload();
      });
    }
    
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum?.removeAllListeners?.('accountsChanged');
        window.ethereum?.removeAllListeners?.('chainChanged');
      }
    };
  }, []);

  // Switch network function
  const switchNetwork = async (networkKey: keyof typeof NETWORKS): Promise<boolean> => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('No wallet detected', {
        description: 'Please install MetaMask or another Ethereum wallet to continue.',
      });
      return false;
    }
    
    setIsProcessing(true);
    
    try {
      const network = NETWORKS[networkKey];
      const chainIdHex = `0x${network.chainId.toString(16)}`;
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }]
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: network.name,
              nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.blockExplorer]
            }]
          });
        } else {
          throw switchError;
        }
      }
      
      setCurrentNetwork(networkKey);
      toast.success(`Switched to ${network.name}`, {
        description: `You are now connected to the ${network.name} network.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      toast.error('Failed to switch network', {
        description: 'Please try again or switch manually in your wallet.',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Connect wallet function with default network as Sepolia
  const connectWallet = async (networkKey: keyof typeof NETWORKS = getPreferredNetwork()): Promise<void> => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('No wallet detected', {
        description: 'Please install MetaMask or another Ethereum wallet to continue.',
      });
      return;
    }
    
    // Check if Sepolia is configured with a valid Infura ID
    if (networkKey === 'SEPOLIA' && !isNetworkConfigured('SEPOLIA')) {
      toast.error('Sepolia configuration required', {
        description: 'Please set your Infura ID in the NETWORKS configuration.',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Switch to the requested network
      const network = NETWORKS[networkKey];
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId, 16) !== network.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${network.chainId.toString(16)}` }]
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${network.chainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer]
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
      const contractInstance = new ethers.Contract(network.contractAddress, ContractABI, signer);
      
      // Update state
      setWalletAddress(walletAddr);
      setIsConnected(true);
      setBalance(parseFloat(balanceEth).toFixed(4) + ` ${network.symbol}`);
      setContract(contractInstance);
      setCurrentNetwork(networkKey);
      
      toast.success('Wallet connected successfully!', {
        description: `Connected to ${walletAddr.substring(0, 6)}...${walletAddr.substring(38)} on ${network.name}`,
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
        description: `Your tutoring session has been recorded on the ${NETWORKS[currentNetwork].name} blockchain.`,
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
    contract,
    currentNetwork,
    switchNetwork
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};
