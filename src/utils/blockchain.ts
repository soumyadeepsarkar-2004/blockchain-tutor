
import { NETWORKS } from "@/context/BlockchainContext";

/**
 * Format time from hundredths to a human-readable string
 * @param {number} timeInHundredths - Time in hundredths (e.g., 150 for 1.5)
 * @returns {string} Formatted time string
 */
export const formatTime = (timeInHundredths: number): string => {
  const hours = Math.floor(timeInHundredths / 100);
  const minutes = (timeInHundredths % 100) * 0.6;

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${Math.round(minutes)}m` : ''}`;
  }
  return `${Math.round(minutes)}m`;
};

/**
 * Format price from hundredths to a decimal string with 2 decimal places
 * @param {number} priceInHundredths - Price in hundredths (e.g., 5075 for 50.75)
 * @returns {string} Formatted price string
 */
export const formatPrice = (priceInHundredths: number): string => {
  return (priceInHundredths / 100).toFixed(2);
};

/**
 * Convert a decimal price to hundredths for the contract
 * @param {number} price - Price as a decimal (e.g., 50.75)
 * @returns {number} Price in hundredths (e.g., 5075)
 */
export const priceToHundredths = (price: number): number => {
  return Math.round(price * 100);
};

/**
 * Convert a time string to hundredths for the contract
 * @param {string} timeString - Time in format "1h 30m" or "45m"
 * @returns {number} Time in hundredths (e.g., 150 for 1h 30m)
 */
export const timeToHundredths = (timeString: string): number => {
  let hours = 0;
  let minutes = 0;
  
  const hoursMatch = timeString.match(/(\d+)h/);
  if (hoursMatch) {
    hours = parseInt(hoursMatch[1], 10);
  }
  
  const minutesMatch = timeString.match(/(\d+)m/);
  if (minutesMatch) {
    minutes = parseInt(minutesMatch[1], 10);
  }
  
  return hours * 100 + Math.round(minutes / 0.6);
};

/**
 * Check if the user has an existing account
 * @returns {boolean} True if the user has an account
 */
export const hasExistingAccount = (): boolean => {
  const user = localStorage.getItem('user');
  return !!user;
};

/**
 * Format blockchain address to a readable string with prefix and suffix
 * @param {string} address - Full blockchain address
 * @param {number} prefixLength - Number of chars to show at start (default 6)
 * @param {number} suffixLength - Number of chars to show at end (default 4)
 * @returns {string} Formatted address string
 */
export const formatAddress = (address: string, prefixLength = 6, suffixLength = 4): string => {
  if (!address || address.length < (prefixLength + suffixLength)) {
    return address;
  }
  
  return `${address.substring(0, prefixLength)}...${address.substring(address.length - suffixLength)}`;
};

/**
 * Get network explorer URL for a transaction or address
 * @param {string} hash - Transaction hash or address
 * @param {keyof typeof NETWORKS} network - Network key (e.g., 'EDUCHAIN', 'SEPOLIA')
 * @param {string} type - Type of explorer URL ('tx' or 'address', default 'tx')
 * @returns {string} Explorer URL
 */
export const getExplorerUrl = (
  hash: string, 
  network: keyof typeof NETWORKS, 
  type: 'tx' | 'address' = 'tx'
): string => {
  const baseUrl = NETWORKS[network].blockExplorer;
  
  return `${baseUrl}${type}/${hash}`;
};

/**
 * Redirect to payment page with the necessary information
 * @param {string} itemType - Type of item (course or tutor)
 * @param {string} itemId - ID of the item
 * @param {number} price - Price of the item
 */
export const redirectToPayment = (itemType: 'course' | 'tutor', itemId: string, price: number): void => {
  // Store the payment info in localStorage and redirect to a payment page
  const paymentInfo = {
    itemType,
    itemId,
    price,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('pendingPayment', JSON.stringify(paymentInfo));
  
  // Redirect to payment page
  window.location.href = '/payment';
};

/**
 * Check if user is authenticated and redirect to login if not
 * @returns {boolean} True if authenticated, false if not (and redirects)
 */
export const requireAuth = (): boolean => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    // Store the current URL to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    
    // Redirect to login
    window.location.href = '/login';
    return false;
  }
  
  return true;
};

/**
 * Get the suggested network for the application (Sepolia by default)
 * @returns {keyof typeof NETWORKS} Suggested network key
 */
export const getPreferredNetwork = (): keyof typeof NETWORKS => {
  // Always use Sepolia as the default network
  return 'SEPOLIA';
};

/**
 * Check if the network has the correct configuration
 * @param {keyof typeof NETWORKS} network - Network to check
 * @returns {boolean} True if network configuration is valid
 */
export const isNetworkConfigured = (network: keyof typeof NETWORKS): boolean => {
  // Specifically check if Sepolia has a proper RPC URL set
  if (network === 'SEPOLIA') {
    const rpcUrl = NETWORKS[network].rpcUrl;
    // Check if the Infura ID is no longer the placeholder
    return !rpcUrl.includes('YOUR_INFURA_ID');
  }
  return true;
};

/**
 * Get estimated gas needed for a blockchain transaction 
 * @param {number} priceInUSD - Price in USD
 * @returns {string} Estimated gas fee in ETH
 */
export const estimateGasFee = (priceInUSD: number): string => {
  // Simple estimation for Sepolia testnet
  // In production, you would use actual gas price from network
  const gasUnits = 100000; // Approximate gas for a contract interaction
  const gasPriceGwei = 2; // Approximate gas price in Gwei
  
  const gasFeeEth = (gasUnits * gasPriceGwei) / 1_000_000_000;
  return gasFeeEth.toFixed(6);
};
