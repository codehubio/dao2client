import debug from 'debug';
import { Connection, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage } from "@solana/web3.js";
import { SettleProposalIns } from '../serde/instructions/settle-proposal';
const log = debug('settle-proposal:info');
export default async function settleProposal(
  connection: Connection,
  creator: PublicKey,
  {
    proposalId,
  }: {
    proposalId: string,
  },
) {
  const {
    SC_ADDRESS = ''
  } = process.env;

  const [pda] = PublicKey.findProgramAddressSync([
    Buffer.from(proposalId),
    Buffer.from('proposal'),
  ], new PublicKey(SC_ADDRESS));
  log(`Dao PDA: ${pda}`);
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
      pubkey: pda,
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
