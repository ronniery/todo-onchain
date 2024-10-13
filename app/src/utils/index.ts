type AutorFilterConfig = {
  memcmp: {
    offset: number;
    bytes: string;
  };
}

export const authorFilter = (authorBase58PublicKey: string): AutorFilterConfig => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey,
  },
});
