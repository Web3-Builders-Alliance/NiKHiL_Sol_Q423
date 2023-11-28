import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import {
  getAccount,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000;

// Mint address
const mint = new PublicKey("7xfZTSdbdmfcF3gFB3zWZuqJBsGff63za7unhbx9KFyu");

(async () => {
  try {
    // Create an ATA
    const AssociatedtokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
      undefined,
      commitment
    );

    // console.log(`Your ata is: ${ata.address.toBase58()}`);
    console.log(
      "Associated Token Account Address",
      AssociatedtokenAccount.address.toBase58()
    );

    const AssociatedtokenAccountInfo = await getAccount(
      connection,
      AssociatedtokenAccount.address
    );

    console.log(
      "AssociatedtokenAccount.amount pre-mint",
      AssociatedtokenAccountInfo.amount
    );
    // Mint to ATA
    await mintTo(
      connection,
      keypair,
      mint,
      AssociatedtokenAccount.address,
      keypair,
      100 * token_decimals
    );

    const mintInfo = await getMint(connection, mint);
    console.log("token supply", mintInfo.supply);

    const updatedAccInfo = await getAccount(
      connection,
      AssociatedtokenAccount.address
    );
    console.log(
      "AssociatedtokenAccount.amount post-mint",
      updatedAccInfo.amount
    );
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
