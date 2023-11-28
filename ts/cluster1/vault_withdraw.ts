import {
  Connection,
  Keypair,
  SystemProgram,
  PublicKey,
  Commitment,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
  BN,
} from "@coral-xyz/anchor";
import { WbaVault, IDL } from "./programs/wba_vault";
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Commitment
const commitment: Commitment = "confirmed";

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment,
});

// Create our program
const program = new Program<WbaVault>(
  IDL,
  "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address,
  provider
);
// Create a random keypair
const vaultState = new PublicKey("fwwwZggpfMqjPLCwPnvPtKMup3q16bs42nLw2RdZZVJ");
// Create the PDA for our enrollment account
// Seeds are "auth", vaultState
const [vaultAuth, _vaultAuth_bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("auth"), Buffer.from(vaultState.toBuffer())],
  program.programId
);

// Create the vault key
// Seeds are "vault", vaultAuth
const [vault_key, _vault_bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), vaultAuth.toBuffer()],
  program.programId
);
// Execute our enrollment transaction
(async () => {
  try {
    const signature = await program.methods
      .withdraw(new BN(0.1 * LAMPORTS_PER_SOL))
      .accounts({
        owner: keypair.publicKey,
        vault: vault_key,
        vaultAuth,
        vaultState,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();
    console.log(
      `Withdraw success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
