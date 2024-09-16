// Define the types for NFT metadata based on the Metaplex Token Standard

export type NftMetadata = {
  name: string;
  description?: string;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes?: NftAttribute[];
  properties?: Properties;
};

export type NftAttribute = {
  trait_type: string;
  value: string;
};

export type Properties = {
  files: NftFile[];
  category: Category;
};

export type NftFile = {
  uri?: string;
  type?: string;
  cdn?: boolean;
};

export type Category = "video" | "image";

// Example function to create NFT metadata

export const createNftMetadata = (
  name: string,
  image: string,
  description?: string,
  animationUrl?: string,
  externalUrl?: string,
  attributes?: NftAttribute[],
  files?: NftFile[],
  category?: Category
): NftMetadata => {
  const properties: Properties = {
    files: files || [],
    category: category || "image", // Default category is "image"
  };

  return {
    name,
    description,
    image,
    animation_url: animationUrl,
    external_url: externalUrl,
    attributes,
    properties,
  };
};

// Example usage of the createNftMetadata function

const nftMetadata = createNftMetadata(
  "Cool NFT",
  "https://example.com/image.png",
  "This is a cool NFT.",
  "https://example.com/animation.mp4",
  "https://example.com",
  [{ trait_type: "Color", value: "Red" }],
  [{ uri: "https://example.com/file.mp4", type: "video/mp4", cdn: true }],
  "video"
);

console.log(nftMetadata);
