
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface BlockchainContextType {
  isConnected: boolean;
  walletAddress: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  bookSession: (tutorAddress: string, sessionTime: number, price: number) => Promise<string | null>;
  completeSession: (contractAddress: string) => Promise<boolean>;
  isProcessing: boolean;
}

// Create a context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  isConnected: false,
  walletAddress: null,
  balance: '0',
  connectWallet: async () => {},
  disconnectWallet: () => {},
  bookSession: async () => null,
  completeSession: async () => false,
  isProcessing: false
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

  // Simulate checking for wallet connection on load
  useEffect(() => {
    // Check if there's wallet information in local storage
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
      setBalance((Math.random() * 2).toFixed(4) + ' ETH'); // Simulate balance
    }
  }, []);

  // Connect wallet function
  const connectWallet = async (): Promise<void> => {
    // This is a simulation - in a real app, we would use ethers.js or web3.js to connect
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate blockchain delay
      
      const mockAddress = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setBalance((Math.random() * 2).toFixed(4) + ' ETH'); // Simulate balance
      
      // Save to local storage for persistence
      localStorage.setItem('walletAddress', mockAddress);
      
      toast.success('Wallet connected successfully!', {
        description: `Connected to ${mockAddress.substring(0, 6)}...${mockAddress.substring(38)}`,
      });
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
    localStorage.removeItem('walletAddress');
    
    toast.info('Wallet disconnected', {
      description: 'Your wallet has been disconnected from the application.',
    });
  };

  // Book a session via smart contract
  const bookSession = async (
    tutorAddress: string, 
    sessionTime: number, 
    price: number
  ): Promise<string | null> => {
    if (!isConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to book a session.',
      });
      return null;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate contract deployment
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a mock contract address
      const contractAddress = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      toast.success('Session booked successfully!', {
        description: `Smart contract deployed at ${contractAddress.substring(0, 6)}...${contractAddress.substring(38)}`,
      });
      
      // Update balance to simulate transaction
      setBalance((prevBalance) => {
        const eth = parseFloat(prevBalance);
        return Math.max(0, eth - price * 0.01).toFixed(4) + ' ETH';
      });
      
      return contractAddress;
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Transaction failed', {
        description: 'There was an error creating the smart contract for this session.',
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete a session and release payment
  const completeSession = async (contractAddress: string): Promise<boolean> => {
    if (!isConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to complete this session.',
      });
      return false;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Session completed!', {
        description: 'Payment has been released to the tutor.',
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
    isProcessing
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};
