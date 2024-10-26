/**
 * Defines the filter configuration for querying data associated with a specific author's public key.
 *
 * @typedef {Object} AutorFilterConfig
 * @property {Object} memcmp - Memory comparison configuration for filtering.
 * @property {number} memcmp.offset - Offset in the memory layout for the specific discriminator.
 * @property {string} memcmp.bytes - Base58 encoded public key of the author for filtering.
 *
 * @example
 * // Example of an AutorFilterConfig object:
 * const filterConfig = {
 *   memcmp: {
 *     offset: 8,
 *     bytes: 'authorBase58PublicKey',
 *   }
 * };
 */
type AutorFilterConfig = {
  memcmp: {
    offset: number;
    bytes: string;
  };
};

/**
 * Generates a filter configuration for querying items associated with a specific author's public key.
 *
 * This function is commonly used when interacting with on-chain data, where filters help
 * narrow down results by specific memory locations and values. In this case, the `offset`
 * represents a fixed position in memory that corresponds to an item's discriminator (an identifier
 * unique to each item type). The `bytes` value is the Base58-encoded public key string that identifies
 * the author whose items you want to filter.
 *
 * @param {string} authorBase58PublicKey - The author's public key encoded in Base58 format.
 * @returns {AutorFilterConfig} A configuration object used for filtering data by author.
 *
 * @example
 * // Example usage of authorFilter to create a filter configuration:
 * const publicKey = 'ExampleBase58PublicKey';
 * const filter = authorFilter(publicKey);
 * 
 * console.log(filter);
 * // Output:
 * // {
 * //   memcmp: {
 * //     offset: 8,
 * //     bytes: 'ExampleBase58PublicKey'
 * //   }
 * // }
 *
 * @see https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getProgramAccounts
 * for more on using filters with `getProgramAccounts` in the Solana JavaScript API.
 */
export const authorFilter = (authorBase58PublicKey: string): AutorFilterConfig => ({
  memcmp: {
    offset: 8, // Fixed memory offset to account for the discriminator
    bytes: authorBase58PublicKey, // Base58 public key for author-specific filtering
  },
});
