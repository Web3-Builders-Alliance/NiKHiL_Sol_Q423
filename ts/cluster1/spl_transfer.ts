import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("7xfZTSdbdmfcF3gFB3zWZuqJBsGff63za7unhbx9KFyu");

// Recipient address
const to = new PublicKey("4QP7hp9saDhm9nicwdMBSi6L4PgRQgbDjze7qSAKzVc7");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromATA = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
      undefined,
      commitment
    );
    console.log(`Your ata is: ${fromATA.address.toBase58()}`);
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toATA = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to,
      undefined,
      commitment
    );
    console.log(`Their ata is: ${toATA.address.toBase58()}`);
    // Transfer the new token to the "toTokenAccount" we just created
    const signature = await transfer(
      connection,
      keypair,
      fromATA.address,
      toATA.address,
      keypair.publicKey,
      1000000
    );

    console.log(`Your transfer txid: ${signature}`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
