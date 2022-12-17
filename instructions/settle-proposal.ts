import debug from 'debug';
import { Connection, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage } from "@solana/web3.js";
import { SettleProposalIns } from '../serde/instructions/settle-proposal';
import BN from 'bn.js';
const log = debug('settle-proposal:info');
export default async function settleProposal(
  connection: Connection,
  creator: PublicKey,
  {
    proposalPda,
  }: {
    proposalPda: PublicKey,
  },
) {
  const {
    SC_ADDRESS = ''
  } = process.env;

  log(`Proposa PDA: ${proposalPda}`);
  const initPoolIx = new SettleProposalIns();
  const serializedData = initPoolIx.serialize();
  const dataBuffer = Buffer.from(serializedData);
  // console.log(testPub.toBuffer());
  const instruction = new TransactionInstruction({
    keys: [{
      pubkey: creator,
      isSigner: true,
      isWritable: true,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: proposalPda,
    }, {
      isSigner: false,
      isWritable: false,
      pubkey: SystemProgram.programId,
    }],
    programId: new PublicKey(SC_ADDRESS),
    data: dataBuffer,
  });
  const {
    blockhash,
  } =  await connection.getLatestBlockhash({
    commitment: 'finalized',
  });
  const tx = new TransactionMessage({
    payerKey: creator,
    recentBlockhash: blockhash,
    instructions: [instruction],
  }).compileToV0Message();
  return tx.serialize();
  
}
