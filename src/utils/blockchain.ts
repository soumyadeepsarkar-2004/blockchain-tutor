
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
