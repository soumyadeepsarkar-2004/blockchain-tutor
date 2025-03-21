
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
  // In a real application, this would redirect to a payment gateway
  // For now, we'll store the payment info in localStorage and redirect to a payment page
  const paymentInfo = {
    itemType,
    itemId,
    price,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('pendingPayment', JSON.stringify(paymentInfo));
  
  // Redirect to a payment page (you would create this page)
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
