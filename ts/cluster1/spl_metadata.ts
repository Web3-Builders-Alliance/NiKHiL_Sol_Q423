import { PublicKey } from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";

// Define our Mint address
const mint = new PublicKey("7xfZTSdbdmfcF3gFB3zWZuqJBsGff63za7unhbx9KFyu");

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Create PDA for token metadata
const metadata_seeds = [
  Buffer.from("metadata"),
  token_metadata_program_id.toBuffer(),
  mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
  metadata_seeds,
  token_metadata_program_id
);

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Start here
    let myTransaction = createMetadataAccountV3(umi, {
      //accounts
      metadata: publicKey(metadata_pda.toString()),
      mint: publicKey(mint.toString()),
      mintAuthority: signer,
      payer: signer,
      updateAuthority: keypair.publicKey,
      data: {
        name: "Super Token",
        symbol: "$UP",
        uri: "super_token_example_uri.com",
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
      isMutable: true,
      collectionDetails: null,
    });

    let result = await myTransaction.sendAndConfirm(umi);

    console.log(result.signature);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
