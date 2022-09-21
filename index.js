// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
      [
        93, 167, 208,  86, 220, 194, 189, 106, 203, 129,
       218, 199, 223,  15, 201, 176, 156,  66, 122, 202,
       164,  68, 127, 144,   3, 198,  25,  97, 154,  20,
        75, 129, 205, 201,  83, 190, 136, 176, 176,  85,
        32, 115, 113,  59, 217, 188, 181, 125,  80, 146,
       191, 204,  71,  28, 240, 110, 138, 100, 179, 175,
       233, 192, 218, 223
     ]            
);


 // Get Keypair from Secret Key
 var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

 // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

const transferSol = async() => {
   // Connect to the Devnet
   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
   //  console.log("Connection object is:", connection);

   // Calculate from getbalance
   const fromwalletBalance = await connection.getBalance(new PublicKey(from.publicKey));
   const calcwalleltb = fromwalletBalance / LAMPORTS_PER_SOL / 2;
   console.log("Rsultat :", calcwalleltb);
     
    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to.publicKey,
   //     lamports: 2
     lamports: calcwalleltb * LAMPORTS_PER_SOL
    })
    );
    // Sign transaction
    var signature = await sendAndConfirmTransaction(
      connection,
     transaction,
     [from]
    );
    console.log('Signature is ', signature);
};


const LaunchAirDrop = async() => {
    // Connect to the Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    //  console.log("Connection object is:", connection);
    
    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });
    console.log("Airdrop completed for the Sender account");
};

   
   
 // get balance from sender account
 const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
     //  console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
    //const myWallet = await Keypair.fromSecretKey(privateKey);
        const walletBalance = await connection.getBalance(new PublicKey(from.publicKey));
        const TowalletBalance = await connection.getBalance(new PublicKey(to.publicKey));    
 //       console.log("WalletAddr: ", from.publicKey);
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
 //       console.log("WalletAddr: ", to.publicKey);
        console.log(`toWallet balance: ${parseInt(TowalletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

// Show the Sol Airdropped & Balance
const mainFunction = async () => {
    await getWalletBalance();
    await LaunchAirDrop();
    await getWalletBalance();
    await transferSol();
    await getWalletBalance();
}

mainFunction();