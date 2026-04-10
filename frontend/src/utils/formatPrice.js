/**
 * Format price in Uganda Shillings (UGX)
 * @param {number} amount - Price amount
 * @returns {string} Formatted price string (e.g., "UGX 25,000")
 */
export const formatPrice = (amount) => {
  if (!amount && amount !== 0) return 'UGX 0';
  return `UGX ${Number(amount).toLocaleString('en-UG')}`;
};
